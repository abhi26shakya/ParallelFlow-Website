import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import { LogoMark } from "@/components/brand/Logo";
import { FeatureGrid } from "@/components/product/FeatureGrid";
import { ModeShowcase } from "@/components/product/ModeShowcase";
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

const name = (slug: string) => PRODUCTS.find((p) => p.slug === slug)!.name;

// Contained hairline between sections, as on x.ai/grok.
function Divider() {
  return <hr className="mx-auto max-w-6xl border-line" />;
}

// The Product page, laid out after x.ai/grok's product page (owner request,
// 2026-10-15): a centred hero, the three work modes beside one sticky preview
// window (components/product), a grid of every feature, "How it connects"
// cards and a closing waitlist band.
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
          <LinkButton href="#workspace" variant="soft" className="h-11">
            {hero.secondaryCta}
          </LinkButton>
        </div>
      </section>

      <Divider />
      <ModeShowcase modes={PRODUCT_MODES} />
      <Divider />
      <FeatureGrid modes={PRODUCT_MODES} />
      <Divider />

      <section aria-labelledby="connects-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="text-center">
          <h2
            id="connects-title"
            className="text-3xl font-medium tracking-tight sm:text-4xl"
          >
            {PRODUCT_PAGE.connectsTitle}
          </h2>
          <p className="mt-4 text-sm text-muted sm:text-base">
            {PRODUCT_PAGE.connectsSubtitle}
          </p>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
          {PRODUCT_PAGE.connects.map(({ slug, text }, index) => (
            <li key={slug} className="rounded-card border border-line p-8">
              <p className="font-mono text-xs text-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-xl font-medium tracking-tight">
                {name(slug)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="closing-title" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="flex flex-col gap-8 rounded-card border border-line bg-card p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2
              id="closing-title"
              className="text-2xl font-medium tracking-tight sm:text-3xl"
            >
              {PRODUCT_PAGE.closingTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              {PRODUCT_PAGE.closing}
            </p>
          </div>
          <WaitlistButton className="h-11 shrink-0 self-start md:self-auto">
            {PRODUCT_PAGE.closingCta}
          </WaitlistButton>
        </div>
      </section>
    </main>
  );
}
