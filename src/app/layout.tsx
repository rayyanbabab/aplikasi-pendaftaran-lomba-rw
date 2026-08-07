import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/site/pwa-register";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ee2b2b" },
    { media: "(prefers-color-scheme: dark)", color: "#171313" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Semarak 17-an RW 10",
    default: "Semarak 17-an RW 10 | Portal Resmi Pendaftaran Lomba HUT RI ke-81",
  },
  description:
    "Portal resmi pendaftaran dan informasi lomba perayaan HUT Kemerdekaan RI ke-81 di RW 10. Mudah, transparan, dan terstruktur untuk seluruh warga!",
  icons: {
    icon: "/logo-hutri-81.png",
    shortcut: "/logo-hutri-81.png",
    apple: "/logo-hutri-81.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RW10: HUTRI KE 81",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${plusJakarta.variable} font-sans`}>
        <ThemeProvider>
          <PwaRegister />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
