import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown } from "lucide-react";

// The Smart Reminders architecture diagram for the "Life of a Feature" post
// (the-life-of-a-feature.mdx). Redrawn from the image in the owner's doc with
// theme tokens, so it follows the light and dark themes instead of shipping a
// fixed white image. The doc's blue highlight on the send worker is a
// foreground outline here, to keep the site monochrome. Wide screens show the
// doc's layout: five stages in a row, with the two data stores below. Phones
// show the same flow as one column.

type Node = { name: string; note: string; key?: boolean };

const STAGES: Node[] = [
  { name: "Scheduler", note: "due invoices" },
  { name: "Message queue", note: "SQS or Kafka" },
  { name: "Send worker", note: "renders email", key: true },
  { name: "Email provider", note: "SendGrid or SES" },
  { name: "Client inbox", note: "end customer" },
];

const RULES: Node = { name: "Reminder rules", note: "database" };
const LOG: Node = { name: "Send log", note: "idempotency keys" };

function Box({ node, className = "" }: { node: Node; className?: string }) {
  return (
    <div
      className={`rounded-control border px-3 py-3 text-center ${
        node.key
          ? "border-foreground bg-foreground/[0.06]"
          : "border-line bg-background"
      } ${className}`}
    >
      <span className="block text-sm font-semibold text-foreground">
        {node.name}
      </span>
      <span className="mt-0.5 block text-xs text-muted">{node.note}</span>
    </div>
  );
}

function Link({ label, Icon }: { label: string; Icon: typeof ArrowUp }) {
  return (
    <span className="flex items-center justify-center gap-1.5 py-2 font-mono text-xs text-muted">
      <Icon className="size-4" />
      {label}
    </span>
  );
}

export function ReminderArchitectureDiagram() {
  return (
    <figure className="my-12">
      <div
        role="img"
        aria-label="The scheduler reads reminder rules from the database and finds due invoices. It sends them to a message queue (SQS or Kafka). The send worker renders each email, checks the send log of idempotency keys and records the send, then hands the email to the email provider (SendGrid or SES), which delivers it to the client's inbox."
        className="rounded-card border border-line bg-card p-4 sm:p-7"
      >
        <p className="text-sm font-medium tracking-tight text-foreground sm:text-base">
          Every reminder passes one idempotency check before it is sent
        </p>

        {/* Wide screens: five stages in a row, data stores below. */}
        <div aria-hidden="true" className="mt-6 hidden md:block">
          <div className="grid grid-cols-5 gap-x-6">
            {STAGES.map((node, i) => (
              <div key={node.name} className="relative">
                <Box node={node} className="h-full" />
                {i < STAGES.length - 1 && (
                  <ArrowRight className="absolute -right-5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                )}
              </div>
            ))}
            <div className="col-start-1">
              <Link label="reads rules" Icon={ArrowUp} />
            </div>
            <div className="col-start-3">
              <Link label="check, then record" Icon={ArrowUpDown} />
            </div>
            <Box node={RULES} className="col-start-1" />
            <Box node={LOG} className="col-start-3" />
          </div>
        </div>

        {/* Phones and small tablets: the same flow in one column. */}
        <div aria-hidden="true" className="mt-5 flex flex-col md:hidden">
          <Box node={RULES} />
          <Link label="reads rules" Icon={ArrowDown} />
          {STAGES.map((node, i) => (
            <div key={node.name} className="flex flex-col">
              {i > 0 && (
                <ArrowDown className="mx-auto my-2 size-4 text-muted" />
              )}
              <Box node={node} />
              {node.key && (
                <>
                  <Link label="check, then record" Icon={ArrowUpDown} />
                  <Box node={LOG} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted">
        <span className="font-mono text-xs uppercase tracking-widest text-foreground">
          Smart Reminders architecture · 5 stages, 2 data stores
        </span>
        <span className="mt-1 block">
          The arrows matter more than the boxes: almost every hard bug in this
          feature lives at a handoff between two of them.
        </span>
      </figcaption>
    </figure>
  );
}
