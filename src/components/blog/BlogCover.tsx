import { LogoMark } from "@/components/brand/Logo";

// Generated cover for posts without an image: a dot field whose sizes follow
// a wave pattern seeded from the post's slug, so each post gets its own
// monochrome cover and the same slug always draws the same one.

const COLS = 32;
const ROWS = 20;
const GAP = 10;

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRandom(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Two pattern families, picked by the seed: crossing waves or rings
// around an off-centre point.
function dots(seed: string) {
  const random = seededRandom(hash(seed));
  const rings = random() < 0.5;
  const waves = Array.from({ length: 3 }, () => ({
    fx: 0.08 + random() * 0.25,
    fy: 0.08 + random() * 0.3,
    phase: random() * Math.PI * 2,
  }));
  const center = { x: random() * COLS, y: random() * ROWS };
  const ringFrequency = 0.45 + random() * 0.4;
  const result: { x: number; y: number; r: number }[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // v is -1..1.
      const v = rings
        ? Math.sin(
            Math.hypot(col - center.x, row - center.y) * ringFrequency +
              waves[0].phase,
          )
        : waves.reduce(
            (sum, w) => sum + Math.sin(col * w.fx + row * w.fy + w.phase),
            0,
          ) / waves.length;
      // Only the upper part of the wave draws, so the field has open areas
      // as well as dense ones.
      const r = Math.max(0, v + 0.15) * 3.4;
      if (r > 0.35) {
        result.push({
          x: col * GAP + GAP / 2,
          y: row * GAP + GAP / 2,
          r: Math.round(r * 100) / 100,
        });
      }
    }
  }
  return result;
}

export function BlogCover({
  seed,
  label,
  className = "relative",
}: {
  seed: string;
  label?: string;
  // Include a position class ("relative" or "absolute ...").
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden bg-card text-foreground ${className}`}
    >
      <svg
        viewBox={`0 0 ${COLS * GAP} ${ROWS * GAP}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full opacity-70 light:opacity-80"
      >
        {dots(seed).map((d) => (
          <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={d.r} fill="currentColor" />
        ))}
      </svg>
      <span className="absolute left-4 top-4 rounded-control border border-line bg-card p-1.5">
        <LogoMark className="block size-3.5 text-foreground/80" />
      </span>
      {label && (
        <span className="absolute bottom-4 left-4 rounded-pill border border-line bg-card px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-foreground/80">
          {label}
        </span>
      )}
    </div>
  );
}
