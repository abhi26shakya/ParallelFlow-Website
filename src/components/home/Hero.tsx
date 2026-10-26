import { MessageCircle } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { HeroGalaxy } from "@/components/home/HeroGalaxy";
import { LoopingVideo } from "@/components/media/LoopingVideo";
import { HERO } from "@/content/home";
import { TALK_TO_US_URL } from "@/lib/site";

// Fades content in on first paint via @starting-style. Motion-safe only, and
// globals.css also disables transitions under prefers-reduced-motion.
const fadeIn =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-700 motion-safe:ease-out motion-safe:starting:translate-y-2 motion-safe:starting:opacity-0";

// Fills the first screen below the navbar, with the copy at the top centre
// and the particle galaxy behind it.
export function Hero() {
  return (
    <section className="relative isolate mx-auto min-h-[calc(100svh-var(--navbar-height))] max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <HeroGalaxy />
      <div data-hero-copy className={`relative z-10 ${fadeIn}`}>
        <p className="neon-ring neon-ring-on inline-flex rounded-pill border border-line px-3 py-1 text-xs font-medium text-muted [--neon-ring-inset:1px] [--neon-ring-opacity:0.45]">
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
    </section>
  );
}

// The product video in its own section below the hero.
export function ProductPreview() {
  return (
    <section
      aria-label="Product preview"
      className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24"
    >
      {/* Fixed 16:9 frame for the product video: a wide app-window frame that
          fills the container. The soft white glow above and dark shadow below
          lift it off the page (a soft drop shadow in the light theme; see
          --window-shadow). */}
      <div
        className={`relative aspect-video w-full overflow-hidden rounded-card border border-line bg-card shadow-window ${fadeIn}`}
      >
        {/* No visible "Product preview" badge (removed at the owner's
            request, 2026-10-25); the section's aria-label keeps it for
            screen readers. */}
        <LoopingVideo
          src="/videos/product-preview.mp4"
          label="Product preview video of ParallelFlow"
        />
      </div>
    </section>
  );
}
