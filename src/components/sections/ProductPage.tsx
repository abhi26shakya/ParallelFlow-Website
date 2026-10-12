import { PreviewSlot } from "@/components/sections/PreviewSlot";
import { ProductCards } from "@/components/sections/ProductCards";
import { ItemGrid, Section } from "@/components/sections/Section";
import { LinkButton } from "@/components/ui/Button";
import {
  PRODUCT_PAGE_LABELS,
  PRODUCT_PAGES,
  closingLine,
} from "@/content/product-pages";
import { PRODUCTS, type ProductSlug } from "@/content/products";
import { WAITLIST_HREF } from "@/lib/site";

// Shared layout for the Arena, Workspace and Developer Space pages. Every
// product is pre-launch, so the page carries a "Coming soon" badge and the
// only action is the waitlist.
export function ProductPage({ slug }: { slug: ProductSlug }) {
  const product = PRODUCTS.find((p) => p.slug === slug)!;
  const page = PRODUCT_PAGES[slug];

  return (
    <main>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <div className="flex items-center justify-center gap-3">
          <p className="font-mono text-xs tracking-widest text-muted">
            {PRODUCT_PAGE_LABELS.eyebrow}
          </p>
          <span className="rounded-pill border border-line px-3 py-1 text-xs text-muted">
            Coming soon
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {product.name}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl">{product.body}</p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{page.intro}</p>
        {page.emphasis && (
          <p className="mt-8 text-lg font-semibold">{page.emphasis}</p>
        )}
        <PreviewSlot
          description={`Product preview placeholder for ${product.name}`}
          placeholder={page.previewPlaceholder}
        />
      </section>

      <Section
        label={PRODUCT_PAGE_LABELS.features}
        title={product.role}
      >
        <ItemGrid items={page.features} />
      </Section>

      <Section
        label={PRODUCT_PAGE_LABELS.connects}
        title={PRODUCT_PAGE_LABELS.connectsTitle}
      >
        <p className="mt-6 max-w-3xl text-lg text-muted">{page.connects}</p>
        <ProductCards exclude={slug} />
      </Section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <p className="text-lg text-muted">{closingLine(product.name)}</p>
          <LinkButton href={WAITLIST_HREF} className="mt-8">
            {PRODUCT_PAGE_LABELS.closingCta}
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
