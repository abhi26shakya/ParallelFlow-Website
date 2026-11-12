"use client";

import { useEffect, useState } from "react";
import { SUBNAV } from "@/content/product-page";

// The Product page's sticky sub-navigation, under the navbar: one link per
// tour section. The link of the section in view is highlighted. On narrow
// screens the links scroll sideways inside the bar. Its height is
// --subnav-height (globals.css), which the page's scroll padding includes so
// anchors land below both bars.
export function ProductSubnav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = SUBNAV.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    // A section counts as current while it crosses a line 40% down the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -60% 0px" },
    );
    for (const el of sections) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Product sections"
      data-subnav
      className="sticky top-[var(--navbar-height)] z-30 h-[var(--subnav-height)] border-y border-line bg-background/90 backdrop-blur"
    >
      <ul className="mx-auto flex h-full max-w-7xl items-center gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:px-6">
        {SUBNAV.map(({ id, label }) => (
          <li key={id} className="shrink-0">
            <a
              href={`#${id}`}
              aria-current={active === id ? "true" : undefined}
              className="block rounded-pill px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground aria-[current]:bg-hover aria-[current]:text-foreground"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
