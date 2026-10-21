import Link from "next/link";
import type { ComponentProps } from "react";

export type Variant = "primary" | "secondary" | "soft";

// neon-ring: the animated outline on every pill (see globals.css).
const base =
  "neon-ring inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-sm font-semibold transition-[color,background-color,box-shadow] duration-200";

// On hover the buttons glow rather than fade (owner request, 2026-10-15).
const variants: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:shadow-glow focus-visible:shadow-glow",
  secondary:
    "border border-line text-foreground hover:bg-hover hover:shadow-glow-soft [--neon-ring-inset:1px]",
  // Filled, no border: a quieter secondary action.
  soft: "bg-hover text-foreground hover:bg-line hover:shadow-glow-soft",
};

export function buttonClass(variant: Variant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

type LinkButtonProps = { href: string; variant?: Variant } & Omit<
  ComponentProps<typeof Link>,
  "href"
>;

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={buttonClass(variant, className)}
      {...props}
    />
  );
}

// Not-yet-available action: a real disabled button, no link and no handler.
export function DisabledButton({
  className = "",
  ...props
}: Omit<ComponentProps<"button">, "disabled" | "type">) {
  return (
    <button
      type="button"
      disabled
      className={`${base} ${variants.secondary} cursor-not-allowed text-muted opacity-80 hover:bg-transparent hover:shadow-none ${className}`}
      {...props}
    />
  );
}
