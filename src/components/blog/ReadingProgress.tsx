"use client";

import { useEffect, useRef } from "react";

// A hairline under the navbar that fills as the reader scrolls the post.
export function ReadingProgress({ targetId }: { targetId: string }) {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = target.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      const progress =
        scrollable <= 0 ? 1 : Math.min(1, Math.max(0, -top / scrollable));
      bar.current?.style.setProperty("transform", `scaleX(${progress})`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-(--navbar-height) z-40 h-0.5 bg-line/60"
    >
      <div
        ref={bar}
        className="h-full origin-left scale-x-0 bg-foreground"
      />
    </div>
  );
}
