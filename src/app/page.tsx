import { Hero } from "@/components/home/Hero";

// The waitlist form arrives in Phase 4; sections below the hero in Phase 5.
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
        className="mx-auto flex min-h-[50vh] max-w-2xl scroll-mt-(--navbar-height) flex-col items-center justify-center px-4 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Join Waitlist
        </h2>
        <p className="mt-4 text-muted">
          The waitlist form is coming in the next build step. Check back soon.
        </p>
      </section>
    </main>
  );
}
