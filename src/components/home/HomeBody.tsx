import {
  AUDIENCE,
  HOW_IT_WORKS,
  OVERSIGHT,
  SOLUTION,
  WHY_NOW,
} from "@/content/home";
import { ProblemStory } from "@/components/home/ProblemStory";
import { ProductCards } from "@/components/sections/ProductCards";
import { ItemGrid, Section } from "@/components/sections/Section";

// Home page sections below the hero.
export function HomeBody() {
  return (
    <>
      <ProblemStory />

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
