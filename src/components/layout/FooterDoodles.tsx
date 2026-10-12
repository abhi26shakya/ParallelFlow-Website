import type { CSSProperties } from "react";

// Line doodles for the footer, drawn in the site's greys. Every one is
// decorative (its container is aria-hidden) and only moves under
// motion-safe:, so with reduced motion each one shows its resting pose.

const line =
  "fill-none [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.5]";

// Tiny walker for the HUMANS lane. Bobs as it goes.
export function TinyHuman({ delay }: { delay: string }) {
  return (
    <svg
      viewBox="0 0 10 16"
      className={`h-4 w-2.5 ${line} stroke-foreground [stroke-width:1.2] motion-safe:animate-bob`}
      style={{ animationDelay: delay }}
    >
      <circle cx="5" cy="3" r="2.2" />
      <path d="M5 5.2v5M5 7l-3 2M5 7l3 2M5 10.2l-2.5 5M5 10.2l2.5 5" />
    </svg>
  );
}

// Tiny robot for the AGENTS lane. Bobs a little faster than the walker.
export function TinyAgent({ delay }: { delay: string }) {
  return (
    <svg
      viewBox="0 0 12 16"
      className={`h-4 w-3 ${line} stroke-foreground [stroke-width:1.2] motion-safe:animate-bob-fast`}
      style={{ animationDelay: delay }}
    >
      <path d="M6 3V1.2M4.5 14v1.5M7.5 14v1.5" />
      <rect x="2" y="3" width="8" height="6" rx="1.5" />
      <circle cx="4.5" cy="6" r="0.6" className="fill-foreground" />
      <circle cx="7.5" cy="6" r="0.6" className="fill-foreground" />
      <rect x="3" y="10" width="6" height="4" rx="1" />
    </svg>
  );
}

// A person and an agent high-fiving at the end of the lanes. Their arms swing
// in from the shoulder, meet, and the spark flashes on contact.
export function HighFive() {
  return (
    <svg viewBox="0 0 96 48" className={`h-14 w-28 shrink-0 ${line} stroke-muted`}>
      {/* Person */}
      <circle cx="20" cy="10" r="5" />
      <path d="M20 15v17M20 20l-8 6M20 32l-6 12M20 32l6 12" />
      <path
        d="M20 20l12-6"
        className="origin-[20px_20px] motion-safe:animate-high-five"
        style={{ "--swing": "35deg" } as CSSProperties}
      />
      {/* Agent */}
      <path d="M68 9V5M78 27l6 6M63 37v7M73 37v7" />
      <circle cx="68" cy="3.5" r="1.5" className="fill-muted" />
      <rect x="60" y="9" width="16" height="12" rx="3" />
      <circle cx="65" cy="15" r="1" className="fill-muted" />
      <circle cx="71" cy="15" r="1" className="fill-muted" />
      <rect x="58" y="23" width="20" height="14" rx="3" />
      <path
        d="M58 27l-12-13"
        className="origin-[58px_27px] motion-safe:animate-high-five"
        style={{ "--swing": "-35deg" } as CSSProperties}
      />
      {/* Spark */}
      <path
        d="M39 4v4M33.5 7l2.5 2.5M44.5 7L42 9.5"
        className="stroke-foreground motion-safe:animate-spark"
      />
    </svg>
  );
}

// Idea to finished work: a light bulb, a dashed arrow flowing right, and a
// box whose tick draws itself in.
export function IdeaToDone() {
  return (
    <svg viewBox="0 0 120 40" className={`h-10 w-30 shrink-0 ${line} stroke-muted`}>
      {/* Bulb */}
      <path d="M14 26c-3-2-5-5-5-9a8 8 0 0 1 16 0c0 4-2 7-5 9v3h-6zM14 33h6" />
      <path
        d="M17 3v2.5M6 8l1.8 1.8M28 8l-1.8 1.8"
        className="stroke-foreground motion-safe:animate-pulse"
      />
      {/* Arrow */}
      <path
        d="M36 20h44"
        className="[stroke-dasharray:3_4] motion-safe:animate-dash-flow"
      />
      <path d="M76 15l5 5-5 5" />
      {/* Done */}
      <rect x="90" y="7" width="26" height="26" rx="5" />
      <path
        d="M96 20.5l5 5 9.5-11"
        pathLength={1}
        className="stroke-foreground [stroke-dasharray:1] motion-safe:animate-draw-check"
      />
    </svg>
  );
}
