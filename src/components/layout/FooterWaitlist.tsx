"use client";

import { ArrowRight } from "lucide-react";
import { useId, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { useWaitlistModal } from "@/components/waitlist/WaitlistModal";
import { waitlistFormSchema } from "@/lib/waitlist/schema";

// Footer email field. The waitlist also needs a name, so this only checks the
// email and hands it to the shared modal, which asks for the rest and shows
// success once the signup is saved.
export function FooterWaitlist() {
  const id = useId();
  const openWaitlist = useWaitlistModal();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const check = waitlistFormSchema.shape.email.safeParse(email);
    if (!check.success) {
      setError(check.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }
    setError("");
    setEmail("");
    openWaitlist({ email: check.data });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full lg:max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-label="Email address"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          className="h-11 w-full min-w-0 rounded-pill sm:flex-1 border border-field bg-background px-4 text-sm text-foreground placeholder:text-muted aria-invalid:border-foreground"
        />
        <button
          type="submit"
          aria-haspopup="dialog"
          className={buttonClass("primary", "group h-11 gap-2 py-0")}
        >
          Join waitlist
          <ArrowRight
            aria-hidden="true"
            className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
          />
        </button>
      </div>
      <p id={`${id}-error`} aria-live="polite" className="mt-2 min-h-5 text-sm text-foreground">
        {error}
      </p>
    </form>
  );
}
