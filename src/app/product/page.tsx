import type { Metadata } from "next";
import { ProductSection } from "@/components/sections/ProductSection";
import { VALUE_PROPOSITION } from "@/content/home";
import type { ProductSlug } from "@/content/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Product | ParallelFlow",
  description: VALUE_PROPOSITION,
  path: "/product",
});

// Owner-approved section order. The product cards elsewhere keep the
// products.ts order.
const SECTION_ORDER: ProductSlug[] = ["workspace", "arena", "developer-space"];

export default function ProductPage() {
  return (
    <main>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="inline-block rounded-pill border border-line px-3 py-1 text-xs text-muted">
          Coming soon
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Product
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl text-muted">
          {VALUE_PROPOSITION}
        </p>
      </section>
      {SECTION_ORDER.map((slug) => (
        <ProductSection key={slug} slug={slug} />
      ))}
    </main>
  );
}
