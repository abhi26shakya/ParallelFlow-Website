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
