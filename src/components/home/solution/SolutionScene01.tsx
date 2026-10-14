"use client";

import { motion } from "motion/react";
import { C, SceneSvg, type SceneProps, loop } from "../problems/sceneKit";

// One connected workflow: the Plan → Chat → Code → Test → Ship flow from the
// old SolutionDiagram.tsx. A pulse runs along it, each dashed connector turns
// solid behind it, every node lights as it passes and Ship ends green.

const PILL_W = 52;
const PILL_H = 26;
const Y = 130;
const NODES = ["Plan", "Chat", "Code", "Test", "Ship"].map((label, i) => ({
  label,
  cx: 60 + i * 80,
  // When the pulse reaches this node, as a share of the loop.
  at: 0.12 + i * 0.14,
}));
const LAST = NODES[NODES.length - 1];
const DONE_AT = LAST.at + 0.04;

function Node({
  node,
  play,
}: {
  node: (typeof NODES)[number];
  play: boolean;
}) {
  const { label, cx, at } = node;
  const ship = node === LAST;
  const pill = (stroke: string, fill: string, text: string) => (
    <>
      <rect
        x={cx - PILL_W / 2}
        y={Y - PILL_H / 2}
        width={PILL_W}
        height={PILL_H}
        rx={PILL_H / 2}
        fill={fill}
        stroke={stroke}
      />
      <text x={cx} y={Y + 3.5} fontSize={11} textAnchor="middle" fill={text}>
        {label}
      </text>
    </>
  );
  return (
    <g>
      {pill(C.line, C.panel, C.gray)}
      <motion.g
        {...loop(play, { opacity: [0, 0, 1, 1] }, [0, at - 0.01, at + 0.03, 1])}
      >
        {ship
          ? pill(C.green, "rgb(61 220 132 / 0.14)", C.text)
          : pill(C.indigo, "rgb(107 107 255 / 0.14)", C.text)}
      </motion.g>
    </g>
  );
}

export function SolutionScene01({ play }: SceneProps) {
  const done = loop(
    play,
    { opacity: [0, 0, 1, 1] },
    [0, DONE_AT, DONE_AT + 0.05, 1],
  );
  const first = NODES[0].at;
  return (
    <SceneSvg play={play}>
      <defs>
        <filter id="pf-solution-s1-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation={4} />
        </filter>
      </defs>

      <text x={34} y={84} fontSize={10.5} fill={C.dim}>
        idea → delivery
      </text>

      {/* Connectors: dashed, then solid once the pulse has crossed them */}
      {NODES.slice(0, -1).map((node, i) => {
        const next = NODES[i + 1];
        const x1 = node.cx + PILL_W / 2;
        const x2 = next.cx - PILL_W / 2;
        return (
          <g key={node.label}>
            <line x1={x1} x2={x2} y1={Y} y2={Y} stroke={C.gray} strokeDasharray="2 3" />
            <motion.path
              d={`M${x1} ${Y} H${x2}`}
              stroke={C.indigo}
              strokeWidth={1.5}
              {...loop(
                play,
                { pathLength: [0, 0, 1, 1] },
                [0, node.at, next.at - 0.02, 1],
                { ease: "linear" },
              )}
            />
          </g>
        );
      })}

      {NODES.map((node) => (
        <Node key={node.label} node={node} play={play} />
      ))}

      {/* The pulse */}
      <motion.g
        {...loop(
          play,
          {
            x: [0, 0, LAST.cx - NODES[0].cx, LAST.cx - NODES[0].cx],
            opacity: [0, 1, 1, 0],
          },
          [0, first, LAST.at, DONE_AT],
          { ease: "linear", still: { opacity: 0 } },
        )}
      >
        <circle cx={NODES[0].cx} cy={Y} r={7} fill={C.indigo} filter="url(#pf-solution-s1-glow)" />
        <circle cx={NODES[0].cx} cy={Y} r={3} fill={C.text} />
      </motion.g>

      {/* Shipped */}
      <motion.g {...done}>
        <circle cx={LAST.cx + PILL_W / 2} cy={Y - PILL_H / 2} r={6} fill={C.green} />
        <path
          d={`M${LAST.cx + PILL_W / 2 - 3} ${Y - PILL_H / 2} l2 2.2 l4 -4.4`}
          stroke="#050506"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x={LAST.cx} y={Y + 36} fontSize={10.5} textAnchor="middle" fill={C.green}>
          shipped ✓
        </text>
      </motion.g>

      {/* Footer */}
      <line x1={28} x2={412} y1={206} y2={206} stroke={C.line} />
      <motion.g {...done}>
        <circle cx={32} cy={235} r={3} fill={C.green} />
        <text x={42} y={239} fontSize={11} fill={C.text}>
          every stage, one place
        </text>
      </motion.g>
    </SceneSvg>
  );
}
