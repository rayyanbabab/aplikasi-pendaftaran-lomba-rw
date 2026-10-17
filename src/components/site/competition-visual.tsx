import React from "react";
import Image from "next/image";
import { Trophy, Medal, Flag, Target, Users, Award, Timer } from "lucide-react";

type CompetitionVisualProps = {
  name: string;
  categoryLabel?: string;
  type?: string;
  image?: string | null;
  className?: string;
};

// Deteksi apakah gambar merupakan foto Unsplash generik
function isGenericUnsplash(url?: string | null): boolean {
  if (!url) return true;
  return url.includes("images.unsplash.com");
}

export function CompetitionVisual({
  name,
  categoryLabel,
  type = "SOLO",
  image,
  className = "",
}: CompetitionVisualProps) {
  const isCustomRealPhoto = image && !isGenericUnsplash(image);

  if (isCustomRealPhoto) {
    return (
      <div className={`relative h-full w-full overflow-hidden bg-muted ${className}`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Visual tematik clean & profesional khas lomba 17-an RW 10
  const lower = name.toLowerCase();

  let theme = {
    tag: "Lomba Tradisional",
    bg: "from-rose-950 via-red-900 to-neutral-950",
    badgeBg: "bg-red-500/20 text-red-200 border-red-500/30",
    icon: <Medal className="h-8 w-8 text-red-200" />,
  };

  if (lower.includes("karung")) {
    theme = {
      tag: "Ketangkasan Fisik",
      bg: "from-amber-950 via-orange-950 to-neutral-950",
      badgeBg: "bg-amber-500/20 text-amber-200 border-amber-500/30",
      icon: <Timer className="h-8 w-8 text-amber-200" />,
    };
  } else if (lower.includes("tambang")) {
    theme = {
      tag: "Kekompakan Regu",
      bg: "from-slate-950 via-blue-950 to-neutral-950",
      badgeBg: "bg-blue-500/20 text-blue-200 border-blue-500/30",
      icon: <Users className="h-8 w-8 text-blue-200" />,
    };
  } else if (lower.includes("pinang")) {
    theme = {
      tag: "Puncak Acara",
      bg: "from-emerald-950 via-teal-950 to-neutral-950",
      badgeBg: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
      icon: <Flag className="h-8 w-8 text-emerald-200" />,
    };
  } else if (lower.includes("kelereng") || lower.includes("sendok")) {
    theme = {
      tag: "Fokus & Keseimbangan",
      bg: "from-indigo-950 via-sky-950 to-neutral-950",
      badgeBg: "bg-sky-500/20 text-sky-200 border-sky-500/30",
      icon: <Target className="h-8 w-8 text-sky-200" />,
    };
  } else if (lower.includes("bakiak")) {
    theme = {
      tag: "Kekompakan Regu",
      bg: "from-stone-950 via-neutral-900 to-stone-950",
      badgeBg: "bg-stone-500/20 text-stone-200 border-stone-500/30",
      icon: <Award className="h-8 w-8 text-amber-200" />,
    };
  } else if (lower.includes("makan") || lower.includes("kerupuk")) {
    theme = {
      tag: "Tradisi Warga",
      bg: "from-rose-950 via-red-900 to-neutral-950",
      badgeBg: "bg-red-500/20 text-red-200 border-red-500/30",
      icon: <Trophy className="h-8 w-8 text-amber-200" />,
    };
  }

  const isTeam = type === "TEAM" || type === "BOTH";

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${theme.bg} p-5 flex flex-col justify-between select-none ${className}`}
    >
      {/* Subtle geometric grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs ${theme.badgeBg}`}
        >
          {theme.tag}
        </span>
        <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-xs">
          {isTeam ? "Beregu" : "Perorangan"}
        </span>
      </div>

      {/* Center Clean Icon Emblem */}
      <div className="relative z-10 my-auto flex items-center justify-center py-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
          {theme.icon}
        </div>
      </div>

      {/* Bottom Subtitle Indicator */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-white/75 border-t border-white/10 pt-2.5">
        <span className="truncate">{categoryLabel || "HUT RI ke-81"}</span>
        <span className="font-bold text-white tracking-wide shrink-0">RW 10</span>
      </div>

      {/* Subtle bottom dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
