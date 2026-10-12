# ParallelFlow Build Progress

Phase 1 audit done. Phases 2 (foundation), 3 (home hero), 4 (waitlist), 5 (home body), 6 (SDLC page), 7 (pricing page), 8 (remaining pages), 9 (SEO) and 10 (quality gate) built and committed. Phase 11 (launch) done on localhost: a real signup is saved in the Supabase database. Hosting waits for the owner's go-ahead. The pricing page was removed after Phase 11 at the owner's request.

## Change after Phase 11: Pricing page removed

**Owner decision (2026-10-12)**
- Delete the pricing page completely, not just hide it. This departs from the brief (Part 4 pricing spec, Phase 7). Bring it back from git history (commit `513ca58` or earlier) if wanted.

**Files changed**
- Deleted: `src/app/pricing/page.tsx`, `src/components/sections/PricingCards.tsx`, `src/content/pricing.ts`
- Changed: `src/lib/nav.ts` (`NAV_PRICING` removed), `src/components/layout/Navbar.tsx`, `MobileMenu.tsx`, `Footer.tsx` (Pricing link removed), `src/lib/seo.ts` (`/pricing` removed from the sitemap), `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass. `/pricing` returns 404, the home page has no Pricing link, and the sitemap no longer lists it.

**Setup needed from the owner**
- None.

**Notes**
- The "Pricing content" rule in `CLAUDE.md` and the pricing parts of `PROJECT_BRIEF.md` no longer match the site. Neither file was edited.
- The Enterprise interest question in the waitlist form (`organization_interest`) is unchanged.

## Phase 11: Launch (localhost)

**Owner decisions this session**
- Stay on localhost. Do not host on Vercel, or anywhere, until the owner says so.
- Phase 11 is split. Done now on localhost: the waitlist against the real Supabase project. Later, when the owner approves hosting: domain, HTTPS, Search Console, analytics and monitoring (see the launch checklist below).
- The owner connected the Supabase plugin and allowed `apply_migration`, so Claude applied the migration.
- Test rows deleted with the owner's approval.

**Files changed**
- `PROGRESS.md` only. No code changes.
- `.env.local` (git-ignored) now holds `SUPABASE_URL` and a secret key (`sb_secret_`). `NEXT_PUBLIC_SITE_URL` stays empty.

**Database (Supabase project "ParallelFlow", ref `iwbyrebxrtmctiispzet`, region ap-southeast-2)**
- The project was empty. `supabase/migrations/0001_create_waitlist_signups.sql` was applied unchanged as migration `create_waitlist_signups`.
- Checked: RLS on with no policies, 8 check constraints, a unique index on `lower(email)`, and no table privileges for `anon` or `authenticated`.
- Both public keys (legacy anon and `sb_publishable_`) get `42501 permission denied` on both read and insert through the REST API.
- Directly in the database, an invalid `organization_interest`, a non-lowercase email and a duplicate email are all rejected.
- Security advisor: one INFO note, "RLS enabled, no policy". That is intended, because only the server-side route writes using the secret key.

**Verified (local production build, `next start` on port 3100, real database)**
- Name and email only: saved, every optional field NULL. All optional fields: saved as sent. Optional fields sent blank: saved as NULL.
- `organization_interest` yes, maybe and `no_individual_or_team` each saved correctly. An invalid value gets a 400 with a field error.
- Duplicate email, both the same and in different capitals with spaces: success, no second row.
- Invalid email or missing name: 400 with a field error. Honeypot or a form sent too fast: rejected. 6th request in 10 minutes from one IP: 429.
- `source` is `website` on every row.
- The owner submitted a real signup in the browser and saw it in the table editor (done-when met). The 5 `pf-test-…@example.com` rows were deleted; 1 row (the owner's) remains.
- Server log has no errors. No secret key appears in the client bundles. Lint, type-check and production build pass.

**Setup needed from the owner**
- None for localhost. The migration is applied and the keys are in `.env.local`.
- Note: a Next server started at 17:25 was still running on port 3000. Restart it so it picks up the new keys.

**Launch checklist, for when the owner approves hosting**
- Host on Vercel (or the chosen provider) from the GitHub repo `abhi26shakya/ParallelFlow-Website`.
- Production env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (the `sb_secret_` key), and `NEXT_PUBLIC_SITE_URL` (production only, set before the build, never on preview builds).
- Connect the domain and check HTTPS and the redirect from the bare domain or `www`.
- Test the deployed waitlist end to end and confirm the row in Supabase.
- Check `robots.txt`, `sitemap.xml`, canonical URLs and the absence of `noindex` on the live domain, and confirm preview URLs stay `noindex`.
- Submit the sitemap in Google Search Console and check indexing.
- Monitoring: watch the hosting logs for `[waitlist]` errors. Analytics choice is still open.
- Check on a real iPhone (Safari) and an Android phone.
- The rate limit is per server instance. On serverless hosting it is weaker; add Cloudflare Turnstile if abuse appears.

**Still incomplete / notes**
- Everything that needs a live site (checklist above).
- No test runner; checks were run by hand with scripts outside the repo.
- Carried over: `/reference` screenshots missing, Enterprise-lead rule undefined, no About/Careers/Contact/Privacy/Terms pages.

**Open decisions**
- At launch: production domain, analytics (none or which), error monitoring beyond hosting logs, and whether to launch with only the privacy note or wait for a Privacy page.

**Next session:** "PF Phase 11 - Hosting", only when the owner says to host. Phase 11 is the last phase in the build order.

## Phase 10: Quality gate

**Files changed**
- `src/app/globals.css`: new `--color-field` token (`#6B6B6B`), used for form field borders only
- `src/components/layout/NavDropdown.tsx`: Escape inside an open dropdown returns focus to its button
- `src/components/waitlist/WaitlistForm.tsx`: field borders use `border-field` (about 3.4:1 against the field, up from 1.45:1) and turn white when invalid. Focus moves to the first invalid field after a failed submit and to the confirmation after success. The submit button uses `aria-disabled` while sending so it keeps focus.
- `PROGRESS.md`

**Owner decisions this session**
- Skip real Supabase testing for now; it moves to Phase 11's live test.
- Manual checks only; no test runner added.
- Approved fixes 1–5 (dropdown Escape focus, focus on first invalid field, focus on success, highlighted invalid fields, `#6B6B6B` form field borders). The `aria-disabled` submit fix was found while re-checking and is the same kind of focus fix.

**Checked (local production build, headless Chrome)**
- Lint, type-check and production build pass.
- All 7 pages (including the 404) at 1440, 768, 375 and 320px: no sideways scroll, layout shift 0, navbar stays pinned.
- Links: every internal link returns 200, both anchors exist, no external or placeholder links, missing URLs return a real 404.
- Keyboard: logical tab order, visible white focus outline everywhere, no traps; dropdowns open with Enter and close on Escape or tab-out; "Tell us more" opens with Enter.
- Mobile menu: opens on tap, closes on Escape and after a link is tapped.
- Form: labels, `aria-invalid`/`aria-describedby` errors and a live region; without Supabase a valid submit shows "Signup is temporarily unavailable", keeps the values and shows no success. The success state was checked with a stubbed API response.
- Contrast: all text passes WCAG AA (lowest is disabled buttons at about 6.4:1); form field borders now pass 3:1.
- Reduced motion: transitions cut to almost nothing, no running animations, no video.
- Scripts: client bundles hold only React, Next.js, lucide and Zod (shared form validation). No content images to optimize.
- Console: no JavaScript errors. Server log shows only the expected missing-env message, with no secrets.
- Secrets: none in client bundles; `.env*` is git-ignored; the Supabase client is `server-only`; `.env.example` lists all 3 variables.
- Content: no prices, banned phrases, SSO, compliance or SLA claims; one H1 per page with logical H2/H3 order.

**Setup needed from the owner**
- None for this phase. No migrations, env vars or dependencies.

**Still incomplete / notes**
- Real Supabase persistence is still unverified (no `.env.local`, migration not confirmed). Phase 11 needs it: run the migration, add the keys, then submit a signup and a duplicate and check the table.
- "Verify production env vars before deployment" can only be done at launch: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_SITE_URL` (production only).
- Checked in headless Chrome only. Check on a real iPhone (Safari) and Android phone before launch.
- No test runner; checks were run by hand with scripts outside the repo.
- Carried over: `/reference` screenshots missing, Enterprise-lead rule undefined, no About/Careers/Contact/Privacy/Terms pages.

**Open decisions**
- None new.

**Next session:** "PF Phase 11 - Launch" (Phase 10 committed as `10910be`).

## Phase 9: SEO

**Files changed**
- New: `src/lib/seo.ts` (`pageMetadata()` helper, `PUBLIC_ROUTES` sitemap list, shared social image settings), `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx` (generated social preview image), `src/app/not-found.tsx` (404 page), `assets/fonts/Inter-Regular.ttf` and `Inter-Bold.ttf` (Inter font files for the generated image, from Google Fonts, OFL licence)
- Changed: `src/lib/site.ts` (`SITE_URL`, `IS_INDEXABLE`), `src/app/layout.tsx` (site-wide metadata defaults), `src/app/page.tsx` (home metadata and Organization/WebSite structured data), the pricing, SDLC and three product `page.tsx` files (now use `pageMetadata()`; titles and descriptions unchanged), `.env.example` (`NEXT_PUBLIC_SITE_URL`), `PROGRESS.md`

**Owner decisions this session**
- Work stays on localhost. There is no production domain yet, so the domain is one setting, `NEXT_PUBLIC_SITE_URL`.
- Use a generated monochrome social image: the wordmark and the value proposition, white and `#B3B3B3` on `#080808`, in Inter.
- Add a 404 page in this phase.

**How indexing works**
- `NEXT_PUBLIC_SITE_URL` unset (localhost, staging, previews): canonical URLs point to `http://localhost:3000`, every page has `noindex, nofollow`, and `robots.txt` blocks everything.
- `NEXT_PUBLIC_SITE_URL` set (production only): canonical URLs, Open Graph URLs, the sitemap and structured data use that domain. `robots.txt` allows the site, blocks `/api/`, and points to the sitemap. The 404 page stays `noindex`.
- The variable is read at build time, so set it before the production build.

**Setup needed from the owner**
- None now. At launch, set `NEXT_PUBLIC_SITE_URL` to the production domain (e.g. `https://example.com`, no trailing path) in the production environment only. Never set it on staging or preview builds.

**Verified**
- Lint, type-check and production build pass. All pages, `robots.txt` and `sitemap.xml` are prerendered.
- Local production server, variable unset: each page has its Part 7 title and description, a canonical URL, Open Graph and Twitter tags with one image, and `noindex, nofollow`. `robots.txt` reads `Disallow: /`. The sitemap lists the 6 public routes. Structured data contains only the name, URL and value proposition. The image is a 1200×630 PNG. A missing URL returns status 404 with the new page.
- Test build with `NEXT_PUBLIC_SITE_URL=https://example.com`: no `noindex` on public pages, canonicals and sitemap use the domain, `robots.txt` allows the site and lists the sitemap, and the 404 stays `noindex`. The build was then rebuilt without the variable.
- The 404 page renders cleanly in headless Chrome at 1440px.

**Still incomplete / notes**
- The social image is generated on request (not prerendered) because it reads the font files. That's fine, but it could be cached later.
- In local mode the 404 page has two `noindex` robots tags (Next adds one, the layout another). Harmless; in production only Next's tag remains.
- No `lastModified` dates in the sitemap. No accurate dates exist, and reading the current date breaks the build under `cacheComponents`.
- No content images exist yet, so there is no alt text to check beyond the social image.
- Carried over: real Supabase persistence unverified, `/reference` screenshots missing, the Enterprise-lead rule undefined, no About/Careers/Contact/Privacy/Terms pages, pages not checked below 500px wide.

**Open decisions**
- None new. At launch: the production domain, and a designed social image if one is wanted (replace `src/app/opengraph-image.tsx` with an `opengraph-image.png`, then update `SOCIAL_IMAGE` in `src/lib/seo.ts`).

**Next session:** "PF Phase 10 - Quality gate".

## Phase 8: Remaining pages

**Files changed**
- New: `src/app/product/arena/page.tsx`, `src/app/product/workspace/page.tsx`, `src/app/product/developer-space/page.tsx` (titles and meta descriptions from the Part 7 table)
- New: `src/content/product-pages.ts` (all product page copy), `src/components/sections/ProductPage.tsx` (shared layout for the three pages)
- Changed: `src/content/products.ts` (each product now has a `slug` and `href`), `src/components/sections/ProductCards.tsx` (cards link to the product pages and keep the "Coming soon" badge; new `exclude` prop), `src/lib/nav.ts` (Product items built from `products.ts` and now live; optional `footerLabel`), `src/components/layout/Footer.tsx` (link columns), `src/components/layout/NavItemRow.tsx`, `NavDropdown.tsx`, `MobileMenu.tsx` (menus close when a link is chosen), `PROGRESS.md`

**Owner decisions this session**
- Product page copy approved as drafted. It is written from Part 6 and the Part 1 "Lead with" points, using "designed to" wording. New wording: the section labels "What it's designed to do" and "How it connects", the heading "One of three connected areas.", the intros, and the item titles. Motion Design, the LLM Wiki, version-control and named integrations, and comparisons with other tools are left out on purpose.
- URLs: `/product/arena`, `/product/workspace`, `/product/developer-space`.
- No separate Solutions or Engineering pages, so the site has no thin pages. The navbar's "Engineering: SDLC" link goes straight to the SDLC page.
- Each product page ends with a Join Waitlist button (`/#waitlist`) after the line "<Product> is coming soon. Join the waitlist for early access and product updates.", adapted from the brief's pre-launch line.
- Footer link columns added, with live links only. Product has Arena, Workspace, Developer Space and Pricing. Solutions has "Software Development Lifecycle (SDLC)". Resources and Company are left out until those pages exist, and so are Privacy and Terms.

**Fixed along the way**
- The mobile menu and the desktop dropdowns stayed open after a nav link was clicked, because the navbar stays mounted across page changes. They now close when a link is chosen.

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass. The three product pages are prerendered as static.
- Each page has the correct title and description, one H1, and no prices or banned phrases.
- Arena renders cleanly in headless Chrome at 1440px and 500px, and Developer Space at 1440px. The footer columns sit side by side on desktop and stack on mobile.
- The home page product cards link to all three pages.

**Still incomplete / notes**
- Not checked below 500px. Check at phone width in a real browser, including that the mobile menu closes after a link is tapped.
- Each product page has an empty 16:9 "Product preview" frame until real visuals exist.
- The Part 1 "done when" condition is met: every nav item is a live page or a "Coming soon" label. Resources (Packages, Documentation, Developer Resources) stays "Coming soon".
- Carried over: real Supabase persistence unverified, `/reference` screenshots missing, the Enterprise-lead rule undefined, no About/Careers/Contact/Privacy/Terms pages.

**Open decisions**
- None new. If Solutions or Engineering hub pages are wanted later, the Part 7 metadata for them is ready.

**Next session:** "PF Phase 9 - SEO" (Phase 8 committed as `5e08d94`).

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
