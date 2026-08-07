"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { Logo81 } from "@/components/site/logo-81";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Lomba", href: "/#lomba" },
  { label: "Jadwal", href: "/#jadwal" },
  { label: "Syarat", href: "/#syarat" },
  { label: "FAQ", href: "/#faq" },
  { label: "Galeri", href: "/galeri" },
];

/** Pill toggle: Sun (Terang) / Moon (Gelap) */
function ThemePill() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder agar tidak ada layout shift
    return (
      <div className="flex h-8 w-[70px] items-center rounded-full border border-border/60 bg-muted p-0.5" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle tema gelap/terang"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      className={`
        relative flex h-8 w-[70px] items-center rounded-full border p-0.5
        transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        ${isDark
          ? "border-slate-600/60 bg-slate-800"
          : "border-amber-200/70 bg-amber-50"
        }
      `}
    >
      {/* Sliding thumb */}
      <span
        className={`
          absolute flex h-6 w-6 items-center justify-center rounded-full shadow-sm
          transition-all duration-300 ease-in-out
          ${isDark
            ? "translate-x-[38px] bg-slate-700 text-slate-200"
            : "translate-x-0 bg-white text-amber-500 shadow-amber-200/40"
          }
        `}
      >
        {isDark
          ? <Moon className="h-3.5 w-3.5" />
          : <Sun className="h-3.5 w-3.5" />
        }
      </span>

      {/* Label kiri (Sun) */}
      <span className={`pl-1.5 text-[10px] font-bold transition-opacity duration-200 ${isDark ? "opacity-50" : "opacity-0"}`}>
        <Sun className="h-3 w-3 text-amber-400" />
      </span>
      {/* Label kanan (Moon) */}
      <span className={`ml-auto pr-1.5 text-[10px] font-bold transition-opacity duration-200 ${isDark ? "opacity-0" : "opacity-50"}`}>
        <Moon className="h-3 w-3 text-slate-500" />
      </span>
    </button>
  );
}

/** Simple icon-only toggle untuk mobile menu */
function ThemeIconToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground w-full"
    >
      {isDark
        ? <><Sun className="h-4 w-4 text-amber-400" /><span>Mode Terang</span></>
        : <><Moon className="h-4 w-4 text-slate-500" /><span>Mode Gelap</span></>
      }
    </button>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/90 shadow-sm shadow-black/5 backdrop-blur-xl border-b border-border/50"
            : "bg-background/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5">

          {/* ── Logo ── */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0 min-w-0">
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#ee2b2b] text-white shadow-md shadow-red-500/30 ring-1 ring-white/20 p-1 overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <Logo81 className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-[17px] font-extrabold leading-tight tracking-tight truncate">
                Semarak 17-an
              </p>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-primary truncate">
                RW 10 &middot; Agustusan 2026
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden items-center gap-1 md:flex shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 text-sm font-semibold text-foreground/80 rounded-lg transition-colors duration-150 hover:text-primary hover:bg-primary/10 group"
              >
                {link.label}
                <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 rounded-full bg-primary scale-x-0 transition-transform duration-200 group-hover:scale-x-100 origin-left" />
              </Link>
            ))}
          </nav>

          {/* ── Desktop: Theme toggle + CTA ── */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <ThemePill />
            <Button
              asChild
              variant="ghost"
              className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/80 transition-all hover:bg-primary/10 hover:text-primary"
            >
              <Link href="/login">Masuk</Link>
            </Button>
            <Button
              asChild
              className="rounded-full bg-[#ee2b2b] px-5 py-2 text-sm font-bold text-white shadow-md shadow-red-500/20 transition-all duration-200 hover:bg-[#d42222] hover:scale-105 active:scale-[0.97]"
            >
              <Link href="/register">Daftar Sekarang</Link>
            </Button>
          </div>

          {/* ── Mobile: Daftar + Hamburger ── */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <Button
              asChild
              size="sm"
              className="rounded-full bg-[#ee2b2b] px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-500/20 hover:bg-[#d42222]"
            >
              <Link href="/register">Daftar 🚀</Link>
            </Button>
            <button
              aria-label="Buka menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card text-foreground transition-colors hover:bg-muted"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown Menu ── */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                {link.label}
              </Link>
            ))}

            {/* Divider + secondary actions */}
            <div className="pt-2 border-t border-border/40 mt-2 space-y-0.5">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Masuk ke Akun
              </Link>
              {/* Theme toggle in mobile menu */}
              <ThemeIconToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
