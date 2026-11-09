"use client";

import {
  Boxes,
  History,
  ListChecks,
  Rocket,
  Workflow,
  type LucideIcon,
} from "lucide-react";
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
import { SOLUTION } from "@/content/home";
import { SolutionCard } from "@/components/home/solution/SolutionCard";
import "@/components/home/problems/problems.css";
import "@/components/home/solution/solution.css";

// "The Solution" below "The Problems", built the same way (ProblemStory.tsx)
// and mirrored: the pinned visual card on the left, the heading and accordion
// on the right. On screens wide and tall enough (the `pin` variant in
// globals.css) a tall wrapper pins everything while the visitor scrolls, and
// scroll position picks the open row. Clicking a row opens it and scrolls to
// its stretch. Elsewhere the card sits above the rows and they advance every
// 6s until the visitor picks one. Under reduced motion nothing advances on
// its own. Its scroll, observers and state are its own, separate from "The
// Problems". The card and scenes live in ./solution.

// One row per step, then the finale's three lines as one title.
const ROWS_TEXT = [
  ...SOLUTION.steps.map((step) => ({
    title: step.title,
    text: `${step.hook} ${step.support}`,
  })),
  { title: SOLUTION.finale.join(" "), text: "" },
];

// One icon per row, in the same order. Shown small in the card.
const ICONS: LucideIcon[] = [Workflow, Boxes, History, ListChecks, Rocket];

const ROWS = ROWS_TEXT.length;

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

const rowAt = (value: number) =>
  Math.min(ROWS - 1, Math.max(0, Math.floor(value * ROWS)));

const id = (index: number) => `solution-${index + 1}`;

function SolutionRow({
  item,
  index,
  active,
  progress,
  pinned,
  auto,
  buttonRef,
  onSelect,
  onAdvance,
  onKeyDown,
}: {
  item: (typeof ROWS_TEXT)[number];
  index: number;
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
    [index / ROWS, (index + 1) / ROWS],
    [0, 1],
  );
  return (
    <li data-active={active} className="pf-solution-row">
      <h3>
        <button
          ref={buttonRef}
          id={`${id(index)}-button`}
          type="button"
          aria-expanded={active}
          aria-controls={`${id(index)}-panel`}
          onClick={onSelect}
          onKeyDown={onKeyDown}
          className="flex min-h-18 w-full items-center justify-between gap-6 px-5 text-left outline-offset-[-2px] sm:px-8 pin:min-h-[clamp(46px,7.5svh,88px)] pin:px-11"
        >
          <span className="pf-solution-title py-3 text-xl leading-snug tracking-tight sm:text-2xl pin:py-2 pin:text-[clamp(18px,3svh,25px)]">
            {item.title}
          </span>
          <span aria-hidden="true" className="pf-solution-icon" />
        </button>
      </h3>
      <div
        id={`${id(index)}-panel`}
        role="region"
        aria-labelledby={`${id(index)}-button`}
        data-open={active}
        inert={!active}
        className="pf-solution-panel"
      >
        <div>
          {item.text && (
            <p className="pf-solution-text max-w-[720px] px-5 pb-6 text-[17px] leading-[1.6] sm:px-8 sm:text-[19px] pin:px-11 pin:pb-[min(28px,3svh)] pin:text-[clamp(15px,2.3svh,19px)]">
              {item.text}
            </p>
          )}
        </div>
      </div>
      {active && pinned && (
        <motion.span
          aria-hidden="true"
          style={{ scaleX: fill }}
          className="pf-solution-progress"
        />
      )}
      {active && auto && (
        <span
          aria-hidden="true"
          onAnimationEnd={onAdvance}
          className="pf-solution-progress pf-solution-progress-auto"
        />
      )}
    </li>
  );
}

export function SolutionStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  // After a click, ignores scroll updates for other rows until the smooth
  // scroll arrives (or 1.2s pass), so the rows it passes don't flash open.
  const scrollLock = useRef<number | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

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
      setActive(rowAt(progress.get())),
    );
    return () => cancelAnimationFrame(frame);
  }, [pinned, progress]);

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
      top: top + ((index + 0.5) / ROWS) * range,
      behavior: reduced ? "instant" : "smooth",
    });
  };

  // Arrow keys, Home and End move focus between rows (WAI-ARIA accordion).
  const moveFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const target = {
      ArrowDown: (index + 1) % ROWS,
      ArrowUp: (index - 1 + ROWS) % ROWS,
      Home: 0,
      End: ROWS - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    buttons.current[target]?.focus();
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="solution-title"
      data-paused={!inView}
      className="pf-solution-root relative border-t border-line"
    >
      <div ref={wrapperRef} className="relative pin:h-[350svh]">
        <div className="pin:sticky pin:top-(--navbar-height) pin:flex pin:h-[calc(100svh-var(--navbar-height))] pin:items-center">
          <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 pin:grid pin:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] pin:grid-rows-[auto_auto] pin:content-center pin:gap-x-12 xl:pin:gap-x-16 pin:py-6">
            <div className="pin:col-start-2 pin:row-start-1 pin:self-end">
              <h2
                id="solution-title"
                className="text-[clamp(48px,5vw,80px)] font-light leading-[1.05] tracking-[-0.02em] pin:text-[min(clamp(48px,5vw,80px),8svh)]"
              >
                {SOLUTION.title}
              </h2>
              <p className="pf-solution-subtitle mt-5 text-lg">
                {SOLUTION.subtitle}
              </p>
            </div>

            <div className="mx-auto mt-10 w-full max-w-2xl pin:sticky pin:top-[110px] pin:col-start-1 pin:row-span-2 pin:row-start-1 pin:mt-0 pin:w-[min(100%,calc((100svh-var(--navbar-height)-3rem)*440/276))] pin:max-w-none pin:self-center pin:justify-self-start">
              <SolutionCard
                active={active}
                title={ROWS_TEXT[active].title}
                Icon={ICONS[active]}
                reduced={reduced}
              />
            </div>

            <ol className="pf-solution-list mt-10 pin:col-start-2 pin:row-start-2 pin:mt-[min(40px,4svh)] pin:self-start">
              {ROWS_TEXT.map((item, index) => (
                <SolutionRow
                  key={item.title}
                  item={item}
                  index={index}
                  active={index === active}
                  progress={progress}
                  pinned={pinned}
                  auto={auto}
                  buttonRef={(el) => {
                    buttons.current[index] = el;
                  }}
                  onSelect={() => select(index)}
                  onAdvance={() => setActive((index + 1) % ROWS)}
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
