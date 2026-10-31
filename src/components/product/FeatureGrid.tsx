import { PRODUCT_PAGE, type ProductMode } from "@/content/product-modes";
import { PRODUCTS } from "@/content/products";
import { MODE_ICONS } from "./modes";

// Every mode's features in one grid, one column per mode, after x.ai/grok's
// "And much more": muted icons, short titles and muted lines, no cards. Sized
// and aligned to match the mode showcase above it.
export function FeatureGrid({ modes }: { modes: ProductMode[] }) {
  return (
    <section aria-labelledby="features-title" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <h2
        id="features-title"
        className="text-3xl font-bold tracking-tighter text-balance sm:text-4xl lg:text-5xl"
      >
        {PRODUCT_PAGE.grid.title}
      </h2>
      <p className="mt-4 text-lg text-muted sm:text-xl">
        {PRODUCT_PAGE.grid.subtitle}
      </p>
      <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
        {modes.map((mode) => {
          const name = PRODUCTS.find((p) => p.slug === mode.slug)!.name;
          const icons = MODE_ICONS[mode.slug];
          return (
            <div key={mode.slug}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
                {name}
              </h3>
              <ul className="mt-6 space-y-8">
                {mode.features.map((feature, index) => {
                  const Icon = icons[index];
                  return (
                    <li key={feature.title} className="flex gap-3">
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="mt-0.5 size-5 shrink-0 text-muted"
                      />
                      <div>
                        <p className="text-base font-medium">{feature.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
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
    </section>
  );
}
