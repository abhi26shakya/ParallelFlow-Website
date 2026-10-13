import { Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { HERO } from "@/content/home";
import { NAV_GROUPS } from "@/lib/nav";
import {
  SITE_DOMAIN,
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL_LINKS,
} from "@/lib/site";
import { CopyrightYear } from "./CopyrightYear";
import { HighFive, IdeaToDone, TinyAgent, TinyHuman } from "./FooterDoodles";
import { ThemeToggle } from "./ThemeToggle";

type FooterLinkItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  external?: boolean;
};
type FooterColumn = { label: string; items: FooterLinkItem[] };

// lucide-react v1 has no brand icons, so X and LinkedIn are drawn inline.
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.878 1.637-1.8 3.37-1.8 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// Built from the navbar config. Only live links are shown, and a column with
// none (Resources today) is left out. Company and Legal columns are added
// only once their pages exist.
const NAV_COLUMNS: FooterColumn[] = NAV_GROUPS.map((group) => ({
  label: group.label,
  items: group.items.flatMap((item) =>
    item.href
      ? [{ label: item.footerLabel ?? item.label, href: item.href }]
      : [],
  ),
})).filter((column) => column.items.length > 0);

const CONNECT: FooterColumn = {
  label: "Connect",
  items: [
    {
      label: "Email",
      href: `mailto:${SOCIAL_LINKS.email}`,
      icon: <Mail aria-hidden="true" className="size-3.5" />,
    },
    { label: "X", href: SOCIAL_LINKS.x, icon: <XIcon />, external: true },
    {
      label: "LinkedIn",
      href: SOCIAL_LINKS.linkedin,
      icon: <LinkedInIcon />,
      external: true,
    },
  ],
};

const COLUMNS = [...NAV_COLUMNS, CONNECT];

// "parallelflow" in the text colour, ".ai" in grey.
const TLD_START = SITE_DOMAIN.lastIndexOf(".");
const DOMAIN_NAME = SITE_DOMAIN.slice(0, TLD_START);
const DOMAIN_TLD = SITE_DOMAIN.slice(TLD_START);

// Two parallel underlines draw in on hover and keyboard focus, the second a
// beat behind the first: people and agents moving together.
const underline =
  "pointer-events-none absolute inset-x-0 h-px origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100";

function FooterLink({ item }: { item: FooterLinkItem }) {
  const content = (
    <>
      {item.icon}
      {item.label}
      {item.external && <span className="sr-only"> (opens in a new tab)</span>}
      <span aria-hidden="true" className={`${underline} bottom-1 bg-foreground`} />
      <span
        aria-hidden="true"
        className={`${underline} bottom-0 bg-muted delay-75`}
      />
    </>
  );
  const className =
    "group relative inline-flex items-center gap-2 py-1.5 text-sm text-muted transition-colors hover:text-foreground focus-visible:text-foreground";

  return item.href.startsWith("/") ? (
    <Link href={item.href} className={className}>
      {content}
    </Link>
  ) : (
    <a
      href={item.href}
      className={className}
      {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {content}
    </a>
  );
}

// A lane is a thin track with little figures walking along it. Humans move
// steadily; agents move faster and two at a time. With reduced motion the
// figures stay put.
type Runner = { start: string; delay: string; agent?: boolean };

function Lane({ label, runners }: { label: string; runners: Runner[] }) {
  return (
    <div className="flex items-end gap-4">
      <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-widest text-muted">
        {label}
      </span>
      <div className="relative h-6 flex-1 overflow-hidden">
        <span className="absolute inset-x-0 bottom-1 h-px bg-line" />
        {runners.map((runner) => (
          <span
            key={runner.delay}
            className={`absolute inset-0 ${runner.start} ${
              runner.agent
                ? "motion-safe:animate-lane-fast"
                : "motion-safe:animate-lane"
            }`}
            style={{ animationDelay: runner.delay }}
          >
            <span className="absolute bottom-1 left-0 flex items-end">
              <span className="h-px w-10 bg-muted/40" />
              {runner.agent ? (
                <TinyAgent delay={runner.delay} />
              ) : (
                <TinyHuman delay={runner.delay} />
              )}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div aria-hidden="true" className="flex items-center gap-4 pt-12">
          <div className="flex flex-1 flex-col gap-3">
            <Lane
              label="Humans"
              runners={[{ start: "translate-x-[30%]", delay: "-2.7s" }]}
            />
            <Lane
              label="Agents"
              runners={[
                { start: "translate-x-[15%]", delay: "-0.8s", agent: true },
                { start: "translate-x-[65%]", delay: "-3.6s", agent: true },
              ]}
            />
          </div>
          <HighFive />
        </div>

        <div className="grid gap-12 py-16 lg:grid-cols-[3fr_2fr]">
          <div>
            <Logo />
            <p className="mt-6 text-[clamp(2.5rem,10.5vw,6rem)] font-bold leading-none tracking-tighter">
              {DOMAIN_NAME}
              <span className="text-muted">{DOMAIN_TLD}</span>
            </p>
            <p className="mt-6 max-w-md text-lg text-pretty text-muted">
              {SITE_TAGLINE}
            </p>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
              <WaitlistButton className="w-full sm:w-auto" />
              <div aria-hidden="true">
                <IdeaToDone />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:pt-14">
            {COLUMNS.map((column) => (
              <nav key={column.label} aria-label={column.label}>
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                  {column.label}
                </h2>
                <ul className="mt-4">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <p>
              &copy; <CopyrightYear /> {SITE_NAME}
            </p>
          </div>
          <p className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 rounded-pill bg-foreground" />
            {HERO.status}
          </p>
        </div>
      </div>
    </footer>
  );
}
