import { ArrowDown, ArrowRight, ArrowUp, Repeat2 } from "lucide-react";

// The diagram for the AI agent blog post (anatomy-of-an-ai-agent.mdx), drawn with theme tokens so
// it follows the light and dark themes instead of shipping a fixed image.

// Each loop step has its own soft colour (owner request, 2026-11-05). Class
// names are written out in full so Tailwind can find them.
const LOOP_STEPS = [
  {
    name: "Model",
    verb: "reasons",
    tint: "border-agent-model/50 bg-agent-model/10",
    text: "text-agent-model",
  },
  {
    name: "Tools",
    verb: "act",
    tint: "border-agent-tools/50 bg-agent-tools/10",
    text: "text-agent-tools",
  },
  {
    name: "Environment",
    verb: "returns the result",
    tint: "border-agent-env/50 bg-agent-env/10",
    text: "text-agent-env",
  },
] as const;

const HARNESS_PARTS = [
  "Context",
  "Memory",
  "Execution environment",
  "Filesystem",
  "Skills",
  "Subagents",
  "Security and permissions",
  "Feedback and validation",
  "Human in the loop",
];

const box =
  "rounded-control border border-line bg-background px-3 py-3 text-center text-sm";

export function AgentAnatomyDiagram() {
  return (
    <figure className="my-12">
      <div
        role="img"
        aria-label="Your command enters a loop inside the harness. In the loop the model reasons, tools act and the environment returns the result, repeating until done, then the final output is returned. The harness provides context, memory, an execution environment, a filesystem, skills, subagents, security and permissions, feedback and validation, and human in the loop."
        className="rounded-card border border-line bg-card p-4 sm:p-7"
      >
        <p className="text-sm font-medium tracking-tight text-foreground sm:text-base">
          An agent is a model in a loop, wrapped by a harness
        </p>

        <div aria-hidden="true">
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-6">
            <div className="flex flex-col items-center">
              <div className={`${box} w-full text-foreground`}>Your command</div>
              <ArrowDown className="mt-2 size-4 text-muted" />
            </div>
            <div className="flex flex-col items-center">
              <div className={`${box} w-full text-foreground`}>Final output</div>
              <span className="mt-2 flex items-center gap-1.5 font-mono text-xs text-muted">
                <ArrowUp className="size-4" />
                when done
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-card border border-agent-harness/30 bg-background/40 p-3 sm:p-5">
            <p className="text-sm font-medium text-agent-harness">Harness</p>

            <div className="mt-3 rounded-card border border-dashed border-line p-3 sm:p-5">
              <p className="font-mono text-xs text-muted">
                Loop (ReAct)
              </p>
              <ol className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
                {LOOP_STEPS.map((step, i) => (
                  <li
                    key={step.name}
                    className="flex flex-col items-center gap-2 sm:flex-1 sm:flex-row sm:gap-3"
                  >
                    {i > 0 && (
                      <>
                        <ArrowDown className="size-4 shrink-0 text-muted sm:hidden" />
                        <ArrowRight className="hidden size-4 shrink-0 text-muted sm:block" />
                      </>
                    )}
                    <div
                      className={`w-full rounded-control border px-3 py-3 text-center ${step.tint}`}
                    >
                      <span className={`block text-sm font-semibold ${step.text}`}>
                        {step.name}
                      </span>
                      <span className="block text-xs text-muted">{step.verb}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 flex items-center justify-center gap-2 font-mono text-xs text-muted">
                <Repeat2 className="size-4" />
                repeat until done
              </p>
            </div>

            <p className="mt-5 text-xs text-muted sm:text-sm">
              What the harness provides
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {HARNESS_PARTS.map((part) => (
                <li
                  key={part}
                  className="rounded-control border border-agent-harness/25 bg-agent-harness/[0.06] px-3 py-3 text-center text-sm text-foreground/85"
                >
                  {part}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted">
        <span className="font-mono text-xs uppercase tracking-widest text-foreground">
          Anatomy of an AI agent
        </span>
        <span className="mt-1 block">
          Your command enters the loop; the model reasons, tools act, the
          environment returns a result, and the loop repeats until the job is
          done. The harness wraps it all.
        </span>
      </figcaption>
    </figure>
  );
}
