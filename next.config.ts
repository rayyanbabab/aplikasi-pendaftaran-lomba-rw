import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Aktifkan kompresi Gzip & Brotli otomatis untuk memperkecil transfer data
  compress: true,
  // Sembunyikan header X-Powered-By demi keamanan dan efisiensi byte
  poweredByHeader: false,
  // Optimasi pemuatan gambar cerdas
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  outputFileTracingRoot: path.join(__dirname),
  // Optimasi lanjutan pemangkasan modul (Tree-Shaking) pada perpustakaan besar
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "drizzle-orm",
      "zod",
      "sonner",
      "recharts"
    ],
  },
};

export default nextConfig;
