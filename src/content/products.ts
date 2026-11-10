// Product names, links and one-line descriptions, shared by the navbar's
// Product dropdown and the Product page's Private and Arena sections. The
// old "role" lines were removed (owner request, 2026-11-10). Source:
// PROJECT_BRIEF.md Part 4, SDLC section 5.

export type ProductSlug = "arena" | "private";

export type Product = {
  slug: ProductSlug;
  name: string;
  href: string;
  body: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "arena",
    name: "Arena",
    href: "/product#arena",
    body: "Align people and AI around project goals, tasks, discussions, responsibilities, and progress.",
  },
  {
    slug: "private",
    name: "Private",
    href: "/product#private",
    body: "Run AI-assisted sessions, work with project context, use available tools, and produce deliverables.",
  },
];
