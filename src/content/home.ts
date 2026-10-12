// Home page copy below the hero. Owner-approved in Phase 5; every line comes
// from PROJECT_BRIEF.md (SDLC sections 2, 3, 5, 6; Parts 2, 6 and 7).
// Change wording only with the owner's approval.

export const VALUE_PROPOSITION =
  "ParallelFlow brings teams, AI agents, tasks, and project context into a connected workspace to help them plan, build, and ship together.";

export type HomeItem = {
  title: string;
  body: string;
};

export const HOME_HEADLINE =
  "AI-native development lifecycle enabling human-agent collaboration to build, track, communicate, and ship faster.";

export const PROBLEM = {
  label: "The problem",
  title: "Coding is getting faster. Shipping software is still complicated.",
  paragraphs: [
    "AI can generate code, explain errors, and automate individual tasks. But software development involves much more than writing code.",
    "Engineering teams still need to coordinate work, manage dependencies, review changes, test features, share decisions, and keep everyone aligned.",
    "When these activities happen across disconnected tools and isolated AI sessions, teams lose context and spend more time coordinating the work than moving it forward.",
  ],
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
  ] satisfies HomeItem[],
  result:
    "Faster individual tasks do not always translate into faster software delivery.",
};

export const WHY_NOW = {
  label: "Why now",
  title:
    "AI has made code generation faster, but the surrounding development lifecycle has not evolved at the same pace.",
  body: "Planning, approvals, reviews, testing, deployment, and handoffs limit the speed of AI-assisted development.",
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
  products: [
    {
      name: "Arena",
      role: "Coordinate the team",
      body: "Align people and AI around project goals, tasks, discussions, responsibilities, and progress.",
    },
    {
      name: "Workspace",
      role: "Execute the work",
      body: "Run AI-assisted sessions, work with project context, use available tools, and produce deliverables.",
    },
    {
      name: "Developer Space",
      role: "Configure capabilities",
      body: "Create and manage reusable agent roles, skills, tools, and integrations to adapt AI capabilities to the team's workflow.",
    },
  ],
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
  ] satisfies HomeItem[],
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
  ] satisfies HomeItem[],
};
