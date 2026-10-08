import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Medal,
  PartyPopper,
  QrCode,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Countdown } from "@/components/site/countdown";
import { InteractiveHero } from "@/components/site/interactive-hero";
import { LandingCompetitions, type LandingCompetitionItem } from "@/components/site/landing-competitions";
import { ScheduleInteractive } from "@/components/site/schedule-interactive";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { ageCategories, competitions, events, registrations } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";

type CompetitionCard = Partial<typeof competitions.$inferSelect> & {
  id: number;
  name: string;
  type: "SOLO" | "TEAM" | "BOTH";
  quotaTotal?: number | null;
  eventId?: number;
  currentCount?: number;
  description?: string | null;
};

const fallbackCategoryLabels = [
  "Kategori Anak-anak",
  "Semua Umur Warga",
  "Kategori Beregu Antar-RT",
  "Kategori Dewasa & Lansia",
];

const guidelines = [
  {
    title: "Khusus Warga RW 10",
    description:
      "Peserta berdomisili di lingkungan RW 10 (mencakup RT 01 sampai dengan RT 08). Pastikan data diri sesuai KTP atau Kartu Keluarga.",
    icon: Users,
  },
  {
    title: "100% Bebas Biaya",
    description:
      "Seluruh pendaftaran perlombaan tidak dipungut biaya apa pun (gratis), didanai penuh oleh kas swadaya dan panitia HUT RI RW 10.",
    icon: Medal,
  },
  {
    title: "Sistem E-Ticket & QR Code",
    description:
      "Setelah mengisi formulir pendaftaran, sistem otomatis menerbitkan E-Ticket dengan QR Code untuk proses check-in cepat di meja panitia hari H.",
    icon: QrCode,
  },
  {
    title: "Sportivitas & Kerukunan",
    description:
      "Tujuan utama kegiatan adalah mempererat silaturahmi warga. Mari saling menghargai dan menjunjung tinggi nilai sportivitas bersama.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "Apakah dikenakan biaya untuk mengikuti lomba 17-an?",
    answer:
      "Tidak ada biaya sama sekali (100% gratis). Seluruh rangkaian perlombaan dibiayai oleh kas kegiatan HUT RI RW 10 dan sumbangan sukarela warga.",
    open: true,
  },
  {
    question: "Berapa cabang lomba yang dapat diikuti oleh satu warga?",
    answer:
      "Setiap warga diperbolehkan mendaftar maksimal pada 3 jenis lomba yang berbeda, agar seluruh warga mendapat kesempatan berpartisipasi secara adil.",
  },
  {
    question: "Bagaimana cara mendaftar untuk lomba kategori regu atau tim?",
    answer:
      "Cukup satu perwakilan (ketua regu) yang mengisi formulir online di portal ini dengan mencantumkan nama tim, nomor WhatsApp aktif, serta nama-nama anggota regu.",
  },
  {
    question: "Apa yang harus dibawa saat pelaksanaan lomba di hari H?",
    answer:
      "Tunjukkan E-Ticket digital (bisa berupa tangkapan layar di HP atau hasil cetak) yang memiliki QR Code kepada panitia di meja registrasi 15 menit sebelum lomba dimulai.",
  },
  {
    question: "Kapan dan di mana pembagian hadiah pemenang lomba?",
    answer:
      "Penyerahan trofi juara, medali, serta hadiah bingkisan akan dilangsungkan pada Panggung Hiburan Rakyat malam puncak tanggal 18 Agustus 2026 di Panggung Kesenian RW 10.",
  },
];

// Target: 17 Agustus 2026, 07:00 WIB (UTC+7)
const COUNTDOWN_TARGET = "2026-08-17T00:00:00.000Z";

export default async function LandingPage() {
  const [event] = await db
    .select()
    .from(events)
    .where(eq(events.isOpen, true))
    .limit(1);

  const competitionRows = event
    ? await db
        .select()
        .from(competitions)
        .where(eq(competitions.eventId, event.id))
    : [];

  const competitionIds = competitionRows.map((competition) => competition.id);
  const [categoryRows, registrationCounts] = competitionIds.length
    ? await Promise.all([
        db
          .select()
          .from(ageCategories)
          .where(inArray(ageCategories.competitionId, competitionIds)),
        db
          .select({
            competitionId: registrations.competitionId,
            total: sql<number>`count(*)`,
          })
          .from(registrations)
          .where(inArray(registrations.competitionId, competitionIds))
          .groupBy(registrations.competitionId),
      ])
    : [[], []];

  const categoriesByCompetition = categoryRows.reduce<Record<number, typeof categoryRows>>(
    (acc, category) => {
      acc[category.competitionId] = acc[category.competitionId] ?? [];
      acc[category.competitionId].push(category);
      return acc;
    },
    {},
  );

  const countsByCompetition = registrationCounts.reduce<Record<number, number>>(
    (acc, item) => {
      acc[item.competitionId] = Number(item.total);
      return acc;
    },
    {},
  );

  const competitionsToShow: CompetitionCard[] = competitionRows.length
    ? competitionRows
    : [
        { id: 1, name: "Lomba Makan Kerupuk", type: "SOLO", quotaTotal: 80, currentCount: 48 },
        { id: 2, name: "Balap Karung", type: "BOTH", quotaTotal: 60, currentCount: 42 },
        { id: 3, name: "Tarik Tambang", type: "TEAM", quotaTotal: 20, currentCount: 14 },
        { id: 4, name: "Panjat Pinang", type: "TEAM", quotaTotal: 10, currentCount: 8 },
        { id: 5, name: "Lari Kelereng", type: "SOLO", quotaTotal: 50, currentCount: 31 },
        { id: 6, name: "Balap Bakiak", type: "TEAM", quotaTotal: 16, currentCount: 10 },
      ];

  const mappedCompetitions: LandingCompetitionItem[] = competitionsToShow.map((competition, index) => {
    const categories = categoriesByCompetition[competition.id] ?? [];
    const categoryLabel =
      categories[0]?.name ?? fallbackCategoryLabels[index % fallbackCategoryLabels.length];
    const count =
      countsByCompetition[competition.id] ??
      ("currentCount" in competition ? competition.currentCount ?? 0 : 0);
    const quotaTotal = competition.quotaTotal ?? null;
    const isTeam = competition.type === "TEAM" || competition.type === "BOTH";
    const countLabel = quotaTotal ? `${count}/${quotaTotal}` : `${count}`;
    const countSuffix = isTeam ? "Tim" : "Peserta";
    const description = competition.name
      ? `Perlombaan sistem ${isTeam ? "regu tim kolaboratif" : "perorangan"}. Daftarkan diri Anda sebelum kuota pendaftaran terpenuhi.`
      : "Perlombaan kemerdekaan tahunan bagi warga RW 10.";

    return {
      id: competition.id,
      name: competition.name || "Lomba Kemerdekaan",
      categoryLabel,
      countLabel,
      countSuffix,
      description,
      type: competition.type || "SOLO",
      href: competition.id ? `/daftar/${competition.id}` : "/daftar",
    };
  });

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">

      {/* ══════════════════════ 1. HERO SECTION INTERAKTIF ══════════════════════ */}
      <InteractiveHero />

      {/* ══════════════════════ 2. COUNTDOWN STRIP ══════════════════════ */}
      <section className="mb-12 sm:mb-16">
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Hitung Mundur Pelaksanaan
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Menuju Puncak 17 Agustus 2026
              </h3>
              <p className="text-xs text-muted-foreground">
                Pendaftaran ditutup 16 Agustus 2026 pukul 22:00 WIB demi penetapan bagan tanding panitia.
              </p>
            </div>
            <div className="w-full md:w-auto">
              <Countdown targetDate={COUNTDOWN_TARGET} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ 3. CABANG LOMBA INTERAKTIF ══════════════════════ */}
      <LandingCompetitions items={mappedCompetitions} />

      {/* ══════════════════════ 4. JADWAL 3 HARI KEGIATAN INTERAKTIF ══════════════════════ */}
      <ScheduleInteractive />

      {/* ══════════════════════ 5. TATA TERTIB & SYARAT ══════════════════════ */}
      <section id="syarat" className="py-12 sm:py-16">
        <div className="mb-8 sm:mb-12 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Ketentuan Resmi
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Tata Tertib &amp; Persyaratan Warga
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Panduan teknis bagi seluruh warga RW 10 demi terciptanya perlombaan yang adil, tertib, aman, dan penuh rasa kekeluargaan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {guidelines.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-xs hover:border-primary/30 transition-colors"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground tracking-tight">{item.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════ 6. TANYA JAWAB (FAQ) ══════════════════════ */}
      <section id="faq" className="py-12 sm:py-16">
        <div className="mb-8 sm:mb-12 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            Pusat Bantuan
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Informasi penting seputar pendaftaran online, tiket, dan teknis kegiatan Agustusan RW 10.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border/80 bg-card overflow-hidden transition-colors hover:border-primary/40 open:border-primary/30"
              open={faq.open}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5 text-left font-bold text-sm text-foreground select-none">
                <span>{faq.question}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:text-primary" />
              </summary>
              <div className="border-t border-border/50 px-4 sm:px-5 pb-5 pt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ══════════════════════ 7. INVITATION BANNER ══════════════════════ */}
      <section className="pb-16 sm:pb-20">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 sm:p-12 text-center">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <PartyPopper className="h-3.5 w-3.5" />
              Semarak Kemerdekaan RI ke-81
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
              Ayo Ramaikan &amp; Daftarkan Namamu Sekarang!
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Jadikan momen Agustusan tahun ini kenangan hangat dan meriah bagi keluarga Anda di RW 10.
              Pilih lomba kegemaran, ajak tetangga sekitar, dan rebut trofi juara kemerdekaan!
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-xs hover:bg-primary/90 cursor-pointer"
              >
                <Link href="/daftar">
                  Pilih Lomba Sekarang
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl text-sm font-semibold border-border/80 hover:border-primary/40 cursor-pointer"
              >
                <Link href="#jadwal">Cek Jadwal Lengkap</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
