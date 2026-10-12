# ParallelFlow Build Progress

Phase 1 audit done. Phases 2 (foundation), 3 (home hero), 4 (waitlist), 5 (home body) and 6 (SDLC page) built and committed. Phase 7 (Pricing page) built, awaiting owner browser review and commit.

## Phase 7: Pricing page

**Files changed**
- New: `src/content/pricing.ts` (single data file for both plans and the page intro), `src/components/sections/PricingCards.tsx`, `src/app/pricing/page.tsx` (title and meta description from the Part 7 table)
- Changed: `src/lib/nav.ts` (Pricing in the navbar is now a live link to `/pricing`), `PROGRESS.md`

**Owner decisions this session**
- No price is shown. Teams reads "Pricing coming soon"; Enterprise reads "Custom pricing". The $25/user price and the Enterprise pilot offer stay unpublished.
- Both cards carry a "Coming soon" badge and list features under "Designed to include:".
- Teams features dropped from the brief's list: "supported tools and integrations", "standard usage limits", "standard support".
- Enterprise scope dropped from the brief's list: "higher or tailored usage limits", "optional onboarding and dedicated support", "custom integrations where technically supported". "Advanced access controls and permissions" shortened to "Access controls and permissions".
- Enterprise supporting text replaced with "Join the waitlist and tell us about your organization's needs." (the brief's line implied a sales call and tailored deployment). Teams supporting text kept as written.
- New wording: H1 "Pricing", the intro line, and an Enterprise note pointing to the "Tell us more" organization-interest question.
- Both CTAs are "Join Waitlist" and link to `/#waitlist`; Enterprise interest is captured by the existing organization-interest question. No checkout, billing, "Contact Sales" or "Most Popular" label.

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass; `/pricing` is prerendered as static.
- Renders cleanly in headless Chrome at 1440px (cards side by side) and 500px (stacked). Correct title and description, one H1, no price in the page.

**Still incomplete / notes**
- Not checked below 500px; check at phone width in a real browser.
- On desktop the Enterprise button sits slightly higher than the Teams one because of the extra note below it.
- The Enterprise-lead rule (organization interest plus team size) is still undefined; answers are only stored.
- Carried over: footer has no link columns, real Supabase persistence unverified, `/reference` screenshots missing, SDLC page not checked at phone width.

**Open decisions**
- None new. When a Teams price is approved, change only `price` in `src/content/pricing.ts`.

**Next session:** "PF Phase 8 - Remaining pages".

## Phase 6: SDLC page

**Files changed**
- New: `src/app/solutions/engineering/sdlc/page.tsx` (page plus title and meta description from the Part 7 table), `src/content/sdlc.ts` (all 8 sections, word for word from Part 4), `src/content/products.ts` (Arena, Workspace, Developer Space one-liners, now shared by both pages)
- New: `src/components/sections/ProductCards.tsx`. Moved to `src/components/sections/`: `Section.tsx` (from `home/`, now takes an optional `id`) and `PreviewSlot.tsx` (was `home/VideoSlot.tsx`, now takes its text as props)
- Changed: `src/components/home/HomeBody.tsx` and `Hero.tsx` (use the shared components; the How it works section now has `id="how-it-works"`), `src/content/home.ts` (product list moved to `products.ts`), `src/lib/nav.ts` (Solutions → "Engineering: SDLC" is now a live link), `PROGRESS.md`

**Owner decisions this session**
- Open decision 5 settled: "Explore the Platform" is a secondary button that links to `/#how-it-works` on the home page.
- Hero visual: an empty 16:9 frame labelled "Product preview" ("Workflow preview coming soon") until a real visual exists.
- Section 4 carries the line "The lifecycle ParallelFlow aims to support." (new wording, owner approved).
- Section 6 "Connected tools" ends at "...into the workflow."; the brief's clause "without promising integrations that are not yet available" was cut (owner approved).
- No "Join the Waitlist" buttons on the SDLC page, which changes the brief's sections 1 and 8. The navbar's "Join waitlist" is the signup path. Because the closing CTA has no button, its supporting line "Be among the first to explore ParallelFlow." is left out too.

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass; `/solutions/engineering/sdlc` is prerendered as static.
- Page renders cleanly in headless Chrome at 1440px and 500px. Correct title and description, one H1, logical H2/H3 order, all products marked "Coming soon" with no links.

**Still incomplete / notes**
- The footer has no link columns yet. The SDLC page is reachable from the navbar only.
- Not checked below 500px; check at phone width in a real browser.
- Carried over: real Supabase persistence unverified, `/reference` screenshots missing.

**Open decisions**
- None new.

**Next session:** "PF Phase 7 - Pricing page".

## Phase 5: Home body

**Files changed**
- New: `src/content/home.ts` (all home copy below the hero, owner-approved), `src/components/home/Section.tsx` (shared section layout and item grid), `src/components/home/HomeBody.tsx`
- Changed: `src/app/page.tsx` (renders `HomeBody`; waitlist section gets a top divider), `PROGRESS.md`

**What was built**
- Sections follow the brief's "Product page key points for YC" table (owner approved): headline + value proposition, The problem, Why now, The solution, How it works (Arena, Workspace, Developer Space one-liners, each "Coming soon", no links), Trust / Human oversight, Who it's for, then the existing waitlist.
- Copy is taken from SDLC sections 2, 3, 5 and 6, Part 2, Part 6 and Part 7. Section labels, the four Trust item titles and the shortened audience lines are new wording, approved by the owner. Problem and Solution text intentionally repeats on the SDLC page (owner approved).

**Setup needed from the owner**
- None for this phase. No migrations, no new env vars, no new dependencies.

**Verified**
- Lint, type-check and production build pass. Page renders cleanly in headless Chrome at 1440px and 500px wide; one H1, logical H2/H3 order.

**Still incomplete / notes**
- Not checked below 500px (headless Chrome's minimum); check at phone width in a real browser.
- Carried over from Phase 4: persistence in a real Supabase project is still unverified (`.env.local` missing, migration not yet run).
- `/reference` screenshots are still missing.
- No real waitlist count, demo video, logos or testimonials are shown; add proof only once it is real.

**Open decisions**
- None new. Decision 2 (front-page copy) is settled in practice: tagline in the hero, headline as the first section below it.

**Next session:** "PF Phase 6 - SDLC page".

## Phase 4: Waitlist

**Files changed**
- New: `supabase/migrations/0001_create_waitlist_signups.sql`, `.env.example`
- New: `src/app/api/waitlist/route.ts`
- New: `src/components/waitlist/WaitlistForm.tsx`
- New: `src/lib/waitlist/schema.ts`, `src/lib/waitlist/rate-limit.ts`, `src/lib/supabase/server.ts`
- Changed: `src/app/page.tsx` (form replaces the placeholder), `package.json` and `package-lock.json` (`zod`, `@supabase/supabase-js`), `CLAUDE.md`, `PROGRESS.md`

**Setup needed from the owner**
- Run `supabase/migrations/0001_create_waitlist_signups.sql` in the Supabase SQL editor. The table did not exist, so it creates it with `organization_interest` included.
- Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and to the hosting provider's environment. Server-only; never commit or paste them.

**Verified**
- Validation, duplicate handling, honeypot, minimum-time check, rate limit, missing-env error and database-failure error, through the real endpoint against a local stand-in for Supabase's REST API.
- Form behaviour in Chrome at desktop and mobile widths (required-only initial form, field errors, values kept on failure, retry, success message).

**Not verified**
- Persistence in a real Supabase project, including the unique index and check constraints. Do this once `.env.local` exists: submit a signup, then a duplicate, and check the rows in the Supabase table editor.

**Still incomplete / notes**
- The rate limit is per server instance and best-effort. Add Cloudflare Turnstile if abuse appears.
- The Enterprise-lead rule (organization interest plus team size) is not defined. Phase 4 only stores both answers.
- No privacy policy page exists yet; the form carries the short privacy note only.

**Open decisions**
- Decisions 3, 6, 8 and 10 in Part 1 are settled in practice (waitlist link, button wording, reference screenshots still to come, video slot).
- `/reference` screenshots are still missing.

**Next session:** "PF Phase 5 - Home body" (copy for the sections below the hero must be written only from the brief, then approved).
