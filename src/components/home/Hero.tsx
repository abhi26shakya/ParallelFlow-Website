import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { HERO } from "@/content/home";
import { WAITLIST_HREF } from "@/lib/site";

// Fades content in on first paint via @starting-style. Motion-safe only, and
// globals.css also disables transitions under prefers-reduced-motion.
const fadeIn =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-700 motion-safe:ease-out motion-safe:starting:translate-y-2 motion-safe:starting:opacity-0";

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-24 sm:pt-28">
      <div className={fadeIn}>
        <p className="inline-flex rounded-pill border border-line px-3 py-1 text-xs font-medium text-muted">
          {HERO.status}
        </p>
        <h1 className="mx-auto mt-6 max-w-[18ch] text-4xl font-bold tracking-tighter text-balance sm:text-6xl lg:text-7xl">
          {HERO.title}
        </h1>
        <p className="mx-auto mt-6 max-w-[60ch] text-lg text-pretty text-muted sm:text-xl">
          {HERO.subtitle}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <LinkButton href={WAITLIST_HREF} className="w-full sm:w-auto">
            Join Waitlist
          </LinkButton>
          <Link
            href="/#how-it-works"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            How it works
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">{HERO.note}</p>
      </div>

      {/* Fixed 16:9 slot for the product video, kept smaller and quieter
          than the shared PreviewSlot so the headline leads. */}
      <div
        role="img"
        aria-label="Product preview video placeholder"
        className={`relative mx-auto mt-16 aspect-video w-full max-w-3xl overflow-hidden rounded-card border border-line sm:mt-20 ${fadeIn} motion-safe:delay-150`}
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
