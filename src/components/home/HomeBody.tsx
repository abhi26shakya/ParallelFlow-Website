import { AUDIENCE, HOW_IT_WORKS, OVERSIGHT } from "@/content/home";
import { ProblemStory } from "@/components/home/ProblemStory";
import { SolutionStory } from "@/components/home/SolutionStory";
import { ProductCards } from "@/components/sections/ProductCards";
import { ItemGrid, Section } from "@/components/sections/Section";

// Home page sections below the hero.
export function HomeBody() {
  return (
    <>
      <ProblemStory />

      <SolutionStory />

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
