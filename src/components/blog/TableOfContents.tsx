"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog";

// Sticky "On this page" list beside the post on desktop. The heading the
// reader is in is highlighted.
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;
    let frame = 0;
    // The active heading is the last one above a line 30% down the viewport.
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      const passed = elements.filter(
        (el) => el.getBoundingClientRect().top <= line,
      );
      setActiveId(passed.at(-1)?.id ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
        On this page
      </p>
      <ol className="mt-4 space-y-1 border-l border-line">
        {headings.map((h) => {
          const active = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px block border-l py-1 text-sm leading-snug transition-colors duration-200 ${
                  h.level === 3 ? "pl-7" : "pl-4"
                } ${
                  active
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
