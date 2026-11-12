import { WORKFLOW } from "@/content/product-page";

// Push, Stages and Roles in one text-only section after Arena (owner
// request, 2026-11-12): three bordered cards side by side from lg, stacked
// below. Each card keeps its own anchor.
export function WorkflowSection() {
  return (
    <section
      aria-label="Push, stages and roles"
      className="border-t border-line"
    >
      <ul className="mx-auto grid max-w-7xl gap-4 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-3">
        {WORKFLOW.map((item) => (
          <li
            key={item.id}
            id={item.id}
            className="flex flex-col rounded-card border border-line bg-card p-6 sm:p-8"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {item.eyebrow}
            </p>
            <h2 className="mt-4 text-[clamp(26px,2.4vw,34px)] font-light leading-[1.1] tracking-[-0.02em] text-balance">
              {item.title}
            </h2>
            <p className="mt-4 leading-relaxed text-pretty text-muted">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
