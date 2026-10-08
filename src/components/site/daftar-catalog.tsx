"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Info,
  MapPin,
  QrCode,
  Search,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CompetitionVisual } from "@/components/site/competition-visual";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface DaftarCatalogItem {
  id: number;
  name: string;
  categoryLabel: string;
  countLabel: string;
  countSuffix: string;
  description: string;
  image?: string;
  type: string; // "SOLO" | "TEAM" | "BOTH"
  href: string;
}

interface DaftarCatalogProps {
  items: DaftarCatalogItem[];
}

export function DaftarCatalog({ items }: DaftarCatalogProps) {
  const [activeTab, setActiveTab] = React.useState<"ALL" | "SOLO" | "TEAM" | "CHILD">("ALL");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedComp, setSelectedComp] = React.useState<DaftarCatalogItem | null>(null);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      // Filter by type
      if (activeTab === "SOLO") {
        if (item.type !== "SOLO" && item.type !== "BOTH" && item.type) return false;
      } else if (activeTab === "TEAM") {
        if (item.type !== "TEAM" && item.type !== "BOTH") return false;
      } else if (activeTab === "CHILD") {
        const isChild = item.categoryLabel.toLowerCase().includes("anak");
        if (!isChild) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        return matchesName || matchesCategory || matchesDesc;
      }
      return true;
    });
  }, [items, activeTab, searchQuery]);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
      {/* Page Header */}
      <section className="mb-10 text-center sm:mb-12">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Trophy className="h-3.5 w-3.5" />
          Katalog Resmi RW 10
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Semua Cabang <span className="text-primary">Lomba 17-an</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Pilih perlombaan kemerdekaan untuk perorangan atau bentuk regu tim tangkas bersama warga RT Anda.
          Pendaftaran online bebas biaya tanpa perlu membuat akun atau password.
        </p>

        {/* Search & Filter Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama lomba atau kategori..."
              className="w-full h-10 rounded-xl border border-border/80 bg-card pl-9 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border border-border/80 bg-muted/30 w-full sm:w-auto justify-center flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "ALL"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("SOLO")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "SOLO"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Perorangan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("TEAM")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "TEAM"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Beregu (Tim)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("CHILD")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "CHILD"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anak-anak
            </button>
          </div>
        </div>
      </section>

      {/* Grid Katalog Lomba */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center text-muted-foreground space-y-2 bg-muted/15 my-8">
          <Trophy className="mx-auto h-10 w-10 opacity-30 text-primary" />
          <p className="text-sm font-bold text-foreground">Tidak ditemukan lomba yang sesuai</p>
          <p className="text-xs max-w-sm mx-auto text-muted-foreground">
            Coba ubah kata kunci pencarian atau ganti filter kategori lomba di atas.
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
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {filteredItems.map((comp) => {
            return (
              <div
                key={comp.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md"
              >
                {/* Visual Header */}
                <div className="relative h-48 w-full overflow-hidden">
                  <CompetitionVisual
                    name={comp.name}
                    categoryLabel={comp.categoryLabel}
                    type={comp.type}
                    image={comp.image}
                  />
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary truncate">
                      {comp.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground shrink-0">
                      <Users className="h-3.5 w-3.5 text-primary/70" />
                      <strong>{comp.countLabel}</strong> {comp.countSuffix}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {comp.name}
                  </h3>

                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                    {comp.description}
                  </p>

                  <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedComp(comp)}
                      className="rounded-xl text-xs font-semibold border-border/80 hover:border-primary/40 hover:bg-muted/40 cursor-pointer"
                    >
                      <Info className="h-3.5 w-3.5 mr-1" />
                      Detail
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                    >
                      <Link href={comp.href}>
                        Daftar Lomba
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Interactive Quick Detail Modal */}
      {selectedComp && (
        <Dialog open={!!selectedComp} onOpenChange={(open) => !open && setSelectedComp(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl p-6">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary">
                  {selectedComp.type === "TEAM" ? "Beregu (Tim)" : "Perorangan"}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {selectedComp.categoryLabel}
                </span>
              </div>
              <DialogTitle className="text-xl font-black text-foreground">
                {selectedComp.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                {selectedComp.description}
              </p>

              {/* Status Pendaftaran & Kuota */}
              <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground">Partisipasi Saat Ini</span>
                  <span className="text-primary tabular-nums">
                    {selectedComp.countLabel} {selectedComp.countSuffix}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Gratis 100% tanpa dipungut biaya apa pun.</span>
                </div>
              </div>

              {/* Ketentuan Singkat */}
              <div className="space-y-2">
                <p className="font-bold text-foreground">Ketentuan Peserta:</p>
                <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                  <li>Warga berdomisili di lingkungan RW 10 (RT 01 sampai RT 08).</li>
                  <li>Membawa E-Ticket digital saat verifikasi kehadiran di hari H.</li>
                  <li>Hadir 15 menit sebelum waktu tanding dimulai.</li>
                </ul>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center gap-2.5">
                <Button
                  asChild
                  className="flex-1 rounded-xl bg-primary font-bold text-xs shadow-xs hover:bg-primary/90 cursor-pointer"
                >
                  <Link href={selectedComp.href}>
                    Lanjut Isi Formulir
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedComp(null)}
                  className="rounded-xl text-xs font-semibold border-border/80 cursor-pointer"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Informasi Layanan Warga RW 10 */}
      <section className="mb-16 rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/60">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Layanan Warga RW 10
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Bantuan &amp; Cek Bukti Pendaftaran
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl">
              Sudah mendaftar sebelumnya dan ingin mengunduh ulang E-Ticket dengan QR Code?
              Gunakan pencarian cepat dengan nomor WhatsApp atau kode pendaftaran Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-border/80 text-xs font-bold hover:border-primary/40 cursor-pointer"
            >
              <Link href="/bukti">
                <QrCode className="mr-1.5 h-4 w-4 text-primary" />
                Cari E-Ticket Saya
              </Link>
            </Button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span>Pendaftaran Tutup: <strong>16 Agustus 2026 Pukul 22:00 WIB</strong></span>
          </div>
          <span className="font-bold text-primary uppercase tracking-wider text-[11px]">
            HUT RI ke-81 &bull; RW 10 Kel. Pengasinan
          </span>
        </div>
      </section>
    </div>
  );
}
