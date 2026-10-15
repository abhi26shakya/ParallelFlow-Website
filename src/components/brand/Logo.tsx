import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

// Temporary text wordmark. Replace the contents with the real logo asset
// once it exists; every placement (navbar, footer) uses this component.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} home`}
      className={`inline-flex items-center rounded-control text-lg font-semibold tracking-tight text-foreground ${className}`}
    >
      {SITE_NAME}
    </Link>
  );
}

// Placeholder symbol: two parallel slanted bars, after the brief's logo
// description ("parallel paths"). Decorative; replace with the real mark once
// logo assets exist. Not used in the navbar or footer yet.
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
    >
      <path d="M6.2 2h2.6L5.4 14H2.8z" />
      <path d="M11.2 2h2.6l-3.4 12H7.8z" />
    </svg>
  );
}
