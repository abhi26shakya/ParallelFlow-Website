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
import type { TourSectionContent } from "@/content/product-page";
import { LoopingVideo } from "@/components/media/LoopingVideo";
import "./product.css";

// A Product page section with a list of features (Private, Arena), built
// like the home page's "The Solution" (owner request, 2026-11-12): the
// heading and an accordion of the features beside the section's screen.
// `side` puts the screen on the left or right, so sections mirror each
// other. On screens wide and tall enough (the `pin` variant in globals.css)
// a tall wrapper pins everything under the navbar while
// the visitor scrolls, and scroll position picks the open row. Clicking a
// row opens it and scrolls to its stretch. Elsewhere nothing pins and the
// rows advance every 6s until the visitor picks one: from lg the two columns
// stay, with the screen sized to the screen height; narrower screens stack
// the screen above the rows. Under reduced motion nothing advances on its
// own. The section id is the anchor used by the navbar and footer.

// Same query as the `pin` variant in globals.css.
const PIN_QUERY = "(width >= 64rem) and (height >= 42rem)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

type Row = { title: string; body: string };

const pad = (n: number) => String(n).padStart(2, "0");

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

function RowItem({
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
  item: Row;
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
          className="flex min-h-16 w-full items-center justify-between gap-6 px-5 text-left outline-offset-[-2px] sm:px-8 pin:min-h-[clamp(40px,5.4svh,68px)] pin:px-8"
        >
          <span className="pf-mode-title py-3 text-xl leading-snug tracking-tight sm:text-2xl pin:py-2 pin:text-[clamp(18px,3svh,25px)]">
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
          <p className="pf-mode-text max-w-[720px] px-5 pb-6 text-[17px] leading-[1.6] sm:px-8 sm:text-[19px] pin:px-8 pin:pb-[min(24px,2.6svh)] pin:text-[clamp(15px,2.3svh,19px)] pin:leading-[1.5]">
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

export function PinnedTourSection({
  section,
  side,
}: {
  section: TourSectionContent;
  side: "left" | "right";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  // After a click, ignores scroll updates for other rows until the smooth
  // scroll arrives (or 1.2s pass), so the rows it passes don't flash open.
  const scrollLock = useRef<number | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const rows = section.bullets;
  const count = rows.length;
  const rowAt = (value: number) =>
    Math.min(count - 1, Math.max(0, Math.floor(value * count)));
  const rowId = (index: number) => `${section.id}-row-${index + 1}`;
  const titleId = `${section.id}-title`;

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

  const screenLeft = side === "left";

  return (
    <section
      ref={sectionRef}
      id={section.id}
      aria-labelledby={titleId}
      data-paused={!inView}
      className="pf-mode-root relative"
    >
      <div ref={wrapperRef} className="relative pin:h-[350svh]">
        <div className="pin:sticky pin:top-(--navbar-height) pin:flex pin:h-[calc(100svh-var(--navbar-height))] pin:items-center">
          <div
            className={`mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:grid lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-10 xl:gap-x-12 pin:py-4 ${
              screenLeft
                ? "lg:grid-cols-[minmax(0,64fr)_minmax(0,36fr)]"
                : "lg:grid-cols-[minmax(0,36fr)_minmax(0,64fr)]"
            }`}
          >
            <div
              className={`lg:row-start-1 lg:self-end ${
                screenLeft ? "lg:col-start-2" : "lg:col-start-1"
              }`}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {section.eyebrow}
              </p>
              <h2
                id={titleId}
                className="mt-3 text-[clamp(48px,5vw,80px)] font-light leading-[1.05] tracking-[-0.02em] text-balance pin:text-[min(clamp(48px,5vw,80px),8svh)]"
              >
                {section.title}
              </h2>
              {section.body && (
                <p className="pf-mode-subtitle mt-5 max-w-[48ch] text-lg text-pretty pin:mt-[min(20px,2svh)]">
                  {section.body}
                </p>
              )}
            </div>

            <div
              className={`mt-10 w-full lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center ${
                screenLeft
                  ? "lg:col-start-1 lg:justify-self-start"
                  : "lg:col-start-2 lg:justify-self-end"
              }`}
            >
              <div
                className={`pf-screen-fit ${screenLeft ? "lg:ml-0" : "lg:mr-0"}`}
              >
                <div className="pf-screen edge-light shadow-window">
                  <LoopingVideo
                    src={section.video.src}
                    label={section.video.label}
                  />
                </div>
                <div aria-hidden="true" className="pf-mode-caption">
                  <span
                    key={active}
                    className="min-w-0 truncate motion-safe:animate-fade-in"
                  >
                    {rows[active].title}
                  </span>
                  <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-pill border border-line px-2 py-0.5 font-mono text-[11px]">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    <span>
                      <span className="text-foreground">{pad(active + 1)}</span>
                      {" / "}
                      {pad(count)}
                    </span>
                  </span>
                </div>
              </div>
              <p aria-live="polite" className="sr-only">
                {rows[active].title}
              </p>
            </div>

            <ol
              className={`pf-mode-list mt-10 lg:row-start-2 lg:self-start pin:mt-[min(32px,3svh)] ${
                screenLeft ? "lg:col-start-2" : "lg:col-start-1"
              }`}
            >
              {rows.map((item, index) => (
                <RowItem
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
