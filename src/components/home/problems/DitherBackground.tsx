"use client";

import { useEffect, useRef } from "react";

// The Problems card's background: a colour field quantized into square dots
// with a 4×4 Bayer ordered dither. Indigo at the top, a violet glow hugging
// the sides of the frame and a sunset glow under it. While `play` is on it
// shimmers at about 20fps; it also stops while the tab is hidden. Otherwise
// it holds one still frame. Owner-approved colour exception (2026-10-15).

// CSS px per dot cell, and the dark gap between dots.
const CELL = 5;
const GAP = 1;
const FRAME_MS = 50;
// Brightness levels a dot can take, including off.
const LEVELS = 4;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => (v + 0.5) / 16,
);

type RGB = [number, number, number];

const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16) / 255,
  parseInt(h.slice(3, 5), 16) / 255,
  parseInt(h.slice(5, 7), 16) / 255,
];
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const NAVY = hex("#1b1f5e");
const INDIGO = hex("#2a2f8a");
const VIOLET = hex("#8b7cf0");
const LAVENDER = hex("#b9a6ff");
const PEACH = hex("#f0a37a");
const ORANGE = hex("#e98a5a");
const GOLD = hex("#f5c27a");
const MAGENTA = hex("#6e2448");
const BROWN = hex("#3a1c12");

// The frame's box as card fractions (matches .pf-problems-frame).
const LEFT = 0.08;
const RIGHT = 0.92;
const TOP = 0.225;
const BOTTOM = 0.775;

// Colour at (u, v) in the card, 0 to 1 each way, at time t in seconds.
function field(u: number, v: number, t: number): RGB {
  const breathe = 1 + 0.1 * Math.sin(t * 0.9);
  const drift = 0.06 * Math.sin(u * 7 + t * 0.5 + Math.sin(v * 5 - t * 0.3));

  // Indigo above the frame, fading to black at the very top.
  const top = smooth(0, 0.14, v) * (1 - smooth(TOP + 0.02, TOP + 0.2, v)) * 2;
  const topColour = mix(NAVY, INDIGO, smooth(0.03, TOP + 0.1, v));

  // Violet hugging the frame's left and right edges.
  const edge = Math.min(Math.abs(u - LEFT), Math.abs(u - RIGHT));
  const sideMask = smooth(TOP - 0.05, TOP + 0.08, v) * (1 - smooth(BOTTOM - 0.04, BOTTOM + 0.12, v));
  const side = Math.exp(-edge / 0.04) * sideMask * 0.95 * breathe;
  const sideColour = mix(VIOLET, LAVENDER, Math.exp(-edge / 0.015));

  // Sunset under the frame: brightest just below it, darker in the corners.
  const below = Math.max(0, v - BOTTOM);
  const centred = 1 - Math.abs(u - 0.5) * 2;
  const bottom =
    Math.exp(-below / 0.17) *
    smooth(BOTTOM - 0.01, BOTTOM + 0.03, v) *
    (0.65 + 0.55 * centred) *
    breathe;
  let warm = mix(mix(GOLD, PEACH, smooth(0, 0.12, below)), ORANGE, smooth(0.1, 0.28, below));
  warm = mix(
    warm,
    mix(MAGENTA, BROWN, smooth(0.15, 0.35, below)),
    (1 - smooth(0.1, 0.65, centred)) * smooth(0.04, 0.3, below),
  );

  const r = topColour[0] * top + sideColour[0] * side + warm[0] * bottom;
  const g = topColour[1] * top + sideColour[1] * side + warm[1] * bottom;
  const b = topColour[2] * top + sideColour[2] * side + warm[2] * bottom;
  const scale = 1 + drift;
  return [r * scale, g * scale, b * scale];
}

export function DitherBackground({ play }: { play: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const small = document.createElement("canvas");
    const smallCtx = small.getContext("2d");
    if (!smallCtx) return;

    let cols = 0;
    let rows = 0;
    let cellPx = 1;
    let image: ImageData | null = null;
    let gaps: CanvasPattern | null = null;
    let raf = 0;
    let last = 0;
    const born = performance.now();

    const draw = (now: number) => {
      if (!image || !gaps) return;
      const t = (now - born) / 1000;
      const data = image.data;
      const w = canvas.width;
      const h = canvas.height;
      for (let j = 0; j < rows; j++) {
        const v = ((j + 0.5) * cellPx) / h;
        for (let i = 0; i < cols; i++) {
          const u = ((i + 0.5) * cellPx) / w;
          const [r, g, b] = field(u, v, t);
          const shimmer =
            0.06 * Math.sin(i * 1.7 + j * 2.3 + t * 1.6) * Math.sin(i * 0.9 - j * 1.3 + t * 1.1);
          const peak = Math.max(r, g, b, 1e-4);
          const level =
            Math.floor(clamp(peak + shimmer) * (LEVELS - 1) + BAYER[(j % 4) * 4 + (i % 4)]) /
            (LEVELS - 1);
          const k = (Math.min(level, 1) / peak) * 255;
          const p = (j * cols + i) * 4;
          data[p] = Math.min(255, r * k);
          data[p + 1] = Math.min(255, g * k);
          data[p + 2] = Math.min(255, b * k);
          data[p + 3] = 255;
        }
      }
      smallCtx.putImageData(image, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, cols * cellPx, rows * cellPx);
      ctx.fillStyle = gaps;
      ctx.fillRect(0, 0, w, h);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const box = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(box.width * dpr));
      canvas.height = Math.max(1, Math.round(box.height * dpr));
      cellPx = Math.max(2, Math.round(CELL * dpr));
      const gapPx = Math.max(1, Math.round(GAP * dpr));
      cols = Math.ceil(canvas.width / cellPx);
      rows = Math.ceil(canvas.height / cellPx);
      small.width = cols;
      small.height = rows;
      image = smallCtx.createImageData(cols, rows);

      // One cell with its gap on the right and bottom edges, tiled.
      const tile = document.createElement("canvas");
      tile.width = cellPx;
      tile.height = cellPx;
      const tileCtx = tile.getContext("2d");
      if (!tileCtx) return;
      tileCtx.fillStyle = "#000";
      tileCtx.fillRect(cellPx - gapPx, 0, gapPx, cellPx);
      tileCtx.fillRect(0, cellPx - gapPx, cellPx, gapPx);
      gaps = ctx.createPattern(tile, "repeat");
      draw(last || born);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < FRAME_MS) return;
      last = now;
      draw(now);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (play && !document.hidden) raf = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [play]);

  return (
    <canvas ref={ref} aria-hidden="true" className="pf-problems-canvas" />
  );
}
