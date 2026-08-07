import Link from "next/link";
import { Clock, Globe, Mail, MapPin, MessageCircle } from "lucide-react";

import { TextThemeToggle } from "@/components/site/theme-toggle";
import { Logo81 } from "@/components/site/logo-81";

const socialLinks = [
  { label: "Website", href: "#", icon: Globe },
  { label: "Chat", href: "#", icon: MessageCircle },
  { label: "Email", href: "#", icon: Mail },
];

const quickLinks = [
  { label: "Daftar Lomba", href: "#lomba" },
  { label: "Jadwal Acara", href: "#jadwal" },
  { label: "Galeri Tahun Lalu", href: "/galeri" },
  { label: "Kontak Panitia", href: "#faq" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/95 pb-10 pt-20">
      <div className="mx-auto w-full max-w-[1200px] px-6">
        <div className="grid gap-16 md:grid-cols-4">
          <div className="space-y-8 md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ee2b2b] text-white shadow-lg shadow-primary/20 p-1.5 overflow-hidden ring-1 ring-white/20">
                <Logo81 className="h-full w-full object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Semarak 17-an</h2>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
                  RT 04 Community
                </p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Wadah silaturahmi dan perayaan kemerdekaan bagi seluruh warga RT 04.
              Mari bersatu, bergembira, dan rayakan semangat Merah Putih bersama.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white hover:shadow-md"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-primary">
              Tautan Cepat
            </h4>
            <ul className="space-y-4 text-sm font-medium text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link className="transition-colors duration-200 hover:text-primary" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-8 text-xs font-bold uppercase tracking-widest text-primary">
              Lokasi Acara
            </h4>
            <ul className="space-y-6 text-sm text-muted-foreground">
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="leading-relaxed">
                  Jl. Pengasinan Tengah RT 04 Depan Masjid Nurul Huda
                </span>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="leading-relaxed">17 Agustus 2026, 07:00 WIB &ndash; Selesai</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-border/60 pt-8 text-xs font-medium text-muted-foreground md:flex-row">
          <p>&copy; 2026 HUTRI-81. Dirgahayu Indonesia</p>
          <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link className="transition-colors duration-200 hover:text-primary" href="/login">
              MASUK
            </Link>
            <TextThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
