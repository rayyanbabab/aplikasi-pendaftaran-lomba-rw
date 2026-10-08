"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  PartyPopper,
  Trophy,
  Users,
  Search,
  CheckCircle2,
  Share2,
} from "lucide-react";

export interface ScheduleEvent {
  time: string;
  title: string;
  note: string;
  tag?: string;
}

export interface ScheduleDay {
  dayNumber: string;
  date: string;
  theme: string;
  location: string;
  isHighlighted?: boolean;
  events: ScheduleEvent[];
}

export const scheduleData: ScheduleDay[] = [
  {
    dayNumber: "Hari ke-1",
    date: "Sabtu, 16 Agustus 2026",
    theme: "Malam Tirakatan & Doa Bersama",
    location: "Balai Warga RW 10",
    events: [
      {
        time: "19:30 WIB",
        title: "Doa Bersama Lintas Warga",
        note: "Syukuran nikmat kemerdekaan dan doa keselamatan bagi para pahlawan bangsa.",
        tag: "Seluruh Warga",
      },
      {
        time: "20:15 WIB",
        title: "Potong Tumpeng Kemerdekaan",
        note: "Ramah tamah bersama tokoh masyarakat, sesepuh, dan pengurus RT 01 sampai RT 08.",
        tag: "Silaturahmi",
      },
      {
        time: "21:00 WIB",
        title: "Technical Meeting & Undian Bagan",
        note: "Penetapan bagan tanding seluruh cabang lomba dan pengarahan juri pertandingan.",
        tag: "Perwakilan Tim / RT",
      },
    ],
  },
  {
    dayNumber: "Hari ke-2 (Puncak)",
    date: "Minggu, 17 Agustus 2026",
    theme: "Upacara & Babak Perlombaan Warga",
    location: "Lapangan Utama RW 10",
    isHighlighted: true,
    events: [
      {
        time: "07:00 WIB",
        title: "Upacara Peringatan Detik-Detik Proklamasi",
        note: "Pengibaran bendera Merah Putih, pembacaan teks Proklamasi, dan lagu kebangsaan.",
        tag: "Wajib Seluruh Warga",
      },
      {
        time: "08:15 WIB",
        title: "Check-in Peserta Lomba (Meja Panitia)",
        note: "Verifikasi kehadiran peserta dengan scan QR Code E-Ticket digital di HP.",
        tag: "Peserta Lomba",
      },
      {
        time: "08:45 WIB",
        title: "Lomba Anak (Makan Kerupuk, Lari Kelereng, Balap Karung)",
        note: "Babak penyisihan hingga final cabang olahraga tradisi anak-anak.",
        tag: "Kategori Anak",
      },
      {
        time: "13:30 WIB",
        title: "Lomba Beregu Dewasa & Antar-RT (Tarik Tambang & Bakiak)",
        note: "Adu kekompakan dan ketangkasan regu antar perwakilan RT 01 sampai RT 08.",
        tag: "Kategori Dewasa / RT",
      },
      {
        time: "16:15 WIB",
        title: "Panjat Pinang Semarak Warga",
        note: "Perebutan hadiah utama di puncak pohon pinang berselimut minyak pelumas ramah lingkungan.",
        tag: "Semua Warga",
      },
    ],
  },
  {
    dayNumber: "Hari ke-3",
    date: "Senin, 18 Agustus 2026",
    theme: "Panggung Hiburan & Pembagian Hadiah",
    location: "Panggung Kesenian RW 10",
    events: [
      {
        time: "19:00 WIB",
        title: "Pentas Seni Anak & Karang Taruna",
        note: "Penampilan tari tradisional kreasi, paduan suara anak, dan musik akustik pemuda.",
        tag: "Pentas Budaya",
      },
      {
        time: "20:00 WIB",
        title: "Penyerahan Trofi, Medali & Piagam Juara",
        note: "Pengumuman juara seluruh cabang lomba serta penetapan RT Paling Kompak tahun 2026.",
        tag: "Apresiasi Juara",
      },
      {
        time: "21:00 WIB",
        title: "Pengundian Doorprize Utama Warga",
        note: "Pengundian nomor kupon berhadiah menarik untuk seluruh keluarga yang hadir.",
        tag: "Doorprize",
      },
    ],
  },
];

export function ScheduleInteractive() {
  const [selectedDayIndex, setSelectedDayIndex] = React.useState(1); // Default to Hari ke-2 (Puncak)
  const [viewMode, setViewMode] = React.useState<"tabs" | "all">("tabs");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const activeDay = scheduleData[selectedDayIndex];

  const handleShare = () => {
    const text = `Jadwal Semarak HUT RI ke-81 RW 10:
Hari 1 (16 Ags): Malam Tirakatan di Balai Warga (19:30 WIB)
Hari 2 (17 Ags): Upacara & Lomba di Lapangan Utama (07:00 WIB)
Hari 3 (18 Ags): Panggung Hiburan & Hadiah di Panggung Kesenian (19:00 WIB)
Info lengkap & daftar: ${window.location.origin}/#jadwal`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const filterEvents = (events: ScheduleEvent[]) => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.note.toLowerCase().includes(q) ||
        (e.tag && e.tag.toLowerCase().includes(q)),
    );
  };

  return (
    <section id="jadwal" className="py-12 sm:py-16">
      {/* Header Section */}
      <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Clock className="h-3.5 w-3.5" />
            Agenda Resmi Kegiatan
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Rangkaian Acara 3 Hari Kemerdekaan
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Seluruh kegiatan dipusatkan di Balai dan Lapangan RW 10. Pilih hari untuk melihat rincian jam, lokasi tepat, dan kategori peserta.
          </p>
        </div>

        {/* View Switcher & Share Button */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
          <div className="flex items-center rounded-xl border border-border/80 bg-muted/40 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("tabs")}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                viewMode === "tabs"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pilih Hari
            </button>
            <button
              type="button"
              onClick={() => setViewMode("all")}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                viewMode === "all"
                  ? "bg-card text-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua Hari
            </button>
          </div>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Salin ringkasan jadwal acara"
            title="Salin ringkasan jadwal acara"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 text-xs font-bold text-foreground hover:border-primary/40 hover:bg-muted/40 transition-all cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-primary" />
                <span>Bagikan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode 1: Interactive Day Tabs */}
      {viewMode === "tabs" && (
        <div className="space-y-6">
          {/* Day Navigation Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {scheduleData.map((day, idx) => {
              const isSelected = idx === selectedDayIndex;
              return (
                <button
                  key={day.dayNumber}
                  type="button"
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                      : "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    {day.isHighlighted && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                        Puncak
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-extrabold text-foreground">{day.date}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{day.theme}</p>
                </button>
              );
            })}
          </div>

          {/* Detailed Timeline View for Selected Day */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
            {/* Active Day Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-primary">
                    {activeDay.dayNumber}
                  </span>
                  <span className="text-muted-foreground">&bull;</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {activeDay.date}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  {activeDay.theme}
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3.5 py-2 text-xs">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Titik Kumpul
                  </p>
                  <p className="font-bold text-foreground">{activeDay.location}</p>
                </div>
              </div>
            </div>

            {/* Quick Agenda Filter inside selected day */}
            <div className="mt-6 mb-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari acara (misal: upacara, anak, tumpeng)..."
                  className="w-full h-9 rounded-xl border border-border/80 bg-muted/20 pl-8 pr-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Timeline Events List */}
            <div className="space-y-4 pt-2">
              {filterEvents(activeDay.events).map((evt, idx) => (
                <div
                  key={evt.time + idx}
                  className="group relative flex flex-col sm:flex-row sm:items-start gap-4 rounded-xl border border-border/60 bg-muted/15 p-4 transition-all hover:border-primary/30 hover:bg-muted/30"
                >
                  {/* Time Badge */}
                  <div className="sm:w-28 shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary tabular-nums">
                      <Clock className="h-3 w-3" />
                      {evt.time}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {evt.title}
                      </h4>
                      {evt.tag && (
                        <span className="rounded-md border border-border/80 bg-card px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {evt.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {evt.note}
                    </p>
                  </div>
                </div>
              ))}

              {filterEvents(activeDay.events).length === 0 && (
                <p className="text-center text-xs text-muted-foreground py-6">
                  Tidak ada agenda yang cocok dengan kata kunci pencarian.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: View All Days Simultaneously */}
      {viewMode === "all" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {scheduleData.map((day) => (
            <div
              key={day.dayNumber}
              className={`flex flex-col rounded-2xl border p-6 shadow-xs transition-all ${
                day.isHighlighted
                  ? "border-primary/50 bg-card ring-2 ring-primary/10"
                  : "border-border/80 bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-border/60">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                    {day.dayNumber}
                  </span>
                  <h3 className="text-base font-extrabold text-foreground mt-0.5">
                    {day.date}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{day.theme}</p>
                </div>
                {day.isHighlighted && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                    Puncak
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground py-3">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-medium text-foreground/80">{day.location}</span>
              </div>

              <div className="mt-2 space-y-4 flex-1">
                {day.events.map((evt) => (
                  <div key={evt.time} className="space-y-0.5 border-l-2 border-primary/30 pl-3">
                    <span className="text-[11px] font-bold text-primary tabular-nums">
                      {evt.time}
                    </span>
                    <p className="text-xs font-bold text-foreground">{evt.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-normal">{evt.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
