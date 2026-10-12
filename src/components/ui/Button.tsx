import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-sm font-semibold transition-colors";

const variants: Record<Variant, string> = {
  primary: "bg-foreground text-background hover:bg-muted",
  secondary: "border border-line text-foreground hover:bg-hover",
};

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
      className={`${base} ${variants[variant]} ${className}`}
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
      className={`${base} ${variants.secondary} cursor-not-allowed text-muted opacity-80 hover:bg-transparent ${className}`}
      {...props}
    />
  );
}
