"use client";

import {
  EqualNot,
  FastForward,
  MessagesSquare,
  Users,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import {
  type MotionValue,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PROBLEM, type ProblemItem } from "@/content/home";
import { PROBLEM_VISUALS } from "@/components/home/ProblemVisuals";

// "The Problems" as a pinned list beside a visual card. On screens wide and
// tall enough (the `pin` variant in globals.css) a tall wrapper pins the
// heading, the five rows and the card while the visitor scrolls. Scroll
// position picks the active row: it lights up, its divider fills left to
// right, and the card shows its visual. Scrolling back reverses it. Elsewhere
// each row stacks with its own visual and fades in on view. Only opacity,
// transform and blur animate.

// One icon per row, in PROBLEM.items order.
const ICONS: LucideIcon[] = [
  FastForward,
  Waypoints,
  MessagesSquare,
  Users,
  EqualNot,
];

// How each visual's `t` plays while its row is active.
const PLAY = [
  { to: 1, duration: 3, delay: 0.2, ease: "linear" },
  { to: 1, duration: 1.6, delay: 0.1, ease: "easeOut" },
  { to: 0.7, duration: 3, delay: 0.5, ease: "linear" },
  { to: 1, duration: 3, delay: 0.3, ease: "linear" },
  { to: 1, duration: 2.4, delay: 0.2, ease: "linear" },
] as const;

// Fixed frame of each visual under reduced motion.
const STILL = [1, 1, 0.6, 1, 1];

// Matches the card's crossfade, so a visual resets only once hidden.
const CROSSFADE = 0.5;

const ROWS = PROBLEM.items.length;

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
// The CSS that hides it (revealClass) applies only when not pinned.
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
  "unpinned:data-[reveal=pending]:translate-y-4 unpinned:data-[reveal=pending]:opacity-0";

// Cursor-follow glow, about 5% of the text colour. Owner-approved exception
// to the brief's no-glow rule (2026-10-13). Hover-capable pointers only; off
// under reduced motion. The parent needs `group/spot` and the onPointerMove
// handler below.
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
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(18rem_circle_at_var(--spot-x,50%)_var(--spot-y,50%),color-mix(in_srgb,var(--color-foreground)_5%,transparent),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100 motion-reduce:hidden"
    />
  );
}

// Faint dot grid, fading out towards the edges.
function DotGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-foreground)_7%,transparent)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"
    />
  );
}

// The large backdrop card and the smaller "app card" a visual sits in.
const BACKDROP_CLASS =
  "relative overflow-hidden rounded-3xl border border-line bg-background shadow-window";
const APP_CARD_CLASS =
  "relative rounded-card border border-line bg-card shadow-window";

// A row's own visual in the stacked layout, playing while in view.
function InlineVisual({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const t = usePlayback(index, inView);
  const Visual = PROBLEM_VISUALS[index];
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`mt-6 flex justify-center p-4 sm:p-8 pin:hidden ${BACKDROP_CLASS}`}
    >
      <DotGrid />
      <div
        className={`flex w-full max-w-md justify-center p-4 sm:p-6 ${APP_CARD_CLASS}`}
      >
        <Visual t={t} />
      </div>
    </div>
  );
}

function ProblemRow({
  item,
  index,
  active,
  progress,
}: {
  item: ProblemItem;
  index: number;
  active: boolean;
  progress: MotionValue<number>;
}) {
  const revealRef = useRevealOnView<HTMLLIElement>();
  // Fills while this row's share of the scroll passes. Only the active
  // row's line shows, so the next row starts from empty.
  const fill = useTransform(
    progress,
    [index / ROWS, (index + 1) / ROWS],
    [0, 1],
  );
  const Icon = ICONS[index];
  return (
    <li
      ref={revealRef}
      data-active={active}
      className={`group relative border-b border-line py-6 transition-[opacity,translate] duration-500 ease-out pin:py-4 pin:data-[active=false]:opacity-40 ${revealClass}`}
    >
      <div className="flex gap-3">
        <Icon
          aria-hidden="true"
          strokeWidth={1.5}
          className="mt-0.5 size-5 shrink-0"
        />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
          {item.lines.map((line) => (
            <p key={line} className="mt-1 text-muted">
              {line}
            </p>
          ))}
        </div>
      </div>
      <motion.span
        aria-hidden="true"
        style={{ scaleX: fill }}
        className="absolute inset-x-0 -bottom-px hidden h-px origin-left bg-foreground opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100 pin:block"
      />
      <InlineVisual index={index} />
    </li>
  );
}

// One visual in the pinned card, shown while its row is active.
function CardLayer({ index, active }: { index: number; active: boolean }) {
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
      <div
        className={`flex w-full max-w-md justify-center px-6 py-8 ${APP_CARD_CLASS}`}
      >
        <Visual t={t} />
      </div>
    </motion.div>
  );
}

export function ProblemStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // 0 to 1 across the pinned stretch; each row owns an equal share.
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const update = (value: number) =>
    setActive(Math.min(ROWS - 1, Math.max(0, Math.floor(value * ROWS))));
  useMotionValueEvent(progress, "change", update);
  useEffect(() => {
    const frame = requestAnimationFrame(() => update(progress.get()));
    return () => cancelAnimationFrame(frame);
  }, [progress]);

  return (
    <section
      aria-labelledby="problem-title"
      className="relative border-t border-line"
    >
      <div ref={ref} className="relative pin:h-[400svh]">
        <div className="pin:sticky pin:top-(--navbar-height) pin:flex pin:h-[calc(100svh-var(--navbar-height))] pin:items-center">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 pin:grid pin:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] pin:items-center pin:gap-12 pin:py-6">
            <div>
              <h2
                id="problem-title"
                className="text-4xl font-semibold tracking-tight sm:text-5xl"
              >
                {PROBLEM.title}
              </h2>
              <ol className="mt-8 border-t border-line pin:mt-6">
                {PROBLEM.items.map((item, index) => (
                  <ProblemRow
                    key={item.title}
                    item={item}
                    index={index}
                    active={index === active}
                    progress={progress}
                  />
                ))}
              </ol>
            </div>

            <div
              aria-hidden="true"
              onPointerMove={trackSpotlight}
              className={`group/spot hidden h-[min(36rem,calc(100svh-var(--navbar-height)-3rem))] pin:block ${BACKDROP_CLASS}`}
            >
              <DotGrid />
              <Spotlight />
              <p className="absolute left-5 top-5 z-10 rounded-pill border border-line bg-background px-3 py-1 font-mono text-xs text-muted">
                <span className="text-foreground">{pad(active + 1)}</span>
                {" / "}
                {pad(ROWS)}
              </p>
              {PROBLEM_VISUALS.map((_, index) => (
                <CardLayer
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
