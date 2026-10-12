export const SITE_NAME = "ParallelFlow";

export const SITE_TAGLINE =
  "A collaborative workspace for teams and AI to plan, build, and ship together.";

export const WAITLIST_HREF = "/#waitlist";

// Set NEXT_PUBLIC_SITE_URL only on the production domain. While it is unset
// (localhost, staging, previews) the site falls back to localhost and every
// page is kept out of search results.
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = new URL(configuredSiteUrl || "http://localhost:3000");

export const IS_INDEXABLE = Boolean(configuredSiteUrl);
