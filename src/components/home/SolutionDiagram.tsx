"use client";

import {
  type MotionValue,
  backOut,
  circOut,
  easeInOut,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useId } from "react";

// The Solution's diagram: one system that assembles itself as `stage` runs
// from 0 to 5. Each whole number is one step of SOLUTION (content/home.ts):
//   0→1  the scattered tools from "The Problems" drift into one flow
//   1→2  People, AI, Tasks and Context orbit in and form the core ring
//   2→3  context dots leave Context and trail around the ring
//   3→4  plan / assign / track cards snap into a lane and tick off
//   4→5  everything folds into the parallel-flow mark
// Every value derives from `stage`, so running it backwards takes the system
// apart again. Geometry is in a 480×360 box: SVG strokes use that viewBox,
// and HTML labels sit at % positions and move in cqw, so both scale
// together. Only opacity, transform, stroke-dashoffset (pathLength) and blur
// change. Decorative: callers mark it aria-hidden.

const W = 480;
const H = 360;
const CX = W / 2;
const CY = H / 2;
const FLOW_Y = 148;
const LANE_Y = 222;
const RX = 196;
const RY = 128;

const VIEW_BOX = `0 0 ${W} ${H}`;

// Box units to container units (the box is W units wide), and to %.
const cq = (n: number) => `${(n * 100) / W}cqw`;
const pctX = (x: number) => `${(x / W) * 100}%`;
const pctY = (y: number) => `${(y / H) * 100}%`;

const rad = (deg: number) => (deg * Math.PI) / 180;
function onRing(deg: number, scale = 1) {
  return {
    x: CX + RX * scale * Math.cos(rad(deg)),
    y: CY + RY * scale * Math.sin(rad(deg)),
  };
}

type Value = MotionValue<number>;

// 0→1 while `stage` moves from `from` to `to`.
function useSpan(
  stage: Value,
  from: number,
  to: number,
  ease?: (v: number) => number,
) {
  return useTransform(stage, [from, to], [0, 1], ease ? { ease } : {});
}

// Hides a path while its pathLength is 0, so round caps leave no dot.
function useDrawn(draw: Value) {
  return useTransform(draw, [0, 0.01], [0, 1]);
}

const PILL =
  "absolute -translate-1/2 whitespace-nowrap rounded-pill border border-line px-[1.7cqw] py-[0.6cqw] font-mono text-[clamp(8px,2.3cqw,12px)] leading-[1.4]";

// A dark glow reads as a smudge on white, so glows are fainter in the light
// theme.
const GLOW_LIGHT = "light:opacity-30";

// Soft blur under glowing strokes. User-space units, so straight lines
// (whose bounding box has no height) still get a filter region.
function GlowFilter({ id }: { id: string }) {
  return (
    <defs>
      <filter
        id={id}
        filterUnits="userSpaceOnUse"
        x={-40}
        y={-40}
        width={W + 80}
        height={H + 80}
      >
        <feGaussianBlur stdDeviation={3.5} />
      </filter>
    </defs>
  );
}

// A light pulse that travels along `d`, with an idle shimmer. Off under
// reduced motion; paused while the diagram is off screen.
function Pulse({
  d,
  glow,
  delay = 0,
  opacity,
}: {
  d: string;
  glow: string;
  delay?: number;
  opacity: Value;
}) {
  const pulse =
    "motion-safe:animate-flow-pulse group-data-[live=false]/diagram:[animation-play-state:paused]";
  return (
    <motion.g style={{ opacity }} className="motion-reduce:hidden">
      <g className="motion-safe:animate-shimmer group-data-[live=false]/diagram:[animation-play-state:paused]">
        {[true, false].map((isGlow) => (
          <path
            key={String(isGlow)}
            d={d}
            pathLength={1}
            strokeDasharray="0.08 1.2"
            strokeDashoffset={0.08}
            strokeLinecap="round"
            strokeWidth={isGlow ? 7 : 2.5}
            filter={isGlow ? `url(#${glow})` : undefined}
            style={{ animationDelay: `${delay}s` }}
            className={`stroke-foreground ${pulse} ${isGlow ? GLOW_LIGHT : ""}`}
          />
        ))}
      </g>
    </motion.g>
  );
}

// Parallax: deeper layers move more with the pointer and the scroll.
function Layer({
  depth,
  px,
  py,
  drift,
  className = "absolute inset-0",
  children,
}: {
  depth: number;
  px: Value;
  py: Value;
  drift: Value;
  className?: string;
  children: React.ReactNode;
}) {
  const x = useTransform(px, (v) => v * depth * 10);
  const y = useTransform(
    [py, drift],
    ([p, d]: number[]) => p * depth * 10 + (0.5 - d) * depth * 24,
  );
  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

// Fold for the finale: the system shrinks, blurs and fades into the mark.
type Fold = { opacity: Value; scale: Value; filter: MotionValue<string> };

function Folding({
  fold,
  children,
}: {
  fold: Fold;
  children: React.ReactNode;
}) {
  return (
    <motion.div style={fold} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------- dot grid

// A faint dot grid around the box, split into rings by distance from the
// core. Each ring scales towards the core by its own amount, so the grid
// bends inward like a gravity well without moving dots one by one.
const GRID = 24;
const BAND = 30;
const GRID_BOX = { x: -60, y: -45, w: W + 120, h: H + 90 };
const GRID_BANDS: { x: number; y: number }[][] = [];
for (let x = GRID_BOX.x + GRID / 2; x < GRID_BOX.x + GRID_BOX.w; x += GRID) {
  for (let y = GRID_BOX.y + GRID / 2; y < GRID_BOX.y + GRID_BOX.h; y += GRID) {
    const band = Math.floor(Math.hypot(x - CX, y - CY) / BAND);
    (GRID_BANDS[band] ??= []).push({ x, y });
  }
}

function GridBand({
  dots,
  band,
  warp,
}: {
  dots: { x: number; y: number }[];
  band: number;
  warp: Value;
}) {
  // Pull peaks at mid distance and eases off towards the edges.
  const distance = (band + 0.5) * BAND;
  const pull = 0.23 * Math.exp(-distance / 120);
  const scale = useTransform(warp, (w) => 1 - w * pull);
  return (
    <motion.svg
      style={{ scale }}
      viewBox={`${GRID_BOX.x} ${GRID_BOX.y} ${GRID_BOX.w} ${GRID_BOX.h}`}
      className="absolute inset-0 size-full"
    >
      {dots.map((dot) => (
        <circle
          key={`${dot.x}-${dot.y}`}
          cx={dot.x}
          cy={dot.y}
          r={1.1}
          className="fill-foreground/10"
        />
      ))}
    </motion.svg>
  );
}

// -------------------------------------------------------------- step 1: flow

// Scattered positions match FragmentedVisual in ProblemVisuals.tsx, scaled
// to this box; `x` is the pill's place in the flow.
const FLOW = [
  { label: "Plan", sx: 84, sy: 72, r: -6, x: 80 },
  { label: "Chat", sx: 324, sy: 51, r: 5, x: 160 },
  { label: "Code", sx: 180, sy: 185, r: -3, x: 240 },
  { label: "Test", sx: 384, sy: 206, r: 6, x: 320 },
  { label: "Ship", sx: 240, sy: 309, r: -4, x: 400 },
];
const FLOW_LINKS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 2],
  [2, 3],
  [3, 4],
];
const FLOW_D = `M${FLOW[0].x} ${FLOW_Y}H${FLOW[FLOW.length - 1].x}`;

// The dashed, broken links from "The Problems": two stubs per link.
const STUBS = FLOW_LINKS.flatMap(([from, to]) =>
  [
    [from, to],
    [to, from],
  ].map(([a, b]) => {
    const p = FLOW[a];
    const q = FLOW[b];
    const at = (f: number) => ({
      x: p.sx + (q.sx - p.sx) * f,
      y: p.sy + (q.sy - p.sy) * f,
    });
    const start = at(0.2);
    const end = at(0.4);
    return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
  }),
);

function FlowPill({
  pill,
  index,
  stage,
}: {
  pill: (typeof FLOW)[number];
  index: number;
  stage: Value;
}) {
  const t = useSpan(stage, index * 0.04, 0.55 + index * 0.04, easeInOut);
  const lit = useSpan(stage, 0.75, 0.95);
  const x = useTransform(t, (v) => cq((pill.sx - pill.x) * (1 - v)));
  const y = useTransform(t, (v) => cq((pill.sy - FLOW_Y) * (1 - v)));
  const rotate = useTransform(t, [0, 1], [pill.r, 0]);
  return (
    <motion.span
      style={{ left: pctX(pill.x), top: pctY(FLOW_Y), x, y, rotate }}
      className={`${PILL} bg-background text-muted`}
    >
      {pill.label}
      {/* Lights up once the flow is connected. */}
      <motion.span
        style={{ opacity: lit }}
        className="absolute inset-0 grid place-items-center text-foreground"
      >
        {pill.label}
      </motion.span>
    </motion.span>
  );
}

function FlowLayer({ stage, glow }: { stage: Value; glow: string }) {
  const stubs = useTransform(stage, [0, 0.3], [1, 0]);
  const draw = useSpan(stage, 0.4, 0.9, easeInOut);
  const drawn = useDrawn(draw);
  const drawGlow = useTransform(draw, [0, 1], [0, 0.35]);
  const pulse = useSpan(stage, 0.85, 1);
  return (
    <>
      <svg
        viewBox={VIEW_BOX}
        fill="none"
        className="absolute inset-0 size-full overflow-visible"
      >
        <GlowFilter id={glow} />
        <motion.g style={{ opacity: stubs }}>
          {STUBS.map((line, i) => (
            <line
              key={i}
              {...line}
              className="stroke-muted/40"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          ))}
        </motion.g>
        <g className={GLOW_LIGHT}>
          <motion.path
            d={FLOW_D}
            filter={`url(#${glow})`}
            strokeWidth={5}
            strokeLinecap="round"
            style={{ pathLength: draw, opacity: drawGlow }}
            className="stroke-foreground"
          />
        </g>
        <motion.path
          d={FLOW_D}
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ pathLength: draw, opacity: drawn }}
          className="stroke-foreground/70"
        />
        <Pulse d={FLOW_D} glow={glow} opacity={pulse} />
      </svg>
      {FLOW.map((pill, index) => (
        <FlowPill key={pill.label} pill={pill} index={index} stage={stage} />
      ))}
    </>
  );
}

// -------------------------------------------------------- step 2: core ring

const RING_D = `M${CX - RX} ${CY}A${RX} ${RY} 0 1 1 ${CX + RX} ${CY}A${RX} ${RY} 0 1 1 ${CX - RX} ${CY}`;

const NODES = [
  { label: "People", angle: -135 },
  { label: "AI", angle: -45 },
  { label: "Tasks", angle: 45 },
  { label: "Context", angle: 135 },
];

function RingNode({
  node,
  index,
  stage,
}: {
  node: (typeof NODES)[number];
  index: number;
  stage: Value;
}) {
  const t = useSpan(stage, 1 + index * 0.07, 1.55 + index * 0.07, circOut);
  const home = onRing(node.angle);
  // Spirals in from outside the card: wider and a third of a turn behind.
  const at = (v: number) =>
    onRing(node.angle - (1 - v) * 110, 1 + (1 - v) * 0.9);
  const x = useTransform(t, (v) => cq(at(v).x - home.x));
  const y = useTransform(t, (v) => cq(at(v).y - home.y));
  const opacity = useTransform(t, [0, 0.3], [0, 1]);
  return (
    <motion.span
      style={{ left: pctX(home.x), top: pctY(home.y), x, y, opacity }}
      className={`${PILL} bg-card text-foreground`}
    >
      {node.label}
    </motion.span>
  );
}

// ----------------------------------------------------- step 3: context dots

// Dots leave the Context node one by one and trail the head almost a full
// lap around the ring, parking on the clear bottom arc between Tasks and
// Context. They never fade: context stays with the project.
const TRAIL = 7;
const TRAIL_GAP = 9;
const TRAIL_FROM = 135;
const TRAIL_TRAVEL = 345;

function TrailDot({ index, head }: { index: number; head: Value }) {
  const angle = useTransform(head, (h) =>
    Math.max(TRAIL_FROM, h - index * TRAIL_GAP),
  );
  const x = useTransform(angle, (a) => cq(onRing(a).x - CX));
  const y = useTransform(angle, (a) => cq(onRing(a).y - CY));
  const scale = useTransform(
    head,
    [TRAIL_FROM + index * TRAIL_GAP, TRAIL_FROM + index * TRAIL_GAP + 8],
    [0, 1],
  );
  const hollow = index % 2 === 1;
  return (
    <motion.span
      style={{ x, y, scale }}
      className={`absolute left-1/2 top-1/2 -translate-1/2 rounded-full ${
        index === 0 ? "size-[1.8cqw]" : "size-[1.3cqw]"
      } ${hollow ? "border border-foreground bg-background" : "bg-foreground"}`}
    />
  );
}

function CoreLayer({ stage, glow }: { stage: Value; glow: string }) {
  const ring = useSpan(stage, 1.3, 1.9, easeInOut);
  const ringDrawn = useDrawn(ring);
  const ringGlow = useTransform(ring, [0, 1], [0, 0.4]);
  const core = useSpan(stage, 1.5, 1.9);
  const halo = useTransform(core, [0, 1], [0, 0.07]);
  const coreScale = useTransform(core, [0, 1], [0.4, 1]);
  const trail = useSpan(stage, 2.05, 2.9, easeInOut);
  const head = useTransform(
    trail,
    [0, 1],
    [TRAIL_FROM, TRAIL_FROM + TRAIL_TRAVEL],
  );
  return (
    <>
      {/* Soft glow behind the core. */}
      <motion.div
        style={{ opacity: halo }}
        className="absolute left-1/2 top-1/2 h-1/2 w-3/5 -translate-1/2 rounded-full bg-foreground blur-3xl"
      />
      <svg
        viewBox={VIEW_BOX}
        fill="none"
        className="absolute inset-0 size-full overflow-visible"
      >
        <GlowFilter id={glow} />
        <g className={GLOW_LIGHT}>
          <motion.path
            d={RING_D}
            filter={`url(#${glow})`}
            strokeWidth={6}
            style={{ pathLength: ring, opacity: ringGlow }}
            className="stroke-foreground"
          />
        </g>
        <motion.path
          d={RING_D}
          strokeWidth={1.25}
          strokeLinecap="round"
          style={{ pathLength: ring, opacity: ringDrawn }}
          className="stroke-foreground/60"
        />
        <motion.g style={{ opacity: core, scale: coreScale }}>
          <circle
            cx={CX}
            cy={CY}
            r={9}
            filter={`url(#${glow})`}
            className={`fill-foreground/50 ${GLOW_LIGHT}`}
          />
          <circle cx={CX} cy={CY} r={4.5} className="fill-foreground" />
        </motion.g>
      </svg>
      {Array.from({ length: TRAIL }, (_, index) => (
        <TrailDot key={index} index={index} head={head} />
      ))}
      {NODES.map((node, index) => (
        <RingNode key={node.label} node={node} index={index} stage={stage} />
      ))}
    </>
  );
}

// ---------------------------------------------------------- step 4: the lane

const CARDS = [
  { label: "Plan", x: 160, from: { x: -70, y: 64, r: -14 } },
  { label: "Assign", x: 240, from: { x: 12, y: 96, r: 10 } },
  { label: "Track", x: 320, from: { x: 76, y: 60, r: -8 } },
];
const CONNECTOR_D = `M${CX} ${FLOW_Y + 12}V${LANE_Y - 12}`;
const LANE_D = `M112 ${LANE_Y}H368`;

function LaneCard({
  card,
  index,
  stage,
}: {
  card: (typeof CARDS)[number];
  index: number;
  stage: Value;
}) {
  const start = 3.1 + index * 0.08;
  // backOut overshoots slightly, so each card snaps into place.
  const t = useSpan(stage, start, start + 0.4, backOut);
  const opacity = useSpan(stage, start, start + 0.15);
  const x = useTransform(t, (v) => cq(card.from.x * (1 - v)));
  const y = useTransform(t, (v) => cq(card.from.y * (1 - v)));
  const rotate = useTransform(t, [0, 1], [card.from.r, 0]);
  // Ticks complete in sequence once all three cards are in.
  const tick = useSpan(stage, 3.6 + index * 0.1, 3.75 + index * 0.1);
  const ticked = useDrawn(tick);
  return (
    <motion.span
      style={{ left: pctX(card.x), top: pctY(LANE_Y), x, y, rotate, opacity }}
      className="absolute flex -translate-1/2 items-center gap-[1cqw] whitespace-nowrap rounded-control border border-line bg-card px-[1.6cqw] py-[0.9cqw] font-mono text-[clamp(8px,2.1cqw,11px)] leading-none text-foreground"
    >
      <svg viewBox="0 0 12 12" fill="none" className="size-[1.1em] shrink-0">
        <circle
          cx={6}
          cy={6}
          r={5.25}
          className="stroke-muted"
          strokeWidth={1}
        />
        <motion.circle
          cx={6}
          cy={6}
          r={5.25}
          style={{ opacity: tick }}
          className="fill-foreground"
        />
        <motion.path
          d="M3.6 6.2 5.3 7.8 8.5 4.4"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength: tick, opacity: ticked }}
          className="stroke-background"
        />
      </svg>
      {card.label}
    </motion.span>
  );
}

function LaneLayer({ stage }: { stage: Value }) {
  const connector = useSpan(stage, 3, 3.25);
  const connectorDrawn = useDrawn(connector);
  const rail = useSpan(stage, 3.05, 3.4, easeInOut);
  const railDrawn = useDrawn(rail);
  return (
    <>
      <svg
        viewBox={VIEW_BOX}
        fill="none"
        className="absolute inset-0 size-full overflow-visible"
      >
        <motion.path
          d={CONNECTOR_D}
          strokeWidth={1.25}
          strokeLinecap="round"
          style={{ pathLength: connector, opacity: connectorDrawn }}
          className="stroke-foreground/60"
        />
        <motion.path
          d={LANE_D}
          strokeWidth={1}
          strokeLinecap="round"
          style={{ pathLength: rail, opacity: railDrawn }}
          className="stroke-muted/50"
        />
      </svg>
      {CARDS.map((card, index) => (
        <LaneCard key={card.label} card={card} index={index} stage={stage} />
      ))}
    </>
  );
}

// --------------------------------------------------------- step 5: the mark

// Three parallel flowing lines.
const MARK = [CY - 36, CY, CY + 36].map(
  (y) =>
    `M120 ${y}C170 ${y - 28} 200 ${y - 28} 240 ${y}S310 ${y + 28} 360 ${y}`,
);

function MarkLine({
  d,
  index,
  stage,
  glow,
}: {
  d: string;
  index: number;
  stage: Value;
  glow: string;
}) {
  const draw = useSpan(
    stage,
    4.25 + index * 0.08,
    4.8 + index * 0.08,
    easeInOut,
  );
  const glowOpacity = useTransform(draw, [0, 1], [0, 0.5]);
  const drawn = useDrawn(draw);
  const pulse = useSpan(stage, 4.85, 5);
  return (
    <>
      <g className={GLOW_LIGHT}>
        <motion.path
          d={d}
          filter={`url(#${glow})`}
          strokeWidth={8}
          strokeLinecap="round"
          style={{ pathLength: draw, opacity: glowOpacity }}
          className="stroke-foreground"
        />
      </g>
      <motion.path
        d={d}
        strokeWidth={3}
        strokeLinecap="round"
        style={{ pathLength: draw, opacity: drawn }}
        className="stroke-foreground"
      />
      <Pulse d={d} glow={glow} opacity={pulse} delay={index * 0.35} />
    </>
  );
}

// ------------------------------------------------------------------- diagram

export function SolutionDiagram({
  stage,
  pointerX,
  pointerY,
  drift,
  live = true,
  className = "w-full",
}: {
  stage: Value;
  // Pointer position across the card, -1 to 1, for parallax.
  pointerX?: Value;
  pointerY?: Value;
  // Scroll progress 0 to 1 through the section, for parallax.
  drift?: Value;
  // Pauses the looping pulses while off screen.
  live?: boolean;
  className?: string;
}) {
  const id = useId().replace(/[^\w-]/g, "");
  const zero = useMotionValue(0);
  const half = useMotionValue(0.5);
  const px = pointerX ?? zero;
  const py = pointerY ?? zero;
  const dr = drift ?? half;

  // The grid bends towards the core once it forms, and most in the finale.
  const warp = useTransform(stage, [1, 2, 4, 5], [0, 0.6, 0.6, 1]);

  const foldT = useSpan(stage, 4, 4.45, easeInOut);
  const foldBlur = useTransform(foldT, [0, 1], [0, 6]);
  const fold: Fold = {
    opacity: useTransform(foldT, [0, 1], [1, 0]),
    scale: useTransform(foldT, [0, 1], [1, 0.9]),
    // No filter at rest, so the layers aren't re-blurred every frame.
    filter: useTransform(foldBlur, (b) => (b > 0.05 ? `blur(${b}px)` : "none")),
  };

  const layer = { px, py, drift: dr };
  return (
    <div
      data-live={live}
      className={`group/diagram relative aspect-[4/3] @container ${className}`}
    >
      <Layer
        depth={0.25}
        {...layer}
        className="absolute -inset-[12.5%] mask-[radial-gradient(ellipse_at_center,black,transparent_72%)]"
      >
        {GRID_BANDS.map((dots, band) => (
          <GridBand key={band} dots={dots} band={band} warp={warp} />
        ))}
      </Layer>
      <Layer depth={0.5} {...layer}>
        <Folding fold={fold}>
          <CoreLayer stage={stage} glow={`${id}-core`} />
        </Folding>
      </Layer>
      <Layer depth={0.8} {...layer}>
        <Folding fold={fold}>
          <FlowLayer stage={stage} glow={`${id}-flow`} />
        </Folding>
      </Layer>
      <Layer depth={1.1} {...layer}>
        <Folding fold={fold}>
          <LaneLayer stage={stage} />
        </Folding>
      </Layer>
      <Layer depth={0.65} {...layer}>
        <svg
          viewBox={VIEW_BOX}
          fill="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <GlowFilter id={`${id}-mark`} />
          {MARK.map((d, index) => (
            <MarkLine
              key={d}
              d={d}
              index={index}
              stage={stage}
              glow={`${id}-mark`}
            />
          ))}
        </svg>
      </Layer>
    </div>
  );
}
