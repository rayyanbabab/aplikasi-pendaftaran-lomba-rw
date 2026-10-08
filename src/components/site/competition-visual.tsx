import React from "react";
import Image from "next/image";

type CompetitionVisualProps = {
  name: string;
  categoryLabel?: string;
  type?: string;
  image?: string | null;
  className?: string;
};

// Deteksi apakah gambar merupakan foto Unsplash generik (AI slop placeholder)
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

  // Visual tematik khas perlombaan tradisional 17-an Indonesia
  const lower = name.toLowerCase();

  let theme = {
    tag: "Lomba Tradisional",
    bg: "from-[#8B1019] via-[#A81722] to-[#680C13]",
    accent: "#FBBF24",
    icon: (
      // Kerupuk gantung
      <svg viewBox="0 0 100 100" className="h-24 w-24 text-white/90 drop-shadow-md" fill="none">
        {/* Tali merah putih gantungan */}
        <line x1="50" y1="0" x2="50" y2="40" stroke="#FFF" strokeWidth="2.5" strokeDasharray="4 3" />
        <line x1="50" y1="0" x2="50" y2="40" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 4" />
        {/* Kerupuk bulat kriuk */}
        <circle cx="50" cy="62" r="24" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
        <circle cx="50" cy="62" r="16" stroke="#EAB308" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="50" cy="62" r="8" fill="#FDE047" opacity="0.6" />
        <path d="M42 54 Q50 48 58 54 Q66 62 58 70 Q50 76 42 70 Q34 62 42 54 Z" stroke="#A16207" strokeWidth="1.5" fill="none" opacity="0.4" />
      </svg>
    ),
  };

  if (lower.includes("karung")) {
    theme = {
      tag: "Ketangkasan Fisik",
      bg: "from-[#991B1B] via-[#B91C1C] to-[#7F1D1D]",
      accent: "#FDE047",
      icon: (
        // Karung goni & helm pelindung
        <svg viewBox="0 0 100 100" className="h-24 w-24 text-white/90 drop-shadow-md" fill="none">
          {/* Karung goni */}
          <path d="M30 45 L26 88 Q50 94 74 88 L70 45 Q50 48 30 45 Z" fill="#D97706" stroke="#92400E" strokeWidth="3" />
          <path d="M28 58 Q50 62 72 58 M27 72 Q50 76 73 72" stroke="#B45309" strokeWidth="2" strokeDasharray="4 3" />
          {/* Tali ikat karung */}
          <ellipse cx="50" cy="46" rx="20" ry="4" stroke="#FEF3C7" strokeWidth="2.5" fill="none" />
          {/* Pelari ceria */}
          <circle cx="50" cy="24" r="12" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
          {/* Ikat kepala merah putih */}
          <rect x="38" y="20" width="24" height="4" fill="#EF4444" rx="1" />
          <rect x="38" y="24" width="24" height="3" fill="#FFFFFF" rx="1" />
        </svg>
      ),
    };
  } else if (lower.includes("tambang")) {
    theme = {
      tag: "Kekompakan Regu",
      bg: "from-[#7C2D12] via-[#9A3412] to-[#63200D]",
      accent: "#FED7AA",
      icon: (
        // Tambang dadung
        <svg viewBox="0 0 100 100" className="h-24 w-24 text-white/90 drop-shadow-md" fill="none">
          {/* Tali tambang tebal melintang */}
          <path d="M10 50 Q30 42 50 50 Q70 58 90 50" stroke="#FDE68A" strokeWidth="12" strokeLinecap="round" />
          <path d="M10 50 Q30 42 50 50 Q70 58 90 50" stroke="#92400E" strokeWidth="12" strokeDasharray="6 6" strokeLinecap="round" opacity="0.6" />
          {/* Pita penanda merah putih di tengah */}
          <rect x="47" y="32" width="6" height="36" fill="#DC2626" rx="2" />
          <rect x="47" y="44" width="6" height="12" fill="#FFFFFF" rx="1" />
          {/* Simbol arah tarikan */}
          <path d="M22 36 L14 44 L22 52 M78 36 L86 44 L78 52" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    };
  } else if (lower.includes("pinang")) {
    theme = {
      tag: "Puncak Acara",
      bg: "from-[#14532D] via-[#166534] to-[#0F3E22]",
      accent: "#FDE047",
      icon: (
        // Pohon pinang & roda hadiah
        <svg viewBox="0 0 100 100" className="h-24 w-24 text-white/90 drop-shadow-md" fill="none">
          {/* Batang pinang licin */}
          <rect x="46" y="22" width="8" height="74" fill="#D97706" stroke="#92400E" strokeWidth="2" rx="2" />
          {/* Roda lingkaran hadiah di pucuk */}
          <ellipse cx="50" cy="22" rx="34" ry="8" stroke="#F59E0B" strokeWidth="4" fill="none" />
          <line x1="16" y1="22" x2="84" y2="22" stroke="#F59E0B" strokeWidth="2" />
          {/* Bendera merah putih di puncak */}
          <line x1="50" y1="6" x2="50" y2="22" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="51" y="6" width="16" height="6" fill="#EF4444" />
          <rect x="51" y="12" width="16" height="6" fill="#FFFFFF" />
          {/* Bingkisan hadiah */}
          <circle cx="28" cy="28" r="4" fill="#EF4444" />
          <circle cx="72" cy="28" r="4" fill="#3B82F6" />
          <circle cx="50" cy="30" r="4" fill="#10B981" />
        </svg>
      ),
    };
  } else if (lower.includes("kelereng") || lower.includes("sendok")) {
    theme = {
      tag: "Fokus & Keseimbangan",
      bg: "from-[#1E3A8A] via-[#1D4ED8] to-[#172554]",
      accent: "#93C5FD",
      icon: (
        // Sendok & kelereng
        <svg viewBox="0 0 100 100" className="h-24 w-24 text-white/90 drop-shadow-md" fill="none">
          {/* Batang sendok */}
          <path d="M15 62 Q35 60 55 52 L62 48" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round" />
          {/* Cekungan sendok */}
          <ellipse cx="74" cy="46" rx="16" ry="10" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" transform="rotate(-15 74 46)" />
          {/* Kelereng mengkilap */}
          <circle cx="72" cy="40" r="9" fill="#10B981" stroke="#059669" strokeWidth="2" />
          <circle cx="70" cy="38" r="2.5" fill="#FFFFFF" />
          <path d="M68 44 Q72 38 76 43" stroke="#34D399" strokeWidth="1.5" fill="none" />
        </svg>
      ),
    };
  } else if (lower.includes("bakiak")) {
    theme = {
      tag: "Kekompakan Regu",
      bg: "from-[#713F12] via-[#854D0E] to-[#422006]",
      accent: "#FDE68A",
      icon: (
        // Bakiak kayu bertiga
        <svg viewBox="0 0 100 100" className="h-24 w-24 text-white/90 drop-shadow-md" fill="none">
          {/* Papan bakiak panjang */}
          <rect x="12" y="58" width="76" height="12" rx="4" fill="#D97706" stroke="#92400E" strokeWidth="2.5" />
          {/* Tiga pasang sabuk karet kaki */}
          <path d="M22 58 Q27 44 32 58" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M45 58 Q50 44 55 58" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M68 58 Q73 44 78 58" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Pita Merah Putih semarak */}
          <rect x="14" y="62" width="72" height="2" fill="#EF4444" />
          <rect x="14" y="64" width="72" height="2" fill="#FFFFFF" />
        </svg>
      ),
    };
  }

  const isTeam = type === "TEAM" || type === "BOTH";

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${theme.bg} p-6 flex flex-col justify-between select-none ${className}`}
    >
      {/* Background motif tekstur halus */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
          {theme.tag}
        </span>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-xs">
          {isTeam ? "Beregu" : "Perorangan"}
        </span>
      </div>

      {/* Center Icon Graphic */}
      <div className="relative z-10 my-auto flex items-center justify-center py-2 transition-transform duration-300 group-hover:scale-108">
        {theme.icon}
      </div>

      {/* Bottom Subtitle Indicator */}
      <div className="relative z-10 flex items-center justify-between text-[11px] font-medium text-white/80">
        <span className="truncate">{categoryLabel || "HUT RI ke-81"}</span>
        <span className="font-bold text-white tracking-wide">RW 10</span>
      </div>

      {/* Subtle bottom dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
