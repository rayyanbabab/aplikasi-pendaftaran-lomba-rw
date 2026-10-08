"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, ArrowRight, Shield } from "lucide-react";
import { useTheme } from "next-themes";

import { Logo81 } from "@/components/site/logo-81";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Cabang Lomba", href: "/#lomba" },
  { label: "Jadwal Acara", href: "/#jadwal" },
  { label: "Tata Tertib", href: "/#syarat" },
  { label: "Tanya Jawab", href: "/#faq" },
  { label: "Dokumentasi", href: "/galeri" },
];

function ThemeIconButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-lg border border-border/60 bg-muted/30" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Ganti mode tampilan"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground hover:bg-muted/40 cursor-pointer"
    >
      {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-neutral-600" />}
    </button>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
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
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled
            ? "border-b border-border/70 bg-background/95 shadow-xs backdrop-blur-md"
            : "border-b border-transparent bg-background/80 backdrop-blur-sm"
        }`}
      >
        {/* Subtle Merah Putih ribbon line */}
        <div className="h-0.5 w-full merah-putih-stripe opacity-90" />

        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">

          {/* ── Brand Logo & Identity ── */}
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs ring-1 ring-black/5 p-1.5 transition-transform duration-200 group-hover:scale-102">
              <Logo81 className="h-full w-full object-contain brightness-0 invert" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-foreground">
                  Semarak 17-an
                </span>
                <span className="rounded px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary">
                  HUT RI 81
                </span>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground">
                RW 10 Kelurahan Pengasinan
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-semibold text-foreground/80 rounded-md transition-colors hover:text-primary hover:bg-primary/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Actions: Theme + Portal + Daftar ── */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <ThemeIconButton />
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Panitia
            </Link>
            <Button
              asChild
              size="sm"
              className="rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90 transition-all"
            >
              <Link href="/daftar">
                Pilih Lomba
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* ── Mobile: Action + Hamburger ── */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              asChild
              size="sm"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              <Link href="/daftar">Pilih Lomba</Link>
            </Button>
            <ThemeIconButton />
            <button
              type="button"
              aria-label="Buka menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-card text-foreground transition-colors hover:bg-muted"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/60 bg-background/98 px-4 py-4 space-y-1 shadow-lg backdrop-blur-xl animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted hover:text-primary transition-colors"
              >
                <span>{link.label}</span>
                <span className="text-muted-foreground/60 text-xs">→</span>
              </Link>
            ))}

            <div className="pt-3 border-t border-border/50 mt-2 space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <Shield className="h-3.5 w-3.5 text-primary" />
                Portal Masuk Panitia RW 10
              </Link>
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
