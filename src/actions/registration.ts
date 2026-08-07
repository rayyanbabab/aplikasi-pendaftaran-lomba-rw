"use server";

import { randomBytes } from "crypto";
import { and, eq, ne, sql } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  ageCategories,
  competitions,
  events,
  participants,
  registrations,
} from "@/db/schema";
import { calculateAge, isAgeInRange } from "@/lib/age";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { registrationSchema } from "@/lib/validators";

function generatePublicCode() {
  const raw = randomBytes(5).toString("hex");
  return `AGS-${raw.toUpperCase()}`;
}

function parseDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

export async function submitRegistration(input: unknown) {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Data pendaftaran tidak valid." };
  }

  const { honeypot, ...data } = parsed.data;
  if (honeypot && honeypot.trim().length > 0) {
    return { ok: false, error: "Permintaan ditolak." };
  }

  const requestHeaders = await headers();
  const clientIp = getClientIp(requestHeaders);
  const limit = rateLimit(`register:${clientIp}`, 6, 60_000);
  if (!limit.allowed) {
    return { ok: false, error: "Terlalu banyak percobaan. Coba lagi nanti." };
  }

  const competitionId = Number(data.competitionId);
  const ageCategoryId = Number(data.ageCategoryId);

  const competition = await db
    .select()
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);

  if (competition.length === 0) {
    return { ok: false, error: "Lomba tidak ditemukan." };
  }

  const [competitionRow] = competition;

  const [eventRow] = await db
    .select()
    .from(events)
    .where(eq(events.id, competitionRow.eventId))
    .limit(1);

  if (!eventRow || !eventRow.isOpen) {
    return { ok: false, error: "Pendaftaran sedang ditutup." };
  }

  if (
    (competitionRow.type === "SOLO" && data.entryType !== "SOLO") ||
    (competitionRow.type === "TEAM" && data.entryType !== "TEAM")
  ) {
    return { ok: false, error: "Jenis pendaftaran tidak sesuai lomba." };
  }

  const [category] = await db
    .select()
    .from(ageCategories)
    .where(and(eq(ageCategories.id, ageCategoryId)));

  if (!category || category.competitionId !== competitionRow.id) {
    return { ok: false, error: "Kategori umur tidak valid." };
  }

  const minMembers = competitionRow.minMembers ?? 1;
  const maxMembers = competitionRow.maxMembers ?? minMembers;

  if (data.entryType === "SOLO") {
    if (data.participants.length !== 1) {
      return { ok: false, error: "Pendaftaran solo hanya untuk 1 peserta." };
    }
  } else {
    if (data.participants.length < minMembers || data.participants.length > maxMembers) {
      return {
        ok: false,
        error: `Jumlah anggota harus ${minMembers}-${maxMembers} orang.`,
      };
    }
  }

  const eventDate = parseDate(String(eventRow.eventDate));
  if (!eventDate) {
    return { ok: false, error: "Tanggal event tidak valid." };
  }

  for (const participant of data.participants) {
    const birthDate = parseDate(participant.birthDate);
    if (!birthDate) {
      return { ok: false, error: "Tanggal lahir peserta tidak valid." };
    }
    const age = calculateAge(birthDate, eventDate);
    if (!isAgeInRange(age, category.ageMin, category.ageMax)) {
      return {
        ok: false,
        error: "Umur peserta tidak sesuai kategori yang dipilih.",
      };
    }
  }

  const normalizedParticipants = data.participants.map((participant, index) => ({
    fullName: participant.fullName.trim(),
    birthDate: participant.birthDate,
    role: data.entryType === "SOLO" ? "LEADER" : index === 0 ? "LEADER" : "MEMBER",
  }));

  try {
    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`select id from competitions where id = ${competitionRow.id} for update`);

      if (competitionRow.quotaTotal) {
        const [{ count }] = await tx
          .select({ count: sql<number>`count(*)` })
          .from(registrations)
          .where(
            and(
              eq(registrations.competitionId, competitionRow.id),
              ne(registrations.status, "CANCELLED"),
            ),
          );

        if (Number(count) >= competitionRow.quotaTotal) {
          return { ok: false, error: "Kuota lomba sudah penuh." } as const;
        }
      }

      let publicCode = generatePublicCode();
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const existing = await tx
          .select({ id: registrations.id })
          .from(registrations)
          .where(eq(registrations.publicCode, publicCode))
          .limit(1);
        if (existing.length === 0) {
          break;
        }
        publicCode = generatePublicCode();
      }

      const [registration] = await tx
        .insert(registrations)
        .values({
          competitionId: competitionRow.id,
          ageCategoryId: category.id,
          entryType: data.entryType,
          status: "SUBMITTED",
          publicCode,
          contactName: data.contactName.trim(),
          contactPhone: data.contactPhone.trim(),
        })
        .returning();

      await tx.insert(participants).values(
        normalizedParticipants.map((participant) => ({
          registrationId: registration.id,
          fullName: participant.fullName,
          birthDate: participant.birthDate,
          role: participant.role as "LEADER" | "MEMBER",
        })),
      );

      return { ok: true, publicCode } as const;
    });

    return result;
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Terjadi kesalahan saat menyimpan data." };
  }
}
