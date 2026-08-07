import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri Kemerdekaan",
  description: "Momen keseruan dan semangat kebersamaan warga RW 10 dalam merayakan Hari Kemerdekaan RI ke-81.",
};

export default function GaleriLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
