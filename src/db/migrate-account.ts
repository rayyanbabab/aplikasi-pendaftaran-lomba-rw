import { sql } from "drizzle-orm";
import { db } from "./index";

async function main() {
  console.log("Menambahkan kolom issuer & id_token_expires_at ke tabel account...");
  try {
    await db.execute(sql`ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "issuer" text;`);
    await db.execute(sql`ALTER TABLE "account" ADD COLUMN IF NOT EXISTS "id_token_expires_at" timestamp;`);
    console.log("✓ Kolom berhasil ditambahkan ke database Neon!");
  } catch (err) {
    console.error("Gagal alter table:", err);
  }
  process.exit(0);
}

main();
