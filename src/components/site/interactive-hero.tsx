import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Flag,
  MapPin,
  Users,
  ArrowRight,
  Ticket,
} from "lucide-react";

import { HeroVideoBackground } from "@/components/site/hero-video-background";
import { Button } from "@/components/ui/button";

export function InteractiveHero() {
  return (
    <section className="pt-4 pb-8 sm:pt-8 sm:pb-12">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-neutral-950 p-6 sm:p-10 lg:p-14 shadow-xl">
        {/* Sang Saka Merah Putih Top Ribbon Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 merah-putih-stripe z-30" />

        {/* Dynamic Interactive Video Background */}
        <HeroVideoBackground />

        {/* Hero Content Layer */}
        <div className="relative z-20 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Narrative Column */}
          <div className="space-y-6 lg:col-span-8">
            {/* Civic Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-red-300 backdrop-blur-md">
              <Flag className="h-3.5 w-3.5 text-red-400" />
              <span>Peringatan HUT ke-81 Kemerdekaan RI &bull; RW 10</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Pesta Rakyat &amp;{" "}
              <span className="text-red-400 underline decoration-red-500/50 decoration-wavy decoration-2">
                Lomba Kemerdekaan
              </span>
              <br />
              Guyub Rukun RW 10
            </h1>

            {/* Lead Narrative */}
            <p className="max-w-2xl text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
              Sambut perayaan 17 Agustus 2026 bersama keluarga dan tetangga.
              Daftarkan diri atau bentuk regu tim tangkas untuk menyemarakkan perlombaan tahunan ini.
              Pendaftaran terbuka untuk seluruh warga RT 01 sampai RT 08, <strong>100% bebas biaya</strong>.
            </p>

            {/* Event Quick Facts Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-xs">
                <Calendar className="h-4 w-4 text-red-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-white">16–18 Agustus 2026</p>
                  <p className="text-[11px] text-neutral-300">3 Hari Rangkaian Acara</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-xs">
                <MapPin className="h-4 w-4 text-red-400 shrink-0" />
                <div className="text-xs truncate">
                  <p className="font-bold text-white truncate">Lapangan RW 10</p>
                  <p className="text-[11px] text-neutral-300 truncate">Jl. Pengasinan Tengah</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-xs">
                <Users className="h-4 w-4 text-red-400 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-white">Warga RT 01 s/d 08</p>
                  <p className="text-[11px] text-neutral-300">Gratis &amp; E-Ticket QR</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer"
              >
                <Link href="#lomba">
                  Pilih Cabang Lomba
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl text-sm font-semibold border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-xs transition-all cursor-pointer"
              >
                <Link href="#jadwal">Jadwal Acara Warga</Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Link href="/bukti" className="inline-flex items-center gap-1.5">
                  <Ticket className="h-3.5 w-3.5 text-red-400" />
                  Cek E-Ticket Saya
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Emblem Column */}
          <div className="hidden lg:flex lg:col-span-4 flex-col items-center justify-center">
            <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md w-full text-center shadow-lg">
              <div className="relative h-32 w-32 mb-4 drop-shadow-md">
                <Image
                  src="/logo-hutri-81.png"
                  alt="Logo HUT RI ke-81"
                  fill
                  sizes="128px"
                  priority
                  className="object-contain"
                />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-red-400">
                DIRGAHAYU REPUBLIK INDONESIA
              </span>
              <p className="mt-1 text-base font-extrabold text-white">
                Nusantara Baru, Indonesia Maju
              </p>
              <p className="mt-1 text-xs text-neutral-300">
                Semarak Kebersamaan di Lingkungan RW 10
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
