"use client";

import { motion } from "motion/react";
import { C, HEADER, SceneSvg, type SceneProps, W, H, loop } from "./sceneKit";

// Lost context: a decision scrolls away under newer messages, then a new
// session opens with nothing carried over.

const MESSAGES = [
  { text: "can we pick a db today?", decision: false },
  { text: "decision: use Postgres, not Mongo", decision: true },
  { text: "ok, moving on to auth", decision: false },
  { text: "lgtm, ship it", decision: false },
  { text: "new thread: billing", decision: false },
  { text: "who owns the migration?", decision: false },
  { text: "rate limits next sprint", decision: false },
];
const TOP = 62;
const GAP = 32;
// Rough width of one 10px monospace character.
const CHAR = 6.1;

export function ProblemScene03({ play }: SceneProps) {
  return (
    <SceneSvg play={play}>
      <defs>
        <clipPath id="pf-problems-s3-clip">
          <rect x={0} y={HEADER + 6} width={W} height={H - HEADER - 6} />
        </clipPath>
      </defs>

      {/* Chat thread, scrolling up */}
      <g clipPath="url(#pf-problems-s3-clip)">
        <motion.g
          {...loop(
            play,
            { y: [0, 0, -GAP * 1.5, -GAP * 3, -GAP * 3] },
            [0, 0.12, 0.32, 0.52, 1],
          )}
        >
          {MESSAGES.map(({ text, decision }, i) => {
            const y = TOP + i * GAP;
            const width = text.length * CHAR + 22;
            const bubble = (
              <g key={text}>
                <rect
                  x={24}
                  y={y - 14}
                  width={width}
                  height={22}
                  rx={6}
                  fill={decision ? "rgb(107 107 255 / 0.16)" : C.panel}
                  stroke={decision ? C.indigo : C.line}
                />
                <text
                  x={35}
                  y={y + 1}
                  fontSize={10}
                  fill={decision ? C.text : C.dim}
                >
                  {text}
                </text>
              </g>
            );
            return decision ? (
              <motion.g
                key={text}
                {...loop(
                  play,
                  { opacity: [1, 1, 0.15, 0, 0] },
                  [0, 0.2, 0.36, 0.46, 1],
                )}
              >
                {bubble}
              </motion.g>
            ) : (
              bubble
            );
          })}
        </motion.g>
      </g>

      {/* Session 2 opens empty */}
      <motion.g
        {...loop(
          play,
          { opacity: [0, 0, 1, 1], x: [48, 48, 0, 0] },
          [0, 0.58, 0.68, 1],
          { ease: "easeOut" },
        )}
      >
        <rect
          x={252}
          y={104}
          width={164}
          height={96}
          rx={8}
          fill="#0a0a0d"
          stroke={C.line}
        />
        <text x={264} y={124} fontSize={10} fill={C.dim}>
          session #2 / teammate
        </text>
        <line x1={252} x2={416} y1={134} y2={134} stroke={C.line} />
        <circle cx={268} cy={155} r={3} fill={C.orange} />
        <text x={278} y={158.5} fontSize={11} fill={C.text}>
          context: empty
        </text>
        <rect x={264} y={174} width={88} height={3} rx={1.5} fill={C.faint} />
        <rect x={264} y={184} width={58} height={3} rx={1.5} fill={C.faint} />
      </motion.g>
    </SceneSvg>
  );
}
