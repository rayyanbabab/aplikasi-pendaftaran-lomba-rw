"use server";

import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { hashPassword, generateRandomString } from "better-auth/crypto";

import { db } from "@/db";
import { user, account } from "@/db/schema";
import { auth } from "@/lib/auth";
import { adminSignInSchema, setupAdminSchema, registerAccountSchema } from "@/lib/validators";

export async function signUpUser(input: unknown) {
  const parsed = registerAccountSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Data pendaftaran tidak valid." };
  }

  const cleanUsername = parsed.data.username.toLowerCase().trim().replace(/@.*$/, "");
  const email = `${cleanUsername}@rt04.id`;

  // Cek apakah username/email sudah terdaftar
  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing.length > 0) {
    return { ok: false, error: `Username "${cleanUsername}" sudah terdaftar! Silakan gunakan username lain atau langsung masuk.` };
  }

  try {
    const userId = generateRandomString(32, "a-z", "A-Z", "0-9");
    const accountId = generateRandomString(32, "a-z", "A-Z", "0-9");
    const hashedPassword = await hashPassword(parsed.data.password);

    await db.insert(user).values({
      id: userId,
      name: parsed.data.name,
      email,
      role: "PANITIA",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(account).values({
      id: accountId,
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Otomatis login pengguna setelah berhasil mendaftar
    await auth.api.signInEmail({
      body: {
        email,
        password: parsed.data.password,
      },
    });

    return { ok: true };
  } catch (error: any) {
    console.error("signUpUser error:", error);
    return { ok: false, error: error.message || "Gagal membuat akun." };
  }
}

export async function adminSignIn(input: unknown) {
  const parsed = adminSignInSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Email atau password tidak valid." };
  }

  let email = parsed.data.email.toLowerCase().trim();
  if (!email.includes("@")) {
    email = `${email}@rt04.id`;
  }

  const existing = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing.length === 0 || (existing[0].role !== "ADMIN" && existing[0].role !== "PANITIA")) {
    return { ok: false, error: "Akun admin/panitia tidak ditemukan atau tidak aktif." };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password: parsed.data.password,
      },
    });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Email atau password salah." };
  }
}

export async function setupFirstAdmin(input: unknown) {
  const parsed = setupAdminSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Data input tidak valid." };
  }

  // Cek apakah sudah ada akun admin atau panitia di database
  const existingAdmins = await db
    .select({ id: user.id })
    .from(user)
    .where(inArray(user.role, ["ADMIN", "PANITIA"]))
    .limit(1);

  if (existingAdmins.length > 0) {
    return {
      ok: false,
      error: "Setup ditolak. Sistem sudah memiliki akun Administrator yang aktif.",
    };
  }

  const email = parsed.data.email.toLowerCase();

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password: parsed.data.password,
        name: parsed.data.name,
      },
    });
    // Pastikan update rolenya menjadi ADMIN
    await db.update(user).set({ role: "ADMIN" }).where(eq(user.email, email));
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Gagal mendaftarkan akun admin pertama." };
  }
}

export async function adminSignOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error(error);
  }
  redirect("/login");
}
