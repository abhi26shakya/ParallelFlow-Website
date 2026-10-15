"use client";

import { type RefObject, useEffect } from "react";

// Hover for the Problems and Solution cards: while a mouse is over the card it
// sets data-hover and the pointer position as --pf-hover-x / --pf-hover-y (0
// to 1), written once per frame without re-rendering. The CSS tilts the frame
// and moves a sheen with them. Off for touch and under reduced motion.
export function useCardHover(
  ref: RefObject<HTMLElement | null>,
  reduced: boolean,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !window.matchMedia("(hover: hover)").matches) return;

    let raf = 0;
    let x = 0.5;
    let y = 0.5;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--pf-hover-x", x.toFixed(4));
      el.style.setProperty("--pf-hover-y", y.toFixed(4));
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = el.getBoundingClientRect();
      x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
      y = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height));
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const enter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      move(event);
      el.dataset.hover = "true";
    };

    const leave = () => {
      delete el.dataset.hover;
    };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      delete el.dataset.hover;
      el.style.removeProperty("--pf-hover-x");
      el.style.removeProperty("--pf-hover-y");
    };
  }, [ref, reduced]);
}
