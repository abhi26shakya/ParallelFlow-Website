import { ArrowDown, ChevronRight, RotateCcw } from "lucide-react";
import { type CSSProperties, Fragment } from "react";
import { PRODUCT_PAGE } from "@/content/product-page";
import "./product.css";

// "One loop. People in charge." (owner plan, 2026-11-12): a dark panel,
// styled like the video screens and with the same traveling edge light,
// holding the loop as four numbered steps (Private, Push, Arena, Stage gate)
// joined by connectors with light pulses running along them, and a return
// path underneath, its pulse running back to the start. Below lg the steps
// stack with down arrows and the return path is a single line. Pulses stop
// under reduced motion. Styles in product.css.
export function WorkLoop() {
  const { loop } = PRODUCT_PAGE;
  return (
    <section aria-labelledby="loop-title" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {loop.eyebrow}
        </p>
        <h2
          id="loop-title"
          className="mt-3 text-[clamp(36px,3.8vw,56px)] font-light leading-[1.05] tracking-[-0.02em] text-balance"
        >
          {loop.title}
        </h2>

        <div className="pf-loop edge-light mt-10 p-5 sm:p-8">
          <ol className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)_56px_minmax(0,1fr)_56px_minmax(0,1fr)] lg:gap-0">
            {loop.steps.map((step, index) => (
              <Fragment key={step.title}>
                {index > 0 && (
                  <li
                    aria-hidden="true"
                    className="flex items-center justify-center lg:relative"
                  >
                    <ArrowDown
                      className="size-4 text-[#6b6b70] lg:hidden"
                      strokeWidth={1.5}
                    />
                    <span
                      className="pf-loop-track hidden lg:block"
                      style={
                        {
                          "--pf-loop-delay": `${(index - 1) * 1.2}s`,
                        } as CSSProperties
                      }
                    />
                    <ChevronRight
                      strokeWidth={1.5}
                      className="absolute right-0 top-1/2 hidden size-4 -translate-y-1/2 text-[#6b6b70] lg:block"
                    />
                  </li>
                )}
                <li className="pf-loop-step">
                  <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[#8a8a8f]">
                    <span className="text-white">{index + 1}</span>
                    <span
                      aria-hidden="true"
                      className="h-px w-5 bg-[#2e2e33]"
                    />
                    {step.label}
                  </p>
                  <h3 className="mt-4 text-lg font-medium tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-pretty text-[#9a9a9f]">
                    {step.body}
                  </p>
                </li>
              </Fragment>
            ))}
          </ol>

          {/* The return path: from under the last step back to the first. */}
          <div className="relative mt-4 lg:mx-[calc((100%-168px)/8)] lg:mt-0">
            <div aria-hidden="true" className="pf-loop-return hidden lg:block">
              <span className="pf-loop-track pf-loop-track-back" />
            </div>
            <p className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#8a8a8f] lg:absolute lg:inset-x-0 lg:bottom-0 lg:translate-y-1/2">
              <span className="flex items-center gap-2 bg-[#050506] px-3">
                <RotateCcw
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-3.5"
                />
                {loop.returnLabel}
              </span>
            </p>
          </div>
          <div className="h-2 lg:h-6" />
        </div>
      </div>
    </section>
  );
}
