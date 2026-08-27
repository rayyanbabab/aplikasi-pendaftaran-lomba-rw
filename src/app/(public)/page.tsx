import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Flag,
  Medal,
  PartyPopper,
  ShieldCheck,
  Trophy,
  UserCheck,
  Users,
  Flame,
  Star,
  MapPin,
} from "lucide-react";

import { Countdown } from "@/components/site/countdown";
import { HeroVideoBackground } from "@/components/site/hero-video-background";
import { LandingCompetitions, type LandingCompetitionItem } from "@/components/site/landing-competitions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { ageCategories, competitions, events, registrations } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";

const fallbackImages = [
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
];

type CompetitionCard = Partial<typeof competitions.$inferSelect> & { id: number; name: string; type: "SOLO" | "TEAM" | "BOTH"; quotaTotal?: number | null; eventId?: number; currentCount?: number; description?: string | null };

const fallbackCategoryLabels = [
  "Kategori Anak",
  "Semua Umur",
  "Kategori Tim",
  "Kategori Dewasa",
];

const scheduleItems = [
  {
    date: "16 Agustus 2026",
    title: "Malam Tirakatan & Doa Bersama",
    details: [
      "19:30 WIB — Doa bersyukur atas kemerdekaan RI",
      "20:30 WIB — Ramah tamah dan diskusi warga",
    ],
    icon: CalendarDays,
  },
  {
    date: "17 Agustus 2026",
    title: "Pelaksanaan Perlombaan Warga",
    details: [
      "07:00 WIB — Upacara pengibaran Bendera Merah Putih",
      "08:30 WIB — Registrasi ulang peserta lomba",
      "09:30 WIB — Dimulainya perlombaan anak & dewasa",
    ],
    icon: PartyPopper,
  },
  {
    date: "18 Agustus 2026",
    title: "Panggung Hiburan & Pembagian Hadiah",
    details: [
      "16:00 WIB — Babak final lomba beregu",
      "19:30 WIB — Pembagian trofi & penghargaan",
      "20:30 WIB — Penampilan hiburan seni warga",
    ],
    icon: Trophy,
  },
];

const rules = [
  {
    title: "Khusus Warga RW 10",
    description:
      "Perlombaan diperuntukkan bagi warga RW 10 yang berdomisili atau tercatat dalam data RT. Siapkan KTP atau KK saat melakukan pendaftaran.",
    icon: UserCheck,
  },
  {
    title: "Menjaga Sportivitas",
    description:
      "Tujuan utama kegiatan adalah kerukunan warga. Seluruh peserta dan pendukung diimbau saling menghormati dan menjaga ketertiban bersama.",
    icon: Medal,
  },
  {
    title: "Keputusan Dewan Juri",
    description:
      "Penilaian serta penentuan juara lomba dilakukan oleh tim penilai dari panitia dan hasilnya bersifat mutlak.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "Apakah dikenakan biaya untuk mengikuti lomba?",
    answer:
      "Seluruh perlombaan diselenggarakan tanpa biaya pendaftaran (gratis), dibiayai oleh kas kegiatan HUT RI Ke-81 RW 10.",
    open: true,
  },
  {
    question: "Berapa kategori lomba yang dapat diikuti?",
    answer:
      "Setiap warga diperbolehkan mendaftar maksimal pada 3 jenis lomba yang berbeda agar membuka kesempatan partisipasi bagi warga lainnya.",
  },
  {
    question: "Bagaimana prosedur pendaftaran untuk kategori tim/beregu?",
    answer:
      "Perwakilan ketua tim mengisi formulir online di portal ini dengan mencantumkan nama tim serta daftar anggota yang bermain.",
  },
  {
    question: "Kapan penyerahan hadiah bagi para pemenang?",
    answer:
      "Pembagian trofi, piagam penghargaan, serta hadiah bagi para juara akan dilangsungkan pada malam puncak panggung hiburan tanggal 18 Agustus.",
  },
];

const statsItems = [
  { icon: Flame, value: "6+", label: "Jenis Lomba" },
  { icon: Users, value: "200+", label: "Warga Peserta" },
  { icon: Trophy, value: "3 Hari", label: "Rangkaian Acara" },
  { icon: Star, value: "Gratis", label: "Tanpa Biaya" },
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
        { id: 0, name: "Balap Karung", type: "SOLO", quotaTotal: 50, currentCount: 45 },
        { id: 1, name: "Makan Kerupuk", type: "SOLO", quotaTotal: 100, currentCount: 32 },
        { id: 2, name: "Tarik Tambang", type: "TEAM", quotaTotal: 16, currentCount: 8 },
        { id: 3, name: "Panjat Pinang", type: "TEAM", quotaTotal: 10, currentCount: 5 },
        { id: 4, name: "Lari Kelereng", type: "SOLO", quotaTotal: 40, currentCount: 15 },
        { id: 5, name: "Balap Bakiak", type: "TEAM", quotaTotal: 12, currentCount: 6 },
      ];

  const mappedCompetitions: LandingCompetitionItem[] = competitionsToShow.map((competition, index) => {
    const categories = categoriesByCompetition[competition.id] ?? [];
    const categoryLabel =
      categories[0]?.name ?? fallbackCategoryLabels[index % fallbackCategoryLabels.length];
    const count =
      countsByCompetition[competition.id] ??
      ("currentCount" in competition ? competition.currentCount ?? 0 : 0);
    const image = fallbackImages[index % fallbackImages.length];
    const quotaTotal = competition.quotaTotal ?? null;
    const isTeam = competition.type === "TEAM" || competition.type === "BOTH";
    const countLabel = quotaTotal ? `${count}/${quotaTotal}` : `${count}`;
    const countSuffix = isTeam ? " Tim" : " Peserta";
    const description = competition.name
      ? `Perlombaan sistem ${isTeam ? "beregu (tim)" : "perorangan"}. Daftar segera sebelum kuota terpenuhi.`
      : "Perlombaan kemerdekaan tahunan bagi warga RW 10.";

    return {
      id: competition.id,
      name: competition.name || "Lomba Kemerdekaan",
      categoryLabel,
      countLabel,
      countSuffix,
      description,
      image,
      isFavorite: index === 0,
      href: competition.id ? `/daftar/${competition.id}` : "/daftar",
    };
  });

  return (
    <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="pt-5 pb-4 sm:pt-8 sm:pb-6">
        <div
          className="relative min-h-[500px] sm:min-h-[600px] rounded-2xl sm:rounded-3xl bg-[#0a0a0a] shadow-2xl overflow-hidden"
        >
          <HeroVideoBackground />

          {/* Content */}
          <div className="relative z-30 flex min-h-[500px] sm:min-h-[600px] flex-col items-center justify-center p-6 sm:p-10 md:p-14 text-center">
            <div className="max-w-3xl space-y-5 sm:space-y-6">

              {/* Badge */}
              <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-white/90 backdrop-blur-md">
                <Flag className="h-3.5 w-3.5 text-[#ee2b2b]" />
                HUT RI KE-81 &bull; TAHUN 2026
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg">
                Pesta Rakyat{" "}
                <span className="text-[#ff4040]">17 Agustus</span>
                <br className="hidden sm:block" />
                <span className="text-white"> RW 10</span>
              </h1>

              {/* Sub */}
              <p className="animate-fade-in delay-100 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-300/90">
                Sambut hari kemerdekaan Indonesia bersama seluruh warga RW 10.
                Daftarkan diri atau timmu untuk mengikuti rangkaian kegiatan dan
                perlombaan tahunan ini.
              </p>

              {/* Buttons */}
              <div className="animate-fade-in delay-200 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  asChild
                  className="h-auto w-full sm:w-auto rounded-full bg-[#ee2b2b] px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-red-600/30 transition-all duration-200 hover:bg-[#d42222] hover:scale-105 active:scale-[0.98]"
                >
                  <Link href="/#lomba">
                    Pilih Lomba
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-auto w-full sm:w-auto rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 active:scale-[0.98]"
                >
                  <Link href="/#jadwal">Jadwal Kegiatan</Link>
                </Button>
              </div>

              {/* Location badge */}
              <div className="animate-fade-in delay-300 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-neutral-400">
                <MapPin className="h-3.5 w-3.5 text-[#ee2b2b]" />
                Jl. Pengasinan Tengah, Depan Masjid Nurul Huda, RW 10
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ STATS BAR ══════════════════════ */}
      <section className="mb-6 sm:mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {statsItems.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card px-4 py-5 sm:py-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{value}</p>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ COUNTDOWN ══════════════════════ */}
      <section className="mb-10 sm:mb-14 rounded-2xl sm:rounded-3xl border border-border/60 bg-card overflow-hidden shadow-sm">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#ee2b2b] via-[#ff6060] to-[#ee2b2b] animate-gradient-shift" />
        <div className="px-6 py-8 sm:py-12">
          <div className="mb-6 sm:mb-8 space-y-2 text-center">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Hitung Mundur
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              17 Agustus 2026
            </h3>
            <p className="text-sm text-muted-foreground">
              Bersama kita rayakan semangat kemerdekaan!
            </p>
            <div className="mx-auto h-1 w-12 sm:w-16 rounded-full bg-[#ee2b2b]" />
          </div>
          <Countdown targetDate={COUNTDOWN_TARGET} />
        </div>
      </section>

      {/* ══════════════════════ COMPETITIONS ══════════════════════ */}
      <LandingCompetitions items={mappedCompetitions} />

      {/* ══════════════════════ SCHEDULE ══════════════════════ */}
      <section id="jadwal" className="py-14 sm:py-20">
        <div className="mb-10 sm:mb-14 space-y-3 text-center">
          <div className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Jadwal Kegiatan
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Rangkaian Acara 17-an
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Seluruh kegiatan dipusatkan di lingkungan RW 10. Warga diimbau mencatat waktu pelaksanaan dan hadir sesuai agenda.
          </p>
        </div>

        {/* Mobile Timeline */}
        <div className="space-y-5 md:hidden">
          {scheduleItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === scheduleItems.length - 1;
            return (
              <div key={item.date} className="relative flex gap-4">
                {!isLast && (
                  <div className="absolute left-[21px] top-12 -bottom-5 w-0.5 bg-gradient-to-b from-[#ee2b2b]/70 via-[#ee2b2b]/30 to-transparent" />
                )}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#ee2b2b] text-white shadow-md shadow-red-500/20 ring-4 ring-red-500/10 dark:border-background z-10 mt-1">
                  <Icon className="h-5 w-5" />
                </div>
                <Card className="flex-1 rounded-2xl border border-border/60 bg-card p-5 shadow-sm min-w-0">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-primary">{item.date}</p>
                  <p className="mb-3 text-[15px] font-extrabold tracking-tight text-foreground">{item.title}</p>
                  <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                    {item.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2">
                        <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative space-y-12 timeline-line">
          {scheduleItems.map((item, index) => {
            const Icon = item.icon;
            const isLeft = index % 2 === 0;
            return (
              <div key={item.date} className="relative z-10 flex items-center gap-8 flex-row">
                {isLeft ? (
                  <div className="w-1/2 flex justify-end">
                    <Card className="rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm max-w-sm w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
                      <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">{item.date}</p>
                      <p className="mb-4 text-lg font-extrabold tracking-tight">{item.title}</p>
                      <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                        {item.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2 justify-end">
                            <span>{detail}</span>
                            <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                ) : (
                  <div className="w-1/2" />
                )}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#ee2b2b] text-white shadow-lg shadow-red-500/20 dark:border-background z-10">
                  <Icon className="h-5 w-5" />
                </div>
                {isLeft ? (
                  <div className="w-1/2" />
                ) : (
                  <div className="w-1/2">
                    <Card className="rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm max-w-sm w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
                      <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">{item.date}</p>
                      <p className="mb-4 text-lg font-extrabold tracking-tight">{item.title}</p>
                      <ul className="space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                        {item.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2">
                            <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════ RULES ══════════════════════ */}
      <section id="syarat" className="py-14 sm:py-20">
        <div className="mb-10 sm:mb-14 space-y-3 text-center">
          <div className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Ketentuan Peserta
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Persyaratan Lomba
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Panduan umum bagi seluruh warga RW 10 yang berpartisipasi dalam perayaan peringatan kemerdekaan.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-3">
          {rules.map((rule, index) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.title}
                className="group relative rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-7 sm:p-8 text-center shadow-sm transition-all duration-200 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Subtle bg glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none rounded-2xl sm:rounded-3xl" />
                <div className="relative z-10">
                  <div className="mx-auto mb-5 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h5 className="mb-3 text-lg sm:text-xl font-bold tracking-tight text-foreground">{rule.title}</h5>
                  <p className="text-sm leading-relaxed text-muted-foreground">{rule.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section id="faq" className="py-14 sm:py-20">
        <div className="mb-10 sm:mb-14 space-y-3 text-center">
          <div className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Informasi Umum
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Pertanyaan Sering Diajukan
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Ringkasan informasi penting mengenai teknis pendaftaran, aturan main, dan pelaksanaan perlombaan.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all duration-200 hover:border-primary/30 shadow-sm open:shadow-md open:border-primary/20"
              open={faq.open}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 text-left font-semibold text-foreground select-none">
                <span className="text-sm sm:text-base tracking-tight">{faq.question}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-primary" />
              </summary>
              <div className="border-t border-border/40 px-5 sm:px-6 pb-5 sm:pb-6 pt-4 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="pb-16 sm:pb-20">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0a0a0a] p-8 sm:p-12 md:p-20 text-center text-white shadow-2xl"
        >
          {/* Banner bg */}
          <Image
            src="/banner-hutri-81.png"
            alt="Banner HUT RI Ke-81 Resmi"
            fill
            className="object-cover object-center pointer-events-none opacity-90"
          />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-red-950/70 via-[#880d0d]/45 to-red-950/70 pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-transparent to-black/45 pointer-events-none" />
          <div className="absolute -left-20 -top-20 z-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-16 z-10 h-96 w-96 rounded-full bg-black/30 blur-3xl pointer-events-none" />

          <div className="relative z-20 mx-auto max-w-2xl space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase text-white backdrop-blur-md">
              <Flag className="h-3.5 w-3.5 text-[#ee2b2b]" />
              GUYUB RUKUN &bull; RW 10
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-white">
              Mari Ramaikan &amp; Bersatu
              <br className="hidden sm:block" />
              Dalam Peringatan HUT RI
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-neutral-200/90">
              Pendaftaran terbuka bagi seluruh keluarga besar RW 10. Pilihlah kategori perlombaan kegemaran Anda dan daftarkan nama sekarang juga.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Button
                asChild
                className="h-auto w-full sm:w-auto rounded-full bg-white px-8 py-3.5 sm:px-10 sm:py-4 text-base font-bold text-[#dc2626] shadow-lg transition-all duration-200 hover:bg-neutral-100 hover:scale-105 active:scale-[0.98]"
              >
                <Link href="/#lomba">
                  Daftar Lomba
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-auto w-full sm:w-auto rounded-full border border-white/30 bg-black/40 px-8 py-3.5 sm:px-10 sm:py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-black/60 active:scale-[0.98]"
              >
                <Link href="/#jadwal">Lihat Jadwal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
