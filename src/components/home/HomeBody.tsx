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
import { ProductCards } from "@/components/sections/ProductCards";
import { ItemGrid, Section } from "@/components/sections/Section";

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

      <Section
        id="how-it-works"
        label={HOW_IT_WORKS.label}
        title={HOW_IT_WORKS.title}
      >
        <p className="mt-6 max-w-3xl text-lg text-muted">
          {HOW_IT_WORKS.intro}
        </p>
        <ProductCards />
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
