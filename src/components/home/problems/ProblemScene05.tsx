"use client";

import { motion } from "motion/react";
import { C, SceneSvg, type SceneProps, loop } from "./sceneKit";

// Faster tasks ≠ faster shipping: tasks completed climbs steeply while
// shipped to prod barely moves.

const TASKS = "M48 228 C160 212 250 124 400 66";
const SHIPPED = "M48 228 C160 226 280 224 400 214";
// The gap between the two lines.
const GAP = `${TASKS} L400 214 C280 224 160 226 48 228 Z`;

export function ProblemScene05({ play }: SceneProps) {
  const draw = loop(play, { pathLength: [0, 1, 1] }, [0, 0.42, 1], {
    ease: "easeOut",
  });
  const ends = loop(play, { opacity: [0, 0, 1, 1] }, [0, 0.4, 0.44, 1]);
  return (
    <SceneSvg play={play}>
      {/* Legend */}
      <line x1={48} x2={62} y1={48} y2={48} stroke={C.indigo} strokeWidth={2} />
      <text x={68} y={51.5} fontSize={10} fill={C.dim}>
        tasks completed
      </text>
      <line x1={190} x2={204} y1={48} y2={48} stroke={C.orange} strokeWidth={2} />
      <text x={210} y={51.5} fontSize={10} fill={C.dim}>
        shipped to prod
      </text>

      {/* Axes */}
      <line x1={48} x2={48} y1={66} y2={232} stroke={C.line} />
      <line x1={48} x2={412} y1={232} y2={232} stroke={C.line} />
      <text x={48} y={250} fontSize={9.5} fill={C.gray}>
        week 1
      </text>
      <text x={400} y={250} fontSize={9.5} textAnchor="end" fill={C.gray}>
        week 8
      </text>

      <motion.path
        d={GAP}
        fill="rgb(107 107 255 / 0.08)"
        {...loop(play, { opacity: [0, 0, 1, 1] }, [0, 0.3, 0.48, 1])}
      />
      <motion.path d={TASKS} stroke={C.indigo} strokeWidth={2} {...draw} />
      <motion.path d={SHIPPED} stroke={C.orange} strokeWidth={2} {...draw} />
      <motion.g {...ends}>
        <circle cx={400} cy={66} r={3.5} fill={C.indigo} />
        <circle cx={400} cy={214} r={3.5} fill={C.orange} />
      </motion.g>

      {/* ≠ pulses once between the end points */}
      <motion.text
        x={392}
        y={152}
        fontSize={34}
        textAnchor="end"
        fill={C.text}
        {...loop(
          play,
          { opacity: [0, 0, 1, 1, 1], scale: [0.6, 0.6, 1.25, 1, 1] },
          [0, 0.46, 0.56, 0.64, 1],
        )}
      >
        ≠
      </motion.text>
    </SceneSvg>
  );
}
