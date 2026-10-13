"use client";

import type { ComponentProps } from "react";
import { buttonClass, type Variant } from "@/components/ui/Button";
import { useWaitlistModal } from "./WaitlistModal";

// Every Join Waitlist button on the site. Opens the shared waitlist modal.
export function WaitlistButton({
  variant = "primary",
  className = "",
  children = "Join Waitlist",
  onClick,
  ...props
}: { variant?: Variant } & Omit<ComponentProps<"button">, "type">) {
  const openWaitlist = useWaitlistModal();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={buttonClass(variant, className)}
      onClick={(e) => {
        onClick?.(e);
        openWaitlist();
      }}
      {...props}
    >
      {children}
    </button>
  );
}
