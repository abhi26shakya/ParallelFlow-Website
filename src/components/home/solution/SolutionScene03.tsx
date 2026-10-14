"use client";

import { motion } from "motion/react";
import { C, SceneSvg, type SceneProps, loop } from "../problems/sceneKit";

// Continuity built in: the decision that scrolled away in ProblemScene03 is
// pinned into project memory instead, and the next session opens with it
// already there.

const DECISION = "decision: use Postgres, not Mongo";
// Rough width of one 10px monospace character.
const CHAR = 6.1;
const CHIP_W = DECISION.length * CHAR + 22;

function Chip({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={CHIP_W}
        height={22}
        rx={6}
        fill="rgb(107 107 255 / 0.16)"
        stroke={C.indigo}
      />
      <text x={x + 11} y={y + 15} fontSize={10} fill={C.text}>
        {DECISION}
      </text>
    </g>
  );
}

export function SolutionScene03({ play }: SceneProps) {
  return (
    <SceneSvg play={play}>
      {/* Project memory */}
      <rect x={24} y={48} width={392} height={84} rx={8} fill="#0a0a0d" stroke={C.line} />
      <text x={36} y={66} fontSize={10} fill={C.dim}>
        project memory
      </text>
      <line x1={24} x2={416} y1={76} y2={76} stroke={C.line} />
      <rect x={316} y={92} width={88} height={3} rx={1.5} fill={C.faint} />
      <rect x={316} y={102} width={64} height={3} rx={1.5} fill={C.faint} />
      <rect x={316} y={112} width={76} height={3} rx={1.5} fill={C.faint} />

      {/* The decision drops in */}
      <motion.g
        {...loop(
          play,
          { opacity: [0, 0, 1, 1], y: [-22, -22, 0, 0] },
          [0, 0.06, 0.2, 1],
          { ease: "easeOut" },
        )}
      >
        <Chip x={36} y={92} />
      </motion.g>

      {/* ...and gets pinned */}
      <motion.g
        {...loop(
          play,
          { opacity: [0, 0, 1, 1, 1], y: [-10, -10, 1.5, 0, 0] },
          [0, 0.24, 0.3, 0.34, 1],
          { ease: "easeOut" },
        )}
      >
        <line x1={36 + CHIP_W - 8} x2={36 + CHIP_W - 8} y1={88} y2={96} stroke={C.dim} strokeWidth={1.2} />
        <circle cx={36 + CHIP_W - 8} cy={87} r={3.5} fill={C.indigo} />
      </motion.g>
      <motion.text
        x={36 + CHIP_W + 6}
        y={107}
        fontSize={9.5}
        fill={C.gray}
        {...loop(play, { opacity: [0, 0, 1, 1] }, [0, 0.32, 0.36, 1])}
      >
        pinned
      </motion.text>

      {/* Session 2 opens with it */}
      <motion.g
        {...loop(
          play,
          { opacity: [0, 0, 1, 1], x: [48, 48, 0, 0] },
          [0, 0.46, 0.56, 1],
          { ease: "easeOut" },
        )}
      >
        <rect x={24} y={148} width={392} height={104} rx={8} fill="#0a0a0d" stroke={C.line} />
        <text x={36} y={166} fontSize={10} fill={C.dim}>
          session #2 / teammate
        </text>
        <line x1={24} x2={416} y1={176} y2={176} stroke={C.line} />
        <motion.g {...loop(play, { opacity: [0, 0, 1, 1] }, [0, 0.6, 0.64, 1])}>
          <circle cx={40} cy={194} r={3} fill={C.green} />
          <text x={50} y={197.5} fontSize={11} fill={C.text}>
            context: restored
          </text>
        </motion.g>
        <motion.g
          {...loop(
            play,
            { opacity: [0, 0, 1, 1], y: [6, 6, 0, 0] },
            [0, 0.68, 0.76, 1],
            { ease: "easeOut" },
          )}
        >
          <Chip x={36} y={212} />
        </motion.g>
      </motion.g>
    </SceneSvg>
  );
}
