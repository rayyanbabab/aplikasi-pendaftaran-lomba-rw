import { hashPassword, generateRandomString } from "better-auth/crypto";
import { db } from "./index";
import { user, account } from "./schema";

async function createAccounts() {
  // 1. Create ADMIN Account
  const adminId = generateRandomString(32, "a-z", "A-Z", "0-9");
  const adminAccountId = generateRandomString(32, "a-z", "A-Z", "0-9");
  const adminPassword = "admin123password";
  const adminHashed = await hashPassword(adminPassword);

  await db.insert(user).values({
    id: adminId,
    name: "Admin Utama",
    email: "admin@RW10.id",
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

  console.log("=== ADMIN ACCOUNT CREATED ===");
  console.log("Email: admin@RW10.id");
  console.log("Password: " + adminPassword);
  console.log("=============================\n");

  // 2. Create PANITIA Account
  const panitiaId = generateRandomString(32, "a-z", "A-Z", "0-9");
  const panitiaAccountId = generateRandomString(32, "a-z", "A-Z", "0-9");
  const panitiaPassword = "panitia123password";
  const panitiaHashed = await hashPassword(panitiaPassword);

  await db.insert(user).values({
    id: panitiaId,
    name: "Panitia Lomba",
    email: "panitia@RW10.id",
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

  console.log("=== PANITIA ACCOUNT CREATED ===");
  console.log("Email: panitia@RW10.id");
  console.log("Password: " + panitiaPassword);
  console.log("===============================");
}

createAccounts().catch(console.error);
