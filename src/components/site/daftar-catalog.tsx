"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Trophy,
  Users,
  UserCheck,
  Zap,
  ShieldCheck,
  Sparkles,
  QrCode,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export interface DaftarCatalogItem {
  id: number;
  name: string;
  categoryLabel: string;
  countLabel: string;
  countSuffix: string;
  description: string;
  image: string;
  type: string; // "SOLO" | "TEAM" | "BOTH" | etc.
  href: string;
}

interface DaftarCatalogProps {
  items: DaftarCatalogItem[];
}

export function DaftarCatalog({ items }: DaftarCatalogProps) {
  const [activeTab, setActiveTab] = React.useState<"ALL" | "SOLO" | "TEAM">("ALL");

  const filteredItems = React.useMemo(() => {
    if (activeTab === "ALL") return items;
    if (activeTab === "SOLO") {
      return items.filter((item) => item.type === "SOLO" || item.type === "BOTH" || !item.type);
    }
    if (activeTab === "TEAM") {
      return items.filter((item) => item.type === "TEAM" || item.type === "BOTH");
    }
    return items;
  }, [items, activeTab]);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
      {/* Hero Header Bagian Daftar Lomba */}
      <section className="mb-12 text-center sm:mb-16">
        <div className="animate-fade-in-down mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-xs font-black uppercase tracking-widest text-primary shadow-xs">
          <Trophy className="h-4 w-4 text-amber-500" />
          Pusat Pendaftaran Resmi RT 04
        </div>
        <h1 className="animate-fade-in-up text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Katalog Semua <span className="text-[#ee2b2b]">Lomba 17-an</span>
        </h1>
        <p className="animate-fade-in-up delay-100 mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg font-medium">
          Pilih arena kompetisi kemerdekaan yang Anda senangi atau bentuk tim tangkas bersama tetangga. Daftarkan diri secara gratis tanpa repot merakit akun!
        </p>

        {/* Tab Filter Lomba: Semua / Solo / Tim */}
        <div className="animate-fade-in-up delay-200 mt-8 flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === "ALL"
                ? "bg-[#ee2b2b] text-white shadow-lg shadow-red-500/30 scale-105"
                : "border border-border/80 bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground active:scale-95"
            }`}
          >
            <Sparkles className="h-4 w-4 text-yellow-300" />
            Semua Lomba ({items.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("SOLO")}
            className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === "SOLO"
                ? "bg-[#ee2b2b] text-white shadow-lg shadow-red-500/30 scale-105"
                : "border border-border/80 bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground active:scale-95"
            }`}
          >
            <UserCheck className="h-4 w-4 text-sky-400" />
            Perorangan / Solo ({items.filter(i => i.type === "SOLO" || i.type === "BOTH" || !i.type).length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("TEAM")}
            className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === "TEAM"
                ? "bg-[#ee2b2b] text-white shadow-lg shadow-red-500/30 scale-105"
                : "border border-border/80 bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground active:scale-95"
            }`}
          >
            <Users className="h-4 w-4 text-emerald-400" />
            Beregu / Tim ({items.filter(i => i.type === "TEAM" || i.type === "BOTH").length})
          </button>
        </div>
      </section>

      {/* Grid Katalog Lomba */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground space-y-3 bg-muted/10">
          <Trophy className="mx-auto h-12 w-12 opacity-40 text-primary" />
          <p className="text-base font-bold text-foreground">Belum ada daftar lomba pada kategori ini</p>
          <p className="text-xs max-w-sm mx-auto text-muted-foreground">
            Cabang kompetisi baru sedang diatur oleh pengurus dan tim panitia RT 04.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-20">
          {filteredItems.map((comp, index) => {
            const isTeam = comp.type === "TEAM" || comp.type === "BOTH";
            return (
              <div
                key={`comp-${comp.id}-${index}`}
                className="card-hover group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-400 hover:border-primary/40 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Bagian Gambar Lomba */}
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <Image
                    src={comp.image}
                    alt={comp.name}
                    fill
                    unoptimized={comp.image.startsWith("http")}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                  
                  {/* Badge Jenis Kompetisi (Solo / Tim) */}
                  <div className="absolute top-4 left-4 z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md shadow-xs">
                      {isTeam ? <Users className="h-3 w-3 text-emerald-400" /> : <UserCheck className="h-3 w-3 text-sky-400" />}
                      {isTeam ? "Beregu (Tim)" : "Perorangan"}
                    </span>
                  </div>
                </div>

                {/* Bagian Deskripsi & Informasi Lomba */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-3.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                      {comp.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-bold text-muted-foreground border border-primary/10">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <strong className="text-foreground">{comp.countLabel}</strong> {comp.countSuffix}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary">
                    {comp.name}
                  </h3>
                  
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2 flex-1">
                    {comp.description}
                  </p>

                  <div className="mt-6">
                    <Button
                      asChild
                      className="h-13 w-full rounded-2xl bg-[#ee2b2b] py-3.5 text-sm font-black text-white shadow-md shadow-red-500/20 transition-all duration-300 hover:bg-[#d42222] group-hover:shadow-lg group-hover:shadow-red-500/30 active:scale-95 cursor-pointer"
                    >
                      <Link href={comp.href}>
                        Daftar Sekarang
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Edukasi & Panduan Daftar Cepat Tanpa Login */}
      <section className="mb-16 rounded-[2.5rem] border border-border/70 bg-card/60 p-6 sm:p-10 md:p-14 shadow-sm backdrop-blur-xl dark:bg-muted/15">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-primary">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Kemudahan Warga &middot; Zero Friction
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            3 Langkah Daftar Cepat Tanpa Ribet
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Portal Semarak 17-an RT 04 membebaskan Anda dari kerepotan registrasi akun atau password. Semua dibuat langsung jadi dan otomatis tervalidasi!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-start rounded-3xl border border-border/80 bg-card p-6 shadow-xs relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-primary font-black text-lg ring-1 ring-primary/20">
              01
            </div>
            <h4 className="text-base font-bold text-foreground tracking-tight z-10">Pilih Arena Lomba</h4>
            <p className="mt-2 text-xs leading-relaxed text-foreground/80 z-10 font-normal">
              Tekan tombol <strong className="text-foreground font-semibold">&quot;Daftar Sekarang&quot;</strong> pada salah satu atau beberapa cabang perlombaan favorit yang tertera di atas.
            </p>
            {/* Watermark Siluet Nomor 1 */}
            <Sparkles className="absolute -right-5 -bottom-5 h-32 w-32 text-primary opacity-[0.08] dark:opacity-[0.06] -rotate-12 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
          </div>

          <div className="flex flex-col items-start rounded-3xl border border-border/80 bg-card p-6 shadow-xs relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 font-black text-lg ring-1 ring-emerald-500/20">
              02
            </div>
            <h4 className="text-base font-bold text-foreground tracking-tight z-10">Isi Identitas &amp; WhatsApp</h4>
            <p className="mt-2 text-xs leading-relaxed text-foreground/80 z-10 font-normal">
              Cukup ketikkan nama lengkap Anda serta nomor WhatsApp aktif untuk kebutuhan komunikasi pengurus dan undangan grup lomba.
            </p>
            {/* Watermark Siluet Nomor 2 */}
            <ShieldCheck className="absolute -right-5 -bottom-5 h-32 w-32 text-emerald-500 opacity-[0.08] dark:opacity-[0.06] -rotate-12 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
          </div>

          <div className="flex flex-col items-start rounded-3xl border border-border/80 bg-card p-6 shadow-xs relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
            <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 font-black text-lg ring-1 ring-sky-500/20">
              03
            </div>
            <h4 className="text-base font-bold text-foreground tracking-tight z-10">E-Ticket &amp; QR Code</h4>
            <p className="mt-2 text-xs leading-relaxed text-foreground/80 z-10 font-normal">
              Sistem langsung menerbitkan Bukti Pendaftaran digital beserta <strong className="text-foreground font-semibold">QR Code</strong> untuk proses scan check-in kilat di hari H kemerdekaan.
            </p>
            {/* Watermark Siluet Nomor 3 */}
            <QrCode className="absolute -right-5 -bottom-5 h-32 w-32 text-sky-500 opacity-[0.08] dark:opacity-[0.06] -rotate-12 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Pendaftaran Tutup: <strong className="text-foreground">16 Agustus 2026 Pukul 22:00 WIB</strong></span>
          </div>
          <span className="text-primary font-extrabold uppercase tracking-widest">
            DIRGAHAYU REPUBLIK INDONESIA KE-81 &bull; RT 04
          </span>
        </div>
      </section>
    </div>
  );
}
