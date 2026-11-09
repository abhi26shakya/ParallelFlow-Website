"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { type ComponentType, useEffect, useRef, useState } from "react";
import { ProblemScene01 } from "./ProblemScene01";
import { ProblemScene02 } from "./ProblemScene02";
import { ProblemScene03 } from "./ProblemScene03";
import { ProblemScene04 } from "./ProblemScene04";
import { ProblemScene05 } from "./ProblemScene05";
import type { SceneProps } from "./sceneKit";

// The visual card for "The Problems": a full-size black screen showing the
// active item's scene, with no background or frame around it (owner request,
// 2026-11-09). Scenes crossfade;
// the outgoing one stays mounted only for the fade. Everything pauses while
// the card is off screen, and holds still under reduced motion.

// In row order (content/home.ts PROBLEM.items).
const SCENES: ComponentType<SceneProps>[] = [
  ProblemScene01,
  ProblemScene02,
  ProblemScene03,
  ProblemScene04,
  ProblemScene05,
];

const FADE = 0.5;

const pad = (n: number) => String(n).padStart(2, "0");

export function ProblemCard({
  active,
  title,
  Icon,
  reduced,
}: {
  active: number;
  title: string;
  Icon: LucideIcon;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // The scene fading out, kept until its fade ends.
  const [shown, setShown] = useState(active);
  const [leaving, setLeaving] = useState<number | null>(null);
  if (shown !== active) {
    setShown(active);
    setLeaving(reduced ? null : shown);
  }

  useEffect(() => {
    if (leaving === null) return;
    const timer = setTimeout(() => setLeaving(null), FADE * 1000);
    return () => clearTimeout(timer);
  }, [leaving, active]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);


  const play = inView && !reduced;

  return (
    <div ref={ref} className="pf-problems-card edge-light">
      <div aria-hidden="true" className="pf-problems-frame">
        <div className="pf-problems-screen">
          {SCENES.map((Scene, index) =>
            index === active || index === leaving ? (
              <motion.div
                key={index}
                className="pf-problems-scene"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{
                  opacity: index === active ? 1 : 0,
                  y: index === active || reduced ? 0 : 8,
                }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: FADE, ease: [0.2, 0.7, 0.2, 1] }
                }
              >
                <Scene play={play} />
              </motion.div>
            ) : null,
          )}
          <Icon
            strokeWidth={1.5}
            className="absolute left-2.5 top-2.5 size-3 text-[#8a8a8a] sm:left-3 sm:top-3"
          />
          <p className="absolute right-2 top-2 flex items-center gap-1.5 rounded-pill border border-[#333] bg-[#0d0d0f] px-2 py-0.5 font-mono text-[10px] text-[#8a8a8a] sm:right-2.5 sm:top-2.5 sm:text-[11px]">
            <span className="size-1.5 rounded-full bg-[#ff7a45]" />
            <span>
              <span className="text-[#e5e5e5]">{pad(active + 1)}</span>
              {" / "}
              {pad(SCENES.length)}
            </span>
          </p>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {title}
      </p>
    </div>
  );
}
