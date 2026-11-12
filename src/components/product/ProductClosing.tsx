import {
  CircleCheckBig,
  DatabaseZap,
  EyeOff,
  FileLock2,
  type LucideIcon,
} from "lucide-react";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import {
  COMING_SOON,
  CTA_LABEL,
  FAQ,
  FINAL_CTA,
  TRUST,
} from "@/content/product-page";

// The end of the Product page: the guardrails (Trust), the roadmap (Coming
// soon), the FAQ and the closing call to action.

// In TRUST.items order.
const TRUST_ICONS: LucideIcon[] = [CircleCheckBig, DatabaseZap, EyeOff, FileLock2];

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

// Greyed-out cards with a "Soon" label, as the app's top bar shows it.
export function ComingSoon() {
  return (
    <section aria-labelledby="soon-title" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <h2 id="soon-title" className={heading}>
          {COMING_SOON.title}
        </h2>
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {COMING_SOON.items.map((item) => (
            <li
              key={item.title}
              className="rounded-card border border-dashed border-line p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-medium text-muted">{item.title}</h3>
                <span className="rounded-pill border border-line px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest text-muted">
                  Soon
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-pretty text-muted opacity-80">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ProductFaq() {
  return (
    <section aria-labelledby="faq-title" className="border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <h2 id="faq-title" className={heading}>
          {FAQ.title}
        </h2>
        <div className="mt-10 divide-y divide-line border-y border-line lg:mt-0">
          {FAQ.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden="true"
                  className="text-xl font-light text-muted transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[60ch] pb-6 leading-relaxed text-pretty text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
        <h2 id="final-cta-title" className={heading}>
          {FINAL_CTA.title}
        </h2>
        <WaitlistButton className="mt-10 h-11 px-6">{CTA_LABEL}</WaitlistButton>
      </div>
    </section>
  );
}
