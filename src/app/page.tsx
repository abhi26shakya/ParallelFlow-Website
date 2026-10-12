import { HomeBody } from "@/components/home/HomeBody";
import { Hero } from "@/components/home/Hero";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

export default function Home() {
  return (
    <main>
      <Hero />
      <HomeBody />
      <div className="border-t border-line">
        <section
          id="waitlist"
          className="mx-auto max-w-xl scroll-mt-(--navbar-height) px-4 py-20 sm:px-6 sm:py-24"
        >
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Join Waitlist
          </h2>
          <p className="mb-8 mt-3 text-center text-muted">
            Be among the first to explore ParallelFlow.
          </p>
          <WaitlistForm />
        </section>
      </div>
    </main>
  );
}
