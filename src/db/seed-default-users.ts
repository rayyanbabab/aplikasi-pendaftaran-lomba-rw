import { hashPassword, generateRandomString } from "better-auth/crypto";
import { db } from "./index";
import { user, account } from "./schema";
import { eq, or } from "drizzle-orm";

async function seedDefaultUsers() {
  console.log("Menyiapkan akun default Admin dan Panitia...");

  // 1. Akun Admin
  const adminEmail = "admin@rw10.id";
  const adminPassword = "admin123password";
  const adminHashed = await hashPassword(adminPassword);

  const existingAdmin = await db
    .select({ id: user.id })
    .from(user)
    .where(or(eq(user.email, adminEmail), eq(user.email, "admin@RW10.id")))
    .limit(1);

  if (existingAdmin.length > 0) {
    const adminId = existingAdmin[0].id;
    await db
      .update(user)
      .set({ email: adminEmail, role: "ADMIN", name: "Admin Utama", updatedAt: new Date() })
      .where(eq(user.id, adminId));

    await db
      .update(account)
      .set({ password: adminHashed, updatedAt: new Date() })
      .where(eq(account.userId, adminId));

    console.log(`✓ Akun Admin (${adminEmail}) berhasil diperbarui.`);
  } else {
    const adminId = generateRandomString(32, "a-z", "A-Z", "0-9");
    const adminAccountId = generateRandomString(32, "a-z", "A-Z", "0-9");

    await db.insert(user).values({
      id: adminId,
      name: "Admin Utama",
      email: adminEmail,
      role: "ADMIN",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(account).values({
      id: adminAccountId,
      accountId: adminId,
      providerId: "credential",
      userId: adminId,
      password: adminHashed,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✓ Akun Admin (${adminEmail}) berhasil dibuat baru.`);
  }

  // 2. Akun Panitia
  const panitiaEmail = "panitia@rw10.id";
  const panitiaPassword = "panitia123password";
  const panitiaHashed = await hashPassword(panitiaPassword);

  const existingPanitia = await db
    .select({ id: user.id })
    .from(user)
    .where(or(eq(user.email, panitiaEmail), eq(user.email, "panitia@RW10.id")))
    .limit(1);

  if (existingPanitia.length > 0) {
    const panitiaId = existingPanitia[0].id;
    await db
      .update(user)
      .set({ email: panitiaEmail, role: "PANITIA", name: "Panitia Lomba", updatedAt: new Date() })
      .where(eq(user.id, panitiaId));

    await db
      .update(account)
      .set({ password: panitiaHashed, updatedAt: new Date() })
      .where(eq(account.userId, panitiaId));

    console.log(`✓ Akun Panitia (${panitiaEmail}) berhasil diperbarui.`);
  } else {
    const panitiaId = generateRandomString(32, "a-z", "A-Z", "0-9");
    const panitiaAccountId = generateRandomString(32, "a-z", "A-Z", "0-9");

    await db.insert(user).values({
      id: panitiaId,
      name: "Panitia Lomba",
      email: panitiaEmail,
      role: "PANITIA",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(account).values({
      id: panitiaAccountId,
      accountId: panitiaId,
      providerId: "credential",
      userId: panitiaId,
      password: panitiaHashed,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✓ Akun Panitia (${panitiaEmail}) berhasil dibuat baru.`);
  }

  console.log("\nSelesai! Akun admin dan panitia siap digunakan.");
  process.exit(0);
}

seedDefaultUsers().catch((err) => {
  console.error("Error seeding users:", err);
  process.exit(1);
});
