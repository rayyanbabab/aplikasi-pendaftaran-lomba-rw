import Link from "next/link";
import { Clock, MapPin } from "lucide-react";

import { TextThemeToggle } from "@/components/site/theme-toggle";
import { Logo81 } from "@/components/site/logo-81";

const socialLinks = [
  {
    label: "TikTok",
    href: "https://www.tiktok.com/",
    hoverColor: "hover:bg-[#010101] hover:text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/",
    hoverColor: "hover:bg-[#25D366] hover:text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    hoverColor: "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#dc2743] hover:text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

const quickLinks = [
  { label: "Daftar Lomba", href: "/#lomba" },
  { label: "Jadwal Acara", href: "/#jadwal" },
  { label: "Syarat Peserta", href: "/#syarat" },
  { label: "Galeri Dokumentasi", href: "/galeri" },
  { label: "Tanya Jawab (FAQ)", href: "/#faq" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/98 pt-16 pb-8">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">

        {/* Main grid */}
        <div className="grid gap-12 sm:gap-10 md:grid-cols-4 pb-12 border-b border-border/50">

          {/* Brand col */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-2xs p-1.5 overflow-hidden ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-102">
                <Logo81 className="h-full w-full object-contain brightness-0 invert" />
              </div>
              <div>
                <p className="text-lg font-black tracking-tight leading-tight text-foreground">Semarak 17-an</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  RW 10 Kelurahan Pengasinan
                </p>
              </div>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              Portal resmi pendaftaran dan informasi perlombaan peringatan HUT Kemerdekaan RI ke-81 di lingkungan RW 10.
              Merajut kebersamaan, menjaga sportivitas, dan mempererat kerukunan antar-warga.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map(({ icon, href, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${hoverColor}`}
                >
                  {icon}
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
