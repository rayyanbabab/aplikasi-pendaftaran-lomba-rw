import Link from "next/link";
import { Logo81 } from "@/components/site/logo-81";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link href="/" className="group flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#ee2b2b] text-white shadow-md shadow-primary/30 ring-1 ring-white/20 p-1 overflow-hidden">
            <Logo81 className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 truncate">
            <p className="text-base sm:text-lg font-extrabold leading-tight tracking-tight truncate">Semarak 17-an</p>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-primary truncate">
              RW 10 &middot; Agustusan 2026
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 lg:gap-8 md:flex shrink-0">
          <Link className="text-sm font-semibold transition-colors duration-200 hover:text-primary" href="/#lomba">
            Lomba
          </Link>
          <Link className="text-sm font-semibold transition-colors duration-200 hover:text-primary" href="/#jadwal">
            Jadwal
          </Link>
          <Link className="text-sm font-semibold transition-colors duration-200 hover:text-primary" href="/#syarat">
            Syarat
          </Link>
          <Link className="text-sm font-semibold transition-colors duration-200 hover:text-primary" href="/#faq">
            FAQ
          </Link>
          <Link className="text-sm font-semibold transition-colors duration-200 hover:text-primary" href="/galeri">
            Galeri
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button
            asChild
            variant="ghost"
            className="rounded-full px-3 py-2 sm:px-4 text-xs sm:text-sm font-bold text-foreground transition-all hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/login">Masuk</Link>
          </Button>
          <Button
            asChild
            className="rounded-full border border-white/30 bg-[#ee2b2b] px-4 py-2 sm:px-6 text-xs sm:text-sm font-bold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:scale-105 hover:bg-[#d92525] active:scale-[0.98]"
          >
            <Link href="/register">
              <span className="sm:hidden">Daftar 🚀</span>
              <span className="hidden sm:inline">Daftar Sekarang</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
