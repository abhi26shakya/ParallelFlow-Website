import {
  CircleCheckBig,
  DatabaseZap,
  EyeOff,
  FileLock2,
  type LucideIcon,
} from "lucide-react";
import { TRUST } from "@/content/product-page";

// The end of the Product page: the guardrails (Trust).

// In TRUST.items order.
const TRUST_ICONS: LucideIcon[] = [
  CircleCheckBig,
  DatabaseZap,
  EyeOff,
  FileLock2,
];

const heading =
  "text-[clamp(36px,3.8vw,56px)] font-light leading-[1.05] tracking-[-0.02em] text-balance";

export function TrustSection() {
  return (
    <section
      id={TRUST.id}
      aria-labelledby="trust-title"
      className="border-t border-line"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          {TRUST.eyebrow}
        </p>
        <h2 id="trust-title" className={`mt-3 ${heading}`}>
          {TRUST.title}
        </h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.items.map((item, index) => {
            const Icon = TRUST_ICONS[index];
            return (
              <li
                key={item.title}
                className="rounded-card border border-line bg-card p-6"
              >
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
                <h3 className="mt-5 text-base font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
