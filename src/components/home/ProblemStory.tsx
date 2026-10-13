"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROBLEM, type ProblemItem } from "@/content/home";
import { PROBLEM_VISUALS } from "@/components/home/ProblemVisuals";

// "The problem" with a sticky visual. On large screens the text column
// scrolls past a window that stays centred in the viewport. The block nearest
// the viewport centre is active: it sets the window's visual and the counter,
// and the others dim. Everything comes from scroll position, so scrolling back
// reverses it. Below `lg` each problem stacks with its own window and fades in
// on view. Only opacity, transform and blur animate.

// Same frame as the hero's product video window (Hero.tsx).
const WINDOW_CLASS =
  "rounded-card border border-line bg-card shadow-[0_-16px_80px_-24px_rgb(255_255_255/0.16),0_40px_80px_-24px_rgb(0_0_0/0.8)]";

// How each visual's `t` plays while its problem is active.
const PLAY = [
  { to: 1, duration: 1.6, delay: 0.1, ease: "easeOut" },
  { to: 0.7, duration: 3, delay: 0.5, ease: "linear" },
  { to: 1, duration: 3, delay: 0.3, ease: "linear" },
] as const;

// Fixed frame of each visual under reduced motion.
const STILL = [1, 0.6, 1];

// Matches the window's crossfade, so a visual resets only once hidden.
const CROSSFADE = 0.5;

const pad = (n: number) => String(n).padStart(2, "0");

// Drives one visual's `t`: plays while `playing`, resets after it stops.
function usePlayback(index: number, playing: boolean) {
  const t = useMotionValue(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      t.set(STILL[index]);
      return;
    }
    if (!playing) {
      const reset = setTimeout(() => t.set(0), CROSSFADE * 1000);
      return () => clearTimeout(reset);
    }
    const controls = animate(t, PLAY[index].to, PLAY[index]);
    return () => controls.stop();
  }, [index, playing, reduced, t]);
  return t;
}

// Hides an element that starts below the viewport, then reveals it once it
// scrolls into view. Elements already on screen, or with no JS, never hide.
// The CSS that hides it (revealClass) applies below `lg` only.
function useRevealOnView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      el.getBoundingClientRect().top < window.innerHeight
    ) {
      return;
    }
    el.dataset.reveal = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      delete el.dataset.reveal;
    };
  }, []);
  return ref;
}

const revealClass =
  "max-lg:data-[reveal=pending]:translate-y-4 max-lg:data-[reveal=pending]:opacity-0";

// Cursor-follow glow, about 5% white. Owner-approved exception to the brief's
// no-glow rule (2026-10-13). Hover-capable pointers only; off under reduced
// motion. The parent needs `group` and the onPointerMove handler below.
function trackSpotlight(event: React.PointerEvent<HTMLElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--spot-x",
    `${event.clientX - box.left}px`,
  );
  event.currentTarget.style.setProperty(
    "--spot-y",
    `${event.clientY - box.top}px`,
  );
}

function Spotlight() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(18rem_circle_at_var(--spot-x,50%)_var(--spot-y,50%),rgb(255_255_255/0.05),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
    />
  );
}

// Faint dot grid, fading out towards the edges.
function DotGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"
    />
  );
}

// A problem's own window in the stacked layout, playing while in view.
function InlineVisual({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const t = usePlayback(index, inView);
  const Visual = PROBLEM_VISUALS[index];
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative mt-6 flex justify-center overflow-hidden p-4 sm:p-8 lg:hidden ${WINDOW_CLASS}`}
    >
      <DotGrid />
      <div className="relative flex w-full justify-center">
        <Visual t={t} />
      </div>
    </div>
  );
}

function ProblemBlock({
  item,
  index,
  active,
  register,
}: {
  item: ProblemItem;
  index: number;
  active: boolean;
  register: (index: number, el: HTMLLIElement | null) => void;
}) {
  const revealRef = useRevealOnView<HTMLLIElement>();
  return (
    <li
      ref={(el) => {
        revealRef.current = el;
        register(index, el);
      }}
      data-active={active}
      className={`transition-[opacity,translate] duration-500 ease-out lg:flex lg:min-h-[80svh] lg:items-center lg:data-[active=false]:opacity-35 ${revealClass}`}
    >
      <div className="w-full">
        <p aria-hidden="true" className="font-mono text-sm text-muted">
          {item.number}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          {item.title}
        </h3>
        <p className="mt-3 text-lg">{item.lines[0]}</p>
        <p className="mt-1 text-muted">{item.lines[1]}</p>
        <InlineVisual index={index} />
      </div>
    </li>
  );
}

// One visual in the sticky window, shown while its problem is active.
function WindowLayer({ index, active }: { index: number; active: boolean }) {
  const reduced = useReducedMotion();
  const t = usePlayback(index, active);
  const Visual = PROBLEM_VISUALS[index];
  return (
    <motion.div
      initial={false}
      animate={
        reduced
          ? // Clears any blur or scale from before reduced motion was known.
            { opacity: active ? 1 : 0, scale: 1, filter: "blur(0px)" }
          : {
              opacity: active ? 1 : 0,
              scale: active ? 1 : 0.96,
              filter: active ? "blur(0px)" : "blur(8px)",
            }
      }
      transition={
        reduced
          ? { duration: 0 }
          : { duration: CROSSFADE, ease: [0.22, 1, 0.36, 1] }
      }
      className="absolute inset-0 flex items-center justify-center p-10"
    >
      <Visual t={t} />
    </motion.div>
  );
}

export function ProblemStory() {
  const blocks = useRef<(HTMLLIElement | null)[]>([]);
  const resultRef = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const [lit, setLit] = useState(false);

  const register = useCallback((index: number, el: HTMLLIElement | null) => {
    blocks.current[index] = el;
  }, []);

  // The active block is the one whose centre is nearest the viewport centre.
  // The result line lights once its top passes 70% of the viewport height.
  const update = useCallback(() => {
    const middle = window.innerHeight / 2;
    let nearest = 0;
    let distance = Infinity;
    blocks.current.forEach((el, index) => {
      if (!el) return;
      const box = el.getBoundingClientRect();
      const d = Math.abs(box.top + box.height / 2 - middle);
      if (d < distance) {
        distance = d;
        nearest = index;
      }
    });
    setActive(nearest);
    const result = resultRef.current?.getBoundingClientRect();
    setLit(!!result && result.top < window.innerHeight * 0.7);
  }, []);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", update);
  useEffect(() => {
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const revealResultRef = useRevealOnView<HTMLParagraphElement>();

  return (
    <section
      aria-labelledby="problem-title"
      className="relative border-t border-line"
    >
      <DotGrid />
      <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {PROBLEM.label}
          </p>
          <h2
            id="problem-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {PROBLEM.title}
          </h2>

          <ol className="mt-12 space-y-16 lg:mt-0 lg:space-y-0">
            {PROBLEM.items.map((item, index) => (
              <ProblemBlock
                key={item.number}
                item={item}
                index={index}
                active={index === active}
                register={register}
              />
            ))}
          </ol>

          {/* Its own block on desktop, so the window stays pinned while the
              line lights up. Then the section ends. */}
          <div className="mt-16 lg:mt-0 lg:flex lg:min-h-[60svh] lg:items-center">
            <p
              ref={(el) => {
                resultRef.current = el;
                revealResultRef.current = el;
              }}
              data-lit={lit}
              className={`w-full border-t border-line pt-6 text-2xl font-semibold tracking-tight transition-[opacity,translate] duration-500 ease-out sm:text-3xl lg:data-[lit=false]:opacity-20 ${revealClass}`}
            >
              {PROBLEM.result}
            </p>
          </div>
        </div>

        {/* Stays centred in the space below the navbar for the whole column. */}
        <div className="hidden lg:block">
          <div className="sticky top-(--navbar-height) flex h-[calc(100svh-var(--navbar-height))] items-center">
            <div
              aria-hidden="true"
              onPointerMove={trackSpotlight}
              className={`group relative h-[min(30rem,calc(100svh-var(--navbar-height)-4rem))] w-full overflow-hidden ${WINDOW_CLASS}`}
            >
              <DotGrid />
              <Spotlight />
              <p className="absolute left-4 top-4 z-10 rounded-pill border border-line px-3 py-1 font-mono text-xs text-muted">
                <span className="text-foreground">{pad(active + 1)}</span>
                {" / "}
                {pad(PROBLEM.items.length)}
              </p>
              {PROBLEM_VISUALS.map((_, index) => (
                <WindowLayer
                  key={index}
                  index={index}
                  active={index === active}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
