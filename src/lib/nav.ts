// Single source for navbar and footer links.
// An item with no `href` is not live yet and renders as a non-clickable
// "Coming soon" label in the navbar and is left out of the footer. Add `href`
// only once the destination page exists.
// A group with an `href` and no items is a plain link with no dropdown. A
// group with an `href` and items opens a dropdown in the navbar; the footer
// shows only its `href`. Items with a `description` render as rich rows
// (name above a one-liner), after x.ai's Products menu.

import { PRODUCTS, type ProductSlug } from "@/content/products";

export type NavItem = {
  label: string;
  href?: string;
  // Longer label for the footer, where there is room for it.
  footerLabel?: string;
  // One-liner shown under the label in the navbar dropdown.
  description?: string;
};

// Product page order (owner-approved 2026-10-14). Names, links and one-liners
// come from products.ts.
const PRODUCT_ORDER: ProductSlug[] = ["workspace", "arena", "developer-space"];

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
  {
    label: "Solutions",
    items: [
      {
        label: "Engineering: SDLC",
        href: "/solutions/engineering/sdlc",
        footerLabel: "Software Development Lifecycle (SDLC)",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Packages" },
      { label: "Documentation" },
      { label: "Developer Resources" },
    ],
  },
];
