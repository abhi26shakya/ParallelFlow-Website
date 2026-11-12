"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import {
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ROLES } from "@/content/home";
import "./built-for.css";

// "Built for [role]" below "The Solution". Four role tabs drive the rotating
// headline phrase and the detail card. On screens wide and tall enough (the
// `pin` variant in globals.css) a tall wrapper pins the section while the
// visitor scrolls, and scroll position picks the role, 01 to 04. Clicking a
// tab scrolls to its stretch. Elsewhere the roles advance every 2.8s from 01,
// pausing while the section is hovered, holds focus or is off screen, and
// stopping for good once the visitor picks a role. Under reduced motion
// nothing advances on its own and nothing animates. Every variant is
// stacked in one grid cell (built-for.css), so the headline and card keep the
// height of the longest one and the page below never moves.

const ITEMS = ROLES.items;
const COUNT = ITEMS.length;
const INTERVAL = 2800;
// Same query as the `pin` variant in globals.css.
const PIN_QUERY = "(width >= 64rem) and (height >= 42rem)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const roleAt = (value: number) =>
  Math.min(COUNT - 1, Math.max(0, Math.floor(value * COUNT)));

const tabId = (index: number) => `built-for-tab-${index + 1}`;
const PANEL_ID = "built-for-panel";

// A media query as state. False on the server and during hydration.
function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// All four variants in one grid cell. Only the active one shows; the rest
// are hidden from assistive tech and can't take focus.
function Swap({
  active,
  render,
}: {
  active: number;
  render: (item: (typeof ITEMS)[number]) => ReactNode;
}) {
  return (
    <div className="pf-builtfor-stack">
      {ITEMS.map((item, index) => (
        <div
          key={item.number}
          className="pf-builtfor-swap"
          data-active={index === active}
          aria-hidden={index !== active}
          inert={index !== active}
        >
          {render(item)}
        </div>
      ))}
    </div>
  );
}

function ColumnLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[13px] tracking-[0.04em] text-muted">
      {children}
    </p>
  );
}

export function BuiltFor() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  // After a click, ignores scroll updates for other roles until the smooth
  // scroll arrives (or 1.2s pass), so the roles it passes don't flash by.
  const scrollLock = useRef<number | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const pinned = useMedia(PIN_QUERY);
  const reduced = useMedia(REDUCED_QUERY);

  const playing =
    !pinned && !picked && !reduced && !hovered && !focused && inView;

  // 0 to 1 across the pinned stretch; each role owns an equal share.
  const { scrollYProgress: progress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(progress, "change", (value) => {
    if (!pinned) return;
    const role = roleAt(value);
    if (scrollLock.current !== null) {
      if (role !== scrollLock.current) return;
      scrollLock.current = null;
    }
    setActive(role);
  });

  // Picks up the scroll position when pinning starts.
  useEffect(() => {
    if (!pinned) return;
    const frame = requestAnimationFrame(() =>
      setActive(roleAt(progress.get())),
    );
    return () => cancelAnimationFrame(frame);
  }, [pinned, progress]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () => setActive((index) => (index + 1) % COUNT),
      INTERVAL,
    );
    return () => clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(lockTimer.current);
    };
  }, []);

  const select = (index: number) => {
    setActive(index);
    setPicked(true);
    const wrapper = wrapperRef.current;
    if (!pinned || !wrapper) return;
    const top = wrapper.getBoundingClientRect().top + window.scrollY;
    const range = wrapper.offsetHeight - window.innerHeight;
    scrollLock.current = index;
    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      scrollLock.current = null;
    }, 1200);
    window.scrollTo({
      top: top + ((index + 0.5) / COUNT) * range,
      behavior: reduced ? "instant" : "smooth",
    });
  };

  // Arrow keys move between tabs and select them; Home and End jump to the
  // ends (WAI-ARIA tabs, automatic activation).
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const target = {
      ArrowRight: (active + 1) % COUNT,
      ArrowLeft: (active - 1 + COUNT) % COUNT,
      Home: 0,
      End: COUNT - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target);
    tabs.current[target]?.focus();
  };

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  const item = ITEMS[active];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="built-for-title"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
    >
      <div ref={wrapperRef} className="relative pin:h-[300svh]">
        <div className="pin:sticky pin:top-(--navbar-height) pin:flex pin:h-[calc(100svh-var(--navbar-height))] pin:items-center">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:pt-[120px] sm:pb-32 pin:py-6">
            <h2
              id="built-for-title"
              className="text-[clamp(2.75rem,7.5vw,5.5rem)] leading-none tracking-[-0.04em] pin:text-[min(clamp(2.75rem,7.5vw,5.5rem),11svh)]"
            >
              <span className="block font-light">{ROLES.lead}</span>
              {/* Screen readers get the active phrase from here. It is a live
              region only when the visitor drives the change (scrolling or
              picking a role), so autoplay doesn't interrupt them every 2.8s. */}
              <span
                className="sr-only"
                aria-live={picked || pinned ? "polite" : undefined}
              >
                {item.phrase}
              </span>
              {/* A brighter green than the accent in the light theme (owner
              request, 2026-10-22). 3.4:1 on white, enough for large text. */}
              <span
                aria-hidden="true"
                className="mt-1 block font-normal text-accent light:text-[#2f9e5f]"
              >
                <Swap active={active} render={(role) => role.phrase} />
              </span>
            </h2>

            <div
              role="tablist"
              aria-label="Roles"
              className="pf-builtfor-tabs mt-12 flex pin:mt-[min(48px,6svh)] flex-wrap gap-2.5"
            >
              {ITEMS.map((role, index) => {
                const selected = index === active;
                return (
                  <button
                    key={role.number}
                    ref={(el) => {
                      tabs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={tabId(index)}
                    aria-selected={selected}
                    aria-controls={PANEL_ID}
                    tabIndex={selected ? 0 : -1}
                    data-active={selected}
                    onClick={() => select(index)}
                    onKeyDown={onKeyDown}
                    className="pf-builtfor-tab inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-pill border px-5 text-[15px]"
                  >
                    <span className="pf-builtfor-num font-mono text-xs">
                      {role.number}
                    </span>
                    {role.label}
                  </button>
                );
              })}
            </div>

            <div
              role="tabpanel"
              id={PANEL_ID}
              aria-labelledby={tabId(active)}
              className="mt-8 grid divide-y divide-line rounded-[20px] border border-line bg-card min-[880px]:grid-cols-2 min-[880px]:divide-x min-[880px]:divide-y-0"
            >
              <div className="p-8">
                <ColumnLabel>The problem</ColumnLabel>
                <div className="mt-4 text-lg leading-[1.55] text-muted">
                  <Swap
                    active={active}
                    render={(role) => <p>{role.problem}</p>}
                  />
                </div>
              </div>

              <div className="p-8">
                <ColumnLabel>What you do in ParallelFlow</ColumnLabel>
                <div className="mt-4">
                  <Swap
                    active={active}
                    render={(role) => (
                      <ul className="space-y-3 leading-[1.55]">
                        {role.actions.map((action) => (
                          <li key={action} className="flex gap-3">
                            <span aria-hidden="true" className="text-accent">
                              →
                            </span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
