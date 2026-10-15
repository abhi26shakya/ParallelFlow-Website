"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { NavGroup } from "@/lib/nav";
import { NAV_ITEM_CLASS, NavItemRow } from "./NavItemRow";

// A navbar group that opens a full-width panel under the bar, after
// openai.com: the group label in muted text above large links (or, for
// Product, rich rows after x.ai's Products menu), with the page
// behind blurred and dimmed. Opens on click/tap and on mouse hover. Closes on
// Escape, outside click, when the pointer moves onto the dimmed page, or when
// focus leaves the dropdown. A group with its own `href` (Product) has a
// link as its trigger: hovering opens the panel and clicking goes to the page.
export function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  // True while the panel is open only because the mouse is hovering, so the
  // first click pins it open instead of toggling it shut.
  const hoverOpened = useRef(false);
  const panelId = useId();
  // Groups whose items have one-liners (Product) list them as rich rows.
  const rich = group.items.some((item) => item.description);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = () => {
    hoverOpened.current = false;
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className="h-full"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        hoverOpened.current = true;
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        close();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        setOpen(false);
        // The panel unmounts, so keep focus on the trigger instead of losing it.
        buttonRef.current?.focus();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      {group.href ? (
        <Link
          ref={buttonRef}
          href={group.href}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={close}
          className={NAV_ITEM_CLASS}
        >
          {group.label}
        </Link>
      ) : (
        <button
          ref={buttonRef}
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
          className={NAV_ITEM_CLASS}
        >
          {group.label}
        </button>
      )}
      {open && (
        <>
          {/* The page below the panel, blurred and dimmed. Moving onto it or
              clicking it closes the panel. */}
          <div
            aria-hidden="true"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") close();
            }}
            onClick={close}
            className="fixed inset-x-0 bottom-0 top-(--navbar-height) bg-background/40 backdrop-blur-md motion-safe:animate-fade-in"
          />
          <div
            id={panelId}
            className="fixed inset-x-0 top-(--navbar-height) bg-background px-4 pb-10 pt-6 sm:px-6 lg:px-8 motion-safe:animate-fade-in"
          >
            <p className="text-sm text-muted">{group.label}</p>
            {rich ? (
              <ul className="-mx-4 mt-3 max-w-sm space-y-1">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <NavItemRow item={item} onSelect={close} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <NavItemRow item={item} onSelect={close} size="large" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
