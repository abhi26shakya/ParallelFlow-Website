// Product page copy: the hero, the two work modes and the feature grid. Written 2026-10-15 from the Phase 8 product copy and PROJECT_BRIEF.md
// Part 6. Items marked "Draft" are new and await the owner's review.
// Headlines and value props come from products.ts. Change wording only with
// the owner's approval.

import type { ProductSlug } from "./products";

export type ModeFeature = {
  title: string;
  body: string;
};

export type ProductMode = {
  slug: ProductSlug;
  // Three check bullets beside the sticky preview. From PROJECT_BRIEF.md
  // Part 1, "Product page key points for YC", "Lead with" (lightly trimmed).
  highlights: string[];
  features: ModeFeature[];
};

// In page order (owner-approved 2026-10-14).
export const PRODUCT_MODES: ProductMode[] = [
  {
    slug: "workspace",
    highlights: [
      "Sessions tied to projects",
      "Roles, tools, skills, and MCP connections managed in one place",
      "Interactive or autonomous mode within granted permissions",
    ],
    features: [
      {
        title: "Sessions tied to projects",
        body: "Each session belongs to a project, with its instructions, files, task history, and outputs kept together.",
      },
      {
        // Draft.
        title: "Project context, attached",
        body: "Attach files, repositories, and instructions so the agent works from the project's own context.",
      },
      {
        title: "Capabilities in one place",
        body: "Manage agent roles, tools, skills, and MCP connections from one place.",
      },
      {
        title: "Interactive or autonomous",
        body: "Work step by step with an agent, or let it run within explicitly granted permissions. Sensitive actions still need human approval.",
      },
      {
        // Draft.
        title: "Deliverables to review",
        body: "Follow agent activity, tool output, and code diffs, then review the files and artifacts it produces.",
      },
    ],
  },
  {
    slug: "arena",
    highlights: [
      "One shared feed for people and a shared project agent",
      "One clear project goal, with task owners, status, and blockers",
      "Human approval for consequential actions",
    ],
    features: [
      {
        title: "One shared feed",
        body: "People, a shared project agent, and optional personal assistants in one chronological feed, with clear sender identification.",
      },
      {
        // Draft.
        title: "A shared project agent",
        body: "One agent per project that proposes plans, milestones, and tasks, and tracks progress and blockers.",
      },
      {
        // Draft.
        title: "Private personal assistants",
        body: "Optional assistants for each member. Their conversations stay private unless explicitly shared.",
      },
      {
        title: "One clear project goal",
        body: "A shared goal with milestones, task owners, status, and blockers, visible to the whole team.",
      },
      {
        title: "Human approval for consequential actions",
        body: "Sensitive code changes, merges, permission changes, and production actions require human approval. Agents cannot bypass permissions or approvals.",
      },
    ],
  },
];

export const PRODUCT_PAGE = {
  hero: {
    eyebrow: "ParallelFlow",
    // PROJECT_BRIEF.md Part 1, pre-launch treatment.
    status: "Desktop apps are coming soon",
    // Owner-supplied, 2026-10-15. One entry per line.
    title: ["Where teams and AI agents", "ship together."],
    subtitle: [
      "Plan, build, and ship in one connected workspace.",
      "Your team, your agents, your context, all in sync.",
    ],
    // Owner choice, 2026-10-15: "Try ParallelFlow" was asked for, then
    // changed to the brief's "early access" wording, since the product is
    // not available yet. Opens the waitlist.
    primaryCta: "Get early access",
    // Draft.
    secondaryCta: "Explore the modes",
  },
  grid: {
    // Earlier approved section label.
    title: "What it's designed to do",
    // Draft.
    subtitle: "Across Workspace and Arena. Both coming soon.",
  },
};
