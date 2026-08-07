// Script: normalkan semua email user yang masih pakai @RW10.id → @rw10.id
import { db } from "./index";
import { user, account } from "./schema";
import { like, sql } from "drizzle-orm";

async function normalizeEmails() {
  console.log("Mencari akun dengan email domain huruf besar...");

  const users = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(like(user.email, "%@RW10.id"));

  if (users.length === 0) {
    console.log("Tidak ada akun yang perlu diubah.");
    process.exit(0);
  }

  console.log(`Ditemukan ${users.length} akun, memperbarui...`);

  for (const u of users) {
    const newEmail = u.email.replace(/@RW10\.id$/i, "@rw10.id");
    await db
      .update(user)
      .set({ email: newEmail, updatedAt: new Date() })
      .where(sql`${user.id} = ${u.id}`);
    console.log(`  ✓ ${u.email} → ${newEmail}`);
  }

  console.log("Selesai! Semua email sudah dinormalisasi.");
  process.exit(0);
}

normalizeEmails().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
