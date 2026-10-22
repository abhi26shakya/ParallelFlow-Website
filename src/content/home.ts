// Home page copy. Owner-approved in Phase 5; every line below the hero comes
// from PROJECT_BRIEF.md (SDLC sections 2, 3, 5, 6; Parts 2, 6 and 7). The hero
// copy is an owner-approved override of the brief's Part 4 hero.
// Product one-liners live in products.ts.
// Change wording only with the owner's approval.

export const VALUE_PROPOSITION =
  "ParallelFlow brings teams, AI agents, tasks, and project context into a connected workspace to help them plan, build, and ship together.";

export const HERO = {
  status: "Pre-launch · Waitlist open",
  title: "Let agents flow with your team",
  subtitle:
    "AI-native development lifecycle enabling human-agent collaboration to build, track, communicate, and ship faster.",
};

// Pinned problem list below the hero (ProblemStory.tsx). Owner-supplied copy,
// 2026-10-13; it replaces the brief's longer SDLC section 2 wording here.
// Five equal rows, each with its own visual.
export type ProblemItem = {
  title: string;
  lines: string[];
};

export const PROBLEM = {
  title: "The Problems",
  // Owner-supplied, 2026-10-15.
  subtitle: "Coding got faster. Everything around it didn't.",
  items: [
    {
      title: "Coding is getting faster.",
      lines: ["Shipping software is still complicated."],
    },
    {
      title: "Fragmented workflows",
      lines: [
        "Plan here. Code there. Ship somewhere else.",
        "Every stage lives in a different tool.",
      ],
    },
    {
      title: "Lost context",
      lines: [
        "Decisions get buried in old chats.",
        "Knowledge doesn't carry across sessions or teammates.",
      ],
    },
    {
      title: "Coordination overhead",
      lines: [
        "People are the glue.",
        "Assigning, tracking, unblocking, all by hand.",
      ],
    },
    {
      title: "Faster tasks ≠ faster shipping.",
      lines: [],
    },
  ] satisfies ProblemItem[],
};

// "The Solution" below the problems (SolutionStory.tsx). Owner-supplied copy,
// 2026-10-13; it replaces the Phase 5 solution paragraphs on the home page.
// Steps 1 to 4 have a title, a hook and a support line. The finale is three
// short lines with no support text.
export type SolutionStep = {
  title: string;
  hook: string;
  support: string;
};

export const SOLUTION = {
  title: "The Solution",
  // Owner-supplied, 2026-10-15.
  subtitle: "One place where humans and agents build, track, and ship together.",
  steps: [
    {
      title: "One connected workflow.",
      hook: "From idea to delivery.",
      support: "Every stage lives in one place.",
    },
    {
      title: "Shared project environment.",
      hook: "People, AI, tasks, and context together.",
      support: "No more scattered tools.",
    },
    {
      title: "Continuity built in.",
      hook: "Decisions stay with the project.",
      support: "Knowledge carries across sessions and teammates.",
    },
    {
      title: "Coordinated by design.",
      hook: "Plan, assign, and track in one flow.",
      support: "Less manual glue work.",
    },
  ] satisfies SolutionStep[],
  finale: ["Plan together.", "Execute with AI.", "Move forward as a team."],
};

// "Built for" section (BuiltFor.tsx), which replaces the old "Who it's for"
// grid. Owner-supplied copy, 2026-10-22. The headline reads "Built for"
// followed by the active role's phrase.
export type Role = {
  number: string;
  label: string;
  phrase: string;
  problem: string;
  actions: [string, string, string];
};

export const ROLES = {
  lead: "Built for",
  items: [
    {
      number: "01",
      label: "Developers",
      phrase: "AI-native developers.",
      problem:
        "You paste the same context into chat, editor, and terminal every session.",
      actions: [
        "Run agent sessions tied to your project",
        "Reuse skills for review, tests, and refactors",
        "Review diffs before anything merges",
      ],
    },
    {
      number: "02",
      label: "Founders",
      phrase: "founders.",
      problem:
        "A small team juggling people, agents, and deliverables across too many tools.",
      actions: [
        "Set one project goal everyone sees",
        "Split tasks between teammates and agents",
        "Approve what ships",
      ],
    },
    {
      number: "03",
      label: "Leads",
      phrase: "engineering leads.",
      problem: "You can't see what agents did without asking someone.",
      actions: [
        "Track owners, status, and blockers",
        "Follow work by people and AI in one feed",
        "Approve consequential actions",
      ],
    },
    {
      number: "04",
      label: "Agent builders",
      phrase: "agent builders.",
      problem: "Tools, skills, and MCP get wired up per agent, per machine.",
      actions: [
        "Manage roles, tools, and skills once",
        "Connect MCP servers per project",
        "Run interactive or autonomous, within permissions",
      ],
    },
  ] satisfies Role[],
};
