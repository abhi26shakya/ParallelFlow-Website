"use client";

import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useTransform,
} from "motion/react";

// Decorative mini visuals for the problem section. Each one is driven by `t`,
// its own 0 to 1 progress, which ProblemStory plays while the visual is
// active and holds at a fixed value under reduced motion. Callers mark them
// aria-hidden. Only opacity, transform and blur change.

type VisualProps = { t: MotionValue<number> };

// Fragmented workflows: five tools, joined by dashed lines that stop short.
// Coordinates are in the 400×280 SVG viewBox; pills use the same box.
const PILLS = [
  { label: "Plan", x: 70, y: 56, dx: -8, dy: -6 },
  { label: "Chat", x: 270, y: 40, dx: 8, dy: -6 },
  { label: "Code", x: 150, y: 144, dx: -8, dy: 2 },
  { label: "Test", x: 320, y: 160, dx: 10, dy: 4 },
  { label: "Ship", x: 200, y: 240, dx: 2, dy: 8 },
];

const LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 2],
  [2, 3],
  [3, 4],
];

// Each link is two dashed stubs, one from each end, with a gap between them.
function stub(from: number, to: number) {
  const a = PILLS[from];
  const b = PILLS[to];
  const at = (f: number) => ({
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
  });
  const start = at(0.2);
  const end = at(0.4);
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
}

function Pill({
  pill,
  t,
}: {
  pill: (typeof PILLS)[number];
  t: MotionValue<number>;
}) {
  const x = useTransform(t, [0, 1], [0, pill.dx]);
  const y = useTransform(t, [0, 1], [0, pill.dy]);
  return (
    <motion.span
      style={{
        left: `${(pill.x / 400) * 100}%`,
        top: `${(pill.y / 280) * 100}%`,
        x,
        y,
      }}
      className="absolute -translate-1/2 rounded-pill border border-line bg-background px-3 py-1 font-mono text-xs text-muted"
    >
      {pill.label}
    </motion.span>
  );
}

export function FragmentedVisual({ t }: VisualProps) {
  return (
    <div className="relative aspect-[10/7] w-full max-w-sm">
      <svg
        viewBox="0 0 400 280"
        className="absolute inset-0 size-full"
        fill="none"
      >
        {LINKS.flatMap(([a, b]) => [stub(a, b), stub(b, a)]).map((line, i) => (
          <line
            key={i}
            {...line}
            className="stroke-muted/40"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
        ))}
      </svg>
      {PILLS.map((pill) => (
        <Pill key={pill.label} pill={pill} t={t} />
      ))}
    </div>
  );
}

// Lost context: an old decision dissolves, last words first, and the next
// session has to ask again.
const WORDS =
  "We agreed to ship the API first, keep the v1 schema, and revisit auth after review.".split(
    " ",
  );

function Word({
  word,
  rank,
  t,
}: {
  word: string;
  rank: number;
  t: MotionValue<number>;
}) {
  // rank 0 dissolves first, rank 1 last.
  const start = rank * 0.75;
  const blur = useTransform(t, [start, start + 0.25], [0, 6]);
  const opacity = useTransform(t, [start, start + 0.25], [1, 0.08]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  return (
    <motion.span style={{ opacity, filter }} className="inline-block">
      {word}
    </motion.span>
  );
}

export function LostContextVisual({ t }: VisualProps) {
  const askOpacity = useTransform(t, [0.3, 0.6], [0, 1]);
  const askY = useTransform(t, [0.3, 0.6], [8, 0]);
  return (
    <div className="w-full max-w-sm">
      <p className="font-mono text-xs text-muted">Session 1</p>
      <p className="mt-2 flex flex-wrap gap-x-[0.3em] rounded-card border border-line bg-background p-4 text-sm leading-relaxed">
        {WORDS.map((word, i) => (
          <Word
            key={`${word}-${i}`}
            word={word}
            rank={(WORDS.length - 1 - i) / (WORDS.length - 1)}
            t={t}
          />
        ))}
      </p>
      <p className="mt-6 text-right font-mono text-xs text-muted">Session 2</p>
      <motion.p
        style={{ opacity: askOpacity, y: askY }}
        className="ml-auto mt-2 w-fit rounded-card border border-line bg-background px-4 py-3 text-sm"
      >
        What did we decide?
      </motion.p>
    </div>
  );
}

// Coordination overhead: manual chips pile up on every task while a counter
// ticks upward.
const CHIPS = ["assign", "track", "unblock"] as const;
const ROWS = 3;

// Order the chips land in: [row, chip index].
const SEQUENCE: [number, number][] = [
  [0, 0],
  [1, 0],
  [0, 1],
  [2, 0],
  [1, 1],
  [0, 2],
  [2, 1],
  [1, 2],
  [2, 2],
];
const STEP = 1 / SEQUENCE.length;
const BAR_WIDTHS = ["w-16", "w-10", "w-14"];

function Chip({
  label,
  step,
  t,
}: {
  label: string;
  step: number;
  t: MotionValue<number>;
}) {
  const start = step * STEP;
  const opacity = useTransform(t, [start, start + 0.08], [0, 1]);
  const y = useTransform(t, [start, start + 0.08], [-6, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className="rounded-pill border border-line px-2 py-0.5 font-mono text-[10px] leading-4 text-muted"
    >
      {label}
    </motion.span>
  );
}

export function CoordinationVisual({ t }: VisualProps) {
  // Matches the chips: one more each time a chip is halfway in.
  const count = useTransform(t, (v) => {
    const n = Math.min(
      SEQUENCE.length,
      Math.max(0, Math.floor((v - 0.04) / STEP) + 1),
    );
    return String(n).padStart(2, "0");
  });
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between font-mono text-xs text-muted">
        <span>Tasks</span>
        <span>
          Manual steps{" "}
          <motion.span className="text-foreground">{count}</motion.span>
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {Array.from({ length: ROWS }, (_, row) => (
          <li
            key={row}
            className="flex items-center gap-2 rounded-control border border-line bg-background px-3 py-2.5 sm:gap-3"
          >
            <span className="size-3 shrink-0 rounded-full border border-field" />
            <span
              className={`h-1.5 min-w-0 shrink rounded-pill bg-hover ${BAR_WIDTHS[row]}`}
            />
            <span className="ml-auto flex shrink-0 gap-1">
              {CHIPS.map((label, chip) => (
                <Chip
                  key={label}
                  label={label}
                  step={SEQUENCE.findIndex(([r, c]) => r === row && c === chip)}
                  t={t}
                />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Coding is getting faster: the coding bar fills at once, while the shipping
// stages light up slowly and most never do.
const STAGES = [
  { label: "Plan", at: 0.35 },
  { label: "Review", at: 0.75 },
  { label: "Test", at: null },
  { label: "Deploy", at: null },
];

function Stage({
  stage,
  t,
}: {
  stage: (typeof STAGES)[number];
  t: MotionValue<number>;
}) {
  const at = stage.at ?? 1;
  const opacity = useTransform(
    t,
    [at, Math.min(1, at + 0.15)],
    [0.35, stage.at === null ? 0.35 : 1],
  );
  return (
    <motion.span
      style={{ opacity }}
      className="rounded-pill border border-line bg-background px-2.5 py-1 text-muted"
    >
      {stage.label}
    </motion.span>
  );
}

export function SpeedVisual({ t }: VisualProps) {
  const scaleX = useTransform(t, [0, 0.25], [0.04, 1]);
  return (
    <div className="w-full max-w-sm space-y-8 font-mono text-xs">
      <div>
        <p className="text-muted">Coding</p>
        <div className="mt-2 h-2 overflow-hidden rounded-pill bg-hover">
          <motion.div
            style={{ scaleX }}
            className="h-full origin-left rounded-pill bg-foreground"
          />
        </div>
      </div>
      <div>
        <p className="text-muted">Shipping</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {STAGES.map((stage) => (
            <Stage key={stage.label} stage={stage} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Faster tasks ≠ faster shipping: tasks tick off quickly, the shipped slot
// stays empty.
const TASKS = 12;

function Task({ index, t }: { index: number; t: MotionValue<number> }) {
  const start = (index / TASKS) * 0.5;
  const opacity = useTransform(t, [start, start + 0.06], [0, 1]);
  return (
    <span className="relative size-4 rounded-[3px] border border-line">
      <motion.span
        style={{ opacity }}
        className="absolute inset-0.5 rounded-[2px] bg-foreground"
      />
    </span>
  );
}

export function NotEqualVisual({ t }: VisualProps) {
  const opacity = useTransform(t, [0.55, 0.8], [0, 1]);
  return (
    <div className="flex w-full max-w-sm items-center justify-center gap-6 font-mono text-xs text-muted">
      <div>
        <p>Tasks done</p>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {Array.from({ length: TASKS }, (_, index) => (
            <Task key={index} index={index} t={t} />
          ))}
        </div>
      </div>
      <motion.span style={{ opacity }} className="text-4xl text-foreground">
        ≠
      </motion.span>
      <div>
        <p>Shipped</p>
        <span className="mt-2 block size-14 rounded-control border border-dashed border-field" />
      </div>
    </div>
  );
}

// In row order (content/home.ts PROBLEM.items).
export const PROBLEM_VISUALS = [
  SpeedVisual,
  FragmentedVisual,
  LostContextVisual,
  CoordinationVisual,
  NotEqualVisual,
];
