// Navbar links. The footer keeps its own list in Footer.tsx.
// An item with no `href` is not live yet and renders as a non-clickable
// "Coming soon" label. Add `href` only once the destination page exists.
// A group with an `href` and no items is a plain link with no dropdown. A
// group with an `href` and items opens a dropdown. Items with a `description` render as rich rows
// (name above a one-liner), after x.ai's Products menu.

import { PRODUCTS, type ProductSlug } from "@/content/products";

export type NavItem = {
  label: string;
  href?: string;
  // One-liner shown under the label in the navbar dropdown.
  description?: string;
};

// Product page order (owner-approved 2026-10-14). Names, links and one-liners
// come from products.ts.
const PRODUCT_ORDER: ProductSlug[] = ["private", "arena"];

const PRODUCT_ITEMS: NavItem[] = PRODUCT_ORDER.map((slug) => {
  const product = PRODUCTS.find((p) => p.slug === slug)!;
  return {
    label: product.name,
    href: product.href,
    description: product.body,
  };
});

export type NavGroup = {
  label: string;
  href?: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Product",
    href: "/product",
    // A dropdown again since 2026-10-15 (owner request).
    items: PRODUCT_ITEMS,
  },
  // Solutions and Resources removed 2026-10-21 (owner request).
  // Added 2026-10-25 (owner request).
  { label: "Blog", href: "/blog", items: [] },
];
