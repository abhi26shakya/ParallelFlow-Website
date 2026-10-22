import { BuiltFor } from "@/components/home/BuiltFor";
import { ProblemStory } from "@/components/home/ProblemStory";
import { SolutionStory } from "@/components/home/SolutionStory";

// Home page sections below the hero.
export function HomeBody() {
  return (
    <>
      <ProblemStory />

      <SolutionStory />

      <BuiltFor />
    </>
  );
}
