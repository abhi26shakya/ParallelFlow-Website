import { Laptop, Monitor } from "lucide-react";
import { PreviewSlot } from "@/components/sections/PreviewSlot";
import { DisabledButton, LinkButton } from "@/components/ui/Button";
import { WAITLIST_HREF } from "@/lib/site";

function DownloadButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <DisabledButton className="w-full gap-2 sm:w-auto">
      {icon}
      {label}
      <span className="text-xs font-normal">Coming soon</span>
    </DisabledButton>
  );
}

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
      <p className="text-sm text-muted">
        Workspace for teams to plan, build &amp; ship together
      </p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
        Work moves forward.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted sm:text-xl">
        A collaborative workspace where people and AI work together to turn
        ideas into finished work.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <DownloadButton
            icon={<Laptop aria-hidden="true" className="size-4" />}
            label="Download for macOS"
          />
          <DownloadButton
            icon={<Monitor aria-hidden="true" className="size-4" />}
            label="Download for Windows"
          />
        </div>
        <LinkButton href={WAITLIST_HREF} className="w-full sm:w-auto">
          Join Waitlist
        </LinkButton>
        <p className="mt-2 max-w-md text-sm text-muted">
          Desktop apps are coming soon. Join the waitlist for early access and
          product updates.
        </p>
      </div>

      <PreviewSlot
        description="Product preview video placeholder"
        placeholder="Product video coming soon"
      />
    </section>
  );
}
