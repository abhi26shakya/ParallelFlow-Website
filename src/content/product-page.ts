// Product page copy, in page order. Rewritten 2026-11-12 from the owner's
// product page plan: a tour of the real product. Private and Arena pair
// their copy with a video; Push, Stages and Roles share one text-only
// section (owner request, 2026-11-12). Plain present tense on this page (owner decision,
// 2026-11-12). Unbuilt features are left out.
// Change wording only with the owner's approval.

import type { ProductSlug } from "./products";

export type SectionId = ProductSlug | "push" | "stages" | "roles" | "trust";

export type WorkflowItem = {
  id: SectionId;
  eyebrow: string;
  title: string;
  body: string;
};

// Private and Arena: a pinned accordion of features beside a looping video.
export type TourSectionContent = WorkflowItem & {
  bullets: { title: string; body: string }[];
  video: { src: string; label: string };
};

export const CTA_LABEL = "Join the waitlist";

export const PRODUCT_PAGE = {
  hero: {
    title: "The whole loop in one workspace.",
    subtitle:
      "Draft with AI in Private, push to your team's Arena, and move the project stage by stage, with a human approving every step.",
    demo: "Watch the full demo",
  },
  loop: {
    eyebrow: "How it works",
    title: "One loop. People in charge.",
    steps: [
      {
        label: "Private",
        title: "Draft with AI",
        body: "Plan, spec and code with your own AI, as real files.",
      },
      {
        label: "Push",
        title: "Push to Arena",
        body: "Share the finished draft with your team.",
      },
      {
        label: "Arena",
        title: "@AI + team",
        body: "Your team and AI work on it together, in one conversation.",
      },
      {
        label: "Stage gate",
        title: "Human approves",
        body: "A teammate approves, and the project moves to the next stage.",
      },
    ],
    returnLabel: "Progress and state written back",
  },
};

export const TOUR_SECTIONS: TourSectionContent[] = [
  {
    id: "private",
    eyebrow: "Private",
    title: "Think before you share.",
    body: "Your own AI workspace.",
    bullets: [
      {
        title: "Private chats",
        body: "Chat with an AI that drafts specs, plans and code as real files.",
      },
      {
        title: "Projects",
        body: "Your own folders that group related chats.",
      },
      {
        title: "My files",
        body: "Everything the AI drafted for you, in one place.",
      },
      {
        title: "Extensions",
        body: "Turn on specialist workflows for your private AI.",
      },
      {
        title: "Linked to arena",
        body: "A chat can draw on one arena's context, and that context never mixes with another arena's.",
      },
    ],
    video: {
      src: "/videos/private.mp4",
      label: "Private: the AI drafting a file",
    },
  },
  {
    id: "arena",
    eyebrow: "Arena",
    title: "Your team and AI, in one conversation.",
    body: "One shared room per project.",
    bullets: [
      {
        title: "Team chat",
        body: "Everyone on the project, in one conversation. Join with an invite link.",
      },
      {
        title: "@AI",
        body: "Answers with the whole Arena (messages and files) as context, streaming as it writes.",
      },
      {
        title: "File viewer",
        body: "Read any pushed file right there.",
      },
      {
        title: "One Arena, one AI context",
        body: "Projects never leak into each other.",
      },
    ],
    video: {
      src: "/videos/arena.mp4",
      label: "Arena: @AI replying to the team",
    },
  },
];

// Push, Stages and Roles, side by side in one section after Arena.
export const WORKFLOW: WorkflowItem[] = [
  {
    id: "push",
    eyebrow: "Push to Arena",
    title: "Share the result, not the mess.",
    body: "When a draft is ready, push it to the Arena. Your team gets a copy of the file. Your chat history stays yours.",
  },
  {
    id: "stages",
    eyebrow: "Stage gates",
    title: "Nothing moves until a human says so.",
    body: "Every project runs in stages (Plan → Build → Test → Ship). The AI does the work; a teammate reviews the approval card and approves. Every approval updates PROGRESS.md and STATE.md, so anyone can see where the project is and how it got there.",
  },
  {
    id: "roles",
    eyebrow: "Custom roles",
    title: "Your team, your roles.",
    body: "Start from a template or define roles like Frontend, Backend, QA or PM. Roles decide who approves which stage, so permissions follow responsibility, not job titles.",
  },
];

export const TRUST = {
  id: "trust" as const,
  eyebrow: "Guardrails",
  title: "AI does the work. Humans close the loop.",
  items: [
    {
      title: "AI can't approve",
      body: 'AI work can reach "in review", never "done". People approve gates.',
    },
    {
      title: "Arenas are isolated",
      body: "Each project's data and AI context are kept apart at the database level.",
    },
    {
      title: "Private is private",
      body: "Your Private space is visible only to you until you push.",
    },
    {
      title: "We don't log your content",
      body: "Messages, files and prompts never go into our logs.",
    },
  ],
};
