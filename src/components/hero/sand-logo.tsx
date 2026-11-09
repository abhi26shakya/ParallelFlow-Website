"use client";

import { useEffect, useRef } from "react";

// Sand grains (12,000 by default) that settle into the ParallelFlow logo cube, hold, then scatter,
// on a loop: the Product page hero visual (owner request, 2026-11-09, from
// the owner's "Sand builds the logo" reference). Grain targets are sampled
// from the real logo geometry (components/brand/Logo.tsx: the three faces,
// the tape strip, minus the tape cut-outs), denser along the edges so the
// box reads crisply. Faces get different brightness so it reads as 3D. Each
// grain starts at its own moment, so the sand pours in rather than snapping.
//
// Plain Canvas 2D, no libraries. The canvas fills its parent (give the parent
// a size and `position: relative`). For sand that drifts past the box and
// dissolves into the page, put the canvas in a larger wrapper and mark the
// logo's box with data-sand-box (see app/product/page.tsx). color="currentColor" follows the CSS
// text colour and is re-read when the theme changes; light grains on the
// dark theme blend with "lighter", dark grains on the light theme with normal
// blending. Grains are allocated once per grain count; the frame loop
// allocates nothing. It pauses off screen and in hidden tabs, and under
// prefers-reduced-motion (or speed 0) draws the settled logo as one still
// frame. Mouse hover matches the home page galaxy: a slight lean toward the
// mouse and a gentle ripple around it (see the hover block). Steps are capped at 50ms so returning to a tab doesn't jump.

// Must match LOGO_FACES / LOGO_TAPE_CUTS / LOGO_VIEWBOX in Logo.tsx.
const FACES = [
  [[512, 108], [794, 274], [512, 443], [230, 274]], // top
  [[215, 297], [497, 466], [497, 802], [215, 632]], // left
  [[809, 297], [527, 466], [527, 802], [809, 632]], // right
  [[397.5, 300], [322.5, 344.2], [322.5, 440], [391, 440], [391, 387.8], [489.2, 330]], // tape strip
] as const;
// Brightness per face: lit top, mid left, shaded right, tape like the top.
const FACE_LIGHT = [1, 0.78, 0.6, 0.95];
const TAPE_CUTS =
  "M737.3 100L366.4 318.3A90 90 0 0 0 322.5 395.1V541M795 150L432.5 363.4A85 85 0 0 0 391 435.9V584";
const VIEW = { x: 165, y: 108, size: 694 };

const EDGE_SHARE = 0.32; // share of grains placed along the face edges
const CYCLE = 9; // seconds: settle 0-2.6, hold 2.6-6, scatter 6-9
const SETTLE = 2.6;
const HOLD_END = 6;
const STAGGER = 1.2; // seconds of spread in each grain's start
const BUCKETS = 10;
const NARROW = 640;
const NARROW_SHARE = 0.4;
const MAX_STEP = 0.05;
const STILL_TIME = 4; // a settled moment, for the still frame
// How far each face shifts when the cube tilts toward the mouse, relative to
// the whole: the top face leads and the side faces lag, so it reads as 3D.
const FACE_DEPTH = [1.35, 0.85, 0.85, 1.35];
// Grain record: target x, y (logo units), face light, size, delay, seed,
// face depth.
const STRIDE = 7;

// A repeatable pseudo-random number in [0, 1) for grain i in cycle k.
function hash(i: number, k: number, salt: number) {
  const s = Math.sin(i * 12.9898 + k * 78.233 + salt * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

function seed(count: number, ctx: CanvasRenderingContext2D) {
  const data = new Float32Array(count * STRIDE);
  const faces = FACES.map((pts) => {
    const path = new Path2D();
    pts.forEach(([x, y], i) => (i ? path.lineTo(x, y) : path.moveTo(x, y)));
    path.closePath();
    return path;
  });
  const cuts = new Path2D(TAPE_CUTS);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.lineWidth = 36;
  ctx.lineCap = "round";
  const inCut = (x: number, y: number) => ctx.isPointInStroke(cuts, x, y);
  const faceAt = (x: number, y: number) =>
    faces.findIndex((path) => ctx.isPointInPath(path, x, y));

  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    let face = -1;
    for (let tries = 0; tries < 60 && face < 0; tries++) {
      if (Math.random() < EDGE_SHARE) {
        // A point on a random edge of a random face, nudged slightly inward.
        const f = FACES[Math.floor(Math.random() * 3)];
        const a = Math.floor(Math.random() * f.length);
        const [x1, y1] = f[a];
        const [x2, y2] = f[(a + 1) % f.length];
        const t = Math.random();
        x = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 6;
        y = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 6;
      } else {
        x = VIEW.x + Math.random() * VIEW.size;
        y = VIEW.y + Math.random() * VIEW.size;
      }
      if (inCut(x, y)) continue;
      face = faceAt(x, y);
    }
    if (face < 0) face = 0;
    const o = i * STRIDE;
    data[o] = x;
    data[o + 1] = y;
    data[o + 2] = FACE_LIGHT[face] * (0.62 + Math.random() * 0.38);
    data[o + 3] = 1 + Math.pow(Math.random(), 2) * 1.2;
    data[o + 4] = Math.random() * STAGGER;
    data[o + 5] = Math.random() * 1000;
    data[o + 6] = FACE_DEPTH[face];
  }
  ctx.restore();
  return data;
}

// Relative luminance (0 to 1) of a colour the canvas normalised to "#rrggbb"
// or "rgba(r, g, b, a)".
function luminance(normalised: string) {
  let rgb: number[];
  if (normalised.startsWith("#")) {
    const n = parseInt(normalised.slice(1, 7), 16);
    rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  } else {
    rgb = (normalised.match(/[\d.]+/g) ?? ["255", "255", "255"])
      .slice(0, 3)
      .map(Number);
  }
  return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
}

// Where grain i sits when scattered in cycle c: blown outward from the
// centre, with a little sideways and downward drift. Written into `spot` so
// the frame loop allocates nothing.
const spot = new Float32Array(2);
function scatter(
  i: number,
  c: number,
  tx: number,
  ty: number,
  cx: number,
  cy: number,
  side: number,
) {
  const ang = Math.atan2(ty - cy, tx - cx) + (hash(i, c, 1) - 0.5) * 1.6;
  const r = side * (0.12 + hash(i, c, 2) * 0.42);
  spot[0] = tx + Math.cos(ang) * r + (hash(i, c, 3) - 0.5) * side * 0.18;
  spot[1] = ty + Math.sin(ang) * r + (hash(i, c, 4) - 0.3) * side * 0.12;
}

// A per-frame easing rate at 60fps, scaled to a frame of `step` seconds.
const ease = (rate: number, step: number) => 1 - Math.pow(1 - rate, step * 60);

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

type Props = {
  grains?: number;
  color?: string;
  speed?: number;
  className?: string;
};

export function SandLogo({
  grains = 12000,
  color = "currentColor",
  speed = 1,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(STILL_TIME);
  const speedRef = useRef(speed);
  const syncRef = useRef<() => void>(() => {});

  useEffect(() => {
    speedRef.current = speed;
    syncRef.current();
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const requested = Math.max(0, Math.round(grains));
    const countFor = () =>
      window.innerWidth < NARROW
        ? Math.round(requested * NARROW_SHARE)
        : requested;
    let count = countFor();
    let data = seed(count, ctx);
    let xs = new Float32Array(count);
    let ys = new Float32Array(count);
    let sizes = new Float32Array(count);
    let buckets = new Uint8Array(count);

    let fill = "#ffffff";
    let blend: GlobalCompositeOperation = "lighter";
    // "currentColor" resolves to the theme's --color-foreground. The
    // variable is read, not the computed `color`, because right after the
    // theme toggles the computed colour still holds the old theme's value
    // for a moment, which left white grains on the light theme.
    const readColor = () => {
      const themed =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-foreground")
          .trim() || getComputedStyle(canvas).color;
      ctx.fillStyle = color === "currentColor" ? themed : color;
      fill = ctx.fillStyle as string;
      blend = luminance(fill) > 0.5 ? "lighter" : "source-over";
    };
    readColor();

    let width = 1;
    let height = 1;
    let dpr = 1;
    // The logo's box inside the canvas, in device pixels. The nearest
    // ancestor marked data-sand-box sets it; the canvas can be larger than
    // that box so scattered sand drifts past it and fades out instead of
    // being cut off at a rectangle. Without one, the box is the canvas.
    let boxX = 0;
    let boxY = 0;
    let boxW = 1;
    let boxH = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      const own = canvas.getBoundingClientRect();
      const box =
        canvas.parentElement
          ?.closest("[data-sand-box]")
          ?.getBoundingClientRect() ?? own;
      boxX = (box.left - own.left) * dpr;
      boxY = (box.top - own.top) * dpr;
      boxW = Math.max(1, box.width * dpr);
      boxH = Math.max(1, box.height * dpr);
      const next = countFor();
      if (next !== count) {
        count = next;
        data = seed(count, ctx);
        xs = new Float32Array(count);
        ys = new Float32Array(count);
        sizes = new Float32Array(count);
        buckets = new Uint8Array(count);
      }
    };
    resize();

    // Hover, matching the home page galaxy (components/home/HeroGalaxy.tsx,
    // owner request, 2026-11-09). Two parts, both eased with the galaxy's
    // per-frame rates:
    // - Tilt: wherever the mouse is on the page, the cube leans a little
    //   toward it (the galaxy's yaw/pitch, as a small parallax shift; the top
    //   face moves more than the sides).
    // - Ripple: over the canvas, grains near the pointer ease outward up to
    //   16px with a gentle travelling wave, the galaxy's exact falloff.
    // Mouse only; off under reduced motion. The canvas ignores pointer
    // events (so the copy stays clickable), so the pointer is tracked on the
    // window and mapped into the canvas.
    let tiltTargetX = 0; // -0.5 to 0.5 across the window
    let tiltTargetY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let pointerX = -9999; // target, device px in the canvas
    let pointerY = -9999;
    let hoverX = -9999; // smoothed position
    let hoverY = -9999;
    let hoverOn = 0; // 1 while the mouse is over the canvas
    let hover = 0; // smoothed strength, 0 to 1
    let clock = 0; // real seconds, for the ripple wave

    const draw = () => {
      const t = timeRef.current;
      const side = Math.min(boxW, boxH);
      const scale = (side * 0.84) / VIEW.size;
      const ox = boxX + (boxW - VIEW.size * scale) / 2 - VIEW.x * scale;
      const oy = boxY + (boxH - VIEW.size * scale) / 2 - VIEW.y * scale;
      const cx = boxX + boxW / 2;
      const cy = boxY + boxH / 2;
      // Grains fade to nothing toward the canvas edges, across the margin
      // outside the logo's box (at least 48px), so there is no hard edge.
      const fadeX = Math.max(48 * dpr, boxX, width - boxX - boxW);
      const fadeY = Math.max(48 * dpr, boxY, height - boxY - boxH);
      // The galaxy's numbers, in CSS px: up to 16px of push, Gaussian falloff
      // exp(-d^2 / 16200), and a wave of 0.8 to 1 along the distance.
      const pushMax = 16 * dpr;
      const spread = 16200 * dpr * dpr;
      const reach2 = spread * 6; // beyond this the push is under 0.1px
      // Tilt shift: the galaxy turns up to 0.08 rad sideways and 0.04 up and
      // down; here that is a lean of up to about 2.6% and 1.3% of the box.
      const leanX = tiltX * side * 0.052;
      const leanY = tiltY * side * 0.026;

      for (let i = 0; i < count; i++) {
        const o = i * STRIDE;
        const tx = ox + data[o] * scale;
        const ty = oy + data[o + 1] * scale;
        const local = t - data[o + 4];
        const k = Math.floor(local / CYCLE);
        const phase = local - k * CYCLE;

        let x: number;
        let y: number;
        let settled: number; // 1 in the logo, 0 fully scattered
        if (phase < SETTLE) {
          const p = easeOut(phase / SETTLE);
          scatter(i, k, tx, ty, cx, cy, side);
          x = spot[0] + (tx - spot[0]) * p;
          y = spot[1] + (ty - spot[1]) * p;
          settled = p;
        } else if (phase < HOLD_END) {
          // A faint shimmer while the logo holds.
          const s = Math.sin(t * 2.2 + data[o + 5]) * 0.35 * dpr;
          x = tx + s;
          y = ty + Math.cos(t * 1.7 + data[o + 5]) * 0.35 * dpr;
          settled = 1;
        } else {
          const p = easeInOut((phase - HOLD_END) / (CYCLE - HOLD_END));
          scatter(i, k + 1, tx, ty, cx, cy, side);
          x = tx + (spot[0] - tx) * p;
          y = ty + (spot[1] - ty) * p;
          settled = 1 - p;
        }

        // Lean toward the mouse, more for the top face than the sides.
        x += leanX * data[o + 6];
        y += leanY * data[o + 6];

        // Ripple: ease outward from the pointer, like the home galaxy.
        if (hover > 0.001) {
          const dx = x - hoverX;
          const dy = y - hoverY;
          const d2 = dx * dx + dy * dy;
          if (d2 < reach2) {
            const d = Math.sqrt(d2) || 1;
            const push =
              hover *
              pushMax *
              Math.exp(-d2 / spread) *
              (0.8 + 0.2 * Math.sin((d / dpr) * 0.05 - clock * 1.6));
            x += (dx / d) * push;
            y += (dy / d) * push;
          }
        }

        xs[i] = x;
        ys[i] = y;
        sizes[i] = data[o + 3] * dpr;
        let edge =
          Math.min(1, Math.max(0, Math.min(x, width - x) / fadeX)) *
          Math.min(1, Math.max(0, Math.min(y, height - y) / fadeY));
        edge = edge * edge * (3 - 2 * edge);
        const alpha = data[o + 2] * (0.32 + 0.68 * settled) * edge;
        // Bucket 255 = invisible (faded out at the edge), never drawn.
        buckets[i] =
          alpha < 0.02 ? 255 : Math.min(BUCKETS - 1, Math.floor(alpha * BUCKETS));
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = blend;
      ctx.fillStyle = fill;
      for (let b = 0; b < BUCKETS; b++) {
        ctx.globalAlpha = (b + 0.5) / BUCKETS;
        for (let i = 0; i < count; i++) {
          if (buckets[i] !== b) continue;
          const s = sizes[i];
          ctx.fillRect(xs[i] - s / 2, ys[i] - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let last = 0;

    const loop = (now: number) => {
      const step = last ? Math.min((now - last) / 1000, MAX_STEP) : 0;
      last = now;
      timeRef.current += step * speedRef.current;
      clock += step;
      // The galaxy's per-frame easing (0.045 tilt, 0.08 pointer, 0.05
      // strength at 60fps), scaled to the real frame time.
      tiltX += (tiltTargetX - tiltX) * ease(0.045, step);
      tiltY += (tiltTargetY - tiltY) * ease(0.045, step);
      if (hoverX < -9000) {
        hoverX = pointerX;
        hoverY = pointerY;
      }
      hoverX += (pointerX - hoverX) * ease(0.08, step);
      hoverY += (pointerY - hoverY) * ease(0.08, step);
      hover += (hoverOn - hover) * ease(0.05, step);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const sync = () => {
      const still = reducedQuery.matches;
      const run =
        visible && !document.hidden && !still && speedRef.current !== 0;
      if (run && !frame) {
        last = 0;
        frame = requestAnimationFrame(loop);
      } else if (!run) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        // Reduced motion shows the settled logo, not a scattered moment,
        // upright and with no ripple.
        if (still) {
          timeRef.current = STILL_TIME + STAGGER;
          tiltX = tiltY = tiltTargetX = tiltTargetY = 0;
          hover = hoverOn = 0;
        }
        draw();
      }
    };
    syncRef.current = sync;

    const themeObserver = new MutationObserver(() => {
      readColor();
      if (!frame) draw();
    });
    if (color === "currentColor") {
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });
    }
    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!frame) draw();
    });
    resizeObserver.observe(canvas);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    viewObserver.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reducedQuery.matches) return;
      const r = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= r.left &&
        event.clientX <= r.right &&
        event.clientY >= r.top &&
        event.clientY <= r.bottom;
      tiltTargetX = event.clientX / window.innerWidth - 0.5;
      tiltTargetY = event.clientY / window.innerHeight - 0.5;
      pointerX = (event.clientX - r.left) * dpr;
      pointerY = (event.clientY - r.top) * dpr;
      hoverOn = inside ? 1 : 0;
    };
    const onPointerLeave = () => {
      hoverOn = 0;
      tiltTargetX = 0;
      tiltTargetY = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    reducedQuery.addEventListener("change", sync);
    sync();

    return () => {
      cancelAnimationFrame(frame);
      syncRef.current = () => {};
      themeObserver.disconnect();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      reducedQuery.removeEventListener("change", sync);
    };
  }, [grains, color]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Grains of sand settling into the ParallelFlow logo, a box, then scattering again"
      className={`pointer-events-none absolute inset-0 block size-full text-foreground ${className}`}
    />
  );
}
