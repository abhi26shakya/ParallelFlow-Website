import { AUDIENCE } from "@/content/home";
import { ProblemStory } from "@/components/home/ProblemStory";
import { SolutionStory } from "@/components/home/SolutionStory";
import { ItemGrid, Section } from "@/components/sections/Section";

// Home page sections below the hero.
export function HomeBody() {
  return (
    <>
      <ProblemStory />

      <SolutionStory />

      <Section label={AUDIENCE.label} title={AUDIENCE.title}>
        <p className="mt-6 max-w-3xl text-lg text-muted">{AUDIENCE.intro}</p>
        <ItemGrid items={AUDIENCE.items} columns={2} />
      </Section>
    </>
  );
}
