"use client";

import { motion } from "motion/react";
import { C, SceneSvg, type SceneProps, loop } from "./sceneKit";

// Coordination overhead: a person sits in the middle of four agents and
// carries every handoff by hand. Each agent waits until the pulse reaches it,
// works briefly, then goes back to waiting.

const DURATION = 6;
const YOU = { x: 220, y: 158 };
const NODE_W = 112;
const NODE_H = 40;

const AGENTS = [
  { name: "Planner", x: 92, y: 78, status: "waiting on human", tone: C.orange, task: "assign" },
  { name: "Coder", x: 348, y: 78, status: "blocked", tone: C.orange, task: "unblock" },
  { name: "Tester", x: 92, y: 238, status: "needs review", tone: C.indigo, task: "track" },
  { name: "Reviewer", x: 348, y: 238, status: "idle", tone: C.gray, task: "assign" },
];

// Trip k leaves YOU at start(k), reaches the agent at +0.12, leaves it at
// +0.16 and is home again at +0.2.
const start = (k: number) => 0.04 + k * 0.22;
// How far along each spoke the pulse stops, short of the agent's box.
const REACH = 0.5;

function Status({
  x,
  y,
  text,
  fill,
  frames,
  times,
  still,
  play,
}: {
  x: number;
  y: number;
  text: string;
  fill: string;
  frames: number[];
  times: number[];
  still: number;
  play: boolean;
}) {
  return (
    <motion.text
      x={x}
      y={y}
      fontSize={9.5}
      textAnchor="middle"
      fill={fill}
      {...loop(play, { opacity: frames }, times, {
        duration: DURATION,
        still: { opacity: still },
      })}
    >
      {text}
    </motion.text>
  );
}

export function ProblemScene04({ play }: SceneProps) {
  const trips = AGENTS.map((agent, k) => {
    const s = start(k);
    return {
      dx: (agent.x - YOU.x) * REACH,
      dy: (agent.y - YOU.y) * REACH,
      times: [s, s + 0.12, s + 0.16, s + 0.2],
    };
  });
  const pulseTimes = [0, ...trips.flatMap((t) => t.times), 1];
  const pulse = (axis: "dx" | "dy") => [
    0,
    ...trips.flatMap((t) => [0, t[axis], t[axis], 0]),
    0,
  ];

  return (
    <SceneSvg play={play} duration={DURATION}>
      {/* Spokes */}
      {AGENTS.map((agent) => (
        <line
          key={agent.name}
          x1={YOU.x}
          y1={YOU.y}
          x2={agent.x}
          y2={agent.y}
          stroke={C.line}
          strokeDasharray="2 4"
        />
      ))}

      {/* Agents */}
      {AGENTS.map((agent, k) => {
        const s = start(k);
        const arrive = s + 0.12;
        const leave = s + 0.16;
        return (
          <g key={agent.name}>
            <rect
              x={agent.x - NODE_W / 2}
              y={agent.y - NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={7}
              fill={C.panel}
              stroke={C.line}
            />
            <text
              x={agent.x}
              y={agent.y - 3}
              fontSize={10.5}
              textAnchor="middle"
              fill={C.text}
            >
              {agent.name}
            </text>
            <Status
              x={agent.x}
              y={agent.y + 12}
              text={agent.status}
              fill={agent.tone}
              frames={[1, 1, 0, 0]}
              times={[0, arrive - 0.01, arrive + 0.01, 1]}
              still={1}
              play={play}
            />
            <Status
              x={agent.x}
              y={agent.y + 12}
              text="working"
              fill={C.green}
              frames={[0, 0, 1, 1, 0, 0]}
              times={[0, arrive - 0.01, arrive + 0.01, leave - 0.01, leave + 0.01, 1]}
              still={0}
              play={play}
            />
            <Status
              x={agent.x}
              y={agent.y + 12}
              text="waiting"
              fill={C.gray}
              frames={[0, 0, 1, 1]}
              times={[0, leave - 0.01, leave + 0.01, 1]}
              still={0}
              play={play}
            />
          </g>
        );
      })}

      {/* You */}
      <circle cx={YOU.x} cy={YOU.y} r={22} fill="#0a0a0d" stroke={C.text} />
      <text
        x={YOU.x}
        y={YOU.y + 4}
        fontSize={11}
        textAnchor="middle"
        fill={C.text}
      >
        YOU
      </text>

      {/* The pulse and its task label */}
      {play && (
        <motion.g
          {...loop(play, { x: pulse("dx"), y: pulse("dy") }, pulseTimes, {
            duration: DURATION,
          })}
        >
          <circle cx={YOU.x} cy={YOU.y} r={4} fill={C.orange} />
          {AGENTS.map((agent, k) => {
            const [s, , , end] = trips[k].times;
            return (
              <motion.text
                key={agent.name}
                x={YOU.x + 8}
                y={YOU.y - 8}
                fontSize={9.5}
                fill={C.orange}
                {...loop(
                  play,
                  { opacity: [0, 0, 1, 1, 0, 0] },
                  [0, s, s + 0.02, end - 0.02, end, 1],
                  { duration: DURATION },
                )}
              >
                {agent.task}
              </motion.text>
            );
          })}
        </motion.g>
      )}
    </SceneSvg>
  );
}
