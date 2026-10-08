"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowRight, Trophy, Download } from "lucide-react";

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

  const handleDownload = async (e: React.MouseEvent, src: string, title: string) => {
    e.stopPropagation();
    try {
      const cleanTitle = title.replace(/[^a-zA-Z0-9]/g, "_") || "Dokumentasi_HUTRI_81";
      const filename = `HUTRI81_RW10_${cleanTitle}.jpg`;

      if (src.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
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
    } catch {
      window.open(src, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen w-full py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        {/* Header Section */}
        <section className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Camera className="h-3.5 w-3.5" />
            Dokumentasi &amp; Arsip Warga
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Galeri Momen <span className="text-primary">Semarak 17-an</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Arsip kebersamaan, senyuman, dan semangat kemerdekaan warga RW 10 dari tahun ke tahun.
          </p>

          {/* Category Filter Chips */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              type="button"
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "border border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              Semua Dokumentasi ({items.length})
            </button>

            {filters.map((opt) => {
              const count = items.filter((i) => i.categoryId === opt.id).length;
              if (count === 0) return null;
              const isActive = activeFilter === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveFilter(opt.id)}
                  type="button"
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "border border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {opt.label} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center text-muted-foreground space-y-2 bg-muted/15">
            <Camera className="mx-auto h-10 w-10 opacity-30 text-primary" />
            <p className="text-sm font-bold text-foreground">Belum ada foto pada kategori ini</p>
            <p className="text-xs max-w-sm mx-auto text-muted-foreground">
              Dokumentasi untuk cabang kegiatan ini akan diunggah oleh seksi dokumentasi panitia.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <Dialog key={`photo-${index}-${item.categoryId}`}>
                <div className="group relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card text-left shadow-2xs transition-all duration-200 hover:border-primary/40 hover:shadow-md">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    unoptimized={item.src.startsWith("http")}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-103"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                  {/* Category Chip */}
                  <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-md bg-black/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs border border-white/20">
                      <Trophy className="h-3 w-3 text-amber-400" />
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Download on Hover */}
                  <div className="absolute top-3.5 right-3.5 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => handleDownload(e, item.src, item.title)}
                      className="flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 px-3 text-xs font-bold text-white shadow-xs cursor-pointer"
                      title="Download foto"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Unduh</span>
                    </button>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="relative mt-auto flex flex-col justify-end p-5 text-white z-10 pointer-events-none">
                    <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Tahun {item.year}
                    </span>
                    <h3 className="text-base font-extrabold tracking-tight text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {item.alt}
                    </p>
                  </div>

                  {/* Dialog Trigger */}
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Lihat foto penuh"
                    />
                  </DialogTrigger>
                </div>

                <DialogContent className="flex max-w-4xl flex-col items-center border-none bg-transparent p-0 shadow-none [&>button]:hidden">
                  <DialogTitle className="sr-only">{item.title}</DialogTitle>
                  <DialogDescription className="sr-only">{item.alt}</DialogDescription>
                  <div className="relative inline-block w-full overflow-hidden rounded-2xl bg-zinc-950 ring-1 ring-white/10 shadow-2xl">
                    <div className="relative flex max-h-[75vh] w-full items-center justify-center p-2 sm:p-4">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={1200}
                        height={900}
                        unoptimized={item.src.startsWith("http")}
                        className="h-auto max-h-[70vh] w-auto rounded-xl object-contain"
                      />
                    </div>

                    <div className="border-t border-white/10 bg-zinc-900/90 p-5 sm:p-6 backdrop-blur-md">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1 max-w-2xl">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                            {item.year} &middot; {item.categoryLabel}
                          </span>
                          <h4 className="text-base font-bold text-white">{item.title}</h4>
                          <p className="text-xs text-zinc-300 leading-relaxed">
                            {item.alt}
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={(e) => handleDownload(e, item.src, item.title)}
                          className="h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs px-5 shadow-xs hover:bg-primary/90 cursor-pointer shrink-0"
                        >
                          <Download className="mr-1.5 h-3.5 w-3.5" />
                          Unduh Foto
                        </Button>
                      </div>
                    </div>

                    <DialogClose className="absolute right-3.5 top-3.5 rounded-full bg-black/60 p-2 text-white shadow-md backdrop-blur-xs ring-1 ring-white/20 transition-all hover:bg-primary cursor-pointer">
                      <span className="sr-only">Tutup</span>
                      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </section>
        )}

        {/* CTA Banner */}
        <section className="mt-16 sm:mt-20">
          <div className="rounded-2xl sm:rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 sm:p-12 text-center">
            <div className="mx-auto max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Agustusan RW 10 Tahun 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Siap Mengukir Kenangan Baru Tahun Ini?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Jadilah bagian dari kemeriahan 17-an RW 10. Daftarkan diri Anda atau regu terbaik RT Anda sekarang juga!
              </p>
              <div className="pt-2">
                <Button
                  asChild
                  className="rounded-xl bg-primary text-primary-foreground font-bold text-xs h-11 px-7 shadow-xs hover:bg-primary/90 cursor-pointer"
                >
                  <Link href="/daftar">
                    Pilih Cabang Lomba
                    <ArrowRight className="ml-1.5 h-4 w-4" />
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
