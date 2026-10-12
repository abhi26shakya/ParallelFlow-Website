import { LinkButton } from "@/components/ui/Button";
import { PRICING_PLANS } from "@/content/pricing";
import { WAITLIST_HREF } from "@/lib/site";

// Teams and Enterprise side by side. No checkout: the only action is the
// existing waitlist, and every capability is marked "Coming soon".
export function PricingCards() {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {PRICING_PLANS.map((plan) => (
        <li
          key={plan.name}
          className="flex flex-col rounded-card border border-line bg-card p-6 sm:p-8"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">{plan.name}</h2>
            <span className="shrink-0 rounded-pill border border-line px-3 py-1 text-xs text-muted">
              Coming soon
            </span>
          </div>
          <p className="mt-3 text-muted">{plan.audience}</p>
          <p className="mt-6 text-xl font-semibold">{plan.price}</p>

          <div className="mt-6 border-t border-line pt-6">
            <h3 className="text-sm font-medium text-muted">
              {plan.featuresIntro}
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-line">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-8">
            <LinkButton href={WAITLIST_HREF} className="w-full">
              {plan.cta}
            </LinkButton>
            <p className="mt-4 text-sm text-muted">{plan.supportingText}</p>
            {plan.note && (
              <p className="mt-3 text-sm text-muted">{plan.note}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
