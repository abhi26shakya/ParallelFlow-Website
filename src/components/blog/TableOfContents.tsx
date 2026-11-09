"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Heading } from "@/lib/blog";

// The heading the reader is in: the last one above a line 30% down the
// viewport.
function useActiveHeading(headings: Heading[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;
    let frame = 0;
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

  return activeId;
}

function HeadingList({
  headings,
  activeId,
  onNavigate,
}: {
  headings: Heading[];
  activeId: string | null;
  onNavigate?: () => void;
}) {
  return (
    <ol className="space-y-1 border-l border-line">
      {headings.map((h) => {
        const active = h.id === activeId;
        return (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={onNavigate}
              aria-current={active ? "location" : undefined}
              className={`-ml-px block border-l py-1 text-sm leading-snug transition-colors duration-200 pointer-coarse:py-3 ${
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
  );
}

// Sticky "On this page" list beside the post on desktop. The heading the
// reader is in is highlighted. The list never runs past the bottom of the
// screen (owner requests, 2026-11-09):
// - It scrolls on its own, with a thin scrollbar, so the reader can browse
//   every heading without moving the article; scrolling past its end
//   doesn't scroll the page (overscroll-contain).
// - It follows the reader, keeping the current heading in view. Only the
//   list scrolls, never the page.
// Soft fades at its edges show there is more above or below.
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const activeId = useActiveHeading(headings);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = list.current;
    const link = box?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!box || !link) return;
    const boxRect = box.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    // Keep the current heading in the middle band of the list.
    const margin = boxRect.height * 0.25;
    if (
      linkRect.top >= boxRect.top + margin &&
      linkRect.bottom <= boxRect.bottom - margin
    ) {
      return;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    box.scrollTo({
      top:
        box.scrollTop +
        (linkRect.top - boxRect.top) -
        (boxRect.height - linkRect.height) * 0.4,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [activeId]);

  return (
    <nav
      aria-label="On this page"
      className="flex max-h-[calc(100svh-var(--navbar-height)-6rem)] flex-col"
    >
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
        On this page
      </p>
      <div
        ref={list}
        className="mt-2 min-h-0 overflow-y-auto overscroll-contain py-2 [mask-image:linear-gradient(to_bottom,transparent,#000_12px,#000_calc(100%-24px),transparent)] pr-2 [scrollbar-color:var(--color-line)_transparent] [scrollbar-width:thin]"
      >
        <HeadingList headings={headings} activeId={activeId} />
      </div>
    </nav>
  );
}

// The same list for phones and tablets, where there is no room beside the
// post: a collapsed box above the article that closes once a heading is
// picked.
export function MobileTableOfContents({ headings }: { headings: Heading[] }) {
  const activeId = useActiveHeading(headings);
  const details = useRef<HTMLDetailsElement>(null);
  return (
    <details
      ref={details}
      className="group rounded-card border border-line bg-card"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
          On this page
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <nav aria-label="On this page" className="px-5 pb-5">
        <HeadingList
          headings={headings}
          activeId={activeId}
          onNavigate={() => details.current?.removeAttribute("open")}
        />
      </nav>
    </details>
  );
}
