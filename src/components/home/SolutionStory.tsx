"use client";

import {
  type MotionValue,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Boxes,
  History,
  ListChecks,
  Rocket,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { SOLUTION } from "@/content/home";
import { SolutionDiagram } from "@/components/home/SolutionDiagram";

// "The Solution" below "The Problems". The same brand, flipped: the canvas
// is on the left and the text on the right. On screens wide and tall enough
// (the `pin` variant in globals.css), with motion allowed, a 500svh wrapper
// pins a full-viewport stage. Scroll drives one diagram that builds itself
// step by step (SolutionDiagram.tsx). All five points stay listed beside it,
// as in "The Problems": the active one is bright and the others dim.
// Scrolling back takes it all apart. Everywhere else, each step stacks
// with its own small canvas that builds once in view. Under reduced motion
// the finished diagram sits beside all five steps, with nothing scroll-linked.

const STEPS = SOLUTION.steps.length + 1;

// Share of each step's scroll that builds its part of the diagram; the rest
// holds the finished state.
const BUILD = 0.7;

const pad = (n: number) => String(n).padStart(2, "0");

// Scroll progress (0 to 1) to diagram stage (0 to STEPS).
function toStage(progress: number) {
  const x = Math.min(STEPS, Math.max(0, progress * STEPS));
  const step = Math.min(STEPS - 1, Math.floor(x));
  return step + Math.min(1, (x - step) / BUILD);
}

// Same card styles as "The Problems" (ProblemStory.tsx).
const BACKDROP_CLASS =
  "relative overflow-hidden rounded-3xl border border-line bg-background shadow-window";
const COUNTER_CLASS =
  "absolute left-5 top-5 z-10 rounded-pill border border-line bg-background px-3 py-1 font-mono text-xs text-muted";

function Counter({ step }: { step: number }) {
  return (
    <p className={COUNTER_CLASS}>
      <span className="text-foreground">{pad(step + 1)}</span>
      {" / "}
      {pad(STEPS)}
    </p>
  );
}

// Cursor-follow glow, about 5% of the text colour, as on the problem card.
// Hover-capable pointers only; off under reduced motion.
function Spotlight() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-[radial-gradient(18rem_circle_at_var(--spot-x,50%)_var(--spot-y,50%),color-mix(in_srgb,var(--color-foreground)_5%,transparent),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100 motion-reduce:hidden"
    />
  );
}

const POINTER_SPRING = { stiffness: 80, damping: 20, mass: 0.6 };

// ------------------------------------------------------------- pinned stage

// The large canvas card: counter, spotlight and pointer parallax.
function StageCard({
  active,
  stage,
  progress,
}: {
  active: number;
  stage: MotionValue<number>;
  progress: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, POINTER_SPRING);
  const smoothY = useSpring(pointerY, POINTER_SPRING);

  function track(event: React.PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    event.currentTarget.style.setProperty("--spot-x", `${x}px`);
    event.currentTarget.style.setProperty("--spot-y", `${y}px`);
    if (event.pointerType !== "mouse") return;
    pointerX.set((x / box.width) * 2 - 1);
    pointerY.set((y / box.height) * 2 - 1);
  }

  function reset() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onPointerMove={track}
      onPointerLeave={reset}
      className={`group/spot h-[min(36rem,calc(100svh-var(--navbar-height)-3rem))] ${BACKDROP_CLASS}`}
    >
      <Spotlight />
      <Counter step={active} />
      <div className="absolute inset-0 grid place-items-center p-10 @container-size">
        <SolutionDiagram
          stage={stage}
          pointerX={smoothX}
          pointerY={smoothY}
          drift={progress}
          live={live}
          className="w-[min(100cqw,133.333cqh)]"
        />
      </div>
    </div>
  );
}

// One icon per row, in SOLUTION order (four steps, then the finale).
const ICONS: LucideIcon[] = [Workflow, Boxes, History, ListChecks, Rocket];

// The finale's three lines. The spaces keep them apart for screen readers.
function FinaleLines() {
  return SOLUTION.finale.map((line, i) => (
    <Fragment key={line}>
      {i > 0 && " "}
      <span className="block">{line}</span>
    </Fragment>
  ));
}

// A row's icon, title and lines, in the same format as the rows of "The
// Problems" (ProblemStory.tsx). Index STEPS - 1 is the finale.
function RowText({ index }: { index: number }) {
  const Icon = ICONS[index];
  const step = SOLUTION.steps[index];
  return (
    // Positioned, so a canvas shadow from the stacked layout can't paint
    // over it.
    <div className="relative flex gap-3">
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className="mt-0.5 size-5 shrink-0"
      />
      <div className="min-w-0">
        <h3 className="text-lg font-semibold tracking-tight">
          {step ? step.title : <FinaleLines />}
        </h3>
        {step &&
          [step.hook, step.support].map((line) => (
            <p key={line} className="mt-1 text-muted">
              {line}
            </p>
          ))}
      </div>
    </div>
  );
}

const ROW_INDEXES = Array.from({ length: STEPS }, (_, index) => index);

// One row of the pinned list. As in "The Problems", all rows stay visible:
// the active one is bright, the others dim to 40%, and the active row's
// divider fills left to right while its share of the scroll passes.
function PinnedRow({
  index,
  active,
  progress,
}: {
  index: number;
  active: boolean;
  progress: MotionValue<number>;
}) {
  const fill = useTransform(
    progress,
    [index / STEPS, (index + 1) / STEPS],
    [0, 1],
  );
  return (
    <li
      data-active={active}
      className="group relative border-b border-line py-4 transition-opacity [@media(height<50rem)]:py-3 duration-500 ease-out data-[active=false]:opacity-40"
    >
      <RowText index={index} />
      <motion.span
        aria-hidden="true"
        style={{ scaleX: fill }}
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-foreground opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100"
      />
    </li>
  );
}

function PinnedSolution() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // 0 to 1 across the pinned stretch; each step owns an equal share.
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Smooths wheel steps so the diagram glides rather than jumps.
  const smooth = useSpring(progress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
    restDelta: 0.0005,
  });
  const stage = useTransform(smooth, toStage);

  const update = (value: number) =>
    setActive(Math.min(STEPS - 1, Math.max(0, Math.floor(value * STEPS))));
  useMotionValueEvent(progress, "change", update);
  useEffect(() => {
    const frame = requestAnimationFrame(() => update(progress.get()));
    return () => cancelAnimationFrame(frame);
  }, [progress]);

  return (
    <div
      ref={ref}
      className="relative hidden h-[500svh] pin-tall:motion-safe:block"
    >
      <div className="sticky top-(--navbar-height) flex h-[calc(100svh-var(--navbar-height))] items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] items-center gap-12 px-6 py-6">
          <StageCard active={active} stage={stage} progress={smooth} />

          <div>
            <h2
              id="solution-title"
              className="text-4xl font-semibold tracking-tight sm:text-5xl"
            >
              {SOLUTION.title}
            </h2>
            <ol className="mt-6 border-t border-line">
              {ROW_INDEXES.map((index) => (
                <PinnedRow
                  key={index}
                  index={index}
                  active={index === active}
                  progress={progress}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------- stacked and reduced

// Hides an element that starts below the viewport, then reveals it once it
// scrolls into view. Elements already on screen, or with no JS, never hide.
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

// Room at the top for the counter.
const CANVAS_CLASS = `w-full max-w-xl px-4 pb-4 pt-12 sm:px-6 sm:pb-6 sm:pt-14 ${BACKDROP_CLASS}`;

// A row's own small canvas below its text: shows the steps before it, then
// builds its own part once half in view. Hidden under reduced motion.
function StepCanvas({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.5, once: true });
  const live = useInView(ref);
  const stage = useMotionValue(index);
  useEffect(() => {
    if (!seen) return;
    const controls = animate(stage, index + 1, {
      duration: 2.4,
      delay: 0.2,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [seen, index, stage]);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`mt-6 motion-reduce:hidden ${CANVAS_CLASS}`}
    >
      <Counter step={index} />
      <SolutionDiagram stage={stage} live={live} />
    </div>
  );
}

// The finished, connected system, for reduced motion.
function StillCanvas() {
  const stage = useMotionValue(STEPS - 1);
  return (
    <div
      aria-hidden="true"
      className={`mb-8 hidden motion-reduce:block lg:sticky lg:top-[calc(var(--navbar-height)+2rem)] lg:mb-0 lg:max-w-none ${CANVAS_CLASS}`}
    >
      <SolutionDiagram stage={stage} live={false} />
    </div>
  );
}

const revealClass =
  "transition-[opacity,translate] duration-500 ease-out data-[reveal=pending]:translate-y-4 data-[reveal=pending]:opacity-0";

// One row of the stacked list, as the stacked rows of "The Problems": text,
// then its visual, with a hairline divider below. Fades in on view. Its text
// is bright while the row is the active one and dims to 40% otherwise
// (never under reduced motion). Before any row is active, all are bright.
function StackedRow({ index, active }: { index: number; active?: boolean }) {
  const ref = useRevealOnView<HTMLLIElement>();
  return (
    <li
      ref={ref}
      data-row={index}
      className={`border-b border-line py-6 ${revealClass}`}
    >
      <div
        data-active={active}
        className="transition-opacity duration-500 ease-out motion-safe:data-[active=false]:opacity-40"
      >
        <RowText index={index} />
      </div>
      <StepCanvas index={index} />
    </li>
  );
}

function StackedSolution() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // The active row is the one crossing the middle of the viewport. Rows
  // touch, so one takes over as the last leaves; the last one stays active
  // once the list scrolls past.
  useEffect(() => {
    const rows = listRef.current?.querySelectorAll<HTMLElement>("[data-row]");
    if (!rows) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.row));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 pin-tall:motion-safe:hidden">
      <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {SOLUTION.title}
      </h2>
      <div className="mt-8 gap-12 lg:motion-reduce:grid lg:motion-reduce:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] lg:motion-reduce:items-start">
        <StillCanvas />
        {/* Positioned, so the canvas shadow doesn't paint over the text. */}
        <ol ref={listRef} className="relative border-t border-line">
          {ROW_INDEXES.map((index) => (
            <StackedRow
              key={index}
              index={index}
              active={active === null ? undefined : index === active}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

export function SolutionStory() {
  return (
    <section
      aria-labelledby="solution-title"
      className="relative border-t border-line"
    >
      <PinnedSolution />
      <StackedSolution />
    </section>
  );
}
