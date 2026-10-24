import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { LogoMark } from "@/components/brand/Logo";
import { FeatureGrid } from "@/components/product/FeatureGrid";
import { ModeShowcase } from "@/components/product/ModeShowcase";
import { LinkButton } from "@/components/ui/Button";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { VALUE_PROPOSITION } from "@/content/home";
import { PRODUCT_MODES, PRODUCT_PAGE } from "@/content/product-modes";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Product | ParallelFlow",
  description: VALUE_PROPOSITION,
  path: "/product",
});

// Contained hairline between sections, as on x.ai/grok.
function Divider() {
  return <hr className="mx-auto max-w-6xl border-line" />;
}

// The Product page, laid out after x.ai/grok's product page (owner request,
// 2026-10-15): a centred hero, the two work modes beside one sticky preview
// window (components/product) and a grid of every feature. The "How it
// connects" cards and the closing waitlist band were removed (owner request,
// 2026-10-22).
export default function ProductPage() {
  const { hero } = PRODUCT_PAGE;
  return (
    <main>
      <section className="mx-auto max-w-5xl px-4 pb-28 pt-28 text-center sm:px-6 sm:pb-36 sm:pt-40">
        <p className="flex items-center justify-center gap-2.5">
          <LogoMark className="size-4 text-muted" />
          <span className="text-sm font-medium text-muted">{hero.eyebrow}</span>
          <span aria-hidden="true" className="h-3 w-px bg-line" />
          <span className="text-xs text-muted/75 light:text-muted">
            {hero.status}
          </span>
        </p>
        <h1 className="mt-5 text-[clamp(2.75rem,7vw,5rem)] font-medium leading-none tracking-[-0.04em]">
          {hero.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-foreground/90 sm:text-xl">
          {hero.subtitle.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <WaitlistButton className="h-11 gap-1.5 pl-5 pr-4">
            {hero.primaryCta}
            <ChevronRight aria-hidden="true" className="size-4" />
          </WaitlistButton>
          <LinkButton href="#private" variant="soft" className="h-11">
            {hero.secondaryCta}
          </LinkButton>
        </div>
      </section>

      <Divider />
      <ModeShowcase modes={PRODUCT_MODES} />
      <Divider />
      <FeatureGrid modes={PRODUCT_MODES} />
    </main>
  );
}
