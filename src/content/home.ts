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

export const SOLUTION = {
  label: "The solution",
  title: "One connected workflow from idea to delivery.",
  paragraphs: [
    "ParallelFlow is designed to connect the people, AI capabilities, tasks, and project context involved in software development.",
    "Instead of treating every AI interaction as a separate conversation, ParallelFlow brings work into a shared project environment where teams can coordinate tasks, execute work, and maintain continuity.",
  ],
  emphasis: "Plan together. Execute with AI. Move forward as a team.",
};

export const HOW_IT_WORKS = {
  label: "How it works",
  title: "From isolated tools to coordinated work.",
  intro:
    "Arena determines what the team needs to accomplish. Workspace is where the work is performed. Developer Space provides the reusable capabilities agents use.",
};

export const OVERSIGHT = {
  label: "Trust",
  title: "Human oversight",
  intro:
    "Keep people involved in important decisions and require approval for sensitive operations when appropriate.",
  items: [
    {
      title: "Clear ownership",
      body: "Every task has a clear owner, and agent status stays visible.",
    },
    {
      title: "Approval for consequential actions",
      body: "Sensitive code changes, merges, permission changes, and production actions require human approval.",
    },
    {
      title: "Permissions",
      body: "Agents cannot bypass permissions or approvals.",
    },
    {
      title: "Private personal assistants",
      body: "Personal assistants are optional and member-controlled. Private conversations are never automatically exposed.",
    },
  ] satisfies SectionItem[],
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
