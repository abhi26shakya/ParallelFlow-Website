"use client";

import { useEffect, useRef } from "react";

// Grains of sand flowing along a slowly turning Möbius strip: the Product page
// hero visual (owner spec, 2026-11-09). No surface is drawn; the shape comes
// only from the grains. A Möbius strip looks two-sided but is one surface, so
// a grain travels what looks like one side and arrives on the "other" without
// crossing an edge, as Private and Arena share one project context.
//
// Plain Canvas 2D, no libraries. The canvas fills its parent (give the parent
// a size and `position: relative`). Owner decisions that differ from the
// spec: the canvas is transparent instead of filled black, so it sits on the
// page background in both themes, and dark grain colours (the light theme)
// draw with normal blending instead of "lighter", which only works on dark
// backgrounds. Pass color="currentColor" to follow the CSS text colour; it is
// re-read when the theme changes.
//
// Grains are allocated once and re-seeded only when the grain count changes
// (the prop, or crossing the 640px narrow-screen cut). The frame loop
// allocates nothing. It pauses off screen and in hidden tabs, draws one still
// frame under prefers-reduced-motion or at speed 0, and caps each step at
// 50ms so returning to the tab doesn't jump.

const R = 1;
const W = 0.42; // half-width of the band
const F = 3.4; // focal distance
const BUCKETS = 12; // alpha levels, so alpha is set 12 times a frame, not per grain
const NARROW = 640;
const NARROW_SHARE = 0.4;
const MAX_STEP = 0.05;
// Grain record: u0, v, speed factor, jitter amplitude.
const STRIDE = 4;

function seed(count: number) {
  const data = new Float32Array(count * STRIDE);
  for (let i = 0; i < count; i++) {
    const r = Math.random() * 2 - 1;
    const o = i * STRIDE;
    data[o] = Math.random() * Math.PI * 4;
    // Pushed toward the edges so the silhouette reads crisply.
    data[o + 1] = Math.sign(r) * Math.pow(Math.abs(r), 0.8);
    data[o + 2] = 0.75 + Math.random() * 0.5;
    data[o + 3] = (Math.random() * 2 - 1) * 0.0175;
  }
  return data;
}

// Relative luminance (0 to 1) of a colour the canvas has normalised to
// "#rrggbb" or "rgba(r, g, b, a)".
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

type Props = {
  grains?: number;
  color?: string;
  speed?: number;
  className?: string;
};

export function MobiusSand({
  grains = 9000,
  color = "#e8d6ad",
  speed = 1,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Animation time in seconds, kept across prop changes.
  const timeRef = useRef(0);
  const speedRef = useRef(speed);
  // Set by the main effect, so the speed effect can start or stop the loop.
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
    let data = seed(count);

    // Resolved fill colour and blending, re-read when the theme changes.
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

    let width = 0;
    let height = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      const next = countFor();
      if (next !== count) {
        count = next;
        data = seed(count);
      }
    };
    resize();

    // Screen x, y, size and alpha bucket for each grain, reused every frame.
    let xs = new Float32Array(count);
    let ys = new Float32Array(count);
    let sizes = new Float32Array(count);
    let buckets = new Uint8Array(count);

    const draw = () => {
      if (xs.length !== count) {
        xs = new Float32Array(count);
        ys = new Float32Array(count);
        sizes = new Float32Array(count);
        buckets = new Uint8Array(count);
      }
      const t = timeRef.current;
      const spin = t * 0.18;
      const tilt = 1.05 + 0.12 * Math.sin(0.11 * t);
      const cs = Math.cos(spin);
      const ss = Math.sin(spin);
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      // The spec's 0.36 clips: with perspective the near side reaches 1.56
      // radii from the centre, which needs 0.29 to stay inside the canvas.
      const scale = 0.29 * Math.min(width, height);
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < count; i++) {
        const o = i * STRIDE;
        const u = data[o] + t * 0.35 * data[o + 2];
        const v = data[o + 1] + data[o + 3] * Math.sin(2 * t + i);
        const half = u / 2;
        const ring = R + v * W * Math.cos(half);
        const x = ring * Math.cos(u);
        const y = ring * Math.sin(u);
        const z = v * W * Math.sin(half);
        // Spin about z, then tilt about x.
        const x1 = x * cs - y * ss;
        const y1 = x * ss + y * cs;
        const y2 = y1 * ct - z * st;
        const z2 = y1 * st + z * ct;
        const k = F / (F + z2);
        const depth = Math.min(1, Math.max(0, (1 - z2) / 2));
        const alpha = 0.12 + 0.55 * depth;
        xs[i] = cx + x1 * scale * k;
        ys[i] = cy + y2 * scale * k;
        sizes[i] = (0.6 + 1.1 * depth) * dpr;
        buckets[i] = Math.min(
          BUCKETS - 1,
          Math.floor(((alpha - 0.12) / 0.55) * BUCKETS),
        );
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = blend;
      ctx.fillStyle = fill;
      for (let b = 0; b < BUCKETS; b++) {
        ctx.globalAlpha = 0.12 + 0.55 * ((b + 0.5) / BUCKETS);
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
      draw();
      frame = requestAnimationFrame(loop);
    };

    const sync = () => {
      const run =
        visible &&
        !document.hidden &&
        !reducedQuery.matches &&
        speedRef.current !== 0;
      if (run && !frame) {
        last = 0;
        frame = requestAnimationFrame(loop);
      } else if (!run) {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
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
    reducedQuery.addEventListener("change", sync);
    sync();

    return () => {
      cancelAnimationFrame(frame);
      syncRef.current = () => {};
      themeObserver.disconnect();
      resizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedQuery.removeEventListener("change", sync);
    };
  }, [grains, color]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Grains of sand flowing along a slowly turning Möbius strip, a surface whose two sides are one"
      className={`pointer-events-none absolute inset-0 block size-full text-foreground ${className}`}
    />
  );
}
