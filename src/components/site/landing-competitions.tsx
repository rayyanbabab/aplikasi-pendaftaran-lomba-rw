"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export type LandingCompetitionItem = {
  id: number;
  name: string;
  categoryLabel: string;
  countLabel: string;
  countSuffix: string;
  description: string;
  image: string;
  isFavorite?: boolean;
  href: string;
};

export function LandingCompetitions({ items }: { items: LandingCompetitionItem[] }) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(items.length > 4);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  React.useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [items.length]);

  const isSlidingRef = React.useRef(false);

  const slide = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el || isSlidingRef.current) return;

    isSlidingRef.current = true;
    const startX = el.scrollLeft;
    // Kalkulasi jarak geser secara presisi sebesar 2 kartu (termasuk gap 24px/1.5rem)
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 24
      : el.clientWidth * 0.5;
    const distance = cardWidth * 2; 
    const targetX = direction === "right" ? startX + distance : startX - distance;

    const startTime = performance.now();
    const duration = 650; // 650ms untuk durasi luncuran berirama sinematik & empuk

    // Kurva Quintic Ease-Out: awal melampar gesit, akhir melambat super mulus (pillowy decelerated stop)
    const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5);

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutQuint(progress);

      el.scrollLeft = startX + (targetX - startX) * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        isSlidingRef.current = false;
        checkScroll();
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const mobileItems = items.slice(0, 4);
  const hasMoreItems = items.length > 4;

  return (
    <section id="lomba" className="py-14 sm:py-20">
      <div className="mb-10 sm:mb-16 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-3 sm:space-y-4 text-center md:text-left">
          <div className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 sm:px-5 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Daftar Perlombaan
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight md:text-5xl">
            Lomba Kemerdekaan
          </h2>
          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Beragam lomba untuk anak-anak hingga dewasa. Silakan mendaftar secara mandiri atau perwakilan tim sebelum batas kuota terpenuhi.
          </p>
        </div>

        {/* Kontrol Tombol Slide Khusus Mode Desktop jika jumlah lomba > 4 */}
        <div className="hidden items-center gap-2.5 md:flex">
          {items.length > 4 && (
            <>
              <button
                type="button"
                onClick={() => slide("left")}
                disabled={!showLeftArrow}
                aria-label="Geser ke Kiri"
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-border/80 bg-card transition-all duration-200 cursor-pointer ${
                  showLeftArrow
                    ? "text-foreground shadow-md hover:border-primary/50 hover:bg-primary/5 hover:scale-105 active:scale-95"
                    : "opacity-35 cursor-not-allowed border-dashed text-muted-foreground"
                }`}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => slide("right")}
                disabled={!showRightArrow}
                aria-label="Geser ke Kanan"
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-border/80 bg-card transition-all duration-200 cursor-pointer ${
                  showRightArrow
                    ? "text-foreground shadow-md hover:border-primary/50 hover:bg-primary/5 hover:scale-105 active:scale-95"
                    : "opacity-35 cursor-not-allowed border-dashed text-muted-foreground"
                }`}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <Link
            href="/daftar"
            className="ml-2 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 text-sm font-bold text-foreground shadow-xs transition-all duration-200 hover:border-primary/50 hover:text-primary active:scale-95 cursor-pointer"
          >
            Semua Lomba
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ================= TAMPILAN DESKTOP: 1 Baris Slider (Horizontal Carousel) ================= */}
      <div className="hidden md:block">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((competition, index) => {
            // Kalkulasi lebar: 2 item di layar sedang (md), dan TEPAT 4 item pada 1 baris di layar desktop lebar (lg+)
            return (
              <div
                key={competition.id}
                className="group flex w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3*1.5rem)/4)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-52 lg:h-56 overflow-hidden">
                  <Image
                    src={competition.image}
                    alt={competition.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-primary truncate">
                      {competition.categoryLabel}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground shrink-0">
                      <Users className="h-3.5 w-3.5 text-primary/70" />
                      {competition.countLabel}
                      {competition.countSuffix}
                    </span>
                  </div>
                  <h3 className="mt-3.5 text-xl font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {competition.name}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {competition.description}
                  </p>
                  <Button
                    asChild
                    className="mt-6 w-full rounded-2xl bg-[#ee2b2b] py-3.5 text-sm font-black text-white shadow-md shadow-red-500/20 transition-all duration-200 hover:bg-[#d42222] hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Link href={competition.href}>
                      Daftar Lomba Ini
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= TAMPILAN MOBILE: Maksimal 4 Kartu + Tombol Lomba Lainnya ================= */}
      <div className="md:hidden space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {mobileItems.map((competition, index) => (
            <div
              key={competition.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 active:scale-[0.99]"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={competition.image}
                  alt={competition.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-primary">
                    {competition.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <Users className="h-3.5 w-3.5 text-primary/70" />
                    {competition.countLabel}
                    {competition.countSuffix}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground">
                  {competition.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {competition.description}
                </p>
                <Button
                  asChild
                  className="mt-5 w-full rounded-xl bg-[#ee2b2b] py-3 text-xs font-black text-white shadow-sm transition-colors hover:bg-[#d42222] cursor-pointer"
                >
                  <Link href={competition.href}>
                    Daftar Lomba
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Semua Lomba menuju /daftar */}
        <div className="pt-2">
          <Button
            asChild
            className="h-14 w-full rounded-2xl border-2 border-[#ee2b2b] bg-[#ee2b2b]/10 hover:bg-[#ee2b2b] text-[#ee2b2b] hover:text-white px-6 text-sm font-black shadow-sm transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <Link href="/daftar" className="flex items-center justify-center gap-2">
              <span>Semua Lomba</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
