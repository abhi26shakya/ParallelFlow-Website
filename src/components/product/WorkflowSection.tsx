import {
  CircleCheckBig,
  DatabaseZap,
  EyeOff,
  FileLock2,
  type LucideIcon,
} from "lucide-react";
import { TRUST, WORKFLOW } from "@/content/product-page";

// The end of the Product page, after Arena: Push, Stages and Roles as three
// text cards, then the guardrails (Trust), together in one section that fits
// one screen below the navbar from lg (owner requests, 2026-11-12). Text
// sizes shrink a little on short screens so both parts stay on screen.
// Each card and the guardrails keep their own anchors.

// In TRUST.items order.
const TRUST_ICONS: LucideIcon[] = [
  CircleCheckBig,
  DatabaseZap,
  EyeOff,
  FileLock2,
];

export function WorkflowSection() {
  return (
    <section aria-label="Push, stages, roles and guardrails">
      <div className="mx-auto flex max-w-7xl flex-col justify-center gap-16 px-4 py-20 sm:px-6 sm:py-24 lg:min-h-[calc(100svh-var(--navbar-height))] lg:gap-[min(48px,5svh)] lg:py-[min(40px,4svh)]">
        <ul className="grid gap-4 lg:grid-cols-3">
          {WORKFLOW.map((item) => (
            <li
              key={item.id}
              id={item.id}
              className="rounded-card border border-line bg-card p-6 lg:p-[min(28px,3svh)]"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {item.eyebrow}
              </p>
              <h2 className="mt-3 text-[clamp(24px,2.1vw,30px)] font-light leading-[1.1] tracking-[-0.02em] text-balance lg:text-[min(clamp(24px,2.1vw,30px),3.6svh)]">
                {item.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-pretty text-muted lg:text-[min(15px,1.9svh)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>

        <div id={TRUST.id}>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            {TRUST.eyebrow}
          </p>
          <h2
            id="trust-title"
            className="mt-3 text-[clamp(48px,5vw,80px)] font-light leading-[1.05] tracking-[-0.02em] text-balance lg:text-[min(clamp(48px,5vw,80px),7svh)]"
          >
            {TRUST.title}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-[min(28px,3svh)] lg:grid-cols-4">
            {TRUST.items.map((item, index) => {
              const Icon = TRUST_ICONS[index];
              return (
                <li
                  key={item.title}
                  className="rounded-card border border-line bg-card p-5 lg:p-[min(22px,2.4svh)]"
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="size-5"
                  />
                  <h3 className="mt-4 text-base font-medium lg:mt-[min(16px,1.8svh)]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted">
                    {item.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
