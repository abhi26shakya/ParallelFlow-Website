import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { SandLogo } from "@/components/hero/sand-logo";
import { FeatureGrid } from "@/components/product/FeatureGrid";
import { ModeStory } from "@/components/product/ModeStory";
import { WorkLoop } from "@/components/product/WorkLoop";
import { LinkButton } from "@/components/ui/Button";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { VALUE_PROPOSITION } from "@/content/home";
import { PRODUCT_MODES, PRODUCT_PAGE } from "@/content/product-modes";
import { PRODUCTS } from "@/content/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Product | ParallelFlow",
  description: VALUE_PROPOSITION,
  path: "/product",
});

// Fades content in on first paint via @starting-style, as on the home hero.
const fadeIn =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-700 motion-safe:ease-out motion-safe:starting:translate-y-2 motion-safe:starting:opacity-0";

const productFor = (slug: string) => PRODUCTS.find((p) => p.slug === slug)!;

// The Product page, redesigned 2026-11-08 to match the home page (owner
// request): a left-aligned hero beside sand that settles into the logo cube, then each mode
// as a pinned accordion beside its video (Private with the card on the left,
// Arena mirrored), the work loop with its guardrails, and every feature.
export default function ProductPage() {
  const { hero } = PRODUCT_PAGE;
  return (
    <main>
      {/* From lg the hero fills the first screen below the navbar: copy and
          animation in two columns, centred against each other, with the
          animation box sized to the screen height (680px at most). Below lg
          they stack. Aligned to the same max-w-7xl edges as the sections
          below it. */}
      <section className="mx-auto flex max-w-7xl items-center px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:min-h-[calc(100svh-var(--navbar-height))] lg:py-8">
        <div
          className={`w-full lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 ${fadeIn}`}
        >
          <div>
            {/* Back to the big heading, wrapping over four lines on desktop
                (owner request, 2026-11-09). */}
            <h1 className="max-w-[14ch] text-[clamp(48px,6.5vw,92px)] font-light leading-[1.02] tracking-[-0.03em]">
              {hero.title.join(" ")}
            </h1>
            <p className="mt-6 max-w-[40ch] text-lg text-pretty text-muted sm:text-xl">
              {hero.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <WaitlistButton className="h-11 gap-1.5 pl-5 pr-4">
                {hero.primaryCta}
                <ChevronRight aria-hidden="true" className="size-4" />
              </WaitlistButton>
              <LinkButton href="#private" variant="soft" className="h-11">
                {hero.secondaryCta}
              </LinkButton>
            </div>
          </div>

          {/* Sand settles into the logo cube, then scatters (owner request,
              2026-11-09; it replaced the Möbius strip). Stacks below the copy
              on smaller screens. Grains use the theme's text colour, to keep
              the site monochrome. */}
          <div className="relative mt-10 h-[340px] sm:h-[440px] lg:mt-0 lg:h-[min(640px,calc(100svh-var(--navbar-height)-4rem))]">
            <SandLogo />
          </div>
        </div>
      </section>

      {PRODUCT_MODES.map((mode, index) => (
        <ModeStory
          key={mode.slug}
          mode={mode}
          product={productFor(mode.slug)}
          side={index % 2 === 0 ? "left" : "right"}
        />
      ))}

      <WorkLoop />
      <FeatureGrid modes={PRODUCT_MODES} />
    </main>
  );
}
