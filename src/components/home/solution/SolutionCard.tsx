"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { type ComponentType, useEffect, useRef, useState } from "react";
import type { SceneProps } from "../problems/sceneKit";
import { useCardHover } from "../problems/useCardHover";
import { SolutionScene01 } from "./SolutionScene01";
import { SolutionScene02 } from "./SolutionScene02";
import { SolutionScene03 } from "./SolutionScene03";
import { SolutionScene04 } from "./SolutionScene04";
import { SolutionScene05 } from "./SolutionScene05";

// The visual card for "The Solution", a copy of ProblemCard.tsx with the
// solution scenes: the same blurred background, frosted frame, black screen
// and counter. Scenes crossfade; the outgoing one stays mounted only for the
// fade. Everything pauses while the card is off screen, and holds still under
// reduced motion.

// In row order (four SOLUTION.steps, then the finale).
const SCENES: ComponentType<SceneProps>[] = [
  SolutionScene01,
  SolutionScene02,
  SolutionScene03,
  SolutionScene04,
  SolutionScene05,
];

const FADE = 0.5;

const pad = (n: number) => String(n).padStart(2, "0");

export function SolutionCard({
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

  useCardHover(ref, reduced);

  const play = inView && !reduced;

  return (
    <div ref={ref} className="pf-solution-card">
      <div aria-hidden="true" className="pf-solution-frame">
        <div className="pf-solution-screen">
          {SCENES.map((Scene, index) =>
            index === active || index === leaving ? (
              <motion.div
                key={index}
                className="pf-solution-scene"
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
