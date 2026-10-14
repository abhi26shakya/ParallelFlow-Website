import { MessageCircle } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { HeroBeams } from "@/components/home/HeroBeams";
import { HERO } from "@/content/home";
import { TALK_TO_US_URL } from "@/lib/site";

// Fades content in on first paint via @starting-style. Motion-safe only, and
// globals.css also disables transitions under prefers-reduced-motion.
const fadeIn =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-700 motion-safe:ease-out motion-safe:starting:translate-y-2 motion-safe:starting:opacity-0";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-28">
      <HeroBeams />
      <div className={`relative z-10 ${fadeIn}`}>
        <p className="inline-flex rounded-pill border border-line px-3 py-1 text-xs font-medium text-muted">
          {HERO.status}
        </p>
        <h1 className="mx-auto mt-6 max-w-[18ch] text-4xl font-bold tracking-tighter text-balance sm:text-6xl lg:text-7xl">
          {HERO.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[60ch] text-lg text-pretty text-muted sm:text-xl">
          {HERO.subtitle}
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href={TALK_TO_US_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("secondary", "w-full gap-2 sm:w-auto")}
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Talk to us
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      {/* Fixed 16:9 slot for the product video: a wide app-window frame that
          fills the hero container and runs past the first screen. The soft
          white glow above and dark shadow below lift it off the page (a soft
          drop shadow in the light theme; see --window-shadow). */}
      <div
        role="img"
        aria-label="Product preview video placeholder"
        className={`relative mt-12 aspect-video w-full overflow-hidden rounded-card border border-line bg-card shadow-window sm:mt-16 ${fadeIn} motion-safe:delay-150`}
      >
        <span className="absolute left-4 top-4 rounded-pill border border-line px-3 py-1 text-xs text-muted">
          Product preview
        </span>
        <div className="flex size-full items-center justify-center text-sm text-muted">
          Product video coming soon
        </div>
      </div>
    </section>
  );
}
