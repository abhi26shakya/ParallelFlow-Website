import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { NAV_GROUPS, NAV_PRICING, type NavItem } from "@/lib/nav";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { CopyrightYear } from "./CopyrightYear";

type FooterColumn = { label: string; items: NavItem[] };

// Built from the navbar config. Only live links are shown, and a column with
// none (Resources today) is left out. Company links and Privacy/Terms are
// added only once their pages exist.
const COLUMNS: FooterColumn[] = NAV_GROUPS.map((group) => ({
  label: group.label,
  items:
    group.label === "Product" ? [...group.items, NAV_PRICING] : group.items,
}))
  .map((column) => ({
    ...column,
    items: column.items.filter((item) => item.href),
  }))
  .filter((column) => column.items.length > 0);

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted">{SITE_TAGLINE}</p>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.label} aria-label={column.label}>
              <p className="text-sm font-medium">{column.label}</p>
              <ul className="mt-3">
                {column.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href!}
                      className="inline-block py-1.5 text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {item.footerLabel ?? item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 text-sm text-muted">
          &copy; <CopyrightYear /> {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
