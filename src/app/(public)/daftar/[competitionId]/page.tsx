import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy, Calendar, MapPin, ShieldCheck, Users, CheckCircle2 } from "lucide-react";

import { RegisterForm } from "@/components/site/register-form";
import { db } from "@/db";
import { ageCategories, competitions, events } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const { competitionId: competitionIdParam } = await params;
  const competitionId = Number(competitionIdParam);

  if (Number.isNaN(competitionId)) {
    notFound();
  }

  const [competition] = await db
    .select()
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);

  if (!competition) {
    notFound();
  }

  const [[event], categories] = await Promise.all([
    db.select().from(events).where(eq(events.id, competition.eventId)).limit(1),
    db.select().from(ageCategories).where(eq(ageCategories.competitionId, competition.id)),
  ]);

  const isTeam = competition.type === "TEAM" || competition.type === "BOTH";

  return (
    <div className="min-h-screen w-full py-10 md:py-16">
      <div className="mx-auto w-full max-w-[1150px] px-4 sm:px-6">
        
        {/* Tombol Kembali yang Elegan & Konsisten */}
        <div className="animate-fade-in mb-8">
          <Link
            href="/daftar"
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-5 py-2.5 text-sm font-bold text-foreground shadow-xs transition-all duration-200 hover:-translate-x-1 hover:border-primary/50 hover:text-primary dark:bg-card/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Semua Lomba
          </Link>
        </div>

        {/* Desktop Split Layout: Sidebar Kiri (Info & Tips) + Konten Kanan (Form) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* KOLOM KIRI: STICKY SIDEBAR INFO COMPACT & ELEGAN */}
          <div className="animate-fade-in-up space-y-6 lg:col-span-5 lg:sticky lg:top-28">
            
            {/* Kartu Utama Lomba */}
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <div className="festive-gradient bg-gradient-to-br from-[#d91c1c] via-[#ee2b2b] to-[#ff4c4c] p-6 text-white sm:p-8 relative overflow-hidden">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/20 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                  <Trophy className="h-3.5 w-3.5" />
                  {competition.type === "BOTH"
                    ? "Individu / Beregu"
                    : `Kategori ${competition.type === "TEAM" ? "Beregu (Tim)" : "Perorangan"}`}
                </span>
                <h1 className="mt-3.5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {competition.name}
                </h1>
                <p className="mt-2 text-xs text-white/90 font-normal leading-relaxed">
                  Pendaftaran resmi perayaan HUT RI ke-81 di lingkungan RW 10. Kuota pendaftaran diatur demi ketertiban dan kemeriahan acara.
                </p>
              </div>

              <div className="p-6 space-y-5 text-sm bg-card">
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary dark:bg-primary/15">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jadwal Acara</p>
                    <p className="font-bold text-foreground text-sm mt-0.5">
                      {event ? event.name : "17 Agustus 2026, 09:00 WIB"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary dark:bg-primary/15">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lokasi Perlombaan</p>
                    <p className="font-bold text-foreground text-sm mt-0.5">
                      {event ? event.location : "Jl. Pengasinan Tengah RW 10 (Masjid Nurul Huda)"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary dark:bg-primary/15">
                    <Users className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ketentuan Personil</p>
                    <p className="font-bold text-foreground text-sm mt-0.5">
                      {isTeam ? `Min. ${competition.minMembers} - Maks. ${competition.maxMembers} Orang / Tim` : "1 Peserta (Individu / Solo)"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Tips & Ketentuan Cepat */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs">
              <h3 className="flex items-center gap-2 text-xs font-extrabold text-foreground uppercase tracking-widest mb-4">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Ketentuan Partisipasi Warga
              </h3>
              <ul className="space-y-3 text-xs leading-relaxed text-foreground/80 font-normal">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500 mt-0.5" />
                  <span><strong className="text-foreground font-semibold">Identitas Valid:</strong> Pastikan nama yang didaftarkan sesuai dengan data KTP atau Kartu Keluarga warga RW 10.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500 mt-0.5" />
                  <span><strong className="text-foreground font-semibold">WhatsApp Aktif:</strong> Nomor WhatsApp aktif diperlukan untuk pengiriman E-Ticket digital dan informasi jadwal lomba.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500 mt-0.5" />
                  <span><strong className="text-foreground font-semibold">Batas Partisipasi:</strong> Setiap warga dapat mendaftarkan diri maksimal pada 3 cabang perlombaan yang berbeda.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* KOLOM KANAN: FORM PENDAFTARAN DINAMIS */}
          <div className="animate-fade-in-up delay-100 lg:col-span-7">
            <RegisterForm
              competition={{
                id: competition.id,
                name: competition.name,
                type: competition.type,
                minMembers: competition.minMembers,
                maxMembers: competition.maxMembers,
              }}
              categories={categories.map((category) => ({
                id: category.id,
                name: category.name,
                ageMin: category.ageMin,
                ageMax: category.ageMax,
              }))}
              eventDate={event?.eventDate ? String(event.eventDate) : "2026-08-17T00:00:00.000Z"}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
