"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ROLES,
  TEAM_SIZES,
  WORKFLOW_NOTES_MAX,
  waitlistFormSchema,
  type WaitlistFieldErrors,
} from "@/lib/waitlist/schema";

type Status = "idle" | "submitting" | "success" | "error";

type Values = {
  full_name: string;
  email: string;
  role: string;
  team_size: string;
  workflow_notes: string;
  website: string;
};

const EMPTY: Values = {
  full_name: "",
  email: "",
  role: "",
  team_size: "",
  workflow_notes: "",
  website: "",
};

const inputClass =
  "w-full rounded-control border border-field bg-background aria-invalid:border-foreground px-3 py-2.5 text-sm text-foreground placeholder:text-muted";

export function WaitlistForm({ initialEmail = "" }: { initialEmail?: string }) {
  const id = useId();
  const [values, setValues] = useState<Values>({ ...EMPTY, email: initialEmail });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<WaitlistFieldErrors>({});
  const startedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  // Read in an effect so the prerender stays free of the current time.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // After a failed submit, move focus to the first invalid field so keyboard
  // and screen reader users land on the problem.
  useEffect(() => {
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [fieldErrors]);

  // The form unmounts on success, so focus the confirmation to keep the
  // user's place and have it announced.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

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
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-card border border-line bg-background p-6 text-center"
      >
        You&apos;re on the list! We&apos;ll be in touch when ParallelFlow is
        ready.
      </p>
    );
  }

  const submitting = status === "submitting";
  const err = (key: keyof WaitlistFieldErrors) => fieldErrors[key]?.[0];

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5 text-left">
      <div>
        <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium">
          Full name <span className="font-normal text-muted">(required)</span>
        </label>
        <input
          id={`${id}-name`}
          name="full_name"
          type="text"
          autoComplete="name"
          // The modal focuses this field when it opens.
          data-autofocus
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
          Work email <span className="font-normal text-muted">(required)</span>
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

      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>

      <div>
        <label htmlFor={`${id}-notes`} className="mb-1.5 block text-sm font-medium">
          Tell us about your company&apos;s workflow and any suggestions you have{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id={`${id}-notes`}
          name="workflow_notes"
          rows={4}
          maxLength={WORKFLOW_NOTES_MAX}
          aria-invalid={!!err("workflow_notes")}
          aria-describedby={err("workflow_notes") ? `${id}-notes-err` : undefined}
          value={values.workflow_notes}
          onChange={(e) => set("workflow_notes", e.target.value)}
          className={`${inputClass} resize-y`}
        />
        {err("workflow_notes") && (
          <p id={`${id}-notes-err`} className="mt-1.5 text-sm text-foreground">
            {err("workflow_notes")}
          </p>
        )}
      </div>

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
        // aria-disabled rather than disabled: a disabled button drops keyboard
        // focus. onSubmit already ignores repeat submits while sending.
        aria-disabled={submitting}
        className="w-full rounded-pill bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-[color,background-color,box-shadow] duration-200 hover:shadow-glow focus-visible:shadow-glow aria-disabled:cursor-not-allowed aria-disabled:opacity-70 aria-disabled:shadow-none"
      >
        {submitting ? "Joining…" : "Join Waitlist"}
      </button>

      <p className="text-center text-xs text-muted">
        Your information is used to manage early access and product updates.
      </p>
    </form>
  );
}
