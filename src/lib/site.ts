export const SITE_NAME = "ParallelFlow";

// Owner-confirmed domain. Shown as text only until the site is hosted there.
export const SITE_DOMAIN = "parallelflow.ai";

export const SITE_TAGLINE =
  "A shared workspace where humans and AI turn ideas into finished work.";

export const WAITLIST_HREF = "/#waitlist";

// Footer social links. These are dummy values until the real accounts exist;
// replace them before the site goes public.
export const SOCIAL_LINKS = {
  email: "hello@parallelflow.example",
  x: "https://x.com/parallelflow",
  linkedin: "https://www.linkedin.com/company/parallelflow",
};

// Set NEXT_PUBLIC_SITE_URL only on the production domain. While it is unset
// (localhost, staging, previews) the site falls back to localhost and every
// page is kept out of search results.
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = new URL(configuredSiteUrl || "http://localhost:3000");

export const IS_INDEXABLE = Boolean(configuredSiteUrl);
