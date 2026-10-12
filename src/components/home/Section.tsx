import type { HomeItem } from "@/content/home";

// Shared layout for the home sections below the hero: small label,
// section heading, then the section's own content.
export function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
        <p className="text-sm font-medium text-muted">{label}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

// Titled points separated by top borders rather than nested cards.
export function ItemGrid({
  items,
  columns = 3,
}: {
  items: HomeItem[];
  columns?: 2 | 3;
}) {
  return (
    <ul
      className={`mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}
    >
      {items.map((item) => (
        <li key={item.title} className="border-t border-line pt-5">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="mt-2 text-muted">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}
