"use client";

import { useEffect, useRef } from "react";

// The hero product video: muted, looping, and silent (the file has no audio).
// It autoplays only when the visitor allows motion; under
// prefers-reduced-motion it stays paused on its first frame with controls, so
// it can still be played on demand.
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      video.controls = query.matches;
      if (query.matches) {
        video.pause();
      } else {
        // Autoplay can still be blocked (e.g. low-power mode); the first frame
        // then stays visible, which is fine.
        video.play().catch(() => {});
      }
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={ref}
      src="/videos/product-preview.mp4"
      aria-label="Product preview video of ParallelFlow"
      className="size-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
