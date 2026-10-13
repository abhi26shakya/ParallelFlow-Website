"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { NAV_GROUPS } from "@/lib/nav";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { NavItemRow } from "./NavItemRow";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      // Escape over the waitlist modal closes only the modal, so focus can
      // return to the menu's Join Waitlist button.
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-10 items-center justify-center rounded-control text-foreground hover:bg-hover"
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--navbar-height))] overflow-y-auto border-b border-line bg-background px-4 pb-6 pt-2"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="py-2">
              <p className="px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted">
                {group.label}
              </p>
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>
                    <NavItemRow item={item} onSelect={() => setOpen(false)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <WaitlistButton className="mt-3 w-full" />
        </div>
      )}
    </div>
  );
}
