"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  ageCategories,
  competitions,
  registrations,
  participants,
} from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import {
  ageCategoryFormSchema,
  checkinSchema,
  competitionFormSchema,
  updateStatusSchema,
} from "@/lib/validators";

export async function createCompetition(input: unknown) {
  await requireAdmin();
  const parsed = competitionFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Data lomba tidak valid." };
  }
  if (parsed.data.minMembers > parsed.data.maxMembers) {
    return { ok: false, error: "Min anggota tidak boleh lebih besar dari max." };
  }

  await db.insert(competitions).values({
    eventId: parsed.data.eventId,
    name: parsed.data.name.trim(),
    type: parsed.data.type,
    quotaTotal: parsed.data.quotaTotal ?? null,
    minMembers: parsed.data.minMembers,
    maxMembers: parsed.data.maxMembers,
  });

  return { ok: true };
}

export async function updateCompetition(id: number, input: unknown) {
  await requireAdmin();
  const parsed = competitionFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Data lomba tidak valid." };
  }
  if (parsed.data.minMembers > parsed.data.maxMembers) {
    return { ok: false, error: "Min anggota tidak boleh lebih besar dari max." };
  }

  await db
    .update(competitions)
    .set({
      eventId: parsed.data.eventId,
      name: parsed.data.name.trim(),
      type: parsed.data.type,
      quotaTotal: parsed.data.quotaTotal ?? null,
      minMembers: parsed.data.minMembers,
      maxMembers: parsed.data.maxMembers,
    })
    .where(eq(competitions.id, id));

  return { ok: true };
}

export async function deleteCompetition(id: number): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  await db.delete(competitions).where(eq(competitions.id, id));
  return { ok: true };
}

export async function createAgeCategory(input: unknown) {
  await requireAdmin();
  const parsed = ageCategoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Data kategori tidak valid." };
  }
  if (parsed.data.ageMin > parsed.data.ageMax) {
    return { ok: false, error: "Umur minimal tidak boleh lebih besar dari maksimal." };
  }

  await db.insert(ageCategories).values({
    competitionId: parsed.data.competitionId,
    name: parsed.data.name.trim(),
    ageMin: parsed.data.ageMin,
    ageMax: parsed.data.ageMax,
  });

  return { ok: true };
}

export async function updateAgeCategory(id: number, input: unknown) {
  await requireAdmin();
  const parsed = ageCategoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Data kategori tidak valid." };
  }
  if (parsed.data.ageMin > parsed.data.ageMax) {
    return { ok: false, error: "Umur minimal tidak boleh lebih besar dari maksimal." };
  }

  await db
    .update(ageCategories)
    .set({
      competitionId: parsed.data.competitionId,
      name: parsed.data.name.trim(),
      ageMin: parsed.data.ageMin,
      ageMax: parsed.data.ageMax,
    })
    .where(eq(ageCategories.id, id));

  return { ok: true };
}

export async function deleteAgeCategory(id: number): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  await db.delete(ageCategories).where(eq(ageCategories.id, id));
  return { ok: true };
}

export async function updateRegistrationStatus(input: unknown) {
  await requireAdmin();
  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Status tidak valid." };
  }

  await db
    .update(registrations)
    .set({ status: parsed.data.status })
    .where(eq(registrations.id, parsed.data.registrationId));

  return { ok: true };
}

export async function checkInRegistration(input: unknown) {
  await requireAdmin();
  const parsed = checkinSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Kode tidak valid." };
  }

  const [registration] = await db
    .select({
      id: registrations.id,
      publicCode: registrations.publicCode,
      status: registrations.status,
      contactName: registrations.contactName,
      contactPhone: registrations.contactPhone,
      competitionId: registrations.competitionId,
      ageCategoryId: registrations.ageCategoryId,
    })
    .from(registrations)
    .where(eq(registrations.publicCode, parsed.data.publicCode.toUpperCase()))
    .limit(1);

  if (!registration) {
    return { ok: false, error: "Kode pendaftaran tidak ditemukan." };
  }

  if (registration.status !== "CHECKED_IN") {
    await db
      .update(registrations)
      .set({ status: "CHECKED_IN" })
      .where(eq(registrations.id, registration.id));
  }

  const [competition] = await db
    .select({ name: competitions.name })
    .from(competitions)
    .where(eq(competitions.id, registration.competitionId))
    .limit(1);

  const [category] = await db
    .select({ name: ageCategories.name })
    .from(ageCategories)
    .where(eq(ageCategories.id, registration.ageCategoryId))
    .limit(1);

  const members = await db
    .select({ fullName: participants.fullName, role: participants.role })
    .from(participants)
    .where(eq(participants.registrationId, registration.id));

  return {
    ok: true,
    data: {
      publicCode: registration.publicCode,
      status: "CHECKED_IN",
      contactName: registration.contactName,
      contactPhone: registration.contactPhone,
      competitionName: competition?.name ?? "-",
      categoryName: category?.name ?? "-",
      participants: members,
    },
  };
}
