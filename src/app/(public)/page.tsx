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
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDcfd6JiPtQHeEZHltfvG2QCB4iWX4m6ZwiEvqKnEOnQDPAeLwEjYxCZgCGZHHBq5VhcfLXxZ-D0LRLPr9AuwDlthunY8Yi3xHFGvO9f8mXvP6dZRbNQnOHgLMRNryVwzb0uu_8ph9fRJCD-4_dVuNVPUJgItaUmE9Jrtpf3XyIv_Yp-Hnow6bs1ZuOW5wBd-cTdsLLAn1Ql7bKbN3LJFh-xpTOmdlx2WHq09O_ZlwVSz1fQ7KYkpKFIQRokUEJis597m0a8FkgyvKh",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAiEUKvoyDVXKsHmojo80XyePm4vJywQayV62FX7kifKOI8AN_aQPoRZO9IT-Lbj4TZ81UNIn1TcPgu0_Mlux2Jhzx8EPOY5W_cUf8i__LFN-sSpcndZp1dIuWATYej0BdR2Q0H4-a6bDo9jF0LM2iEN1OF6SG3BhFGungEyHgTbJ-RnA75lIDwfn-DjLKVlrdACcWSTzT61aiMI_L55LCmu-03DJQg0Pk9zA1xP9FcQt7OvUJxG6BqrQkKlyXel3z1TXISrQi5_YRz",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDTILYtvkKR8JcIZjB9d8m0VJdS2OPIlKChClCBz_lVLwdDKFxQRltT4UNJebo4azy_hLghMML_0wMbIOpXdKA4mHp0LFqUwKiwD7XaTH7Uj2xnbJULPwhPxn0c0lBKpJd9GfIHqSvWTw0hIN8Ld2l40xBJpN7eI8wOi1P4AqRhRaTQcy59PibRldWYW5rMJWXpT-lmqYpt-v-h07SNVF3OFlFJyb99Rk_30L7UI_JBmy5mLkO1eqpEjIdjrWuJFNL84wqYf1-RdZG0",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCeaNMW_Obj14rr4oN1-SpJuk0hQR6tsuQROZNt2IQCwT5YK_VE3xICn2D9gqtpO6rZqDfTqT4SVH1dV_Ua46kO-sH4jeEUK9N7WZDNb883yDVsqFceRYgY5x2XBU6lnhc3IIoO-SoY4i9QWUCGbG1buPWIIrAQO8-s8rcOli0tczH4RnWArbl6-k996BCCXlwmgwd9iDKttxWTV39GxWIgT0ql8HWnIwrF3UQmmZNkbxhF48TYOdG5cI7stsqBRAzq3AVNgswL3GDu",
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
    title: "Khusus Warga RT 04",
    description:
      "Perlombaan diperuntukkan bagi warga RT 04 yang berdomisili atau tercatat dalam data RT. Siapkan KTP atau KK saat melakukan pendaftaran.",
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
      "Seluruh perlombaan diselenggarakan tanpa biaya pendaftaran (gratis), dibiayai oleh kas kegiatan HUT RI Ke-81 RT 04.",
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
      : "Perlombaan kemerdekaan tahunan bagi warga RT 04.";

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
      {/* ============ HERO ============ */}
      <section className="py-6 sm:py-10">
        <div
          className="relative min-h-[480px] sm:min-h-[580px] rounded-2xl sm:rounded-3xl bg-[#0a0a0a] shadow-xl"
          style={{ clipPath: "inset(0 0 0 0 round 24px)" }}
        >
          <HeroVideoBackground />
          <div className="relative z-30 flex min-h-[480px] sm:min-h-[580px] flex-col items-center justify-center p-5 sm:p-8 md:p-12 text-center">
            <div className="relative max-w-3xl space-y-5 sm:space-y-7">
                <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-xs font-semibold tracking-[0.15em] text-white backdrop-blur-md">
                  <Flag className="h-3.5 w-3.5 text-[#ee2b2b] sm:h-4 sm:w-4" />
                  HUT RI KE-81 &bull; TAHUN 2026
                </div>
                <h1 className="animate-fade-in text-3xl sm:text-5xl font-black leading-[1.15] sm:leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
                  Pesta Rakyat <span className="text-[#ff4242]">17 Agustus</span> RT 04
                </h1>
                <p className="animate-fade-in delay-100 mx-auto max-w-2xl text-base font-normal leading-relaxed text-neutral-300 sm:text-lg md:text-xl">
                  Sambut hari kemerdekaan Indonesia bersama seluruh warga RT 04.
                  Daftarkan diri atau timmu untuk mengikuti rangkaian kegiatan dan
                  perlombaan tahunan ini.
                </p>
                <div className="animate-fade-in delay-200 flex flex-col items-center justify-center gap-3 pt-3 sm:flex-row sm:gap-4 sm:pt-2 w-full sm:w-auto">
                  <Button
                    asChild
                    className="h-auto w-full sm:w-auto rounded-full bg-[#ee2b2b] px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-[#d42222] active:scale-[0.99]"
                  >
                    <Link href="/#lomba">
                      Pilih Lomba
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="h-auto w-full sm:w-auto rounded-full border border-white/30 bg-white/10 px-7 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 active:scale-[0.99]"
                  >
                    <Link href="/#jadwal">Jadwal Kegiatan</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* ============ COUNTDOWN ============ */}
      <section className="mb-10 sm:mb-12 rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-6 sm:py-12 shadow-sm">
        <div className="mb-6 sm:mb-8 space-y-2 text-center">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Agenda Peringatan
          </p>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight md:text-3xl">
            17 Agustus 2026
          </h3>
          <div className="mx-auto h-1 w-12 sm:w-16 rounded-full bg-[#ee2b2b]" />
        </div>
        <Countdown targetDate={COUNTDOWN_TARGET} />
      </section>

      {/* ============ COMPETITIONS (1 Baris di Desktop & Max 4 + CTA di HP) ============ */}
      <LandingCompetitions items={mappedCompetitions} />

      {/* ============ SCHEDULE ============ */}
      <section id="jadwal" className="py-14 sm:py-20">
        <div className="mb-10 sm:mb-16 space-y-3 sm:space-y-4 text-center">
          <div className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 sm:px-5 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Jadwal Kegiatan
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight md:text-5xl">
            Rangkaian Acara 17-an
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Seluruh kegiatan dipusatkan di lingkungan RT 04. Warga diimbau mencatat waktu pelaksanaan dan hadir sesuai agenda.
          </p>
        </div>
        {/* Mobile Timeline View (< 768px) */}
        <div className="space-y-6 md:hidden">
          {scheduleItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === scheduleItems.length - 1;
            return (
              <div key={item.date} className="relative flex gap-4">
                {/* Vertical connector line */}
                {!isLast && (
                  <div className="absolute left-[21px] top-12 -bottom-6 w-0.5 bg-gradient-to-b from-[#ee2b2b]/60 via-[#ee2b2b]/30 to-transparent" />
                )}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#ee2b2b] text-white shadow-md shadow-red-500/20 ring-4 ring-red-500/10 dark:border-background z-10 mt-1">
                  <Icon className="h-5 w-5" />
                </div>
                <Card className="flex-1 rounded-2xl border border-border/60 bg-card p-5 shadow-sm min-w-0">
                  <h4 className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">{item.date}</h4>
                  <p className="mb-3 text-base font-extrabold tracking-tight text-foreground">{item.title}</p>
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

        {/* Desktop Timeline View (>= 768px) */}
        <div className="hidden md:block relative space-y-12 timeline-line">
          {scheduleItems.map((item, index) => {
            const Icon = item.icon;
            const isLeft = index % 2 === 0;
            return (
              <div key={item.date} className="relative z-10 flex items-center gap-8 flex-row">
                {isLeft ? (
                  <div className="w-1/2 text-right">
                    <Card className="card-hover inline-block rounded-3xl border border-border/60 p-6 shadow-sm min-w-[320px] text-right">
                      <h4 className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">{item.date}</h4>
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
                    <Card className="card-hover inline-block rounded-3xl border border-border/60 p-6 shadow-sm min-w-[320px] text-left">
                      <h4 className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-primary">{item.date}</h4>
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

      {/* ============ RULES ============ */}
      <section id="syarat" className="py-14 sm:py-20">
        <div className="mb-10 sm:mb-16 space-y-3 sm:space-y-4 text-center">
          <div className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 sm:px-5 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Ketentuan Peserta
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight md:text-5xl">
            Persyaratan Lomba
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Panduan umum bagi seluruh warga RT 04 yang berpartisipasi dalam perayaan peringatan kemerdekaan.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
          {rules.map((rule, index) => {
            const Icon = rule.icon;
            return (
              <div
                key={rule.title}
                className="group rounded-2xl sm:rounded-3xl border border-border/60 bg-card p-6 sm:p-8 text-center shadow-sm transition-all duration-200 hover:border-primary/40 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mx-auto mb-5 sm:mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h5 className="mb-2.5 text-lg sm:text-xl font-bold tracking-tight text-foreground">{rule.title}</h5>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {rule.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-14 sm:py-20">
        <div className="mb-10 sm:mb-16 space-y-3 sm:space-y-4 text-center">
          <div className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 sm:px-5 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            Informasi Umum
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight md:text-5xl">
            Pertanyaan Sering Diajukan
          </h2>
          <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Ringkasan informasi penting mengenai teknis pendaftaran, aturan main, dan pelaksanaan perlombaan.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-3.5 sm:space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-colors duration-200 hover:border-primary/30 shadow-sm"
              open={faq.open}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 sm:p-6 text-left font-semibold text-foreground select-none">
                <span className="text-base tracking-tight">{faq.question}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="border-t border-border/40 px-5 sm:px-6 pb-5 sm:pb-6 pt-4 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-14 sm:py-20">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0a0a0a] p-8 sm:p-12 md:p-20 text-center text-white shadow-2xl"
          style={{ clipPath: "inset(0 0 0 0 round 24px)" }}
        >
          {/* Official government commemorative background banner */}
          <Image
            src="/banner-hutri-81.png"
            alt="Banner HUT RI Ke-81 Resmi"
            fill
            className="object-cover object-center pointer-events-none opacity-90"
          />

          {/* Lighter crimson & theatrical dark shading canopy to show off official banner graphics */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-red-950/65 via-[#880d0d]/40 to-red-950/65 pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

          {/* Subtle lighting accents */}
          <div className="absolute -left-20 -top-20 z-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-16 z-10 h-96 w-96 rounded-full bg-black/30 blur-3xl pointer-events-none" />

          <div className="relative z-20 mx-auto max-w-2xl space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-xs font-semibold tracking-[0.15em] text-white backdrop-blur-md">
              <Flag className="h-3.5 w-3.5 text-[#ee2b2b] sm:h-4 sm:w-4" />
              GUYUB RUKUN &bull; RT 04
            </div>
            <h2 className="text-3xl sm:text-4xl font-black leading-[1.15] sm:leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              Mari Ramaikan &amp; Bersatu<br className="hidden sm:block" /> Dalam Peringatan HUT RI
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-neutral-200">
              Pendaftaran terbuka bagi seluruh keluarga besar RT 04. Pilihlah kategori perlombaan kegemaran Anda dan daftarkan nama sekarang juga.
            </p>
            <div className="flex flex-col items-center justify-center gap-3.5 sm:gap-4 pt-4 sm:flex-row">
              <Button
                asChild
                className="h-auto w-full rounded-full bg-white px-8 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-bold text-[#dc2626] shadow-lg transition-colors duration-200 hover:bg-neutral-100 active:scale-[0.99] sm:w-auto"
              >
                <Link href="/#lomba">
                  Daftar Lomba
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-auto w-full rounded-full border border-white/30 bg-black/40 px-8 py-3.5 sm:px-10 sm:py-4 text-base sm:text-lg font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-black/60 active:scale-[0.99] sm:w-auto"
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
