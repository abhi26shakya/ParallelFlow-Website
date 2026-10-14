// Single source for navbar and footer links.
// An item with no `href` is not live yet and renders as a non-clickable
// "Coming soon" label in the navbar and is left out of the footer. Add `href`
// only once the destination page exists.
// A group with an `href` and no items is a plain link with no dropdown.

export type NavItem = {
  label: string;
  href?: string;
  // Longer label for the footer, where there is room for it.
  footerLabel?: string;
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
    items: [],
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
