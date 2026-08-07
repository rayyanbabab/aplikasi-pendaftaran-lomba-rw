import { redirect } from "next/navigation";
import { RegisterAccountForm } from "@/components/site/register-account-form";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Buat Akun Panitia & Admin",
  description: "Halaman pendaftaran akun pengelola perlombaan HUT RI ke-81 RW 10.",
};

export default async function RegisterPage() {
  // Cek apakah pengguna sudah memiliki sesi aktif
  const session = await getSession();
  if (session?.user) {
    redirect("/portal");
  }

  return <RegisterAccountForm />;
}
