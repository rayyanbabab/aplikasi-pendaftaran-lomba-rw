"use client";

import * as React from "react";

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
  const [remaining, setRemaining] = React.useState(() => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const parsed = new Date(targetDate);
    if (Number.isNaN(parsed.getTime())) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return getRemaining(parsed);
  });

  const [prevSeconds, setPrevSeconds] = React.useState(remaining.seconds);
  const [isTicking, setIsTicking] = React.useState(false);

  React.useEffect(() => {
    if (!targetDate) return undefined;
    const parsed = new Date(targetDate);
    if (Number.isNaN(parsed.getTime())) return undefined;

    const interval = setInterval(() => {
      const newRemaining = getRemaining(parsed);
      setRemaining((prev) => {
        if (prev.seconds !== newRemaining.seconds) {
          setPrevSeconds(prev.seconds);
          setIsTicking(true);
          setTimeout(() => setIsTicking(false), 300);
        }
        return newRemaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const items = [
    { label: "Hari", value: remaining.days },
    { label: "Jam", value: remaining.hours },
    { label: "Menit", value: remaining.minutes },
    { label: "Detik", value: remaining.seconds },
  ];

  const isFinished = remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0;

  if (isFinished) {
    return (
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="animate-scale-in rounded-3xl border border-primary/20 bg-primary/5 p-8">
          <p className="text-3xl font-black text-primary md:text-4xl">🎉 Acara Telah Dimulai!</p>
          <p className="mt-3 text-base text-muted-foreground">Selamat merayakan kemerdekaan Indonesia!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-2xl grid-cols-4 gap-2 px-1 sm:gap-4 sm:px-4 md:gap-6">
      {items.map((item, index) => {
        const isSecond = item.label === "Detik";
        return (
          <div
            key={item.label}
            className="animate-fade-in-up flex flex-col items-center gap-1.5 sm:gap-3"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border bg-gradient-to-b from-primary/5 to-primary/10 dark:from-primary/15 dark:to-primary/25 ${
                isSecond && isTicking
                  ? "border-primary/40 shadow-md sm:shadow-lg shadow-primary/10"
                  : "border-primary/10"
              }`}
              style={{ transition: "border-color 0.3s ease, box-shadow 0.3s ease" }}
            >
              {/* Decorative corner accent */}
              <div className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-primary/10 blur-xl" />
              <p
                suppressHydrationWarning
                className={`relative z-10 font-black tabular-nums text-primary ${
                  isSecond && isTicking ? "scale-110" : "scale-100"
                }`}
                style={{
                  fontSize: "clamp(1.25rem, 4.5vw, 3.2rem)",
                  transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {pad(item.value)}
              </p>
            </div>
            <p className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] text-muted-foreground truncate w-full text-center">
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
