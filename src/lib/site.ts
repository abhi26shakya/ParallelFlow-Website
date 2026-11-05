export const SITE_NAME = "ParallelFlow";

// Owner-confirmed domain. Shown as text only until the site is hosted there.
export const SITE_DOMAIN = "parallelflow.ai";

export const SITE_TAGLINE =
  "A shared workspace where humans and AI turn ideas into finished work.";

// Footer contact links. The founders' personal accounts for now (owner
// decision, 2026-11-05); swap in company accounts once they exist.
export const SOCIAL_LINKS = {
  email: "baghelkirankant0@gmail.com",
  x: "https://x.com/Abhishek_ks26",
  linkedin: "https://www.linkedin.com/in/abhishek-shakya-42bab8212/",
};

// Hero "Talk to us" booking page. Placeholder until the real Calendly link
// exists; replace it before the site goes public.
export const TALK_TO_US_URL = "https://calendly.com/parallelflow/30min";

// Set NEXT_PUBLIC_SITE_URL only on the production domain. While it is unset
// (localhost, staging, previews) the site falls back to localhost and every
// page is kept out of search results.
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = new URL(configuredSiteUrl || "http://localhost:3000");

export const IS_INDEXABLE = Boolean(configuredSiteUrl);
