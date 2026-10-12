// Phase 2 placeholder. The hero arrives in Phase 3; the waitlist form in Phase 4.
export default function Home() {
  return (
    <main>
      <section
        id="waitlist"
        className="mx-auto flex min-h-[70vh] max-w-2xl scroll-mt-(--navbar-height) flex-col items-center justify-center px-4 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Join Waitlist
        </h1>
        <p className="mt-4 text-muted">
          The waitlist form is coming in the next build step. Check back soon.
        </p>
      </section>
    </main>
  );
}
