"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Search,
  Info,
  Medal,
  ShieldCheck,
  LayoutGrid,
  Columns3,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CompetitionVisual } from "@/components/site/competition-visual";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type LandingCompetitionItem = {
  id: number;
  name: string;
  categoryLabel: string;
  countLabel: string;
  countSuffix: string;
  description: string;
  image?: string;
  type?: string;
  isFavorite?: boolean;
  href: string;
};

export function LandingCompetitions({ items }: { items: LandingCompetitionItem[] }) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(items.length > 3);
  const [activeFilter, setActiveFilter] = React.useState<"ALL" | "SOLO" | "TEAM" | "CHILD">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"carousel" | "grid">("carousel");
  const [selectedCompetition, setSelectedCompetition] = React.useState<LandingCompetitionItem | null>(null);

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

  const slide = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      // Filter by type
      if (activeFilter === "SOLO") {
        if (item.type !== "SOLO" && item.type !== "BOTH" && item.type) return false;
      } else if (activeFilter === "TEAM") {
        if (item.type !== "TEAM" && item.type !== "BOTH") return false;
      } else if (activeFilter === "CHILD") {
        const isChild = item.categoryLabel.toLowerCase().includes("anak");
        if (!isChild) return false;
      }

      // Filter by search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        return matchesName || matchesCategory || matchesDesc;
      }

      return true;
    });
  }, [items, activeFilter, searchQuery]);

  return (
    <section id="lomba" className="py-12 sm:py-16">
      {/* Section Header */}
      <div className="mb-8 sm:mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Cabang Perlombaan Warga
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Lomba 17-an RW 10
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Terbuka untuk warga RT 01 sampai RT 08. Daftarkan diri secara mandiri atau bentuk tim antar-tetangga sebelum kuota terpenuhi.
          </p>
        </div>

        {/* View Switcher & All Catalog Link */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="flex items-center rounded-xl border border-border/80 bg-muted/40 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("carousel")}
              aria-label="Tampilan korsel"
              title="Tampilan korsel"
              className={`rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                viewMode === "carousel"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Columns3 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Tampilan petak"
              title="Tampilan petak"
              className={`rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-bold border-border/80 hover:border-primary/40 cursor-pointer"
          >
            <Link href="/daftar">
              Katalog Lengkap
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Interactive Controls Bar: Filter Tabs & Live Search */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === "ALL"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("SOLO")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === "SOLO"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Perorangan
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("TEAM")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === "TEAM"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Beregu (Tim)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("CHILD")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === "CHILD"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            Anak-anak
          </button>
        </div>

        {/* Live Search Input */}
        <div className="relative sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama lomba..."
            className="w-full h-9 rounded-xl border border-border/80 bg-card pl-8 pr-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Carousel Navigation Buttons (Visible when in carousel mode) */}
      {viewMode === "carousel" && (
        <div className="flex justify-end gap-1.5 mb-3 sm:hidden">
          <button
            type="button"
            onClick={() => slide("left")}
            disabled={!showLeftArrow}
            aria-label="Geser ke kiri"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground transition-all cursor-pointer ${
              showLeftArrow ? "hover:border-primary/40 hover:bg-muted/50" : "opacity-30 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => slide("right")}
            disabled={!showRightArrow}
            aria-label="Geser ke kanan"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground transition-all cursor-pointer ${
              showRightArrow ? "hover:border-primary/40 hover:bg-muted/50" : "opacity-30 cursor-not-allowed"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-10 text-center text-muted-foreground space-y-2 bg-muted/15 my-4">
          <p className="text-sm font-bold text-foreground">Tidak ada lomba yang sesuai</p>
          <p className="text-xs max-w-sm mx-auto text-muted-foreground">
            Coba ubah kata kunci pencarian atau ganti filter kategori lomba.
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Hapus pencarian
            </button>
          )}
        </div>
      ) : viewMode === "carousel" ? (
        /* CAROUSEL VIEW */
        <div className="relative">
          {/* Desktop Carousel Navigation Overlays */}
          <div className="hidden sm:block absolute -left-4 top-1/2 -translate-y-1/2 z-20">
            <button
              type="button"
              onClick={() => slide("left")}
              disabled={!showLeftArrow}
              aria-label="Geser ke kiri"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/90 shadow-md text-foreground transition-all cursor-pointer backdrop-blur-xs ${
                showLeftArrow ? "hover:border-primary/40 hover:scale-105" : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="hidden sm:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
            <button
              type="button"
              onClick={() => slide("right")}
              disabled={!showRightArrow}
              aria-label="Geser ke kanan"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/90 shadow-md text-foreground transition-all cursor-pointer backdrop-blur-xs ${
                showRightArrow ? "hover:border-primary/40 hover:scale-105" : "opacity-0 pointer-events-none"
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filteredItems.map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                onOpenDetail={() => setSelectedCompetition(competition)}
                className="w-[280px] sm:w-[320px] lg:w-[350px] shrink-0 snap-start"
              />
            ))}
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              onOpenDetail={() => setSelectedCompetition(competition)}
            />
          ))}
        </div>
      )}

      {/* Interactive Quick Detail Modal */}
      {selectedCompetition && (
        <Dialog open={!!selectedCompetition} onOpenChange={(open) => !open && setSelectedCompetition(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl p-6">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                  {selectedCompetition.type === "TEAM" ? "Beregu (Tim)" : "Perorangan"}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {selectedCompetition.categoryLabel}
                </span>
              </div>
              <DialogTitle className="text-xl font-black text-foreground">
                {selectedCompetition.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                {selectedCompetition.description}
              </p>

              {/* Status Pendaftaran & Kuota */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground">Partisipasi Terdaftar</span>
                  <span className="text-primary tabular-nums">
                    {selectedCompetition.countLabel} {selectedCompetition.countSuffix}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Gratis 100% tanpa dipungut biaya pendaftaran.</span>
                </div>
              </div>

              {/* Fasilitas & Ketentuan */}
              <div className="space-y-2">
                <p className="font-bold text-foreground">Ketentuan Singkat:</p>
                <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                  <li>Berdomisili di wilayah RW 10 (RT 01 sampai RT 08).</li>
                  <li>Membawa E-Ticket digital saat check-in pada hari H.</li>
                  <li>Hadir 15 menit sebelum nomor pertandingan dipanggil.</li>
                </ul>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center gap-2.5">
                <Button
                  asChild
                  className="flex-1 rounded-xl bg-primary font-bold text-xs shadow-xs hover:bg-primary/90 cursor-pointer"
                >
                  <Link href={selectedCompetition.href}>
                    Daftar Lomba Ini
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedCompetition(null)}
                  className="rounded-xl text-xs font-semibold border-border/80 cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

function CompetitionCard({
  competition,
  onOpenDetail,
  className = "",
}: {
  competition: LandingCompetitionItem;
  onOpenDetail: () => void;
  className?: string;
}) {
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md ${className}`}
    >
      {/* Visual Header */}
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <CompetitionVisual
          name={competition.name}
          categoryLabel={competition.categoryLabel}
          type={competition.type}
          image={competition.image}
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-bold text-primary truncate">
            {competition.categoryLabel}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground shrink-0">
            <Users className="h-3.5 w-3.5 text-primary/70" />
            {competition.countLabel} {competition.countSuffix}
          </span>
        </div>

        <h3 className="mt-2 text-lg font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {competition.name}
        </h3>

        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {competition.description}
        </p>

        {/* Card Interactive Actions */}
        <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenDetail}
            className="rounded-xl text-xs font-semibold border-border/80 hover:border-primary/40 hover:bg-muted/40 cursor-pointer"
          >
            <Info className="h-3.5 w-3.5 mr-1" />
            Detail
          </Button>

          <Button
            asChild
            size="sm"
            className="flex-1 rounded-xl bg-primary font-bold text-xs shadow-xs hover:bg-primary/90 cursor-pointer"
          >
            <Link href={competition.href}>
              Daftar Sekarang
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
