import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { SandLogo } from "@/components/hero/sand-logo";
import { DemoVideoButton } from "@/components/product/DemoVideoButton";
import {
  ComingSoon,
  FinalCta,
  ProductFaq,
  TrustSection,
} from "@/components/product/ProductClosing";
import { ProductSubnav } from "@/components/product/ProductSubnav";
import { TourScreen, TourSection } from "@/components/product/TourSection";
import { WorkLoop } from "@/components/product/WorkLoop";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { VALUE_PROPOSITION } from "@/content/home";
import {
  CTA_LABEL,
  PRODUCT_PAGE,
  TOUR_SECTIONS,
} from "@/content/product-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Product | ParallelFlow",
  description: VALUE_PROPOSITION,
  path: "/product",
});

// Fades content in on first paint via @starting-style, as on the home hero.
const fadeIn =
  "motion-safe:transition-[opacity,translate] motion-safe:duration-700 motion-safe:ease-out motion-safe:starting:translate-y-2 motion-safe:starting:opacity-0";

// The Product page, rewritten 2026-11-12 from the owner's plan as a tour of
// the real product: the hero beside sand that settles into the logo cube, a
// sticky sub-navigation, the loop, then one section per step (Private, Push,
// Arena, Stages, Roles), each pairing copy with its screen and alternating
// sides, then the guardrails, the roadmap, the FAQ and a closing CTA.
export default function ProductPage() {
  const { hero } = PRODUCT_PAGE;
  return (
    <main>
      {/* From lg in landscape, the hero fills the first screen below the
          navbar (large portrait tablets get natural height instead, so the
          heading isn't pushed halfway down a tall screen): copy and
          animation in two columns, centred against each other, with the
          animation box sized to the screen height (680px at most). Below lg
          they stack. Aligned to the same max-w-7xl edges as the sections
          below it. */}
      {/* Full width, so the sand's sideways bleed is clipped only at the
          screen edge and never adds a horizontal scroll. */}
      <div className="overflow-x-clip">
        <section className="mx-auto flex max-w-7xl items-center px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:landscape:min-h-[calc(100svh-var(--navbar-height))] lg:landscape:py-8">
          <div
            className={`w-full lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 ${fadeIn}`}
          >
            <div className="relative z-10">
              {/* Back to the big heading, wrapping over four lines on desktop
                  (owner request, 2026-11-09). */}
              <h1 className="max-w-[14ch] text-[clamp(48px,6.5vw,92px)] font-light leading-[1.02] tracking-[-0.03em]">
                {hero.title}
              </h1>
              <p className="mt-6 max-w-[40ch] text-lg text-pretty text-muted sm:text-xl">
                {hero.subtitle}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <WaitlistButton className="h-11 gap-1.5 pl-5 pr-4">
                  {CTA_LABEL}
                  <ChevronRight aria-hidden="true" className="size-4" />
                </WaitlistButton>
                <DemoVideoButton label={hero.demo} />
              </div>
            </div>

            {/* Sand settles into the logo cube, then scatters (owner request,
                2026-11-09; it replaced the Möbius strip). Stacks below the copy
                on smaller screens. Grains use the theme's text colour, to keep
                the site monochrome. */}
            {/* The canvas bleeds well past this box (it's marked as the logo's
                box), and grains fade out toward the canvas edges, so the
                scattered sand dissolves into the page instead of stopping at a
                rectangle (owner request, 2026-11-09). It sits behind the copy. */}
            <div
              data-sand-box
              className="relative mt-10 h-[340px] sm:h-[440px] lg:mt-0 lg:h-[min(640px,calc(100svh-var(--navbar-height)-4rem))]"
            >
              <div className="pointer-events-none absolute -inset-x-[30%] -inset-y-[22%] lg:-left-[55%] lg:-right-[25%]">
                <SandLogo />
              </div>
            </div>
          </div>
        </section>
      </div>

      <ProductSubnav />
      <WorkLoop />
      {TOUR_SECTIONS.map((section, index) => (
        <TourSection
          key={section.id}
          section={section}
          side={index % 2 === 0 ? "left" : "right"}
          large={section.id === "roles"}
        >
          <TourScreen media={section.media} />
        </TourSection>
      ))}
      <TrustSection />
      <ComingSoon />
      <ProductFaq />
      <FinalCta />
    </main>
  );
}
