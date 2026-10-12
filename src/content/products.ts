// One-line product descriptions shared by the home page, the SDLC page and
// the product pages. Source: PROJECT_BRIEF.md Part 4, SDLC section 5.

export type ProductSlug = "arena" | "workspace" | "developer-space";

export type Product = {
  slug: ProductSlug;
  name: string;
  href: string;
  role: string;
  body: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "arena",
    name: "Arena",
    href: "/product/arena",
    role: "Coordinate the team",
    body: "Align people and AI around project goals, tasks, discussions, responsibilities, and progress.",
  },
  {
    slug: "workspace",
    name: "Workspace",
    href: "/product/workspace",
    role: "Execute the work",
    body: "Run AI-assisted sessions, work with project context, use available tools, and produce deliverables.",
  },
  {
    slug: "developer-space",
    name: "Developer Space",
    href: "/product/developer-space",
    role: "Configure capabilities",
    body: "Create and manage reusable agent roles, skills, tools, and integrations to adapt AI capabilities to the team's workflow.",
  },
];
