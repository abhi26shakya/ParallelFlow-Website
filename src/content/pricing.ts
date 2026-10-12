// Pricing page content. Single source for both plans.
// Source: PROJECT_BRIEF.md Part 4 Pricing; wording owner-approved in Phase 7.
// The proposed Teams price and the Enterprise pilot offer are NOT approved:
// do not add any price here until the owner approves it.

export type PricingPlan = {
  name: string;
  audience: string;
  price: string;
  featuresIntro: string;
  features: string[];
  cta: string;
  supportingText: string;
  note?: string;
};

export const PRICING_HERO = {
  title: "Pricing",
  intro:
    "Plans for teams and organizations building software with AI. ParallelFlow is coming soon. Join the waitlist for early access.",
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Teams",
    audience:
      "For startups, small engineering teams, and product teams using AI to build software.",
    price: "Pricing coming soon",
    featuresIntro: "Designed to include:",
    features: [
      "Shared team workspace",
      "Arena for project coordination and collaboration",
      "Workspace for AI-assisted task execution",
      "Shared project tasks and progress tracking",
      "Reusable agent roles and skills",
      "Shared project context and knowledge",
    ],
    cta: "Join Waitlist",
    supportingText:
      "Get early access to collaborative AI-powered software development.",
  },
  {
    name: "Enterprise",
    audience:
      "For larger engineering organizations adopting AI-assisted development across multiple teams.",
    price: "Custom pricing",
    featuresIntro: "Designed to include:",
    features: [
      "Everything in Teams, where applicable",
      "Organization-wide workspace management",
      "Access controls and permissions",
      "Shared and managed agent extensions",
      "Custom workflow configuration",
    ],
    cta: "Join Waitlist",
    supportingText:
      "Join the waitlist and tell us about your organization's needs.",
    note: "In the waitlist form, open “Tell us more” and answer whether you're interested in ParallelFlow for your organization.",
  },
];
