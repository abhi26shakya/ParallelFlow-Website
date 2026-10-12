import type { Metadata } from "next";
import { PricingCards } from "@/components/sections/PricingCards";
import { PRICING_HERO } from "@/content/pricing";

export const metadata: Metadata = {
  title: "Pricing | ParallelFlow",
  description:
    "Explore ParallelFlow plans for collaborative AI development. Check the website for current availability and pricing details.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {PRICING_HERO.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          {PRICING_HERO.intro}
        </p>
      </div>
      <div className="mt-14">
        <PricingCards />
      </div>
    </main>
  );
}
