import { Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { WaitlistButton } from "@/components/waitlist/WaitlistButton";
import { HERO } from "@/content/home";
import { PRODUCTS, type ProductSlug } from "@/content/products";
import { SITE_NAME, SITE_TAGLINE, SOCIAL_LINKS } from "@/lib/site";
import { CopyrightYear } from "./CopyrightYear";
import { ThemeToggle } from "./ThemeToggle";

// Footer links. List only pages that exist, keep a column only once it has at
// least two links, and show at most three columns. Solutions comes back here
// once it has a second page beside SDLC; Company and Legal once their pages
// exist.
type FooterLinkItem = { label: string; href: string };
type FooterColumn = { label: string; items: FooterLinkItem[] };

const productLink = (slug: ProductSlug): FooterLinkItem => {
  const product = PRODUCTS.find((p) => p.slug === slug)!;
  return { label: product.name, href: product.href };
};

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    label: "Product",
    items: [
      productLink("workspace"),
      productLink("arena"),
      productLink("developer-space"),
    ],
  },
];

// lucide-react v1 has no brand icons, so X and LinkedIn are drawn inline.
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.878 1.637-1.8 3.37-1.8 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIALS: { label: string; href: string; icon: ReactNode; external?: boolean }[] = [
  {
    label: "Email",
    href: `mailto:${SOCIAL_LINKS.email}`,
    icon: <Mail aria-hidden="true" className="size-4" />,
  },
  { label: "X", href: SOCIAL_LINKS.x, icon: <XIcon />, external: true },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, icon: <LinkedInIcon />, external: true },
];

// Same horizontal padding as the navbar, so the footer lines up with the logo.
const container = "px-4 sm:px-6 lg:px-8";

const heading = "font-mono text-xs uppercase tracking-widest text-muted";

// Two parallel underlines draw in on hover and keyboard focus, the second a
// beat behind the first: people and agents moving together.
const underline =
  "pointer-events-none absolute inset-x-0 h-px origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100";

function FooterLink({ item }: { item: FooterLinkItem }) {
  return (
    <Link
      href={item.href}
      className="group relative inline-flex items-center py-1 text-sm text-muted transition-colors hover:text-foreground focus-visible:text-foreground"
    >
      {item.label}
      <span aria-hidden="true" className={`${underline} bottom-1 bg-foreground`} />
      <span aria-hidden="true" className={`${underline} bottom-0 bg-muted delay-75`} />
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      {/* Closing CTA after cursor.com's "Try Cursor now.": a large regular-weight
          headline over a light pill. */}
      <div className={`${container} flex flex-col items-center pt-16 lg:pt-28 lg:pb-12`}>
        <h2 className="text-center text-[clamp(2.75rem,6vw,4.5rem)] font-normal leading-[1.1] tracking-[-0.04em] text-foreground">
          Try ParallelFlow
        </h2>
        {/* Same modal as the navbar's Join Waitlist. The ! overrides restyle the
            shared primary button for this spot only: regular 16px text, a
            dimmer fill on hover instead of the glow, and a focus ring. */}
        <WaitlistButton className="mt-8 text-base! leading-5! font-normal! transition-[background-color]! hover:bg-foreground/85 hover:shadow-none! focus-visible:shadow-none! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">
          Get Early Access
        </WaitlistButton>
      </div>

      <div>
        {/* Brand on the left, link columns pushed to the right edge. The
            CTA above ends with lg:pb-12, so pt-8 here makes an 80px gap on
            desktop (56px on mobile). */}
        <div className={`${container} flex flex-col items-start gap-12 pt-14 pb-5 md:flex-row md:justify-between lg:pt-8 lg:pb-10`}>
          {/* flex-col so the inline-flex Logo adds no line-box space below it. */}
          <div className="flex flex-col items-start">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-pretty text-muted">{SITE_TAGLINE}</p>
            <ul className="mt-6 flex gap-2">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.external ? `${social.label} (opens in a new tab)` : social.label}
                    className="inline-flex size-9 items-center justify-center rounded-pill border border-line text-muted transition-colors hover:bg-hover hover:text-foreground focus-visible:text-foreground"
                    {...(social.external && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-12">
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.label} aria-label={column.label}>
                <h2 className={heading}>{column.label}</h2>
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
      </div>

      <div>
        <div className={`${container} flex flex-col gap-3 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between`}>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <p>
              &copy; <CopyrightYear /> {SITE_NAME}
            </p>
          </div>
          <p className="inline-flex items-center gap-2 self-start rounded-pill border border-line px-3 py-1 md:self-auto">
            <span aria-hidden="true" className="size-1.5 rounded-pill bg-status" />
            {HERO.status}
          </p>
        </div>
      </div>

      {/* Sign-off wordmark, cropped by the footer's bottom edge. */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[3vw] bg-linear-to-b from-foreground/20 to-transparent bg-clip-text text-center text-[17vw] font-bold leading-[0.8] tracking-tighter whitespace-nowrap text-transparent">
          {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
