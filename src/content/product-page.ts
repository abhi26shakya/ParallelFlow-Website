// Product page copy, in page order. Rewritten 2026-11-12 from the owner's
// product page plan: a tour of the real product, where each section pairs
// its copy with a screen. Plain present tense on this page (owner decision,
// 2026-11-12); anything not built yet appears only under "Coming soon".
// Change wording only with the owner's approval.

import type { ProductSlug } from "./products";

export type SectionId = ProductSlug | "push" | "stages" | "roles" | "trust";

// A section's visual: a looping product video, or an empty 16:9 frame that
// waits for footage from the live app (owner choice, 2026-11-12).
export type SectionMedia =
  | { kind: "video"; src: string; label: string }
  | { kind: "slot"; label: string };

export type TourSectionContent = {
  id: SectionId;
  // The label in the sticky sub-navigation.
  nav: string;
  eyebrow: string;
  title: string;
  body?: string;
  bullets?: { title: string; body: string }[];
  media: SectionMedia;
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
    nav: "Private",
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
    media: {
      kind: "video",
      src: "/videos/private.mp4",
      label: "Private: the AI drafting a file",
    },
  },
  {
    id: "push",
    nav: "Push",
    eyebrow: "Push to Arena",
    title: "Share the result, not the mess.",
    body: "When a draft is ready, push it to the Arena. Your team gets a copy of the file. Your chat history stays yours.",
    media: { kind: "slot", label: "Push to Arena" },
  },
  {
    id: "arena",
    nav: "Arena",
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
    media: {
      kind: "video",
      src: "/videos/arena.mp4",
      label: "Arena: @AI replying to the team",
    },
  },
  {
    id: "stages",
    nav: "Stages",
    eyebrow: "Stage gates",
    title: "Nothing moves until a human says so.",
    body: "Every project runs in stages (Plan → Build → Test → Ship). The AI does the work; a teammate reviews the approval card and approves. Every approval updates PROGRESS.md and STATE.md, so anyone can see where the project is and how it got there.",
    media: { kind: "slot", label: "Stage strip and approval card" },
  },
  {
    id: "roles",
    nav: "Roles",
    eyebrow: "Custom roles",
    title: "Your team, your roles.",
    body: "Start from a template or define roles like Frontend, Backend, QA or PM. Roles decide who approves which stage, so permissions follow responsibility, not job titles.",
    media: { kind: "slot", label: "Roles and templates" },
  },
];

export const TRUST = {
  id: "trust" as const,
  nav: "Trust",
  eyebrow: "Guardrails",
  title: "AI does the work. Humans close the loop.",
  items: [
    {
      title: "AI can't approve",
      body: "AI work can reach \"in review\", never \"done\". People approve gates.",
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

export const COMING_SOON = {
  title: "Coming soon",
  items: [
    {
      title: "Developer mode",
      body: "Run coding agents from your editor, connected to your Arena.",
    },
    {
      title: "Autonomous runs",
      body: "Let the AI run within the permissions you grant.",
    },
    {
      title: "Tool connections (MCP)",
      body: "Connect tools to each project.",
    },
  ],
};

export const FAQ = {
  title: "Questions",
  items: [
    {
      q: "Is this a chat app or a project tool?",
      a: "Both: chat is where the work happens, and stages are how it moves forward.",
    },
    {
      q: "What does the AI know?",
      a: "In an Arena, only that Arena's messages and files. In Private, only your own chats and whatever you link.",
    },
    {
      q: "Does it replace my coding tools?",
      a: "No. Keep Cursor or Claude Code; ParallelFlow is where the team's work meets.",
    },
    {
      q: "Which models?",
      a: "Leading models via OpenRouter.",
    },
  ],
};

export const FINAL_CTA = {
  title: "See the whole loop for yourself.",
};

// The sticky sub-navigation, in page order.
export const SUBNAV = [
  ...TOUR_SECTIONS.map(({ id, nav }) => ({ id, label: nav })),
  { id: TRUST.id, label: TRUST.nav },
];
