// Navbar links. The footer keeps its own list in Footer.tsx.
// An item with no `href` is not live yet and renders as a non-clickable
// "Coming soon" label. Add `href` only once the destination page exists.
// A group with an `href` and no items is a plain link with no dropdown. A
// group with an `href` and items opens a dropdown. Items with a `description` render as rich rows
// (name above a one-liner), after x.ai's Products menu.

export type NavItem = {
  label: string;
  href?: string;
  // One-liner shown under the label in the navbar dropdown.
  description?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Product",
    href: "/product",
    // A plain link since 2026-11-12: the Private and Arena dropdown items
    // were removed (owner request).
    items: [],
  },
  // Solutions and Resources removed 2026-10-21 (owner request).
  // Added 2026-10-25 (owner request).
  { label: "Blog", href: "/blog", items: [] },
];
