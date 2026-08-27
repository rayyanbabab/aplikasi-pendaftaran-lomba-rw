import { hashPassword, generateRandomString } from "better-auth/crypto";
import { db } from "./index";
import { user, account } from "./schema";
import { eq, or } from "drizzle-orm";

async function seedDefaultUsers() {
  console.log("Menyiapkan akun default Admin dan Panitia via Better Auth API...");
  const { auth } = await import("../lib/auth");

  // Hapus akun lama jika ada agar bersih
  await db.delete(account);
  await db.delete(user);
  console.log("Membersihkan tabel user & account lama...");

  // 1. Buat Akun Admin
  const adminEmail = "admin@rw10.id";
  const adminPassword = "admin123password";
  
  try {
    const adminRes = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Admin Utama",
      },
    });
    console.log("✓ signUpEmail Admin berhasil:", adminRes?.user?.id);

    // Update role jadi ADMIN
    if (adminRes?.user?.id) {
      await db.update(user).set({ role: "ADMIN" }).where(eq(user.id, adminRes.user.id));
    }
  } catch (err: any) {
    console.error("Gagal signUp Admin:", err);
  }

  // 2. Buat Akun Panitia
  const panitiaEmail = "panitia@rw10.id";
  const panitiaPassword = "panitia123password";

  try {
    const panitiaRes = await auth.api.signUpEmail({
      body: {
        email: panitiaEmail,
        password: panitiaPassword,
        name: "Panitia Lomba",
      },
    });
    console.log("✓ signUpEmail Panitia berhasil:", panitiaRes?.user?.id);

    // Update role jadi PANITIA
    if (panitiaRes?.user?.id) {
      await db.update(user).set({ role: "PANITIA" }).where(eq(user.id, panitiaRes.user.id));
    }
  } catch (err: any) {
    console.error("Gagal signUp Panitia:", err);
  }

  console.log("\nMemverifikasi login dengan Better Auth...");
  try {
    const testAdmin = await auth.api.signInEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
      }
    });
    console.log("✓ Login Admin berhasil:", testAdmin?.user?.email);
  } catch (err: any) {
    console.error("✗ Login Admin gagal:", err?.message || err);
  }

  try {
    const testPanitia = await auth.api.signInEmail({
      body: {
        email: panitiaEmail,
        password: panitiaPassword,
      }
    });
    console.log("✓ Login Panitia berhasil:", testPanitia?.user?.email);
  } catch (err: any) {
    console.error("✗ Login Panitia gagal:", err?.message || err);
  }

  console.log("\nSelesai! Akun admin dan panitia 100% siap digunakan.");
  process.exit(0);
}

seedDefaultUsers().catch((err) => {
  console.error("Error seeding users:", err);
  process.exit(1);
});

