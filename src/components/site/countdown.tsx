"use client";

import * as React from "react";
import { Calendar, BellRing, Share2, Check } from "lucide-react";

const pad = (value: number) => String(value).padStart(2, "0");

function getRemaining(targetDate: Date) {
  const now = new Date();
  const diff = Math.max(0, targetDate.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function Countdown({ targetDate }: { targetDate?: string | null }) {
  const [copied, setCopied] = React.useState(false);
  const [remaining, setRemaining] = React.useState(() => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const parsed = new Date(targetDate);
    if (Number.isNaN(parsed.getTime())) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return getRemaining(parsed);
  });

  React.useEffect(() => {
    if (!targetDate) return undefined;
    const parsed = new Date(targetDate);
    if (Number.isNaN(parsed.getTime())) return undefined;

    const interval = setInterval(() => {
      setRemaining(getRemaining(parsed));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const items = [
    { label: "Hari", value: remaining.days },
    { label: "Jam", value: remaining.hours },
    { label: "Menit", value: remaining.minutes },
    { label: "Detik", value: remaining.seconds, isSeconds: true },
  ];

  const isFinished =
    remaining.days === 0 &&
    remaining.hours === 0 &&
    remaining.minutes === 0 &&
    remaining.seconds === 0;

  const handleShareWa = () => {
    const text = encodeURIComponent(
      `Halo Bapak/Ibu dan Pemuda RW 10! Ayo ramaikan Peringatan HUT RI ke-81 RW 10 Pengasinan. Rangkaian lomba dimulai 16-18 Agustus 2026. Pendaftaran gratis 100%! Cek cabang lomba dan jadwal lengkap di: ${typeof window !== "undefined" ? window.location.origin : ""}`,
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleDownloadCalendar = () => {
    // Generate .ics calendar file for 17 Agustus 2026
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Semarak 17-an RW 10//ID
BEGIN:VEVENT
UID:hutri81-rw10-20260817@pengasinan
DTSTAMP:20260801T000000Z
DTSTART:20260817T000000Z
DTEND:20260817T150000Z
SUMMARY:Peringatan HUT ke-81 Kemerdekaan RI RW 10
DESCRIPTION:Pesta Rakyat dan Perlombaan Warga HUT RI ke-81 RW 10 Kelurahan Pengasinan. Lapangan Utama RW 10.
LOCATION:Lapangan Utama RW 10, Jl. Pengasinan Tengah
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "agenda-17an-rw10.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isFinished) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-primary/30 bg-primary/10 p-6 text-center shadow-xs">
        <p className="text-xl font-black text-primary sm:text-2xl">
          Rangkaian Acara HUT RI ke-81 Sedang Berlangsung!
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Mari ramaikan Lapangan RW 10 bersama seluruh keluarga dan tetangga tercinta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Digits Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-background/80 px-2 py-3 sm:py-3.5 shadow-2xs backdrop-blur-xs transition-colors ${
              item.isSeconds ? "border-primary/40" : ""
            }`}
          >
            <span
              suppressHydrationWarning
              className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight tabular-nums ${
                item.isSeconds ? "text-primary animate-pulse" : "text-foreground"
              }`}
            >
              {pad(item.value)}
            </span>
            <span className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Interactive Remind & Share Buttons */}
      <div className="flex items-center justify-center gap-2 pt-1 text-xs">
        <button
          type="button"
          onClick={handleDownloadCalendar}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary/40 hover:bg-muted/40 transition-all cursor-pointer shadow-2xs"
        >
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>Simpan ke Kalender (.ics)</span>
        </button>

        <button
          type="button"
          onClick={handleShareWa}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:border-emerald-500/40 hover:bg-emerald-50/20 transition-all cursor-pointer shadow-2xs"
        >
          <Share2 className="h-3.5 w-3.5 text-emerald-600" />
          <span>Bagikan ke WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
