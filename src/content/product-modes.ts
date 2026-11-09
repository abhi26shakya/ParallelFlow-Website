// Product page copy: the hero, the two work modes, the work loop (how they
// connect, with human oversight) and the feature grid. Rewritten 2026-11-08 for the Product page
// redesign (owner request), drafted from PROJECT_BRIEF.md Part 6. Items marked
// "Draft" are new and await the owner's review. Mode names and one-liners come
// from products.ts. Change wording only with the owner's approval.

import type { ProductSlug } from "./products";

export type ModeRow = {
  title: string;
  body: string;
};

export type ModeFeature = {
  title: string;
  body: string;
};

export type ProductMode = {
  slug: ProductSlug;
  // The pinned accordion rows beside the mode's video. Draft.
  rows: ModeRow[];
  // The feature grid at the end of the page.
  features: ModeFeature[];
};

// In page order (owner-approved 2026-10-14).
export const PRODUCT_MODES: ProductMode[] = [
  {
    slug: "private",
    rows: [
      {
        title: "Sessions tied to projects",
        body: "Each session belongs to a project, so its instructions, files, task history, and outputs stay together.",
      },
      {
        title: "Project context, attached",
        body: "Attach files, repositories, and instructions, so the agent works from the project's own context.",
      },
      {
        title: "Roles, tools, skills, and MCP",
        body: "Manage the agent's roles, tools, skills, and MCP connections from one place.",
      },
      {
        title: "Interactive or autonomous",
        body: "Work step by step with an agent, or let it run within explicitly granted permissions.",
      },
      {
        title: "Deliverables to review",
        body: "Follow agent activity, tool output, and code diffs, then review the files and artifacts it produces.",
      },
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
    rows: [
      {
        title: "One shared feed",
        body: "People, a shared project agent, and optional personal assistants in one chronological feed, with clear sender identification.",
      },
      {
        title: "A shared project agent",
        body: "One agent per project, designed to propose plans, milestones, and tasks, and to track progress and blockers.",
      },
      {
        title: "Private personal assistants",
        body: "Optional assistants for each member. Their conversations stay private unless explicitly shared.",
      },
      {
        title: "One clear project goal",
        body: "A shared goal with milestones, task owners, status, and blockers, visible to the whole team.",
      },
      {
        title: "Human approval",
        body: "Consequential actions, like sensitive code changes, merges, and production actions, wait for a person.",
      },
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
    // No "coming soon" wording on this page (owner decision, 2026-11-09).
    // Owner-supplied, 2026-11-09. Two sentences; the hero joins them and
    // lets the big heading wrap naturally.
    title: ["Two ways to work.", "One project context."],
    // Draft.
    subtitle:
      "Coordinate the team in Arena. Execute the work in Private.",
    // Owner choice, 2026-10-15. Opens the waitlist.
    primaryCta: "Get early access",
  },
  // "How they connect" and "People stay in charge", merged into one
  // screen-tall section at the owner's request (2026-11-09). Draft. From
  // PROJECT_BRIEF.md Part 6: Private, "Relationship with Arena", and Arena,
  // "Human oversight".
  loop: {
    eyebrow: "How it works",
    title: "One loop. People in charge.",
    subtitle:
      "Arena decides what needs to happen. Private is where it gets done. People approve what matters.",
    steps: [
      {
        label: "Arena",
        title: "Plan together",
        body: "The team and the project agent agree on the goal, the milestones, and who owns each task.",
      },
      {
        label: "Private",
        title: "Execute with AI",
        body: "An assigned task opens in Private, with the project's context, tools, and permissions.",
      },
      {
        label: "Arena",
        title: "Move forward as a team",
        body: "Status and deliverables sync back, so there are no disconnected copies of project state.",
      },
    ],
    syncBack: "Status and deliverables sync back to Arena",
    guardrailsLabel: "Guardrails at every step",
    guardrails: [
      {
        title: "Approval for consequential actions",
        body: "Sensitive code changes, merges, and production actions wait for a person.",
      },
      {
        title: "Permissions agents can't bypass",
        body: "Agents use only the tools and access they've been granted.",
      },
      {
        title: "Private by default",
        body: "Personal assistant conversations are shared only when a member chooses.",
      },
      {
        title: "Visible status and a record",
        body: "Working, waiting for approval, completed, or failed, with a record of what happened.",
      },
    ],
  },
  grid: {
    // Earlier approved section label.
    title: "What it's designed to do",
    // Draft.
    subtitle: "Across Private and Arena.",
  },
};
