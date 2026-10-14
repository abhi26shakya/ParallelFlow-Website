"use client";

import { motion } from "motion/react";
import { C, SceneSvg, type SceneProps, loop } from "../problems/sceneKit";

// Coordinated by design: tasks pick up an agent and move across the board on
// their own. The person only approves at REVIEW. The answer to the
// hand-routed board of ProblemScene04.

const COLUMNS = ["TODO", "RUNNING", "REVIEW", "DONE"];
const COL_X = 24;
const COL_STEP = 100;
const COL_W = 92;
const CARD_W = 80;
const CARD_H = 30;

// Each card leaves a column at `moves[0]`, `moves[1]` and `moves[2]`.
const CARDS = [
  { name: "task 1", agent: "Planner", y: 80, moves: [0.08, 0.24, 0.4] },
  { name: "task 2", agent: "Coder", y: 116, moves: [0.22, 0.38, 0.54] },
  { name: "task 3", agent: "Tester", y: 152, moves: [0.36, 0.52, 0.68] },
];
const STEP = 0.06;
// Rough width of one 7.5px monospace character.
const CHAR = 4.6;

function Card({ card, play }: { card: (typeof CARDS)[number]; play: boolean }) {
  const [a, b, c] = card.moves;
  const x = COL_X + (COL_W - CARD_W) / 2;
  const tagW = card.agent.length * CHAR + 10;
  return (
    <motion.g
      {...loop(
        play,
        { x: [0, 0, 100, 100, 200, 200, 300, 300] },
        [0, a, a + STEP, b, b + STEP, c, c + STEP, 1],
      )}
    >
      <rect x={x} y={card.y} width={CARD_W} height={CARD_H} rx={5} fill={C.panel} stroke={C.line} />
      <motion.rect
        x={x}
        y={card.y}
        width={CARD_W}
        height={CARD_H}
        rx={5}
        fill="rgb(61 220 132 / 0.1)"
        stroke={C.green}
        {...loop(play, { opacity: [0, 0, 1, 1] }, [0, c + STEP - 0.01, c + STEP + 0.02, 1])}
      />
      <text x={x + 7} y={card.y + 12} fontSize={9} fill={C.text}>
        {card.name}
      </text>
      {/* The agent tag, assigned as the card leaves TODO */}
      <motion.g {...loop(play, { opacity: [0, 0, 1, 1] }, [0, a - 0.02, a + 0.02, 1])}>
        <rect x={x + 7} y={card.y + 16} width={tagW} height={10} rx={5} fill="rgb(107 107 255 / 0.18)" />
        <text x={x + 12} y={card.y + 23.5} fontSize={7.5} fill={C.indigo}>
          {card.agent}
        </text>
      </motion.g>
    </motion.g>
  );
}

export function SolutionScene04({ play }: SceneProps) {
  const reviewX = COL_X + 2 * COL_STEP;
  return (
    <SceneSvg play={play}>
      {COLUMNS.map((label, i) => (
        <g key={label}>
          <text x={COL_X + i * COL_STEP + 4} y={60} fontSize={9.5} fill={C.gray}>
            {label}
          </text>
          <rect
            x={COL_X + i * COL_STEP}
            y={68}
            width={COL_W}
            height={124}
            rx={6}
            fill="#0a0a0d"
            stroke={C.line}
          />
        </g>
      ))}
      <text x={reviewX + COL_W - 6} y={60} fontSize={8} textAnchor="end" fill={C.indigo}>
        Reviewer
      </text>

      {CARDS.map((card) => (
        <Card key={card.name} card={card} play={play} />
      ))}

      {/* The one human step */}
      <line x1={reviewX + 14} x2={reviewX + 14} y1={192} y2={222} stroke={C.gray} strokeDasharray="2 3" />
      <circle cx={reviewX + 14} cy={232} r={11} fill={C.panel} stroke={C.gray} />
      <text x={reviewX + 14} y={234.5} fontSize={7} textAnchor="middle" fill={C.text}>
        YOU
      </text>
      <motion.text
        x={reviewX + 32}
        y={235.5}
        fontSize={10}
        fill={C.green}
        {...loop(play, { opacity: [0, 0, 1, 1] }, [0, 0.38, 0.42, 1])}
      >
        approve ✓
      </motion.text>

      {/* Manual steps */}
      <text x={28} y={235.5} fontSize={10} fill={C.dim}>
        manual steps: 12
      </text>
      <motion.text
        x={136}
        y={235.5}
        fontSize={10}
        fill={C.green}
        {...loop(play, { opacity: [0, 0, 1, 1], x: [-6, -6, 0, 0] }, [0, 0.74, 0.8, 1])}
      >
        → 1
      </motion.text>
    </SceneSvg>
  );
}
