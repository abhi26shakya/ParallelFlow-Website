"use client";

import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProductMode } from "@/content/product-modes";
import { PRODUCTS } from "@/content/products";
import { MODE_ICON } from "./modes";
import { PreviewWindow } from "./PreviewWindow";

// The three work modes as scroll-linked blocks beside one sticky "Product
// preview" window, after x.ai/grok's feature section. At lg and up, each block
// is as tall as the window's sticky box and centres its text, so the active
// mode's text lines up with the window. The block crossing the middle of the
// screen is fully opaque and the others dim to 20%; the window shows the
// active mode. Below lg there is no dimming and each
// block shows its own window under its text. Block ids are the anchors linked
// from the product cards and the old /product/* redirects.
export function ModeShowcase({ modes }: { modes: ProductMode[] }) {
  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = blocks.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) setActive(index);
        }
      },
      // A line across the middle of the screen. The first block stays active
      // until another crosses it, and the last stays active after.
      { rootMargin: "-50% 0px -50% 0px" },
    );
    for (const el of blocks.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const name = (mode: ProductMode) =>
    PRODUCTS.find((p) => p.slug === mode.slug)!.name;

  return (
    <section aria-label="Work modes" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-12">
        <div>
          {modes.map((mode, index) => {
            const product = PRODUCTS.find((p) => p.slug === mode.slug)!;
            const Icon = MODE_ICON[mode.slug];
            return (
              <div
                key={mode.slug}
                id={mode.slug}
                ref={(el) => {
                  blocks.current[index] = el;
                }}
                aria-labelledby={`${mode.slug}-title`}
                role="group"
                className="lg:flex lg:min-h-[calc(100svh-var(--navbar-height))] lg:flex-col lg:justify-center"
              >
                <div
                  className={`py-10 transition-opacity duration-500 lg:py-12 ${
                    index === active ? "" : "lg:opacity-20"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <Icon aria-hidden="true" strokeWidth={1.5} className="size-6 shrink-0" />
                    <h2
                      id={`${mode.slug}-title`}
                      className="text-2xl font-medium tracking-tight sm:text-3xl"
                    >
                      {product.name}
                    </h2>
                  </div>
                  <p className="mt-4 max-w-md leading-relaxed">{product.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {mode.highlights.map((point) => (
                      <li key={point} className="flex gap-3 text-sm text-muted">
                        <Check aria-hidden="true" strokeWidth={1.75} className="mt-0.5 size-4 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 lg:hidden">
                    <PreviewWindow name={product.name} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* One window for all three modes. Its box fills the screen below the
            navbar and centres the window, so it sits mid-screen while the
            blocks scroll past. */}
        <div className="hidden lg:block">
          <div className="sticky top-(--navbar-height) flex h-[calc(100svh-var(--navbar-height))] items-center">
            <div className="w-full">
              <PreviewWindow name={name(modes[active])} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
