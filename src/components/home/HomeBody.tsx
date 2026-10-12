import {
  AUDIENCE,
  HOME_HEADLINE,
  HOW_IT_WORKS,
  OVERSIGHT,
  PROBLEM,
  SOLUTION,
  VALUE_PROPOSITION,
  WHY_NOW,
} from "@/content/home";
import { ItemGrid, Section } from "./Section";

// Home page sections between the hero and the waitlist form.
export function HomeBody() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {HOME_HEADLINE}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          {VALUE_PROPOSITION}
        </p>
      </section>

      <Section label={PROBLEM.label} title={PROBLEM.title}>
        <div className="mt-6 max-w-3xl space-y-4 text-lg text-muted">
          {PROBLEM.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <ItemGrid items={PROBLEM.items} />
        <p className="mt-12 max-w-3xl text-lg">
          <span className="font-semibold">The result:</span>{" "}
          <span className="text-muted">{PROBLEM.result}</span>
        </p>
      </Section>

      <Section label={WHY_NOW.label} title={WHY_NOW.title}>
        <p className="mt-6 max-w-3xl text-lg text-muted">{WHY_NOW.body}</p>
      </Section>

      <Section label={SOLUTION.label} title={SOLUTION.title}>
        <div className="mt-6 max-w-3xl space-y-4 text-lg text-muted">
          {SOLUTION.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <p className="mt-10 text-xl font-semibold sm:text-2xl">
          {SOLUTION.emphasis}
        </p>
      </Section>

      <Section label={HOW_IT_WORKS.label} title={HOW_IT_WORKS.title}>
        <p className="mt-6 max-w-3xl text-lg text-muted">
          {HOW_IT_WORKS.intro}
        </p>
        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          {HOW_IT_WORKS.products.map((product) => (
            <li
              key={product.name}
              className="rounded-card border border-line bg-card p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <span className="shrink-0 rounded-pill border border-line px-3 py-1 text-xs text-muted">
                  Coming soon
                </span>
              </div>
              <p className="mt-1 text-sm font-medium">{product.role}</p>
              <p className="mt-4 text-muted">{product.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section label={OVERSIGHT.label} title={OVERSIGHT.title}>
        <p className="mt-6 max-w-3xl text-lg text-muted">{OVERSIGHT.intro}</p>
        <ItemGrid items={OVERSIGHT.items} columns={2} />
      </Section>

      <Section label={AUDIENCE.label} title={AUDIENCE.title}>
        <p className="mt-6 max-w-3xl text-lg text-muted">{AUDIENCE.intro}</p>
        <ItemGrid items={AUDIENCE.items} columns={2} />
      </Section>
    </>
  );
}
