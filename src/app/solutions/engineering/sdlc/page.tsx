import type { Metadata } from "next";
import { PreviewSlot } from "@/components/sections/PreviewSlot";
import { ProductCards } from "@/components/sections/ProductCards";
import { ItemGrid, Section } from "@/components/sections/Section";
import { LinkButton } from "@/components/ui/Button";
import {
  SDLC_CLOSING,
  SDLC_CONNECTS,
  SDLC_HERO,
  SDLC_OUTCOME,
  SDLC_PROBLEM,
  SDLC_REALITIES,
  SDLC_SOLUTION,
  SDLC_WORKFLOW,
} from "@/content/sdlc";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "AI Software Development Lifecycle | ParallelFlow",
  description:
    "Connect planning, development, code review, testing, and delivery in a collaborative AI-powered software development workflow.",
  path: "/solutions/engineering/sdlc",
});

export default function SdlcPage() {
  return (
    <main>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <p className="font-mono text-xs tracking-widest text-muted">
          {SDLC_HERO.eyebrow}
        </p>
        <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {SDLC_HERO.title}
        </h1>
        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-lg text-muted">
          {SDLC_HERO.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <div className="mt-10">
          <LinkButton
            href={SDLC_HERO.secondaryCta.href}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            {SDLC_HERO.secondaryCta.label}
          </LinkButton>
        </div>
        <PreviewSlot
          description="Product preview placeholder for the connected engineering workflow"
          placeholder="Workflow preview coming soon"
        />
      </section>

      <Section label={SDLC_PROBLEM.label} title={SDLC_PROBLEM.title}>
        <div className="mt-6 max-w-3xl space-y-4 text-lg text-muted">
          {SDLC_PROBLEM.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-lg">
          <span className="font-semibold">The result:</span>{" "}
          <span className="text-muted">{SDLC_PROBLEM.result}</span>
        </p>
        <ItemGrid items={SDLC_PROBLEM.items} />
      </Section>

      <Section label={SDLC_SOLUTION.label} title={SDLC_SOLUTION.title}>
        <div className="mt-6 max-w-3xl space-y-4 text-lg text-muted">
          {SDLC_SOLUTION.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <p className="mt-10 text-xl font-semibold sm:text-2xl">
          {SDLC_SOLUTION.emphasis}
        </p>
        <ItemGrid items={SDLC_SOLUTION.items} columns={2} />
      </Section>

      <Section label={SDLC_WORKFLOW.label} title={SDLC_WORKFLOW.title}>
        <p className="mt-6 text-sm text-muted">{SDLC_WORKFLOW.note}</p>
        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SDLC_WORKFLOW.stages.map((stage, index) => (
            <li key={stage.title} className="border-t border-line pt-5">
              <span className="font-mono text-sm text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-semibold">{stage.title}</h3>
              <p className="mt-2 text-muted">{stage.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section label={SDLC_CONNECTS.label} title={SDLC_CONNECTS.title}>
        <ProductCards />
        <p className="mt-10 max-w-3xl text-lg text-muted">
          {SDLC_CONNECTS.outro}
        </p>
      </Section>

      <Section label={SDLC_REALITIES.label} title={SDLC_REALITIES.title}>
        <ItemGrid items={SDLC_REALITIES.items} />
      </Section>

      <Section label={SDLC_OUTCOME.label} title={SDLC_OUTCOME.title}>
        <p className="mt-6 text-lg text-muted">{SDLC_OUTCOME.intro}</p>
        <ul className="mt-6 max-w-3xl list-disc space-y-3 pl-5 text-lg text-muted marker:text-line">
          {SDLC_OUTCOME.goals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
        <p className="mt-10 max-w-3xl text-xl font-semibold sm:text-2xl">
          {SDLC_OUTCOME.closing}
        </p>
      </Section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {SDLC_CLOSING.title}
          </h2>
          <p className="mt-6 text-lg text-muted">{SDLC_CLOSING.body}</p>
        </div>
      </section>
    </main>
  );
}
