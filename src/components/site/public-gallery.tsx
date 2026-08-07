"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowRight, Sparkles, Trophy, Download } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type PublicGalleryItem = {
  src: string;
  alt: string;
  categoryId: string;
  categoryLabel: string;
  title: string;
  year: string;
};

export type FilterOption = {
  id: string;
  label: string;
};

export function PublicGallery({
  items,
  filters,
}: {
  items: PublicGalleryItem[];
  filters: FilterOption[];
}) {
  const [activeFilter, setActiveFilter] = React.useState<string>("all");

  const filteredItems = React.useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((item) => item.categoryId === activeFilter);
  }, [items, activeFilter]);

  // Fungsi pengunduh foto universal via Server Proxy (Bebas dari masalah pembatasan CORS & Tab Baru!)
  const handleDownload = async (e: React.MouseEvent, src: string, title: string) => {
    e.stopPropagation();
    try {
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_") || "Momen_HUTRI_81";
      const filename = `HUTRI81_RW10_${cleanTitle}.jpg`;

      if (src.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Mengalihkan unduhan ke Server Proxy kita untuk melompati pemblokiran CORS & batal buka tab baru
        const proxyUrl = `/api/download-image?url=${encodeURIComponent(src)}&filename=${encodeURIComponent(filename)}`;
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error("Gagal mengunduh lewat server proxy");
        
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (err) {
      // Fallback cadangan darurat jika jaringan terganggu
      window.open(src, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen w-full py-12">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        {/* Hero Section Galeri */}
        <section className="mb-14 text-center">
          <div className="animate-fade-in-down mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-wider text-primary shadow-xs">
            <Camera className="h-4 w-4" />
            Arsip & Dokumentasi RW 10
          </div>
          <h1 className="animate-fade-in-up text-4xl font-black tracking-tight text-foreground md:text-6xl">
            Galeri Momen <span className="text-[#ee2b2b]">Semarak 17-an</span>
          </h1>
          <p className="animate-fade-in-up delay-100 mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Saksikan kembali senyuman, tawa, dan kekompakan tak terlupakan warga RW 10 saat merayakan kemerdekaan Indonesia.
          </p>

          {/* Interaksi Category Filter Bar */}
          <div className="animate-fade-in-up delay-200 mt-8 flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveFilter("all")}
              type="button"
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeFilter === "all"
                  ? "bg-[#ee2b2b] text-white shadow-lg shadow-red-500/30 scale-105"
                  : "border border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              Semua Momen ({items.length})
            </button>

            {filters.map((opt) => {
              const count = items.filter((i) => i.categoryId === opt.id).length;
              if (count === 0) return null; // Sembunyikan mutlak seluruh tab kategori lomba/umum jika masih berstatus 0
              const isActive = activeFilter === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveFilter(opt.id)}
                  type="button"
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#ee2b2b] text-white shadow-lg shadow-red-500/30 scale-105"
                      : "border border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <Trophy className="h-4 w-4 text-amber-500" />
                  {opt.label} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* Grid Galeri */}
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground space-y-3 bg-muted/10">
            <Camera className="mx-auto h-12 w-12 opacity-40 text-primary" />
            <p className="text-base font-bold text-foreground">Belum ada dokumentasi pada kategori ini</p>
            <p className="text-xs max-w-sm mx-auto text-muted-foreground">
              Foto-foto meriah untuk cabang ini sedang disiapkan oleh Panitia dan Admin.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <Dialog key={`photo-${index}-${item.categoryId}`}>
                <div className="card-hover group relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card text-left shadow-sm">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    unoptimized={item.src.startsWith("http")}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

                  {/* Lencana Kategori */}
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20">
                      <Trophy className="h-3 w-3 text-amber-400" />
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Tombol Unduh Kustom pada Hover di Pojok Kiri/Kanan Atas */}
                  <div className="absolute top-4 right-4 z-20 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => handleDownload(e, item.src, item.title)}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#ee2b2b] hover:bg-[#d92222] px-3.5 text-xs font-black text-white backdrop-blur-md shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      title="Download Foto ke Perangkat"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh</span>
                    </button>
                  </div>

                  {/* Area Judul dan Deskripsi */}
                  <div className="relative mt-auto flex flex-col justify-end p-6 text-white z-10 pointer-events-none">
                    <span className="mb-1 inline-flex w-fit items-center rounded-md bg-[#ee2b2b]/90 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-extrabold tracking-tight text-white line-clamp-1 group-hover:text-red-200 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {item.alt}
                    </p>
                  </div>

                  {/* Tombol Pemicu Dialog Lightbox Full-Cover */}
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label="Lihat detail foto"
                    />
                  </DialogTrigger>
                </div>

                <DialogContent className="flex max-w-4xl flex-col items-center border-none bg-transparent p-0 shadow-none [&>button]:hidden">
                  <DialogTitle className="sr-only">{item.title}</DialogTitle>
                  <DialogDescription className="sr-only">{item.alt}</DialogDescription>
                  <div className="relative inline-block w-full overflow-hidden rounded-3xl bg-black/90 ring-1 ring-white/20 shadow-2xl">
                    <div className="relative flex max-h-[80vh] w-full items-center justify-center p-2 sm:p-4">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={1200}
                        height={900}
                        unoptimized={item.src.startsWith("http")}
                        className="h-auto max-h-[72vh] w-auto rounded-2xl object-contain"
                      />
                    </div>

                    <div className="border-t border-white/10 bg-zinc-950/80 p-5 backdrop-blur-xl sm:p-7">
                      <div className="flex flex-col gap-4.5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1.5 max-w-2xl">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-[#ee2b2b]">
                            {item.year} &middot; {item.categoryLabel}
                          </span>
                          <h4 className="text-lg font-black text-white">{item.title}</h4>
                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-0.5">
                            {item.alt}
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={(e) => handleDownload(e, item.src, item.title)}
                          className="h-11 w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#ee2b2b] to-[#e01d1d] hover:from-[#e01d1d] hover:to-[#c91818] px-6 text-xs font-black text-white shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <DialogClose className="absolute right-4 top-4 rounded-full bg-black/70 p-2.5 text-white shadow-lg backdrop-blur-md ring-1 ring-white/30 transition-all hover:bg-red-600 hover:scale-110 cursor-pointer">
                      <span className="sr-only">Tutup</span>
                      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </section>
        )}

        {/* CTA Banner di Bawah Galeri */}
        <section className="mt-20">
          <div className="festive-gradient relative overflow-hidden rounded-[3rem] p-10 text-center text-white shadow-xl shadow-red-500/20 md:p-16">
            <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                Agustusan 2026 Segera Tiba
              </span>
              <h2 className="text-3xl font-black tracking-tight md:text-5xl">
                Siap Melukis Kenangan Baru Tahun Ini?
              </h2>
              <p className="text-base font-medium text-white/90 md:text-lg">
                Jangan cuma jadi penonton! Segera daftarkan namamu atau tim terbaikmu di ajang perlombaan HUT RI ke-81.
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  className="h-auto rounded-full bg-white px-9 py-4 text-lg font-black text-[#ee2b2b] shadow-xl transition-all duration-300 hover:scale-105 hover:bg-zinc-100 hover:shadow-2xl cursor-pointer"
                >
                  <Link href="/#lomba">
                    Daftar Lomba Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
