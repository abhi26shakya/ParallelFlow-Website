// Home page copy. Owner-approved in Phase 5; every line below the hero comes
// from PROJECT_BRIEF.md (SDLC sections 2, 3, 5, 6; Parts 2, 6 and 7). The hero
// copy is an owner-approved override of the brief's Part 4 hero.
// Product one-liners live in products.ts.
// Change wording only with the owner's approval.

import type { SectionItem } from "@/components/sections/Section";

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

export const AUDIENCE = {
  label: "Who it's for",
  title: "Software engineering teams using AI to build and ship software.",
  intro:
    "For teams that want to coordinate people, AI agents, tasks, tools, and shared context in one connected workflow.",
  items: [
    {
      title: "AI-native developers",
      body: "Use AI to write, debug, review, and maintain code, with fewer context switches and reusable agent capabilities.",
    },
    {
      title: "Startup founders and small engineering teams",
      body: "Coordinate people, AI, tasks, and deliverables with limited resources.",
    },
    {
      title: "Engineering leads and technical managers",
      body: "See progress, blockers, and responsibilities across work done by people and AI.",
    },
    {
      title: "AI agent builders and technical teams",
      body: "Experiment with agent workflows, tools, skills, and MCP.",
    },
  ] satisfies SectionItem[],
};
