"use client";

import { motion } from "motion/react";
import { C, SceneSvg, type SceneProps, loop } from "./sceneKit";

// Coding is getting faster: the coding bar fills at once and glows, while the
// shipping pipeline lights up slowly and stalls at Review. Grown from the
// earlier SpeedVisual (ProblemVisuals.tsx).

const PILL_W = 84;
const PILL_Y = 134;
const STAGES = [
  { label: "Plan", x: 28, litAt: 0.3 },
  { label: "Review", x: 128, litAt: 0.5 },
  { label: "Test", x: 228, litAt: null },
  { label: "Deploy", x: 328, litAt: null },
];
const STALL_AT = 0.6;

function Stage({
  stage,
  play,
}: {
  stage: (typeof STAGES)[number];
  play: boolean;
}) {
  const { label, x, litAt } = stage;
  const cx = x + PILL_W / 2;
  return (
    <g>
      <rect
        x={x}
        y={PILL_Y}
        width={PILL_W}
        height={26}
        rx={13}
        fill={C.panel}
        stroke={C.line}
      />
      <text
        x={cx}
        y={PILL_Y + 16.5}
        fontSize={11}
        textAnchor="middle"
        fill={C.gray}
      >
        {label}
      </text>
      {litAt !== null && (
        <motion.g
          {...loop(play, { opacity: [0, 0, 1, 1] }, [0, litAt, litAt + 0.06, 1])}
        >
          <rect
            x={x}
            y={PILL_Y}
            width={PILL_W}
            height={26}
            rx={13}
            fill="rgb(107 107 255 / 0.14)"
            stroke={C.indigo}
          />
          <text
            x={cx}
            y={PILL_Y + 16.5}
            fontSize={11}
            textAnchor="middle"
            fill={C.text}
          >
            {label}
          </text>
        </motion.g>
      )}
    </g>
  );
}

export function ProblemScene01({ play }: SceneProps) {
  const stall = loop(
    play,
    { opacity: [0, 0, 1, 1] },
    [0, STALL_AT, STALL_AT + 0.05, 1],
  );
  const review = STAGES[1];
  const reviewX = review.x + PILL_W / 2;
  return (
    <SceneSvg play={play}>
      <defs>
        <filter id="pf-problems-s1-glow" x="-20%" y="-300%" width="140%" height="700%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
      </defs>

      {/* Coding */}
      <text x={28} y={66} fontSize={11} fill={C.dim}>
        Coding
      </text>
      <motion.text
        x={412}
        y={66}
        fontSize={11}
        textAnchor="end"
        fill={C.green}
        {...loop(play, { opacity: [0, 0, 1, 1] }, [0, 0.16, 0.2, 1])}
      >
        100%
      </motion.text>
      <rect x={28} y={76} width={384} height={8} rx={4} fill={C.faint} />
      <motion.rect
        x={28}
        y={76}
        width={384}
        height={8}
        rx={4}
        fill={C.green}
        filter="url(#pf-problems-s1-glow)"
        {...loop(play, { opacity: [0, 0, 0.6, 0.6] }, [0, 0.14, 0.22, 1])}
      />
      <motion.rect
        x={28}
        y={76}
        width={384}
        height={8}
        rx={4}
        fill={C.green}
        style={{ originX: 0 }}
        {...loop(play, { scaleX: [0.03, 1, 1] }, [0, 0.16, 1], {
          ease: "easeOut",
        })}
      />

      {/* Shipping */}
      <text x={28} y={122} fontSize={11} fill={C.dim}>
        Shipping
      </text>
      {STAGES.slice(0, -1).map((stage, i) => (
        <line
          key={stage.label}
          x1={stage.x + PILL_W}
          x2={STAGES[i + 1].x}
          y1={PILL_Y + 13}
          y2={PILL_Y + 13}
          stroke={i === 0 ? C.gray : C.line}
          strokeDasharray={i === 0 ? undefined : "2 3"}
        />
      ))}
      {STAGES.map((stage) => (
        <Stage key={stage.label} stage={stage} play={play} />
      ))}

      {/* The stall at Review */}
      <motion.g {...stall}>
        <circle cx={review.x + PILL_W - 4} cy={PILL_Y + 2} r={3.5} fill={C.orange} />
        {play && (
          <motion.circle
            cx={review.x + PILL_W - 4}
            cy={PILL_Y + 2}
            r={3.5}
            fill={C.orange}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 2.6 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <text
          x={reviewX}
          y={PILL_Y + 46}
          fontSize={10.5}
          textAnchor="middle"
          fill={C.orange}
        >
          waiting…
        </text>
      </motion.g>

      {/* Timer */}
      <line x1={28} x2={412} y1={206} y2={206} stroke={C.line} />
      <motion.g {...loop(play, { opacity: [0, 0, 1, 1] }, [0, 0.18, 0.22, 1])}>
        <circle cx={32} cy={235} r={3} fill={C.green} />
        <text x={42} y={239} fontSize={11} fill={C.text}>
          coding: 2m
        </text>
      </motion.g>
      <text x={220} y={239} fontSize={10} textAnchor="middle" fill={C.gray}>
        vs
      </text>
      <motion.g {...stall}>
        <circle cx={326} cy={235} r={3} fill={C.orange} />
        <text x={412} y={239} fontSize={11} textAnchor="end" fill={C.text}>
          shipping: 3d
        </text>
      </motion.g>
    </SceneSvg>
  );
}
