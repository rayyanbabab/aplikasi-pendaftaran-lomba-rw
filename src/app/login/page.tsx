import { redirect } from "next/navigation";
import { inArray } from "drizzle-orm";

import { AdminLoginForm } from "@/components/site/admin-login-form";
import { db } from "@/db";
import { user } from "@/db/schema";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Login Panitia & Admin",
  description: "Portal masuk untuk pengelolaan data dan perlombaan HUT RI ke-81 RT 04.",
};

export default async function LoginPage() {
  // Cek apakah pengguna sudah memiliki sesi aktif sebagai Admin/Panitia
  const session = await getSession();
  if (session?.user) {
    const sessionUser = session.user as { role?: string };
    if (sessionUser.role === "ADMIN" || sessionUser.role === "PANITIA") {
      redirect("/portal");
    }
  }

  // Cek apakah ada minimal satu akun ADMIN atau PANITIA di database
  const existingAdmins = await db
    .select({ id: user.id })
    .from(user)
    .where(inArray(user.role, ["ADMIN", "PANITIA"]))
    .limit(1);

  // Jika belum ada akun admin/panitia sama sekali, arahkan otomatis ke halaman setup
  if (existingAdmins.length === 0) {
    redirect("/setup");
  }

  return <AdminLoginForm />;
}
