import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Bukti & Status Pendaftaran",
  description: "Lihat dan unduh bukti pendaftaran lomba HUT RI ke-81 Anda dengan kode pendaftaran resmi.",
};

export default function BuktiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
