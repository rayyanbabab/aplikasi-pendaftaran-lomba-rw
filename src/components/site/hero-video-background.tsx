"use client";

import * as React from "react";
import { Play, Pause, Film } from "lucide-react";

interface VideoClip {
  src: string;
  label: string;
}

const videoClips: VideoClip[] = [
  { src: "/motion-1.mp4", label: "Pawai Warga" },
  { src: "/motion-2.mp4", label: "Semarak Lomba" },
  { src: "/motion-3.mp4", label: "Guyub Rukun" },
];

export function HeroVideoBackground() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isReducedMotion, setIsReducedMotion] = React.useState(false);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);

  // Check prefers-reduced-motion
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      setIsPlaying(false);
    }
  }, []);

  // Handle active video playback
  React.useEffect(() => {
    const currentVideo = videoRefs.current[activeIndex];
    if (!currentVideo) return;

    if (isPlaying && !isReducedMotion) {
      currentVideo.currentTime = 0;
      currentVideo.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      currentVideo.pause();
    }
  }, [activeIndex, isPlaying, isReducedMotion]);

  const handleVideoEnded = () => {
    setActiveIndex((prev) => (prev + 1) % videoClips.length);
  };

  const togglePlayPause = () => {
    const currentVideo = videoRefs.current[activeIndex];
    if (isPlaying) {
      currentVideo?.pause();
      setIsPlaying(false);
    } else {
      currentVideo?.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const selectClip = (index: number) => {
    setActiveIndex(index);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-950">
      {/* Video layers */}
      {!isReducedMotion &&
        videoClips.map((clip, index) => {
          const isActive = index === activeIndex;
          return (
            <video
              key={clip.src}
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={clip.src}
              muted
              playsInline
              onEnded={isActive ? handleVideoEnded : undefined}
              preload={index === 0 ? "auto" : "metadata"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            />
          );
        })}

      {/* High-contrast multi-layer tint for WCAG AA readability */}
      <div className="absolute inset-0 z-20 bg-neutral-950/75 pointer-events-none" />
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/80 pointer-events-none" />

      {/* Interactive Video Control Bar (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-30 hidden sm:flex items-center gap-2 rounded-xl border border-white/15 bg-black/60 px-3 py-1.5 backdrop-blur-md text-white text-xs">
        <button
          type="button"
          onClick={togglePlayPause}
          aria-label={isPlaying ? "Jeda video latar" : "Putar video latar"}
          title={isPlaying ? "Jeda video latar" : "Putar video latar"}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
        </button>

        <div className="h-3.5 w-px bg-white/20" />

        <div className="flex items-center gap-1.5" role="tablist" aria-label="Pilih klip video">
          <Film className="h-3 w-3 text-white/60 mr-0.5" />
          {videoClips.map((clip, idx) => (
            <button
              key={clip.src}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              onClick={() => selectClip(idx)}
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer ${
                idx === activeIndex
                  ? "bg-primary text-white shadow-2xs"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {clip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
