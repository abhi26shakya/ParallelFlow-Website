"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { C, SceneSvg, type SceneProps, Window, loop } from "../problems/sceneKit";

// Shared project environment: one window where people, agents, tasks and
// context fade in panel by panel and connect to a hub. The answer to the
// scattered tool windows of ProblemScene02.

const HUB = { x: 220, y: 157 };
const PANEL_W = 168;
// Rough width of one 9px monospace character.
const CHAR = 5.4;

const PANELS = [
  { label: "people", x: 36, y: 76, h: 62, at: 0.06 },
  { label: "agents", x: 236, y: 76, h: 62, at: 0.18 },
  { label: "tasks", x: 36, y: 176, h: 70, at: 0.3 },
  { label: "context", x: 236, y: 176, h: 70, at: 0.42 },
];
const LINK_AT = 0.52;
const SYNC_AT = 0.66;

function Chips({ x, y, labels, colour }: { x: number; y: number; labels: string[]; colour: string }) {
  let left = x;
  return labels.map((label) => {
    const w = label.length * CHAR + 12;
    const chip = (
      <g key={label}>
        <rect x={left} y={y} width={w} height={17} rx={8.5} fill={C.faint} stroke={colour} strokeOpacity={0.6} />
        <text x={left + w / 2} y={y + 11.5} fontSize={9} textAnchor="middle" fill={C.text}>
          {label}
        </text>
      </g>
    );
    left += w + 6;
    return chip;
  });
}

const BODIES: ReactNode[] = [
  // people
  [0, 1, 2].map((i) => (
    <circle
      key={i}
      cx={52 + i * 22}
      cy={115}
      r={8}
      fill={["#2b2b33", "#34343e", "#24242c"][i]}
      stroke={C.gray}
    />
  )),
  // agents
  <Chips key="agents" x={248} y={106} labels={["Planner", "Coder", "Tester"]} colour={C.indigo} />,
  // tasks
  [C.green, C.indigo, C.gray].map((dot, i) => (
    <g key={dot}>
      <circle cx={52} cy={204 + i * 14} r={3} fill={dot} />
      <rect x={62} y={202.5 + i * 14} width={[92, 72, 104][i]} height={3} rx={1.5} fill={C.faint} />
    </g>
  )),
  // context
  <Chips key="context" x={248} y={206} labels={["spec.md", "decisions.md"]} colour={C.gray} />,
];

// From each panel's inner corner to the hub.
const LINKS = PANELS.map(({ x, y, h }) => {
  const px = x < HUB.x ? x + PANEL_W : x;
  const py = y < HUB.y ? y + h : y;
  return `M${px} ${py} L${HUB.x} ${HUB.y}`;
});

export function SolutionScene02({ play }: SceneProps) {
  const synced = loop(play, { opacity: [0, 0, 1, 1] }, [0, SYNC_AT, SYNC_AT + 0.05, 1]);
  return (
    <SceneSvg play={play}>
      <Window x={24} y={46} w={392} h={214} title="parallelflow / project" lines={[]} />

      {LINKS.map((d) => (
        <motion.path
          key={d}
          d={d}
          stroke={C.gray}
          strokeWidth={1}
          {...loop(play, { pathLength: [0, 0, 1, 1] }, [0, LINK_AT, LINK_AT + 0.1, 1], {
            ease: "easeOut",
          })}
        />
      ))}

      {PANELS.map(({ label, x, y, h, at }, i) => (
        <motion.g
          key={label}
          {...loop(play, { opacity: [0, 0, 1, 1], y: [6, 6, 0, 0] }, [0, at, at + 0.08, 1], {
            ease: "easeOut",
          })}
        >
          <rect x={x} y={y} width={PANEL_W} height={h} rx={6} fill="#0a0a0d" stroke={C.line} />
          <text x={x + 12} y={y + 17} fontSize={9.5} fill={C.dim}>
            {label}
          </text>
          {BODIES[i]}
        </motion.g>
      ))}

      {/* Hub: grey until everything is linked, then green */}
      <circle cx={HUB.x} cy={HUB.y} r={6} fill={C.panel} stroke={C.gray} />
      <motion.g {...synced}>
        <circle cx={HUB.x} cy={HUB.y} r={6} fill={C.green} />
        {play && (
          <motion.circle
            cx={HUB.x}
            cy={HUB.y}
            r={6}
            fill={C.green}
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 2.4 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.g>
    </SceneSvg>
  );
}
