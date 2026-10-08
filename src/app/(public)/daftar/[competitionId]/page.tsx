import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy, Calendar, MapPin, ShieldCheck, Users, CheckCircle2 } from "lucide-react";

import { RegisterForm } from "@/components/site/register-form";
import { CompetitionVisual } from "@/components/site/competition-visual";
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
    <div className="min-h-screen w-full py-8 md:py-12">
      <div className="mx-auto w-full max-w-[1150px] px-4 sm:px-6">
        
        {/* Tombol Kembali */}
        <div className="mb-6">
          <Link
            href="/daftar"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2 text-xs font-bold text-foreground shadow-2xs transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Katalog Lomba
          </Link>
        </div>

        {/* Layout Grid: Sidebar Info + Form */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* KOLOM KIRI: INFO LOMBA & KETENTUAN */}
          <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-24">
            
            {/* Kartu Utama Lomba */}
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
              <div className="relative h-44 overflow-hidden">
                <CompetitionVisual
                  name={competition.name}
                  categoryLabel={categories[0]?.name ?? "Umum"}
                  type={competition.type}
                />
              </div>

              <div className="p-6 space-y-4 text-xs bg-card">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {competition.type === "BOTH"
                      ? "Individu / Beregu"
                      : `Kategori ${competition.type === "TEAM" ? "Beregu (Tim)" : "Perorangan"}`}
                  </span>
                  <h1 className="mt-1 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                    {competition.name}
                  </h1>
                </div>

                <div className="space-y-3 pt-2 border-t border-border/60">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Jadwal Acara</p>
                      <p className="text-muted-foreground">
                        {event ? event.name : "17 Agustus 2026, 09:00 WIB"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Lokasi Pertandingan</p>
                      <p className="text-muted-foreground">
                        {event ? event.location : "Jl. Pengasinan Tengah RW 10"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Ketentuan Peserta</p>
                      <p className="text-muted-foreground">
                        {isTeam
                          ? `Min. ${competition.minMembers} - Maks. ${competition.maxMembers} Orang / Tim`
                          : "1 Peserta (Individu / Perorangan)"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Tips & Panduan Warga */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
              <h3 className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Ketentuan Warga RW 10
              </h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong>Identitas:</strong> Terbuka untuk warga RT 01 s/d RT 08 RW 10.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong>WhatsApp Aktif:</strong> Diperlukan untuk pengiriman E-Ticket digital.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                  <span><strong>Bebas Biaya:</strong> Pendaftaran 100% gratis tanpa dipungut iuran apa pun.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* KOLOM KANAN: FORM PENDAFTARAN */}
          <div className="lg:col-span-7">
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
