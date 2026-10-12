import { z } from "zod";

// Shared by the form (client) and POST /api/waitlist (server).
// Values are the stored slugs; labels are what the form shows.

export const ROLES = [
  { value: "developer", label: "Developer / Engineer" },
  { value: "founder", label: "Founder" },
  { value: "product_manager", label: "Product / Project Manager" },
  { value: "designer", label: "Designer" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
] as const;

export const TEAM_SIZES = [
  { value: "just_me", label: "Just me" },
  { value: "2_10", label: "2–10" },
  { value: "11_50", label: "11–50" },
  { value: "51_200", label: "51–200" },
  { value: "200_plus", label: "200+" },
] as const;

export const AI_TOOLS = [
  { value: "claude_code", label: "Claude Code" },
  { value: "openai_codex", label: "OpenAI Codex" },
  { value: "cursor", label: "Cursor" },
  { value: "github_copilot", label: "GitHub Copilot" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "other", label: "Other" },
  { value: "none", label: "None" },
] as const;

export const WORKFLOW_CHALLENGES = [
  { value: "tool_switching", label: "Switching between different tools" },
  {
    value: "coordinating_humans_agents",
    label: "Coordinating humans and AI agents",
  },
  { value: "repetitive_tasks", label: "Repetitive manual tasks" },
  { value: "tracking_progress", label: "Tracking tasks and project progress" },
  {
    value: "sharing_context",
    label: "Sharing project knowledge and context",
  },
  {
    value: "connecting_tools",
    label: "Connecting tools and automating workflows",
  },
  { value: "other", label: "Other" },
] as const;

export const EARLY_ACCESS_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no", label: "No" },
] as const;

export const ORGANIZATION_INTEREST_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "maybe", label: "Maybe" },
  { value: "no_individual_or_team", label: "No, individual or team use" },
] as const;

type Option = { readonly value: string };
const values = <T extends readonly [Option, ...Option[]]>(options: T) =>
  options.map((o) => o.value) as unknown as [
    T[number]["value"],
    ...T[number]["value"][],
  ];

// An unanswered optional question arrives as "" (or is missing) and is
// stored as empty, never as a default.
const optionalEnum = <T extends readonly [Option, ...Option[]]>(options: T) =>
  z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.enum(values(options)).optional(),
  );

const optionalMulti = <T extends readonly [Option, ...Option[]]>(options: T) =>
  z.array(z.enum(values(options))).max(options.length).optional();

export const waitlistFormSchema = z.object({
  full_name: z
    .string({ error: "Enter your full name." })
    .trim()
    .min(1, "Enter your full name.")
    .max(200, "Name is too long."),
  email: z
    .string({ error: "Enter a valid email address." })
    .trim()
    .toLowerCase()
    .max(254, "Enter a valid email address.")
    .pipe(z.email("Enter a valid email address.")),
  role: optionalEnum(ROLES),
  team_size: optionalEnum(TEAM_SIZES),
  current_ai_tools: optionalMulti(AI_TOOLS),
  workflow_challenges: optionalMulti(WORKFLOW_CHALLENGES),
  early_access_interest: optionalEnum(EARLY_ACCESS_OPTIONS),
  organization_interest: optionalEnum(ORGANIZATION_INTEREST_OPTIONS),
});

export type WaitlistFormValues = z.input<typeof waitlistFormSchema>;
export type WaitlistSignup = z.output<typeof waitlistFormSchema>;

// Anti-spam fields the form adds on top of the signup answers.
export const waitlistRequestSchema = waitlistFormSchema.extend({
  // Honeypot: hidden from people, so a real signup leaves it empty.
  website: z.string().max(0).optional(),
  // When the form was shown (ms since epoch); used for a minimum-time check.
  startedAt: z.number().int().optional(),
});

export type WaitlistFieldErrors = Partial<
  Record<keyof WaitlistFormValues, string[]>
>;
