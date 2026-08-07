import Link from "next/link";
import { Clock, Globe, Mail, MapPin, MessageCircle, Heart } from "lucide-react";

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
  { label: "Syarat Peserta", href: "#syarat" },
  { label: "Galeri Tahun Lalu", href: "/galeri" },
  { label: "Tanya Jawab (FAQ)", href: "#faq" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/98 pt-16 pb-8">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">

        {/* Main grid */}
        <div className="grid gap-12 sm:gap-10 md:grid-cols-4 pb-12 border-b border-border/50">

          {/* Brand col */}
          <div className="space-y-6 md:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ee2b2b] text-white shadow-lg shadow-red-500/20 p-1.5 overflow-hidden ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105">
                <Logo81 className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-xl font-black tracking-tight leading-tight">Semarak 17-an</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
                  RW 10 Community
                </p>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Wadah silaturahmi dan perayaan kemerdekaan bagi seluruh warga RW 10.
              Mari bersatu, bergembira, dan rayakan semangat Merah Putih bersama.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-widest text-primary">
              Tautan Cepat
            </h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    className="text-muted-foreground transition-colors duration-150 hover:text-primary flex items-center gap-2 group"
                    href={link.href}
                  >
                    <span className="h-1 w-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-150 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Location Info */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-widest text-primary">
              Lokasi Acara
            </h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="leading-relaxed">
                  Jl. Pengasinan Tengah RW 10,<br />
                  Depan Masjid Nurul Huda
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="leading-relaxed">
                  17 Agustus 2026<br />
                  07:00 WIB &ndash; Selesai
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            &copy; 2026 Semarak 17-an RW 10 &bull; Dirgahayu Republik Indonesia
          </p>
          <div className="flex items-center gap-5">
            <Link
              className="font-semibold uppercase tracking-widest transition-colors hover:text-primary"
              href="/login"
            >
              Portal Panitia
            </Link>
            <TextThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
