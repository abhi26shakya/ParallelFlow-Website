"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AI_TOOLS,
  EARLY_ACCESS_OPTIONS,
  ORGANIZATION_INTEREST_OPTIONS,
  ROLES,
  TEAM_SIZES,
  WORKFLOW_CHALLENGES,
  waitlistFormSchema,
  type WaitlistFieldErrors,
} from "@/lib/waitlist/schema";

type Status = "idle" | "submitting" | "success" | "error";

type Values = {
  full_name: string;
  email: string;
  role: string;
  team_size: string;
  current_ai_tools: string[];
  workflow_challenges: string[];
  early_access_interest: string;
  organization_interest: string;
  website: string;
};

const EMPTY: Values = {
  full_name: "",
  email: "",
  role: "",
  team_size: "",
  current_ai_tools: [],
  workflow_challenges: [],
  early_access_interest: "",
  organization_interest: "",
  website: "",
};

const inputClass =
  "w-full rounded-control border border-line bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted";

export function WaitlistForm() {
  const id = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<WaitlistFieldErrors>({});
  const startedAt = useRef<number | null>(null);

  // Read in an effect so the prerender stays free of the current time.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const toggle = (
    key: "current_ai_tools" | "workflow_challenges",
    value: string,
  ) =>
    setValues((v) => ({
      ...v,
      [key]: v[key].includes(value)
        ? v[key].filter((x) => x !== value)
        : [...v[key], value],
    }));

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const { website, ...answers } = values;
    const check = waitlistFormSchema.safeParse(answers);
    if (!check.success) {
      const errors: WaitlistFieldErrors = {};
      for (const issue of check.error.issues) {
        const key = issue.path[0] as keyof WaitlistFieldErrors;
        (errors[key] ??= []).push(issue.message);
      }
      setFieldErrors(errors);
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...answers,
          website,
          startedAt: startedAt.current ?? undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: WaitlistFieldErrors;
      };
      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      setFieldErrors(data.fieldErrors ?? {});
      setStatus("error");
      setMessage(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("Network error. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-card border border-line bg-card p-6 text-center"
      >
        You&apos;re on the waitlist. We&apos;ll be in touch about early access
        and product updates.
      </p>
    );
  }

  const submitting = status === "submitting";
  const err = (key: keyof WaitlistFieldErrors) => fieldErrors[key]?.[0];

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 text-left">
      <div>
        <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium">
          Full name <span className="font-normal text-muted">(required)</span>
        </label>
        <input
          id={`${id}-name`}
          name="full_name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={!!err("full_name")}
          aria-describedby={err("full_name") ? `${id}-name-err` : undefined}
          value={values.full_name}
          onChange={(e) => set("full_name", e.target.value)}
          className={inputClass}
        />
        {err("full_name") && (
          <p id={`${id}-name-err`} className="mt-1.5 text-sm text-foreground">
            {err("full_name")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium">
          Email address <span className="font-normal text-muted">(required)</span>
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={!!err("email")}
          aria-describedby={err("email") ? `${id}-email-err` : undefined}
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          className={inputClass}
        />
        {err("email") && (
          <p id={`${id}-email-err`} className="mt-1.5 text-sm text-foreground">
            {err("email")}
          </p>
        )}
      </div>

      <details className="group rounded-card border border-line">
        <summary className="cursor-pointer select-none rounded-card px-4 py-3 text-sm font-medium hover:bg-hover">
          Tell us more <span className="font-normal text-muted">(optional)</span>
        </summary>
        <div className="space-y-5 border-t border-line p-4">
          <div>
            <label htmlFor={`${id}-role`} className="mb-1.5 block text-sm font-medium">
              Role
            </label>
            <select
              id={`${id}-role`}
              value={values.role}
              onChange={(e) => set("role", e.target.value)}
              className={inputClass}
            >
              <option value="">Select a role</option>
              {ROLES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${id}-size`} className="mb-1.5 block text-sm font-medium">
              Team size
            </label>
            <select
              id={`${id}-size`}
              value={values.team_size}
              onChange={(e) => set("team_size", e.target.value)}
              className={inputClass}
            >
              <option value="">Select a team size</option>
              {TEAM_SIZES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <CheckboxGroup
            legend="Current AI tools"
            options={AI_TOOLS}
            selected={values.current_ai_tools}
            onToggle={(v) => toggle("current_ai_tools", v)}
          />
          <CheckboxGroup
            legend="Biggest workflow challenge"
            options={WORKFLOW_CHALLENGES}
            selected={values.workflow_challenges}
            onToggle={(v) => toggle("workflow_challenges", v)}
          />
          <RadioGroup
            legend="Would you be willing to test early versions of ParallelFlow and share feedback?"
            name={`${id}-early`}
            options={EARLY_ACCESS_OPTIONS}
            value={values.early_access_interest}
            onChange={(v) => set("early_access_interest", v)}
          />
          <RadioGroup
            legend="Are you interested in ParallelFlow for your organization?"
            name={`${id}-org`}
            options={ORGANIZATION_INTEREST_OPTIONS}
            value={values.organization_interest}
            onChange={(v) => set("organization_interest", v)}
          />
        </div>
      </details>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </label>
      </div>

      <div aria-live="polite" className="text-sm">
        {status === "error" && message}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-pill bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Joining…" : "Join Waitlist"}
      </button>

      <p className="text-center text-xs text-muted">
        Your information is used to manage early access and product updates.
      </p>
    </form>
  );
}

function CheckboxGroup({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  options: readonly { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={selected.includes(o.value)}
              onChange={() => onToggle(o.value)}
              className="size-4 accent-white"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RadioGroup({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 text-sm text-muted">
            <input
              type="radio"
              name={name}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="size-4 accent-white"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
