// Arena, Workspace and Developer Space page copy. Owner-approved in Phase 8;
// written from PROJECT_BRIEF.md Part 6 and the Part 1 "Lead with" points.
// Hero one-liners come from products.ts. Motion Design, LLM Wiki,
// version-control and named integrations are left out on purpose.
// Change wording only with the owner's approval.

import type { SectionItem } from "@/components/sections/Section";
import type { ProductSlug } from "./products";

export type ProductPageContent = {
  intro: string;
  emphasis?: string;
  previewPlaceholder: string;
  features: SectionItem[];
  connects: string;
};

export const PRODUCT_PAGE_LABELS = {
  eyebrow: "PRODUCT",
  features: "What it's designed to do",
  connects: "How it connects",
  connectsTitle: "One of three connected areas.",
  closingCta: "Join Waitlist",
};

// Closing line, adapted from the brief's "Desktop apps are coming soon.
// Join the waitlist for early access and product updates."
export function closingLine(name: string) {
  return `${name} is coming soon. Join the waitlist for early access and product updates.`;
}

export const PRODUCT_PAGES: Record<ProductSlug, ProductPageContent> = {
  arena: {
    intro:
      "Arena is designed to be a shared environment where people and AI agents work toward one clearly defined project goal. Not a traditional chatbot, but a place for communication, planning, delegation, reviews, and progress.",
    previewPlaceholder: "Arena preview coming soon",
    features: [
      {
        title: "One shared feed",
        body: "People, a shared project agent, and optional personal assistants in one chronological feed, with clear sender identification. Private conversations are never automatically exposed.",
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
    connects:
      "Arena determines what the team needs to accomplish. Tasks assigned in Arena are designed to open in Workspace, with status and deliverables syncing back.",
  },
  workspace: {
    intro:
      "Workspace is designed to be where the work is performed: start AI sessions, manage projects, configure agents, and execute tasks in one place. A capable workbench, not a generic chatbot.",
    previewPlaceholder: "Workspace preview coming soon",
    features: [
      {
        title: "Sessions tied to projects",
        body: "Each session belongs to a project, with its instructions, files, task history, and outputs kept together.",
      },
      {
        title: "Capabilities in one place",
        body: "Manage agent roles, tools, skills, and MCP connections from one place.",
      },
      {
        title: "Interactive or autonomous",
        body: "Work step by step with an agent, or let it run within explicitly granted permissions. Sensitive actions still need human approval.",
      },
    ],
    connects:
      "Workspace is where the work is performed. Tasks from Arena are designed to open here, and the roles and skills built in Developer Space are designed to be selectable here.",
  },
  "developer-space": {
    intro:
      "Developer Space is designed as a visual, low-code environment to create, test, manage, and share the extensions that shape what AI agents can do, without building every tool from scratch.",
    emphasis: "Configure visually. Reuse everywhere. Share securely.",
    previewPlaceholder: "Developer Space preview coming soon",
    features: [
      {
        title: "Visual, low-code builder",
        body: "Create roles and skills step by step, then preview, validate, and test them before sharing.",
      },
      {
        title: "Personal and team libraries",
        body: "Extensions are private by default. Share versioned extensions with your team, each with a clear owner.",
      },
      {
        title: "Secure sharing",
        body: "Credentials are never embedded in a shared extension, and sensitive capabilities require approval.",
      },
    ],
    connects:
      "Developer Space provides the reusable capabilities agents use. Extensions are designed to be selectable in Workspace and shareable with authorized projects and teams in Arena.",
  },
};
