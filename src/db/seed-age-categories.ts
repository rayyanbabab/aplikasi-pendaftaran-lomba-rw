import { db } from "./index";
import { ageCategories, competitions, events } from "./schema";
import { eq } from "drizzle-orm";

async function seedAgeCategories() {
  console.log("Mengambil daftar lomba dari database...");

  const allComps = await db.select().from(competitions);
  console.log(`Ditemukan ${allComps.length} lomba: ${allComps.map(c => `[${c.id}] ${c.name}`).join(", ")}`);

  // Hapus kategori lama jika ada
  await db.delete(ageCategories);
  console.log("Kategori lama dihapus.");

  // Buat kategori umur untuk setiap lomba
  const defaultCategories = [
    { name: "Anak-anak", ageMin: 5,  ageMax: 12 },
    { name: "Remaja",    ageMin: 13, ageMax: 17 },
    { name: "Dewasa",    ageMin: 18, ageMax: 99 },
  ];

  let totalInserted = 0;
  for (const comp of allComps) {
    for (const cat of defaultCategories) {
      await db.insert(ageCategories).values({
        competitionId: comp.id,
        name: cat.name,
        ageMin: cat.ageMin,
        ageMax: cat.ageMax,
      });
      totalInserted++;
    }
    console.log(`  ✓ Kategori ditambahkan untuk lomba: ${comp.name}`);
  }

  // Perbaiki lokasi event dari RT 04 ke RW 10
  await db
    .update(events)
    .set({ location: "Jl. Pengasinan Tengah, Depan Masjid Nurul Huda, RW 10" })
    .where(eq(events.id, 1));
  console.log("\n  ✓ Lokasi event diperbarui ke RW 10");

  console.log(`\nSelesai! ${totalInserted} kategori umur berhasil dibuat.`);
  process.exit(0);
}

seedAgeCategories().catch((e) => { console.error(e); process.exit(1); });
