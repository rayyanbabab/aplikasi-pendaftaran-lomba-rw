import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RT04: HUTRI KE 81",
    short_name: "RT04: HUTRI KE 81",
    description: "Portal resmi pendaftaran, informasi lomba, dan verifikasi check-in warga perayaan HUT Kemerdekaan RI ke-81 di RT 04.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ee2b2b",
    orientation: "portrait",
    icons: [
      {
        src: "/logo-hutri-81.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-hutri-81.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo-hutri-81.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
