"use client";

import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import {
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ModeRow, ProductMode } from "@/content/product-modes";
import type { Product } from "@/content/products";
import { MODE_ICON, MODE_ICONS } from "./modes";
import { ModeCard } from "./ModeCard";
import "./product.css";

// One work mode on the Product page, built like the home page's "The
// Solution" (home/SolutionStory.tsx): the mode's heading and an accordion of
// its rows beside the mode's pinned, full-size video. `side`
// puts the card on the left or right, so the two modes mirror each other as
// "The Problems" and "The Solution" do. On screens wide and tall enough (the
// `pin` variant in globals.css) a tall wrapper pins everything while the
// visitor scrolls, and scroll position picks the open row. Clicking a row
// opens it and scrolls to its stretch. Elsewhere the card sits above the rows
// and they advance every 6s until the visitor picks one. Under reduced motion
// nothing advances on its own. The section id is the mode's slug, the anchor
// linked from the navbar, the footer and products.ts.

// Same query as the `pin` variant in globals.css.
const PIN_QUERY = "(width >= 64rem) and (height >= 42rem)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

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

function ModeRowItem({
  id,
  item,
  index,
  count,
  active,
  progress,
  pinned,
  auto,
  buttonRef,
  onSelect,
  onAdvance,
  onKeyDown,
}: {
  id: string;
  item: ModeRow;
  index: number;
  count: number;
  active: boolean;
  progress: MotionValue<number>;
  pinned: boolean;
  auto: boolean;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onAdvance: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  // Fills while this row's share of the scroll passes.
  const fill = useTransform(
    progress,
    [index / count, (index + 1) / count],
    [0, 1],
  );
  return (
    <li data-active={active} className="pf-mode-row">
      <h3>
        <button
          ref={buttonRef}
          id={`${id}-button`}
          type="button"
          aria-expanded={active}
          aria-controls={`${id}-panel`}
          onClick={onSelect}
          onKeyDown={onKeyDown}
          className="flex min-h-16 w-full items-center justify-between gap-6 px-5 text-left outline-offset-[-2px] sm:px-8 pin:min-h-[clamp(40px,5.8svh,72px)] pin:px-8"
        >
          <span className="pf-mode-title py-3 text-lg leading-snug tracking-tight sm:text-xl pin:py-2 pin:text-[clamp(16px,2.5svh,22px)]">
            {item.title}
          </span>
          <span aria-hidden="true" className="pf-mode-icon" />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        data-open={active}
        inert={!active}
        className="pf-mode-panel"
      >
        <div>
          <p className="pf-mode-text max-w-[640px] px-5 pb-5 text-base leading-[1.6] sm:px-8 sm:text-[17px] pin:px-8 pin:pb-4 pin:text-[clamp(14px,2svh,16px)] pin:leading-[1.5]">
            {item.body}
          </p>
        </div>
      </div>
      {active && pinned && (
        <motion.span
          aria-hidden="true"
          style={{ scaleX: fill }}
          className="pf-mode-progress"
        />
      )}
      {active && auto && (
        <span
          aria-hidden="true"
          onAnimationEnd={onAdvance}
          className="pf-mode-progress pf-mode-progress-auto"
        />
      )}
    </li>
  );
}

export function ModeStory({
  mode,
  product,
  side,
}: {
  mode: ProductMode;
  product: Product;
  side: "left" | "right";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  // After a click, ignores scroll updates for other rows until the smooth
  // scroll arrives (or 1.2s pass), so the rows it passes don't flash open.
  const scrollLock = useRef<number | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const rows = mode.rows;
  const count = rows.length;
  const rowAt = (value: number) =>
    Math.min(count - 1, Math.max(0, Math.floor(value * count)));
  const rowId = (index: number) => `${mode.slug}-row-${index + 1}`;
  const titleId = `${mode.slug}-title`;
  const Icon = MODE_ICON[mode.slug];
  const rowIcons = MODE_ICONS[mode.slug];

  const pinned = useMedia(PIN_QUERY);
  const reduced = useMedia(REDUCED_QUERY);
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [inView, setInView] = useState(false);
  const auto = !pinned && !reduced && !stopped;

  // 0 to 1 across the pinned stretch; each row owns an equal share.
  const { scrollYProgress: progress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(progress, "change", (value) => {
    if (!pinned) return;
    const row = rowAt(value);
    if (scrollLock.current !== null) {
      if (row !== scrollLock.current) return;
      scrollLock.current = null;
    }
    setActive(row);
  });

  // Picks up the scroll position when pinning starts.
  useEffect(() => {
    if (!pinned) return;
    const frame = requestAnimationFrame(() =>
      setActive(
        Math.min(count - 1, Math.max(0, Math.floor(progress.get() * count))),
      ),
    );
    return () => cancelAnimationFrame(frame);
  }, [pinned, progress, count]);

  // Auto-advance pauses while the section is off screen.
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
    const wrapper = wrapperRef.current;
    if (!pinned || !wrapper) {
      setStopped(true);
      return;
    }
    const top = wrapper.getBoundingClientRect().top + window.scrollY;
    const range = wrapper.offsetHeight - window.innerHeight;
    scrollLock.current = index;
    clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      scrollLock.current = null;
    }, 1200);
    window.scrollTo({
      top: top + ((index + 0.5) / count) * range,
      behavior: reduced ? "instant" : "smooth",
    });
  };

  // Arrow keys, Home and End move focus between rows (WAI-ARIA accordion).
  const moveFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const target = {
      ArrowDown: (index + 1) % count,
      ArrowUp: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    buttons.current[target]?.focus();
  };

  const cardLeft = side === "left";

  return (
    <section
      ref={sectionRef}
      id={mode.slug}
      aria-labelledby={titleId}
      data-paused={!inView}
      className="pf-mode-root relative scroll-mt-(--navbar-height) border-t border-line"
    >
      <div ref={wrapperRef} className="relative pin:h-[350svh]">
        <div className="pin:sticky pin:top-(--navbar-height) pin:flex pin:h-[calc(100svh-var(--navbar-height))] pin:items-center">
          <div
            className={`mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 pin:grid pin:grid-rows-[auto_auto] pin:content-center pin:gap-x-10 xl:pin:gap-x-14 pin:py-4 ${
              cardLeft
                ? "pin:grid-cols-[minmax(0,60fr)_minmax(0,40fr)]"
                : "pin:grid-cols-[minmax(0,40fr)_minmax(0,60fr)]"
            }`}
          >
            <div
              className={`pin:row-start-1 pin:self-end ${
                cardLeft ? "pin:col-start-2" : "pin:col-start-1"
              }`}
            >
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-4" />
                {product.role}
              </p>
              <h2
                id={titleId}
                className="mt-4 text-[clamp(44px,5vw,72px)] font-light leading-[1.05] tracking-[-0.02em] pin:mt-[min(12px,1.5svh)] pin:text-[min(clamp(44px,5vw,72px),6.5svh)]"
              >
                {product.name}
              </h2>
              <p className="pf-mode-subtitle mt-4 max-w-[48ch] text-lg text-pretty pin:mt-[min(12px,1.5svh)] pin:text-[clamp(15px,2.2svh,18px)]">
                {product.body}
              </p>
            </div>

            <div
              className={`mt-10 w-full pin:row-span-2 pin:row-start-1 pin:mt-0 pin:w-[min(100%,calc((100svh-var(--navbar-height)-7rem)*16/9))] pin:max-w-none pin:self-center ${
                cardLeft
                  ? "pin:col-start-1 pin:justify-self-start"
                  : "pin:col-start-2 pin:justify-self-end"
              }`}
            >
              <ModeCard
                video={`/videos/${mode.slug}.mp4`}
                name={product.name}
                active={active}
                count={count}
                title={rows[active].title}
                Icon={rowIcons[active]}
              />
            </div>

            <ol
              className={`pf-mode-list mt-10 pin:row-start-2 pin:mt-[min(32px,3svh)] pin:self-start ${
                cardLeft ? "pin:col-start-2" : "pin:col-start-1"
              }`}
            >
              {rows.map((item, index) => (
                <ModeRowItem
                  key={item.title}
                  id={rowId(index)}
                  item={item}
                  index={index}
                  count={count}
                  active={index === active}
                  progress={progress}
                  pinned={pinned}
                  auto={auto}
                  buttonRef={(el) => {
                    buttons.current[index] = el;
                  }}
                  onSelect={() => select(index)}
                  onAdvance={() => setActive((index + 1) % count)}
                  onKeyDown={(event) => moveFocus(event, index)}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
