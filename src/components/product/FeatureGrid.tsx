import { PRODUCT_PAGE, type ProductMode } from "@/content/product-modes";
import { PRODUCTS } from "@/content/products";
import { MODE_ICON, MODE_ICONS } from "./modes";

// Every mode's features at the end of the Product page: one column per mode,
// each a bordered panel with a mono label and the features as hairline-
// separated rows, in the look of the home page's accordions.
export function FeatureGrid({ modes }: { modes: ProductMode[] }) {
  return (
    <section aria-labelledby="features-title" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <h2
          id="features-title"
          className="text-[clamp(40px,4.5vw,64px)] font-light leading-[1.05] tracking-[-0.02em] text-balance"
        >
          {PRODUCT_PAGE.grid.title}
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {modes.map((mode) => {
            const product = PRODUCTS.find((p) => p.slug === mode.slug)!;
            const ModeIcon = MODE_ICON[mode.slug];
            const icons = MODE_ICONS[mode.slug];
            return (
              <div
                key={mode.slug}
                className="rounded-card border border-line bg-card"
              >
                <h3 className="flex items-center gap-2.5 border-b border-line px-6 py-4 font-mono text-xs uppercase tracking-widest text-muted sm:px-8">
                  <ModeIcon aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  <span className="text-foreground">{product.name}</span>
                </h3>
                <ul className="divide-y divide-line">
                  {mode.features.map((feature, index) => {
                    const Icon = icons[index];
                    return (
                      <li key={feature.title} className="flex gap-4 px-6 py-5 sm:px-8">
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.5}
                          className="mt-0.5 size-5 shrink-0 text-muted"
                        />
                        <div>
                          <p className="text-base font-medium">{feature.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-pretty text-muted">
                            {feature.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
