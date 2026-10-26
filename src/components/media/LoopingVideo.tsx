"use client";

import { useEffect, useRef } from "react";

// A product video: muted, looping, and silent (the files have no audio). Used
// by the home hero and the Product page preview windows.
// When motion is allowed it plays from the start each time it scrolls into
// view and pauses when it leaves. Under prefers-reduced-motion it stays paused
// on its first frame with controls, so it can still be played on demand.
export function LoopingVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const sync = () => {
      video.controls = query.matches;
      if (query.matches || !visible) {
        video.pause();
      } else {
        // Autoplay can still be blocked (e.g. low-power mode); the first frame
        // then stays visible, which is fine.
        video.play().catch(() => {});
      }
    };

    // Restart on entry, once at least 40% of the video is on screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible && !query.matches) {
          video.currentTime = 0;
        }
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.4 },
    );
    observer.observe(video);

    sync();
    query.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      query.removeEventListener("change", sync);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      aria-label={label}
      className="size-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
