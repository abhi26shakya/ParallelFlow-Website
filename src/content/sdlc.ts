// Solutions → Engineering → SDLC page copy, word for word from
// PROJECT_BRIEF.md Part 4. Join the Waitlist buttons are left out by owner
// decision (Phase 6); the navbar's Join waitlist is the signup path.
// Product one-liners for section 5 live in products.ts.
// Change wording only with the owner's approval.

import type { SectionItem } from "@/components/sections/Section";

export const SDLC_HERO = {
  eyebrow: "SOLUTIONS / ENGINEERING",
  title: "The software development lifecycle, working as one.",
  paragraphs: [
    "Bring planning, coding, reviews, testing, and delivery into a connected workflow where people and AI can work together.",
    "ParallelFlow helps engineering teams coordinate work, maintain shared context, and move from an idea to a shipped product with less friction.",
  ],
  secondaryCta: { label: "Explore the Platform", href: "/#how-it-works" },
};

export const SDLC_PROBLEM = {
  label: "The Problem",
  title: "Coding is getting faster. Shipping software is still complicated.",
  paragraphs: [
    "AI can generate code, explain errors, and automate individual tasks. But software development involves much more than writing code.",
    "Engineering teams still need to coordinate work, manage dependencies, review changes, test features, share decisions, and keep everyone aligned.",
    "When these activities happen across disconnected tools and isolated AI sessions, teams lose context and spend more time coordinating the work than moving it forward.",
  ],
  result:
    "Faster individual tasks do not always translate into faster software delivery.",
  items: [
    {
      title: "Fragmented workflows",
      body: "Planning, communication, development, testing, and delivery often happen in separate tools.",
    },
    {
      title: "Lost context",
      body: "Decisions, project knowledge, and previous AI interactions are difficult to carry across sessions and teammates.",
    },
    {
      title: "Coordination overhead",
      body: "People must manually assign tasks, track progress, resolve blockers, and connect the outputs of different tools.",
    },
  ] satisfies SectionItem[],
};

export const SDLC_SOLUTION = {
  label: "The Solution",
  title: "One connected workflow from idea to delivery.",
  paragraphs: [
    "ParallelFlow is designed to connect the people, AI capabilities, tasks, and project context involved in software development.",
    "Instead of treating every AI interaction as a separate conversation, ParallelFlow brings work into a shared project environment where teams can coordinate tasks, execute work, and maintain continuity.",
  ],
  emphasis: "Plan together. Execute with AI. Move forward as a team.",
  items: [
    {
      title: "Shared context",
      body: "Keep project goals, decisions, instructions, and relevant knowledge accessible to authorized teammates and agents.",
    },
    {
      title: "Connected execution",
      body: "Link planned work to the sessions, tools, and deliverables used to complete it.",
    },
    {
      title: "Human-agent collaboration",
      body: "Let people and AI contribute to the same broader workflow, with clear responsibilities and human oversight.",
    },
    {
      title: "Continuous progress",
      body: "Make task status, blockers, and completed work easier to follow.",
    },
  ] satisfies SectionItem[],
};

// The brief requires this to read as the lifecycle ParallelFlow aims to
// support, not as available features.
export const SDLC_WORKFLOW = {
  label: "The SDLC Workflow",
  title: "Every stage connected. Every handoff with context.",
  note: "The lifecycle ParallelFlow aims to support.",
  stages: [
    {
      title: "Plan",
      body: "Turn product ideas and requirements into clear tasks, milestones, and priorities. Give the team a shared understanding of what needs to be built.",
    },
    {
      title: "Design",
      body: "Define technical approaches, explore alternatives, document decisions, and establish the context needed before implementation begins.",
    },
    {
      title: "Develop",
      body: "Use AI-assisted execution to work on code, explore repositories, solve problems, and produce development artifacts within the project's workflow.",
    },
    {
      title: "Review",
      body: "Bring changes, explanations, and relevant context together to support code review, feedback, and human approval.",
    },
    {
      title: "Test",
      body: "Connect implementation work with testing tasks, test results, and identified issues so problems can be tracked and addressed.",
    },
    {
      title: "Deploy and Maintain",
      body: "Track delivery tasks, document releases, follow up on issues, and preserve knowledge for future development cycles.",
    },
  ] satisfies SectionItem[],
};

export const SDLC_CONNECTS = {
  label: "How ParallelFlow Connects the Workflow",
  title: "From isolated tools to coordinated work.",
  outro:
    "Together, these areas form a connected approach to planning, execution, and customization without treating each activity as an isolated process.",
};

export const SDLC_REALITIES = {
  label: "Built for the Realities of Engineering Teams",
  title: "More than code generation.",
  items: [
    {
      title: "Long-running work",
      body: "Keep tasks and project context organized beyond a single AI conversation, supporting continuity where the underlying system permits it.",
    },
    {
      title: "Team-wide knowledge",
      body: "Make important decisions, technical documentation, and project instructions easier to find and reuse, subject to access permissions.",
    },
    {
      title: "Flexible workflows",
      body: "Configure reusable capabilities and tools around the needs of different projects and engineering teams.",
    },
    {
      title: "Human oversight",
      body: "Keep people involved in important decisions and require approval for sensitive operations when appropriate.",
    },
    {
      title: "Connected tools",
      body: "Bring supported development tools and integrations into the workflow.",
    },
  ] satisfies SectionItem[],
};

export const SDLC_OUTCOME = {
  label: "The Outcome",
  title: "Spend less time coordinating work. Spend more time shipping it.",
  intro: "ParallelFlow's goal is to help engineering teams:",
  goals: [
    "Reduce repetitive coordination and context switching.",
    "Make project status and ownership easier to understand.",
    "Reuse knowledge instead of repeatedly explaining the same context.",
    "Connect AI-assisted work with the team's broader development process.",
    "Build workflows that can evolve as AI capabilities improve.",
  ],
  closing:
    "The goal is not simply to make individual developers faster. It is to help the entire team work more effectively together.",
};

export const SDLC_CLOSING = {
  title: "Your team's workflow should move as fast as your AI.",
  body: "Connect planning, execution, and collaboration in a workspace designed for how software teams are evolving.",
};
