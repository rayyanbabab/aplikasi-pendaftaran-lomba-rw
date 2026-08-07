"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hashPassword, generateRandomString } from "better-auth/crypto";

import { db } from "@/db";
import { user, account } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { createUserSchema, editUserSchema } from "@/lib/validators";

async function verifyAdminCaller() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Sesi tidak valid atau telah berakhir.");
  }

  const sessionUser = session.user as { role?: string };
  if (sessionUser.role !== "ADMIN") {
    const dbUser = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    if (!dbUser[0] || dbUser[0].role !== "ADMIN") {
      throw new Error("Akses ditolak. Fitur Manajemen User hanya hak milik ADMIN.");
    }
  }
  return session.user;
}

export async function createUserAccount(input: unknown) {
  try {
    await verifyAdminCaller();
    const parsed = createUserSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "Input data tidak valid." };
    }

    const cleanUsername = parsed.data.username.toLowerCase().trim().replace(/@.*$/, "");
    const email = `${cleanUsername}@RW10.id`;

    // Cek apakah email/username tersebut sudah digunakan
    const existing = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existing.length > 0) {
      return { ok: false, error: `Username "${cleanUsername}" (@RW10.id) sudah terdaftar pada database!` };
    }

    // Menggunakan kriptografi internal better-auth agar kompatibel dan tidak meremot cookie
    const userId = generateRandomString(32, "a-z", "A-Z", "0-9");
    const accountId = generateRandomString(32, "a-z", "A-Z", "0-9");
    const hashedPassword = await hashPassword(parsed.data.password);

    await db.insert(user).values({
      id: userId,
      name: parsed.data.name,
      email,
      role: "PANITIA", // Mutlak dibuat sebagai PANITIA karena Admin Utama hanyalah Anda (tunggal)
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

    revalidatePath("/portal/users");
    return { ok: true };
  } catch (error: any) {
    console.error("createUserAccount error:", error);
    return { ok: false, error: error.message || "Gagal menambahkan akun panitia/admin baru." };
  }
}

export async function deleteUserAccount(targetUserId: string) {
  try {
    const caller = await verifyAdminCaller();
    if (caller.id === targetUserId) {
      return { ok: false, error: "Demi perlindungan sistem, Anda tidak dapat menghapus akun Anda sendiri!" };
    }

    await db.delete(user).where(eq(user.id, targetUserId));
    revalidatePath("/portal/users");
    return { ok: true };
  } catch (error: any) {
    console.error("deleteUserAccount error:", error);
    return { ok: false, error: error.message || "Gagal menghapus akun terpilih." };
  }
}

export async function updateUserRole(targetUserId: string, newRole: "ADMIN" | "PANITIA") {
  try {
    const caller = await verifyAdminCaller();
    if (caller.id === targetUserId) {
      return { ok: false, error: "Anda tidak dibolehkan memoderasi role akun milik Anda sendiri!" };
    }

    await db.update(user).set({ role: newRole }).where(eq(user.id, targetUserId));
    revalidatePath("/portal/users");
    return { ok: true };
  } catch (error: any) {
    console.error("updateUserRole error:", error);
    return { ok: false, error: error.message || "Gagal memutakhiran kewenangan akun." };
  }
}

export async function editUserAccount(input: unknown) {
  try {
    await verifyAdminCaller();
    const parsed = editUserSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message || "Input data pengeditan tidak valid." };
    }

    const { userId, name, password } = parsed.data;

    // Perbarui nama akun di tabel user
    await db.update(user).set({ name, updatedAt: new Date() }).where(eq(user.id, userId));

    // Jika admin memasukkan password baru (terdapat string kata sandi), hash dan update ke tabel account
    if (password && password.trim().length >= 6) {
      const hashedPassword = await hashPassword(password);
      await db.update(account)
        .set({ password: hashedPassword, updatedAt: new Date() })
        .where(eq(account.userId, userId));
    }

    revalidatePath("/portal/users");
    return { ok: true };
  } catch (error: any) {
    console.error("editUserAccount error:", error);
    return { ok: false, error: error.message || "Gagal menyimpan pengeditan akun." };
  }
}
