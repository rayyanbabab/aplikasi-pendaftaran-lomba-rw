import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formulir Pendaftaran Lomba",
  description: "Daftarkan diri atau regu Anda untuk berpartisipasi dalam semarak perlombaan kemerdekaan RI ke-81.",
};

export default function DaftarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
