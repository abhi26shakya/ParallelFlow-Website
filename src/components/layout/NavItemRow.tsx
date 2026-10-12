import Link from "next/link";
import type { NavItem } from "@/lib/nav";

// Live items render as links; items without an href render as a
// non-clickable "Coming soon" label (no fake or broken links).
export function NavItemRow({ item }: { item: NavItem }) {
  if (item.href) {
    return (
      <Link
        href={item.href}
        className="block rounded-control px-3 py-2 text-sm text-foreground hover:bg-hover"
      >
        {item.label}
      </Link>
    );
  }
  return (
    <span
      aria-disabled="true"
      className="flex items-center justify-between gap-4 whitespace-nowrap px-3 py-2 text-sm text-muted"
    >
      {item.label}
      <span className="text-xs">Coming soon</span>
    </span>
  );
}
