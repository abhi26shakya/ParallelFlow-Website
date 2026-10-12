// Single source for navbar (and, later, footer) links.
// An item with no `href` is not live yet and renders as a non-clickable
// "Coming soon" label. Add `href` only once the destination page exists.

export type NavItem = {
  label: string;
  href?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Product",
    items: [
      { label: "Arena" },
      { label: "Workspace" },
      { label: "Developer Space" },
    ],
  },
  {
    label: "Solutions",
    items: [{ label: "Engineering: SDLC" }],
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

// Top-level link without a dropdown. Not live until Phase 7.
export const NAV_PRICING: NavItem = { label: "Pricing" };
