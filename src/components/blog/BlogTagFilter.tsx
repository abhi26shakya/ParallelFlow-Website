"use client";

import { useState, type ReactNode } from "react";

export type FilterablePost = {
  slug: string;
  tags: string[];
  featured: ReactNode;
  card: ReactNode;
  // The same card laid out full width, for a card alone on its row.
  wideCard: ReactNode;
};

// A card alone on the last row (an odd number of cards below the featured
// post) spans the full width and uses the wide layout, instead of leaving an
// empty gap beside it.
const isLone = (index: number, total: number) =>
  index === total - 1 && index % 2 === 0;

// Grid columns out of 12 on desktop: rows alternate wide/narrow and
// narrow/wide, so the grid reads like a magazine spread. Tablets get two
// equal columns, since a 5/12 column is too narrow there.
function span(index: number, total: number) {
  if (isLone(index, total)) return "md:col-span-2 lg:col-span-12";
  const wideFirst = Math.floor(index / 2) % 2 === 0;
  return (index % 2 === 0) === wideFirst ? "lg:col-span-7" : "lg:col-span-5";
}

// Topic chips above the posts. Filtering happens in the browser, so the
// page itself stays fully static. The newest matching post is featured.
export function BlogTagFilter({
  tags,
  posts,
}: {
  tags: string[];
  posts: FilterablePost[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const shown = active
    ? posts.filter((post) => post.tags.includes(active))
    : posts;
  const [featured, ...rest] = shown;

  const chip = (label: string, value: string | null) => {
    const selected = active === value;
    return (
      <li key={label}>
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => setActive(value)}
          className={`rounded-pill border px-4 py-1.5 text-sm transition-colors duration-200 ${
            selected
              ? "border-foreground bg-foreground text-background"
              : "border-line text-muted hover:border-foreground/40 hover:text-foreground"
          }`}
        >
          {label}
        </button>
      </li>
    );
  };

  return (
    <>
      {tags.length > 1 && (
        <ul aria-label="Filter by topic" className="mb-10 flex flex-wrap gap-2">
          {chip("All", null)}
          {tags.map((tag) => chip(tag, tag))}
        </ul>
      )}
      {/* Re-keyed on each filter so the posts fade in again. */}
      <div key={active ?? "all"} className="animate-fade-in">
        {featured && featured.featured}
        {rest.length > 0 && (
          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
            {rest.map((post, i) => (
              <li key={post.slug} className={span(i, rest.length)}>
                {isLone(i, rest.length) ? post.wideCard : post.card}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
