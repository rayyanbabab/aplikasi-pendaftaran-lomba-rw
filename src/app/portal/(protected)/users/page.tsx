import { asc, eq } from "drizzle-orm";
import { ShieldX } from "lucide-react";
import Link from "next/link";

import { UserManagementClient } from "@/components/site/user-management-client";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Manajemen Akun User & Panitia",
  description: "Kelola akun panitia dan pengelola perlombaan HUT RI ke-81 RW 10.",
};

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const sessionUser = session.user as { role?: string; id: string };

  // Pengecekan status wewenang pengguna (dari sesi maupun verifikasi langsung DB)
  let userRole = sessionUser.role;
  if (!userRole || userRole !== "ADMIN") {
    const dbCaller = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, sessionUser.id))
      .limit(1);
    userRole = dbCaller[0]?.role;
  }

  // Pengaman bila PANITIA mencoba mengintip atau masuk ke halaman Manajemen User
  if (userRole !== "ADMIN") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center animate-fade-in-up">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-6 shadow-xl ring-8 ring-red-500/5">
          <ShieldX className="h-10 w-10 animate-pulse" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Akses Dibatasi Khusus Administrator</h1>
        <p className="mt-3 max-w-md text-base text-muted-foreground leading-relaxed">
          Maaf, akun Anda berstatus <span className="font-bold text-orange-500">PANITIA</span>. Halaman Manajemen User hanya dapat dikelola oleh pemilik kewenangan penuh (<span className="font-bold text-red-600 dark:text-red-400">ADMIN</span>).
        </p>
        <Button asChild className="mt-8 rounded-xl bg-[#ee2b2b] px-6 py-6 font-bold text-white shadow-lg shadow-primary/25">
          <Link href="/portal">Kembali ke Portal Utama</Link>
        </Button>
      </div>
    );
  }

  // Mengambil daftar seluruh staf / panitia dari PostgreSQL Supabase
  const allUsers = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(asc(user.createdAt));

  return <UserManagementClient users={allUsers} currentUserId={session.user.id} />;
}
