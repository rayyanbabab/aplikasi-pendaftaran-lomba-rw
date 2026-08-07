import { redirect } from "next/navigation";
import { inArray } from "drizzle-orm";

import { SetupAdminForm } from "@/components/site/setup-admin-form";
import { db } from "@/db";
import { user } from "@/db/schema";

export const metadata = {
  title: "Inisialisasi Akun Admin",
  description: "Inisiasi akun administrator pertama pada database baru Pendaftaran Lomba RW 10.",
};

export default async function SetupPage() {
  // Cek apakah di database sudah terdaftar minimal satu akun Admin atau Panitia
  const existingAdmins = await db
    .select({ id: user.id })
    .from(user)
    .where(inArray(user.role, ["ADMIN", "PANITIA"]))
    .limit(1);

  // Jika sudah ada akun admin, kunci halaman setup dan alirkan ke /login
  if (existingAdmins.length > 0) {
    redirect("/login");
  }

  return <SetupAdminForm />;
}
