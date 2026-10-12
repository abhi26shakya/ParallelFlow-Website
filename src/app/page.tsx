import { Hero } from "@/components/home/Hero";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

// Sections below the hero arrive in Phase 5.
export default function Home() {
  return (
    <main>
      <Hero />
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          AI-native development lifecycle enabling human-agent collaboration to
          build, track, communicate, and ship faster.
        </h2>
      </section>
      <section
        id="waitlist"
        className="mx-auto max-w-xl scroll-mt-(--navbar-height) px-4 pb-24 pt-8 sm:px-6"
      >
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Join Waitlist
        </h2>
        <p className="mb-8 mt-3 text-center text-muted">
          Be among the first to explore ParallelFlow.
        </p>
        <WaitlistForm />
      </section>
    </main>
  );
}
