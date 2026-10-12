"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { NavGroup } from "@/lib/nav";
import { NavItemRow } from "./NavItemRow";

// Opens on click/tap and on mouse hover. Closes on Escape, outside click,
// or when focus leaves the dropdown.
export function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // True while the panel is open only because the mouse is hovering, so the
  // first click pins it open instead of toggling it shut.
  const hoverOpened = useRef(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        hoverOpened.current = true;
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        hoverOpened.current = false;
        setOpen(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (hoverOpened.current) {
            hoverOpened.current = false;
            return;
          }
          setOpen((v) => !v);
        }}
        className="inline-flex items-center gap-1 rounded-control px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover"
      >
        {group.label}
        <ChevronDown
          aria-hidden="true"
          className={`size-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute left-0 top-full min-w-56 pt-2"
        >
          <ul className="rounded-card border border-line bg-card p-1.5">
            {group.items.map((item) => (
              <li key={item.label}>
                <NavItemRow item={item} onSelect={() => setOpen(false)} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
