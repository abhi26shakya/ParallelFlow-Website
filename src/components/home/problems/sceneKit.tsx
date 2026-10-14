"use client";

import {
  type TargetAndTransition,
  type Transition,
  motion,
} from "motion/react";
import type { ReactNode } from "react";

// Shared pieces for the five problem scenes. Each scene is one SVG in a
// W × H viewBox, so it scales with the card. The top HEADER units are left
// clear for the icon and the counter. Only opacity, transform and
// stroke-dashoffset (via pathLength) animate.

export const W = 440;
export const H = 276;
export const HEADER = 36;

// Owner-approved colour exception for the Problems card (2026-10-15).
export const C = {
  indigo: "#6b6bff",
  orange: "#ff7a45",
  green: "#3ddc84",
  gray: "#6b6b6b",
  text: "#e5e5e5",
  dim: "#8a8a8a",
  line: "#26262b",
  panel: "#0d0d10",
  faint: "#1c1c22",
} as const;

export type SceneProps = { play: boolean };

type Frames = Record<string, number[]>;
type Still = Record<string, number>;

// Keyframes for one element, looping every `duration` seconds while the scene
// plays. Otherwise it holds `still`, by default the last frame. That is the
// reduced-motion frame, so last frames should tell the story on their own.
export function loop(
  play: boolean,
  frames: Frames,
  times: number[],
  {
    duration = 5,
    ease = "easeInOut",
    still,
  }: { duration?: number; ease?: Transition["ease"]; still?: Still } = {},
): {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: Transition;
} {
  const pick = (at: (v: number[]) => number) =>
    Object.fromEntries(Object.entries(frames).map(([k, v]) => [k, at(v)]));
  if (!play) {
    const hold = { ...pick((v) => v[v.length - 1]), ...still };
    return { initial: hold, animate: hold, transition: { duration: 0 } };
  }
  return {
    initial: pick((v) => v[0]),
    animate: frames,
    transition: { duration, times, ease, repeat: Infinity },
  };
}

// The scene's SVG. Its contents fade out at the end of each loop and back in,
// which hides the jump back to the first frame.
export function SceneSvg({
  play,
  duration = 5,
  children,
}: {
  play: boolean;
  duration?: number;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="pf-problems-svg"
      fill="none"
    >
      <motion.g
        {...loop(
          play,
          { opacity: [0, 1, 1, 0] },
          [0, 0.03, 0.95, 1],
          { duration, ease: "linear", still: { opacity: 1 } },
        )}
      >
        {children}
      </motion.g>
    </svg>
  );
}

// A small app window: three-dot chrome, a title and faint content lines.
export function Window({
  x,
  y,
  w,
  h,
  title,
  lines,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: number[];
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={w}
        height={h}
        rx={6}
        fill={C.panel}
        stroke={C.line}
        strokeWidth={1}
      />
      {[0, 1, 2].map((dot) => (
        <circle key={dot} cx={10 + dot * 8} cy={10} r={2.2} fill="#34343a" />
      ))}
      <text x={38} y={13.5} fontSize={9.5} fill={C.dim}>
        {title}
      </text>
      <line x1={0} x2={w} y1={20} y2={20} stroke={C.line} />
      {lines.map((width, i) => (
        <rect
          key={i}
          x={10}
          y={30 + i * 10}
          width={width}
          height={3}
          rx={1.5}
          fill={C.faint}
        />
      ))}
    </g>
  );
}
