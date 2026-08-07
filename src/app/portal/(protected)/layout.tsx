import { eq } from "drizzle-orm";
import type { Metadata } from "next";

import { AdminShell } from "@/components/site/admin-shell";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    template: "%s | Dasbor Panitia & Admin",
    default: "Dasbor Utama | Semarak 17-an RW 10",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const sessionUser = session.user as { role?: string; id: string };

  // Meneruskan role eksak pengguna ke seluruh komponen dasbor
  let role = sessionUser.role;
  if (!role) {
    const dbCaller = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    role = dbCaller[0]?.role || "PANITIA";
  }

  return (
    <AdminShell session={session} userRole={role}>
      {children}
    </AdminShell>
  );
}
