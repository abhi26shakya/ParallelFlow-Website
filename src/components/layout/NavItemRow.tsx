import Link from "next/link";
import type { NavItem } from "@/lib/nav";

// Desktop navbar items (a group's link or dropdown trigger): plain text, after
// openai.com. Inside Navbar's group/nav, the other items dim while one is
// hovered, and an open dropdown's trigger stays bright.
export const NAV_ITEM_CLASS =
  "inline-flex h-full items-center text-sm text-foreground transition-colors duration-100 group-hover/nav:text-muted hover:text-foreground! aria-expanded:text-foreground!";

// Live items render as links; items without an href render as a
// non-clickable "Coming soon" label (no fake or broken links).
// `onSelect` lets the open menu close itself, since the navbar stays mounted
// across page navigations. `large` is for the desktop dropdown panel and
// `medium` for the mobile menu. On the desktop panel, an item with a
// `description` renders as a rich row: its name above its one-liner, with a
// hover highlight, after x.ai's Products menu.
const SIZES = {
  default: {
    link: "block rounded-control px-3 py-2 text-sm text-foreground hover:bg-hover",
    label: "flex items-center justify-between gap-4 whitespace-nowrap px-3 py-2 text-sm text-muted",
  },
  medium: {
    link: "block rounded-control px-3 py-2 text-lg text-foreground hover:bg-hover",
    label: "flex items-center justify-between gap-4 whitespace-nowrap px-3 py-2 text-lg text-muted",
  },
  large: {
    link: "inline-block py-1 text-2xl font-medium tracking-tight text-foreground transition-colors duration-100 hover:text-muted",
    label: "flex items-baseline gap-3 whitespace-nowrap py-1 text-2xl font-medium tracking-tight text-muted",
  },
};

export function NavItemRow({
  item,
  onSelect,
  size = "default",
}: {
  item: NavItem;
  onSelect?: () => void;
  size?: keyof typeof SIZES;
}) {
  const styles = SIZES[size];
  if (item.href && item.description && size === "default") {
    return (
      <Link
        href={item.href}
        onClick={onSelect}
        className="block rounded-card px-4 py-3 transition-colors duration-100 hover:bg-hover focus-visible:bg-hover"
      >
        <span className="block text-base font-medium text-foreground">
          {item.label}
        </span>
        <span className="mt-0.5 block text-sm text-muted">
          {item.description}
        </span>
      </Link>
    );
  }
  if (item.href) {
    return (
      <Link href={item.href} onClick={onSelect} className={styles.link}>
        {item.label}
      </Link>
    );
  }
  return (
    <span aria-disabled="true" className={styles.label}>
      {item.label}
      <span className="text-xs font-normal tracking-normal">Coming soon</span>
    </span>
  );
}
