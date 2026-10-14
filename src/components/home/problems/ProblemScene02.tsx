"use client";

import { motion } from "motion/react";
import { C, SceneSvg, type SceneProps, Window, loop } from "./sceneKit";

// Fragmented workflows: one task hops between four scattered tools along
// dashed paths, and every hop is another context switch.

const DURATION = 6;

const WINDOWS = [
  { title: "plan.md", x: 24, y: 40, lines: [92, 70, 104, 56] },
  { title: "editor", x: 266, y: 48, lines: [60, 110, 84, 96] },
  { title: "terminal", x: 40, y: 150, lines: [118, 64, 90, 40] },
  { title: "ci / deploy", x: 270, y: 154, lines: [74, 100, 52, 88] },
];
const WIN_W = 150;
const WIN_H = 70;
const center = (i: number) => ({
  x: WINDOWS[i].x + WIN_W / 2,
  y: WINDOWS[i].y + WIN_H / 2 + 4,
});

// One connector per hop, each drawn while the task travels it.
const PATHS = [
  "M174 79 C220 79 220 87 266 87",
  "M341 118 C341 150 115 120 115 150",
  "M190 189 C230 189 230 193 270 193",
];
// When each hop starts and lands, as a share of the loop.
const HOPS = [
  [0.15, 0.25],
  [0.4, 0.5],
  [0.65, 0.75],
];

function Connector({
  d,
  hop,
  play,
}: {
  d: string;
  hop: number[];
  play: boolean;
}) {
  const mask = `pf-problems-s2-mask-${hop[0]}`;
  return (
    <g>
      <mask id={mask} maskUnits="userSpaceOnUse">
        <motion.path
          d={d}
          stroke="#fff"
          strokeWidth={4}
          {...loop(play, { pathLength: [0, 0, 1, 1] }, [0, hop[0], hop[1], 1], {
            duration: DURATION,
          })}
        />
      </mask>
      <path
        d={d}
        stroke={C.indigo}
        strokeOpacity={0.7}
        strokeDasharray="3 4"
        mask={`url(#${mask})`}
      />
    </g>
  );
}

export function ProblemScene02({ play }: SceneProps) {
  const start = center(0);
  const offsets = WINDOWS.map((_, i) => ({
    x: center(i).x - start.x,
    y: center(i).y - start.y,
  }));
  // Rests at a window, then travels to the next.
  const times = [0, ...HOPS.flat(), 1];
  const at = (axis: "x" | "y") => [
    offsets[0][axis],
    ...HOPS.flatMap((_, i) => [offsets[i][axis], offsets[i + 1][axis]]),
    offsets[3][axis],
  ];
  // The counter shows n from the moment the task lands at window n.
  const lands = [0.03, ...HOPS.map(([, end]) => end)];
  return (
    <SceneSvg play={play} duration={DURATION}>
      {WINDOWS.map((w) => (
        <Window
          key={w.title}
          x={w.x}
          y={w.y}
          w={WIN_W}
          h={WIN_H}
          title={w.title}
          lines={w.lines}
        />
      ))}
      {PATHS.map((d, i) => (
        <Connector key={d} d={d} hop={HOPS[i]} play={play} />
      ))}

      {/* The task card */}
      <motion.g
        {...loop(play, { x: at("x"), y: at("y") }, times, {
          duration: DURATION,
        })}
      >
        <g transform={`translate(${start.x - 50} ${start.y - 12})`}>
          <rect
            width={100}
            height={24}
            rx={5}
            fill="#121218"
            stroke={C.indigo}
          />
          <circle cx={11} cy={12} r={2.5} fill={C.indigo} />
          <text x={20} y={15.5} fontSize={10} fill={C.text}>
            #128 add auth
          </text>
        </g>
      </motion.g>

      {/* Context switch counter */}
      <text x={232} y={256} fontSize={11} textAnchor="end" fill={C.dim}>
        context switches:
      </text>
      {lands.map((from, i) => {
        const to = lands[i + 1];
        const frames =
          to === undefined
            ? { opacity: [0, 0, 1, 1] }
            : { opacity: [0, 0, 1, 1, 0, 0] };
        const times =
          to === undefined
            ? [0, from - 0.02, from, 1]
            : [0, Math.max(0, from - 0.02), from, to - 0.02, to, 1];
        return (
          <motion.text
            key={i}
            x={240}
            y={256}
            fontSize={11}
            fill={i === 3 ? C.orange : C.text}
            {...loop(play, frames, times, { duration: DURATION })}
          >
            {i + 1}
          </motion.text>
        );
      })}
    </SceneSvg>
  );
}
