import { z } from "zod";

// Shared by the form (client) and POST /api/waitlist (server).
// Values are the stored slugs; labels are what the form shows.

export const ROLES = [
  { value: "founder", label: "Founder" },
  { value: "developer", label: "Software Engineer" },
  { value: "product_manager", label: "Product Manager" },
  { value: "designer", label: "Designer" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
] as const;

export const TEAM_SIZES = [
  { value: "just_me", label: "Just me" },
  { value: "2_5", label: "2–5" },
  { value: "6_10", label: "6–10" },
  { value: "11_50", label: "11–50" },
  { value: "50_plus", label: "50+" },
] as const;

// Longest free-text answer accepted; matches the DB check.
export const WORKFLOW_NOTES_MAX = 2000;

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
  workflow_notes: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z
      .string()
      .trim()
      .max(WORKFLOW_NOTES_MAX, `Keep this under ${WORKFLOW_NOTES_MAX} characters.`)
      .optional(),
  ),
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
