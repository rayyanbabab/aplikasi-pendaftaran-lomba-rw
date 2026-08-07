"use client";

import * as React from "react";

const videoSources = [
  "/motion-1.mp4",
  "/motion-2.mp4",
  "/motion-3.mp4",
];

export function HeroVideoBackground() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const videoRefs = React.useRef<(HTMLVideoElement | null)[]>([]);

  // Auto-play the initial active video when mounted
  React.useEffect(() => {
    const currentVideo = videoRefs.current[activeIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.play().catch(() => {
        // Handle cases where browser blocks autoplay silently
      });
    }
  }, [activeIndex]);

  const handleVideoEnded = () => {
    setActiveIndex((prev) => (prev + 1) % videoSources.length);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      {/* Video layers for smooth cross-fading */}
      {videoSources.map((src, index) => {
        const isActive = index === activeIndex;
        return (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            src={src}
            muted
            playsInline
            onEnded={isActive ? handleVideoEnded : undefined}
            preload={index === 0 ? "auto" : "metadata"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        );
      })}

      {/* Deep solid dark layer to dim the video brightness and give pure spotlight to the title */}
      <div className="absolute inset-0 z-20 bg-black/65 pointer-events-none" />

      {/* Cinematic top & bottom vignette formatting */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-transparent to-black/75 pointer-events-none" />
    </div>
  );
}
