import { db } from "./index";
import { ageCategories, competitions, events } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  const existing = await db
    .select({ id: events.id })
    .from(events)
    .where(eq(events.name, "Pesta Rakyat 17 Agustus"));

  if (existing.length > 0) {
    console.log("Seed sudah ada, memperbarui lokasi dan tanggal acara di database...");
    await db
      .update(events)
      .set({
        location: "Jl. Pengasinan Tengah RT 04 Depan Masjid Nurul Huda",
        eventDate: "2026-08-17",
      })
      .where(eq(events.name, "Pesta Rakyat 17 Agustus"));
    console.log("Update database berhasil.");
    return;
  }

  const [event] = await db
    .insert(events)
    .values({
      name: "Pesta Rakyat 17 Agustus",
      location: "Jl. Pengasinan Tengah RT 04 Depan Masjid Nurul Huda",
      eventDate: "2026-08-17",
      isOpen: true,
    })
    .returning();

  const [kerupuk] = await db
    .insert(competitions)
    .values({
      eventId: event.id,
      name: "Lomba Makan Kerupuk",
      type: "SOLO",
      quotaTotal: 80,
      minMembers: 1,
      maxMembers: 1,
    })
    .returning();

  const [karung] = await db
    .insert(competitions)
    .values({
      eventId: event.id,
      name: "Balap Karung",
      type: "BOTH",
      quotaTotal: 60,
      minMembers: 1,
      maxMembers: 4,
    })
    .returning();

  const [tambang] = await db
    .insert(competitions)
    .values({
      eventId: event.id,
      name: "Tarik Tambang",
      type: "TEAM",
      quotaTotal: 20,
      minMembers: 6,
      maxMembers: 8,
    })
    .returning();

  await db.insert(ageCategories).values([
    {
      competitionId: kerupuk.id,
      name: "Anak (7-12 tahun)",
      ageMin: 7,
      ageMax: 12,
    },
    {
      competitionId: kerupuk.id,
      name: "Remaja (13-17 tahun)",
      ageMin: 13,
      ageMax: 17,
    },
    {
      competitionId: karung.id,
      name: "Umum (8-15 tahun)",
      ageMin: 8,
      ageMax: 15,
    },
    {
      competitionId: karung.id,
      name: "Umum (16-35 tahun)",
      ageMin: 16,
      ageMax: 35,
    },
    {
      competitionId: tambang.id,
      name: "Umum (15-35 tahun)",
      ageMin: 15,
      ageMax: 35,
    },
  ]);

  console.log("Seed selesai.");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
