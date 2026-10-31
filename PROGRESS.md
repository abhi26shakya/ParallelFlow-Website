# ParallelFlow Build Progress

Phase 1 audit done. Phases 2 (foundation), 3 (home hero), 4 (waitlist), 5 (home body), 6 (SDLC page), 7 (pricing page), 8 (remaining pages), 9 (SEO) and 10 (quality gate) built and committed. Phase 11 (launch) done on localhost: a real signup is saved in the Supabase database. Hosting waits for the owner's go-ahead. The pricing page was removed after Phase 11 at the owner's request. The home hero and then the footer were redesigned after that, also at the owner's request. Then the waitlist moved into a shared modal, "The problem" got a sticky visual window, the site got a light theme with a footer toggle, "The problem" became the pinned "The Problems" list, the "Why now" section was removed, "The solution" became the scroll-built "The Solution" diagram, the "How it works" and "Trust" sections were removed from the home page, the three product pages were merged into one Product page, the home hero got animated monochrome light beams behind its heading, "The Problems" became an accordion beside a pinned, dithered visual card, "The Solution" was rebuilt to match it, mirrored, both visual cards got a hover effect, and the Product page was rebuilt around the three work modes and then restyled after x.ai/grok's product page, with a blank preview window waiting for videos. The real logo (a box mark) then replaced the placeholder mark and joined the text wordmark. The footer was then redesigned as a minimal YC-startup-style footer. Solutions and Resources were then removed from the navbar and the SDLC page was deleted. Pill buttons then got a neon ring on hover, the hero's pre-launch badge got an always-on neon ring, and the footer lost its status badge. Developer Space was then removed from the site, and the Product page lost its "How it connects" cards and closing waitlist band. The hero beams then appeared in the light theme too, inverted to dark grey. The home page's "Who it's for" grid was then replaced by a rotating "Built for [role]" section. The animated dotted backgrounds of the Problems and Solution cards were then replaced by a plain blurred background that follows the theme, and their inner screens grew. The hero's preview slot then got the real product video in its own section below the hero, the hero was made to fill the first screen with its copy at the top centre, and the hero beams were removed. The hero then got an animated particle galaxy behind its copy. A team blog was then added: a Blog navbar link, an editorial `/blog` index and post pages, with posts written as MDX files in the repo. The home video's "Product preview" badge was then removed. The Product page's Arena and Private preview windows then got their real videos. A pre-deployment audit (2026-10-31) followed, and its first fixes added security headers and gave unknown blog slugs a real 404.

## Change after Phase 11: Security headers and blog 404 (audit fixes)

**Owner request (2026-10-31)**
- From the pre-deployment audit, fix M1 (no security headers) and M4 (unknown blog slugs returned HTTP 200).

**What changed**
- `next.config.ts` sends security headers on every route: a Content-Security-Policy (same-origin only, `frame-ancestors 'none'`, `object-src 'none'`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a `Permissions-Policy` that turns off camera, microphone, geolocation and topics, and `Strict-Transport-Security` (2 years, includeSubDomains, no preload). `poweredByHeader: false` removes `X-Powered-By: Next.js`.
- The CSP has no nonces, because nonces force every page to render per request. It allows `'unsafe-inline'` scripts (Next.js inline payloads and the theme script) and adds `'unsafe-eval'` only in `next dev`. It leaves out `upgrade-insecure-requests`, which would break `next start` over http on localhost.
- `src/app/blog/[slug]/page.tsx` exports `ensureStatic = "navigation"`, so an unlisted slug waits for its full render and `notFound()` returns a real 404. `dynamicParams = false` is not allowed with Cache Components.

**Files changed**
- `next.config.ts`, `src/app/blog/[slug]/page.tsx`, `PROGRESS.md`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass.
- `next start` with curl: all six headers are present, `X-Powered-By` is gone, and `/blog/does-not-exist` returns 404 (it returned 200 before). Home, Product and Blog return 200, and `/product/arena` still returns 308.
- In Chrome, on both `next start` and `next dev`, there are no CSP violations: the theme script runs, the hero galaxy draws, the videos play, and the waitlist modal opens.

**Still incomplete / notes**
- Embedding a third-party script, iframe or font later (for example Calendly embeds, analytics or Turnstile) will need its domain added to the CSP.
- The other audit items are still open; see the audit report. The most urgent are the dummy social and booking links, the video sizes, production env vars, a privacy notice, and bot protection.

## Change after Phase 11: Arena and Private videos on the Product page

**Owner request (2026-10-26)**
- Add the Arena and Private videos (from the owner's `ParallelFlow Logo` folder) to the Product page's work-mode preview windows.

**What changed**
- `public/videos/arena.mp4` and `public/videos/private.mp4` (copied unchanged: about 35 MB and 43 MB).
- The preview window plays the active mode's video: muted, looping, restarted when it scrolls into view or the mode changes, paused with controls under `prefers-reduced-motion`.
- No visible "Product preview" badge: the owner asked for it to be removed (2026-10-26), overriding the labelling rule for these videos as for the home video. Each video's aria-label still says "product preview". `CLAUDE.md` and `PROJECT_BRIEF.md` (Part 1, "Product visuals and video") record the exception.
- The hero's video player moved from `home/HeroVideo.tsx` to a shared `media/LoopingVideo.tsx` that takes `src` and `label`.

**Files changed**
- New: `public/videos/arena.mp4`, `public/videos/private.mp4`
- Moved: `src/components/home/HeroVideo.tsx` → `src/components/media/LoopingVideo.tsx`
- Changed: `src/components/home/Hero.tsx`, `src/components/product/PreviewWindow.tsx`, `src/components/product/ModeShowcase.tsx`, `CLAUDE.md`, `PROJECT_BRIEF.md`, `PROGRESS.md`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass.

**Still incomplete / notes**
- The files are large for the web. Compress them (e.g. H.264 at a lower bitrate) before launch; no encoder is installed here.

## Change after Phase 11: "Product preview" badge removed from the home video

**Owner request (2026-10-25)**
- Delete the "Product preview" badge in the top-left corner of the home page product video. The owner confirmed this overrides the "Label product visuals 'Product preview'" rule for this video.

**What changed**
- The badge is gone. The section keeps `aria-label="Product preview"`, so screen readers still announce it. The Product page preview cards are unchanged.
- `CLAUDE.md` and `PROJECT_BRIEF.md` (Part 1, "Product visuals and video"; home section 6) record the exception.

**Files changed**
- Changed: `src/components/home/Hero.tsx`, `CLAUDE.md`, `PROJECT_BRIEF.md`, `PROGRESS.md`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass.

## Change after Phase 11: Team blog (MDX) in the navbar

**Owner request (2026-10-25)**
- Add "Blog" to the navbar after Product, linking to a real `/blog` page.
- Let anyone on the team write posts, and give the blog a more attractive, creative design.
- Owner's choices: team-only authors; posts are Markdown (MDX) files in the repo, published by pull request; editorial-magazine design within the monochrome rules.

**What changed**
- Posts are `src/content/blog/posts/<slug>.mdx`, each starting with `export const metadata = { title, summary, date, author, tags, cover?, coverAlt?, draft? }`. `src/lib/blog.ts` validates the metadata with Zod, so a bad date, an unknown author or an invalid file name fails the build with a readable message. It also works out reading time and the table of contents. Drafts show only in `npm run dev`.
- Authors live in `src/content/blog/authors.ts`, which starts empty; only real team members should be added. A writing guide is in `src/content/blog/README.md`, and `posts/_template.mdx` is a copy-me template (files starting with `_` are never published).
- `/blog`: an oversized masthead, the newest post as a wide featured card, the rest in an asymmetric 7/5–5/7 grid, and topic chips that filter in the browser so the page stays static. Cards lift, the cover zooms and an arrow slides in on hover. While there are no posts, an "Issue 001" panel shows "The first post is on its way."
- Posts without a cover image get a generated monochrome dot-field cover (waves or rings), seeded from the slug so it never changes.
- `/blog/<slug>`: tags, a large title, the summary, the author row, the cover, a ~68ch reading column, a sticky "On this page" contents list on desktop, a reading progress bar under the navbar, an author card, a waitlist band using the value proposition, and "More from the blog".
- MDX is set up through `@next/mdx`, with `remark-gfm` (tables) and `rehype-slug` (heading ids) named as strings for Turbopack. Post styles are in `src/mdx-components.tsx`.
- With Cache Components, `generateStaticParams` can't return an empty list. Until the first post exists, it returns the placeholder slug `no-posts-yet`, which renders the 404 page. Unknown slugs call `notFound()`.
- Sitemap: `/blog` plus every published post. `pageMetadata` takes an optional `article` (published date, author) for post pages.

**Files changed**
- New: `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/lib/blog.ts`, `src/mdx-components.tsx`, `src/components/blog/` (`BlogCover`, `PostCover`, `PostCard`, `AuthorChip`, `BlogTagFilter`, `ReadingProgress`, `TableOfContents`), `src/content/blog/` (`README.md`, `authors.ts`, `page-copy.ts`, `posts/_template.mdx`)
- Changed: `next.config.ts`, `package.json`, `package-lock.json` (`@next/mdx` 16.4.3 pinned, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`, `remark-gfm`, `rehype-slug`, `github-slugger`), `src/lib/nav.ts`, `src/lib/seo.ts`, `src/app/sitemap.ts`, `CLAUDE.md`, `PROGRESS.md`

**Setup needed from the owner**
- Restart any running `npm run dev`, because `next.config.ts` changed.
- Add real team members to `src/content/blog/authors.ts` before the first post.

**Verified**
- Lint, type-check and production build pass; `/blog` and each post prerender as static.
- In Chrome, on a production build, with four temporary posts and a temporary author (both since deleted): masthead, featured card, grid, hover, tag filter, generated covers, the post page (contents highlight, progress bar, divider, code, table, quote, author card, waitlist band, more posts), the light theme, and 390px mobile width with no horizontal scroll. An unknown slug returns 404, and the sitemap lists posts.
- Broken metadata (bad date plus unknown author) fails the build, naming the file and both fields.
- After removing the test files: the empty state renders, and the sitemap lists only `/`, `/product` and `/blog`.

**Not verified**
- Reduced motion was not toggled in the browser. Transitions rely on the existing global `prefers-reduced-motion` rule in `globals.css`.
- Real cover images and author avatars were not tried, because none exist yet.

**Open decisions**
- Draft copy awaiting approval: the description "Updates and writing from the ParallelFlow team.", "The first post is on its way.", "No posts yet. Check back soon." and the "Issue 001" label. `/blog` has no row in the Part 7 metadata table.
- The footer has no Blog link; add one only if the owner asks.
- Not built: RSS, newsletter, comments, a web editor.

## Change after Phase 11: Next.js security upgrade (16.4.0 → 16.4.3)

**Owner request (2026-10-24)**
- Run the Next.js security upgrade. Next.js 16.4.0 was flagged by a published security advisory, and the build kept stopping on it.

**What changed**
- `next` and `eslint-config-next` 16.4.0 → 16.4.3, a same-major patch release, so no codemods or migration guide. Versions stay pinned exactly, as before. `package-lock.json` is updated.
- No source or config changes. The tool also asked for `experimental.agentUpgrade` in `next.config.ts`; that was not added without the owner's say.

**Files changed**
- Changed: `package.json`, `package-lock.json`, `PROGRESS.md`

**Setup needed from the owner**
- None. Restart any running `npm run dev` so it uses 16.4.3.

**Verified**
- `next --version` reports v16.4.3, and `npm audit` finds 0 vulnerabilities.
- Lint, type-check and production build pass; the build no longer stops on the security check.
- Dev server: `/`, `/product`, `/robots.txt`, `/sitemap.xml` and `/opengraph-image` return 200. `/product/workspace` redirects (308) to `/product#private`. `/api/waitlist` rejects an empty body with field errors (400, nothing written).
- Home page in the browser: hero, galaxy and navbar look the same, there are no console errors, and the dev overlay no longer shows the security insight.
- Duplicate check: no existing upgrade branch or commit. Open GitHub PRs could not be checked, because the `gh` CLI is not installed.

## Change after Phase 11: Workspace renamed to Private

**Owner request (2026-10-24)**
- Rename the "Workspace" product to "Private". Owner decision in this session: the section anchor changes too, `/product#workspace` → `/product#private`.

**What changed**
- The product name, slug and link are now Private / `private` / `/product#private` in the navbar dropdown, the footer and the Product page (the section, the "Explore the modes" button and "Across Private and Arena"). The icon maps use the new slug.
- `/product/workspace` now redirects (308) to `/product#private`. Old `/product#workspace` links still open `/product`, but at the top of the page.
- Unchanged on purpose: the lower-case "workspace" as a common noun in the value proposition (kept word for word), the site description and the Product page subtitle.

**Files changed**
- Changed: `src/content/products.ts`, `src/content/product-modes.ts`, `src/app/product/page.tsx`, `src/components/layout/Footer.tsx`, `src/components/product/modes.ts`, `src/lib/nav.ts`, `next.config.ts`, `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- Checked on the dev server: `/product/workspace` lands on `/product#private`; the page shows "Private" and no "Workspace"; the `#private` section exists; there are no console errors.

**Still incomplete / notes**
- `PROJECT_BRIEF.md` was then updated: every mention of the product now says "Private", with a rename note under the Part 6 heading. "Workspace" stays where it is a common noun: the old "Workspace for teams…" tagline, "Profile & Workspace settings", the homepage SEO title, and all lower-case uses, including the value proposition.

## Change after Phase 11: New product video

**Owner request (2026-10-24)**
- Replace the product video with `ParallelFlow Logo/Preview_2.mp4`.

**What changed**
- `public/videos/product-preview.mp4` is now that file: 1920×1080 H.264, 58.5s, no audio track, 34.1 MB. The owner then re-exported `Preview_2.mp4` (same format, 34.1 MB), and the site copy was replaced with the new export. Its metadata is at the front of the file, so it streams. The path is unchanged, so there are no code changes. The old video stays in git history.

**Files changed**
- Changed: `public/videos/product-preview.mp4`, `PROGRESS.md`

**Verified**
- Checked on the dev server at 1440×812: the new video loads (58.5s, 1920×1080) and plays from the start when scrolled into view.

**Still incomplete / notes**
- At 34.1 MB it is still large; re-encode it to roughly 5–10 MB before launch (ffmpeg is not installed here).

## Change after Phase 11: Product video starts on reaching it

**Owner request (2026-10-24)**
- Start the product video from the beginning when the visitor reaches its section.

**What changed**
- `HeroVideo` now waits until at least 40% of the video is on screen. Then it jumps to 0:00 and plays. It pauses when scrolled away, and restarts from 0:00 each time it comes back into view. Reduced-motion behaviour is unchanged: paused on the first frame with controls, and never restarted.

**Files changed**
- Changed: `src/components/home/HeroVideo.tsx`, `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- Checked on the dev server at 1440×812: paused at 0:00 while at the top of the page; playing from 0:00 once scrolled into view; paused when scrolled away; restarted from 0:00 on return.

## Change after Phase 11: Hero particle galaxy

**Owner request (2026-10-24)**
- Add an interactive Milky Way made of fine sand-grain particles behind the hero copy, inspired by ingrassiadaniel.it but not copied from it. The hero's copy, layout and buttons stay unchanged.
- Owner decisions in this session: plain WebGL with no new dependency (Three.js not added). In the light theme the same galaxy is drawn as dark graphite grains on white.

**What changed**
- New `HeroGalaxy` client component: one WebGL point cloud generated once from a fixed seed (mulberry32). It has two major and two minor logarithmic spiral arms with clumps, a dim bulge and a sparse halo: 55k grains on desktop, 22k on phones or devices with 4 or fewer cores. The pixel ratio is capped at 1.5 (1 on phones).
- All motion runs in the vertex shader: a slow rotation, grains flowing outward along the arms (fading in and out at the ends), light turbulence, about 16% twinkle, and an eased mouse tilt for parallax. Grains near the mouse ease a few pixels outward (mouse only, not touch). No React state changes per frame.
- Readability: grains dim to 28% inside the hero copy's box (found with `data-hero-copy`) and fade out toward the canvas edges, so there is no visible rectangle. The core is kept dim. On phones the galaxy is larger and sits a little lower, so its arms show around and below the copy.
- Palette: graphite to silver to soft white, with about 3% warm-white grains. Light theme: charcoal and graphite at lower opacity. It follows theme changes live.
- `pointer-events: none` and `aria-hidden`. It pauses off screen and in hidden tabs. Under reduced motion it draws one still frame with no pointer response, and it reacts if that setting changes. If WebGL is missing, it renders nothing. Cleanup frees the buffer, the program and the listeners. The WebGL context is not force-lost, because React Strict Mode remounts reuse the same canvas.
- `Hero.tsx`: the section gained `relative isolate`, the copy wrapper gained `relative z-10` and `data-hero-copy`, and `<HeroGalaxy />` was added. Copy, spacing and sizes are unchanged.

**Files changed**
- New: `src/components/home/HeroGalaxy.tsx`
- Changed: `src/components/home/Hero.tsx`, `PROGRESS.md`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass. (The build again stopped once on Next.js's security-advisory check; a rerun passed.)
- Checked on the dev server at 1440×812 in the dark and light themes: the galaxy shows behind the heading with no rectangle edge, and it rotates between frames. The heading, subheading, badge, navbar and buttons look the same. The navbar links, Join Waitlist and "Talk to us" receive clicks through the canvas. It runs at about 60 fps, with no horizontal scroll.
- Checked at 390px wide (in an iframe): the copy is readable and the galaxy frames it.
- Not checked: reduced motion, a real phone or touch device, lower-end GPUs, or how the cursor ripple feels to use.

**Follow-up (2026-10-24): more visible**
- Owner asked for the galaxy to be more visible in both themes. Grain opacity is up about 1.5×, grains are slightly larger, dark-theme greys are lighter and light-theme greys are darker. The light theme now uses nearly full opacity. The dimming behind the copy is unchanged.
- Checked on the dev server at 1440×812 in both themes: the arms are clearly visible and the heading stays readable.

**Still incomplete / notes**
- Brightness, tilt and speed are constants at the top of the shader and are easy to tune if the owner wants it stronger or calmer.

## Change after Phase 11: Hero video, split hero, beams removed

**Owner requests (2026-10-24)**
- Put the product video (`ParallelFlow Logo/Product_preview.mp4`) in the hero's Product preview slot.
- Then: split the hero copy and the video into two separate sections. The owner chose to have the hero fill the first screen and the video section start below it.
- Then: remove the animated background strips (the hero beams) and place the heading at the top centre. The owner chose to keep the full-screen hero, leaving empty space below the button.

**What changed**
- The video is copied to `public/videos/product-preview.mp4` (1920×1080 H.264, 52s, no audio track, 36.6 MB, metadata at the front of the file so it streams).
- New `HeroVideo` client component: muted, looping, inline, `preload="metadata"`. It autoplays only when motion is allowed. Under `prefers-reduced-motion` it stays paused on the first frame and shows controls. It reacts if that setting changes.
- The "Product preview" label stays in the frame's top-left corner, now with a dark translucent background so it reads over the video in both themes.
- `Hero` now holds only the copy (badge, heading, subheading, "Talk to us"). It is at least one screen tall below the navbar (`100svh` minus the navbar height), with the copy centred left to right and starting near the top.
- New `ProductPreview` section (in `Hero.tsx`) holds the 16:9 video frame. `src/app/page.tsx` renders `<Hero />` then `<ProductPreview />`.
- The hero beams are gone: `HeroBeams.tsx` is deleted and all `.hero-beams` styles (including the light-theme filter and the glow animation) are removed from `globals.css`.

**Files changed**
- New: `src/components/home/HeroVideo.tsx`, `public/videos/product-preview.mp4`
- Changed: `src/components/home/Hero.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `PROGRESS.md`
- Deleted: `src/components/home/HeroBeams.tsx`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass. (The build again stopped once on Next.js's security-advisory check; a rerun passed.)
- Not checked in a browser: the video playing, the hero layout, phone widths, the light theme or reduced motion.

**Still incomplete / notes**
- The video is 36.6 MB and committed to git with the code. Re-encode it to roughly 5–10 MB (ideally with a WebM version too) before launch. ffmpeg is not installed on this machine.
- The full-screen hero leaves empty space below the button on tall screens, as chosen by the owner.
- The older entries about the hero beams below are now history only.

## Change after Phase 11: Blurred card backgrounds, bigger screens

**Owner requests (2026-10-24)**
- First: make the coloured dotted background behind "The Problems" and "The Solution" visual cards monochrome, and make the screen inside both cards a little bigger.
- Then: remove the animated dot (pixel) background entirely and use a simple blurred background that matches the rest of the site.

**What changed**
- `DitherBackground.tsx` (the animated canvas, shared by both cards) is deleted. Its hover glow went with it; the frame's tilt and sheen on hover stay.
- Each card now uses the site's card colour (`--color-card`) with a 1px `--color-line` border, plus two soft, heavily blurred grey shapes (CSS `filter: blur`) in opposite corners behind the frosted frame. It is static, so there is nothing to pause or reduce.
- The card now follows the theme: dark grey in the dark theme, light grey in the light theme. The screen inside stays dark in both, like a device screen. The frame's glass is a faint white (dark theme) or faint black (light theme) tint with a hairline border.
- The frame (glass border plus screen) grew from 84% × 55% of the card to 90% × 65%, still centred.
- Scene accents inside the screens (green, indigo, orange) are unchanged.

**Files changed**
- Deleted: `src/components/home/problems/DitherBackground.tsx`
- Changed: `src/components/home/problems/ProblemCard.tsx`, `src/components/home/solution/SolutionCard.tsx`, `src/components/home/problems/problems.css`, `src/components/home/solution/solution.css`, `PROGRESS.md`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass. (The build sometimes stops on Next.js's online security-advisory check after compiling; a rerun passes. Next.js 16.4.0 was flagged as having a known vulnerability; upgraded to 16.4.3 on 2026-10-24.)
- Checked on the dev server at 1440×812: the Problems card in the dark theme and the Solution card in the light theme.

**Still incomplete / notes**
- Not checked at phone widths.
- Should the scene accents inside the screens go monochrome too? Not done unless asked.

## Change after Phase 11: "Built for [role]" section

**Owner request (2026-10-22)**
- Replace the home page's "Who it's for" section (headline, intro, 2×2 persona grid) with a rotating "Built for [role]" section: four role tabs, a headline phrase that rotates with them, and a detail card (three columns with a Join Waitlist button at first; two columns and no button after follow-ups). Copy supplied by the owner, used word for word.
- Owner decisions in this session: the green accent is approved as an exception to the monochrome rule (decision 7). The role copy, including "Review diffs before anything merges" and "Reuse skills for review, tests, and refactors", is approved as written. The role data lives in `src/content/home.ts`.

**What changed**
- New `BuiltFor` section. It autoplays every 2.8s from 01. It pauses on hover, on focus inside the section and while off screen, and stops for good once a role is picked. Under reduced motion there is no autoplay and no transition.
- The pills are a WAI-ARIA tab group (arrow keys, Home, End). The card is the tabpanel. The headline phrase becomes a polite live region only after the visitor picks a role.
- All variants of the phrase and card columns sit stacked in one grid cell, so heights never change while cycling.
- Below 880px the card columns stack. Below 480px the pills scroll sideways in one row.
- New `--color-accent` token: `#6fd39a` dark, `#1f7a4d` light (5.3:1 on white, 4.9:1 on cards).

**Files changed**
- New: `src/components/home/BuiltFor.tsx`, `src/components/home/built-for.css`
- Changed: `src/components/home/HomeBody.tsx`, `src/content/home.ts` (`AUDIENCE` replaced by `ROLES`), `src/app/globals.css` (accent token), `PROGRESS.md`
- Deleted: `src/components/sections/Section.tsx` (no longer used)

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass (rerun after the follow-ups). Committed and pushed as `9582585`.
- In Chrome against the production build: autoplay cycles, pauses on hover and resumes after, stops after a click. Arrow, Home and End keys select and focus tabs. Section height stays constant across all four roles at 1440, 1024, 768 and 375px, with no horizontal overflow. Checked visually in both themes at 1440, 768 and 375px (375px in an iframe).

**Still incomplete / notes**
- Owner follow-up: the card's third column ("Start in" plus the mode name) was removed, along with `startIn` in `home.ts`. The card now has two columns ("The problem", "What you do in ParallelFlow"). The Join Waitlist button was then removed from the section too, so it has no CTA.
- The card uses `bg-card` (#151515 / #f4f4f4). The demo cards in "The Problems" and "The Solution" are pure black in both themes, so they have no raised-surface token to reuse.
- Reduced motion was checked in code only, not by emulating it in a browser.
- Owner follow-up: the "Who it's for" eyebrow (green dot and label) was removed, and `ROLES.label` with it. On screens matching the `pin` variant (at least 1024px wide and 672px tall) the section now pins under the navbar inside a 300svh wrapper, and scrolling moves the role from 01 Developers to 04 Agent builders, one quarter of the stretch each. Clicking a tab smooth-scrolls to its quarter, the same way "The Solution" works. On phones and short screens, where the pinned layout wouldn't fit, the 2.8s autoplay stays. Checked on the dev server at 1440×812 and 1024×680 (pinned; the card fits) and 375×812 (autoplay).
- Owner follow-up: in the light theme the rotating role phrase uses `#2f9e5f`, brighter than the accent. The owner first asked for the dark theme's `#6fd39a` (1.8:1 on white), then for something a little darker. `#2f9e5f` is 3.4:1, which passes for large text but is below the 4.5:1 target. The arrows keep the darker `#1f7a4d` in light mode.

## Change after Phase 11: Hero beams in the light theme

**Owner request (2026-10-22)**
- The hero's diagonal beams ("strip effect") showed only in the dark theme. Show them in the light theme too, adjusted to suit it.

**What changed**
- In the light theme `.hero-beams` is no longer hidden. A CSS filter (`invert(1) hue-rotate(180deg)`) turns the silver beams and white glow into dark-grey beams and a soft dark halo on white, with the same cool tint, at 80% opacity. The shader, animation, mask and dark theme are unchanged.

**Files changed**
- `src/app/globals.css`: the light-theme `.hero-beams` rule and comments
- `src/components/home/HeroBeams.tsx`: comments only

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass. Committed and pushed as `0c1b5ef`.
- In Chrome at 1440px against the production build: the beams animate in the light theme, the heading stays readable and the beams fade out before the navbar and the preview. Tried 55% opacity first; it was too faint.

**Still incomplete / notes**
- As in the dark theme, the grey subheading (`#555555`) loses some contrast where a beam crosses it.
- Not checked: phone widths and reduced motion in the light theme. The running dev server on port 3000 was not picking up file changes and may need a restart.

## Change after Phase 11: Developer Space removed, Product page trimmed

**Owner request (2026-10-22)**
- Remove Developer Space from the website. Workspace and Arena are the only products left.
- Remove the "How it connects" section from `/product`.
- Remove the closing "Join the waitlist" band from `/product`.

**What changed**
- Developer Space is gone from the product list, the navbar's Product menu, the footer's Product column and the `/product` mode showcase and feature grid.
- The feature grid is now two columns, so it fills the width.
- `/product/developer-space` now redirects (308) to `/product`. The Arena and Workspace redirects are unchanged.
- `/product` now ends with "What it's designed to do". The footer's "Try ParallelFlow / Get Early Access" is the closing CTA. The divider above the removed sections went with them.
- The footer's Product column still has two links (Workspace, Arena), so it meets the two-link rule.
- Copy changed (owner to review):
  - Feature grid subtitle: "Across Workspace, Arena, and Developer Space. All coming soon." → "Across Workspace and Arena. Both coming soon."
  - The "How it connects" text and the closing band text were deleted with their sections.

**Files changed**
- `src/content/products.ts`: the Developer Space entry and slug
- `src/content/product-modes.ts`: the Developer Space mode, the grid subtitle, the connects and closing copy
- `src/lib/nav.ts`: the Product menu order
- `src/components/layout/Footer.tsx`: the Product column
- `src/components/product/modes.ts`: Developer Space icons and their imports
- `src/components/product/FeatureGrid.tsx`: two columns
- `src/components/product/ModeShowcase.tsx`: comments only
- `src/app/product/page.tsx`: the two sections, a divider and an unused helper removed
- `next.config.ts`: the redirect
- `PROGRESS.md`

**Setup needed from the owner**
- None. `next.config.ts` changed, so restart `npm run dev` if it was running.

**Verified**
- Lint, type-check and production build pass.
- No "Developer Space" text on `/`, `/product` or the 404 page.
- Headless Chrome at 1440 and 390px:
  - `/product` has only the Workspace and Arena blocks.
  - No "How it connects" or closing band.
  - Normal spacing before the footer, no horizontal scroll.
  - The footer lists only Workspace and Arena.

**Still incomplete / notes**
- The open navbar dropdown was not screenshotted. It builds from the same product list.
- The Developer Space copy is still in `PROJECT_BRIEF.md` Part 6 if it comes back.

## Change after Phase 11: Neon ring on buttons and the hero badge

**Owner request (2026-10-21 to 2026-10-22)**
- The footer's "Get Early Access" gets the same hover glow as the navbar's "Join Waitlist".
- A thin animated neon border on every pill button, then changed to show only on hover. Without hover the buttons look as before.
- The same neon border, always moving, on the home hero's "Pre-launch · Waitlist open" badge.
- Remove "Pre-launch · Waitlist open" from the footer.
- **Owner override:** the neon colours go against the brief's monochrome, no-neon, no-gradient rules (CLAUDE.md, `PROJECT_BRIEF.md` Part 3, decision 7). The owner chose neon colours when asked.

**Behaviour**
- **Ring:** 1.5px, a conic gradient (cyan → violet → pink → amber → cyan) turning once every 4s, linear. It is drawn on `::before` with a mask, so only the outline shows. Fill, text, size and shape are unchanged and nothing shifts.
- **Buttons:** every pill from the shared `Button.tsx` (navbar, mobile menu, footer, `/product`, 404, Home hero's "Talk to us", `DisabledButton`) plus the waitlist form submit. The ring fades in over 200ms on hover and on keyboard focus, together with the existing glow. Icon buttons and nav controls are unchanged.
- **Hero badge:** the ring is always on (`neon-ring-on`), dimmed to 45% (`[--neon-ring-opacity:0.45]` in `Hero.tsx`) at the owner's request so it is less visible. `--neon-ring-opacity` defaults to 1.
- **Bordered pills** ("Talk to us", the badge) set `--neon-ring-inset: 1px`, so the ring covers the grey border instead of sitting inside it.
- **Reduced motion:** the ring stays still and keeps its colours.
- **Themes:** the colours are the same in light and dark.
- **Footer CTA:** its overrides that turned the glow off and dimmed the fill on hover are removed, so it uses the shared primary glow. Its 16px regular text and focus ring stay.
- **Footer bottom bar:** the status badge and its green dot are removed. The theme toggle and copyright remain. `--color-status` is now unused but kept in `globals.css`.

**Files changed**
- `src/app/globals.css`: `@property --neon-ring-angle`, `neon-ring-spin` keyframes, `neon-ring` and `neon-ring-on` utilities, `--neon-ring-opacity`
- `src/components/ui/Button.tsx`: `neon-ring` on the shared base, the inset on the secondary variant
- `src/components/waitlist/WaitlistForm.tsx`: `neon-ring` on the submit
- `src/components/home/Hero.tsx`: the always-on ring on the badge
- `src/components/layout/Footer.tsx`: shared glow on Get Early Access, status badge removed
- `PROGRESS.md`

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass.
- Headless Chrome at 1440 and 390px, in dark and light:
  - No ring at rest; the ring on hover; the same glow on the footer and navbar buttons.
  - The badge ring is visible all the time.
  - The ring angle moves about 90° per second, and stays at 0° under reduced motion.

**Still incomplete / notes**
- Not checked by hand: a real mouse, Safari, Firefox.
- The Turbopack dev server twice missed new `@utility` rules in `globals.css` until it was restarted. If a style change does not show in dev, restart `npm run dev`.
- Committed as `2440c7f`, with the dimmer badge ring in `bc11d83`. Both pushed.

## Change after Phase 11: Navbar trimmed, SDLC page deleted

**Owner request (2026-10-21)**
- Remove "Solutions" and "Resources" from the navbar. Product is the only navbar group left.
- Delete the SDLC page, which no menu linked to any more.

**Files changed**
- Deleted: `src/app/solutions/engineering/sdlc/page.tsx`, `src/content/sdlc.ts`, and `src/components/sections/PreviewSlot.tsx` and `ProductCards.tsx`, which only the SDLC page used.
- Changed: `src/lib/nav.ts` (groups removed), `src/lib/seo.ts` (sitemap entry removed), comments in `Footer.tsx` and `src/content/products.ts`, `PROGRESS.md`.

**Setup needed from the owner**
- None.

**Notes**
- The open item about the SDLC hero's "Explore the Platform" link is moot now that the page is gone.
- The SDLC copy is still in `PROJECT_BRIEF.md` Part 4 if the page comes back.

## Change after Phase 11: Footer redesign

**Owner request (2026-10-21)**
- A clean, minimal YC-startup-style footer, aligned with the navbar, refined over several rounds in one session. Nothing outside the footer was redesigned.
- Owner decisions:
  - Only real links: a column needs at least two links, at most three columns, no "Soon" tags.
  - One colour accent, a green status dot. This overrides decision 7 for that dot only.
  - The Humans/Agents track and the footer doodles are removed.
  - The closing CTA follows cursor.com's "Try Cursor now.".

**What was built (top to bottom)**
- Closing CTA, centred: "Try ParallelFlow" in large regular-weight type (clamp 44–72px, -0.04em, line height 1.1) over a light "Get Early Access" pill. The pill uses the shared `WaitlistButton`, so it opens the same waitlist modal as the navbar.
- Brand block on the left (logo, tagline, 36px round Email/X/LinkedIn buttons). Link columns from `FOOTER_COLUMNS` at the top of `Footer.tsx` sit on the right, flush with the container's right edge. Today that is one column, Product (Workspace, Arena, Developer Space → `/product#…`). Solutions has only SDLC, so it is left out under the two-link rule; SDLC stays in the navbar.
- Bottom bar: theme toggle and "© year ParallelFlow" on the left, a status pill with a green dot (`--color-status`, with light and dark values) on the right.
- A large "ParallelFlow" sign-off wordmark (17vw, fading out) cropped by the bottom edge. `overflow-hidden` sits on the wordmark's wrapper only.
- No divider lines inside the footer; only its top border remains. Every row uses the navbar's padding (`px-4 sm:px-6 lg:px-8`) with no max width.
- The footer is shorter than a typical laptop viewport, so at the bottom of the page the sticky navbar no longer covers the CTA heading. That was the cause of the clipped-heading bug. It can still happen on windows under about 740px tall.

**Files changed**
- Deleted: `src/components/layout/FooterDoodles.tsx`. An inline email form, `FooterWaitlist.tsx`, was added during the redesign and later removed when the CTA button replaced it. Its modal and form prefill changes were reverted with it.
- Changed:
  - `src/components/layout/Footer.tsx`
  - `src/app/globals.css`: footer animation tokens and keyframes removed, `--color-status` added
  - `src/lib/nav.ts`: `footerLabel` removed, comment updated
  - `PROGRESS.md`

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass.
- Headless Chrome at 375, 768, 1440 and 1920px in both themes:
  - Left edges match the navbar logo, and the Product column and pill line up with the Join Waitlist button.
  - No horizontal scroll.
  - The CTA opens the modal.

**Still incomplete / notes**
- Add links to `FOOTER_COLUMNS` as pages ship. Solutions returns once it has a second page; Company and Legal once their pages exist.
- `SOCIAL_LINKS` are still dummy values; replace them before going public.
- The brief's footer table (Part 3) still lists the old columns; this redesign supersedes it at the owner's request.

## Change after Phase 11: Real logo

**Owner request (2026-10-21)**
- The owner's logo, an isometric box with two tape strips, replaces the placeholder mark. It must work on both the black and the white background.
- Masters: `logo1.png` (black on white) and `logo2.png` (white on black), 1024px with no transparency, from `~/Desktop/ParallelFlow Logo/`. Copied to `assets/brand/` as references. They are not served.

**How it works**
- The mark was traced into one SVG in `LogoMark` (`src/components/brand/Logo.tsx`). The four faces are filled with `currentColor`, and the two tape lines are cut out with a mask that uses a `useId` id. On top of the black master it differs by about 0.3% of pixels, all anti-aliased edges.
- Because it uses `currentColor`, the mark is white in the dark theme and black in the light theme, with no per-theme files.
- `Logo` is now the mark (28px) plus the "ParallelFlow" wordmark at 20px semibold, 8px apart. The owner asked on 2026-10-21 for it larger (first 24px and 18px), then sized like typical startup navbars (mark 20–28px, wordmark 16–20px), so the navbar and footer pick it up. The `/product` eyebrow already used `LogoMark` and now shows the real mark.
- **Favicon:** `src/app/icon.svg` uses the same paths. It is near-black on a light browser and white on a dark one (`prefers-color-scheme`). The default Next `favicon.ico` is removed.
- **Social image:** `opengraph-image.tsx` shows the white mark beside the name, from `assets/brand/logo-mark-white.png`, which is rendered from the same paths.
- If the mark changes, update `Logo.tsx`, `icon.svg` and `logo-mark-white.png` together.

**Files changed**
- New: `assets/brand/logo-black-on-white.png`, `assets/brand/logo-white-on-black.png`, `assets/brand/logo-mark-white.png`, `src/app/icon.svg`
- Changed: `src/components/brand/Logo.tsx`, `src/app/opengraph-image.tsx`, `PROGRESS.md`
- Removed: `src/app/favicon.ico`

**Verified**
- Lint, type-check and production build pass.
- The served navbar and footer markup render white on `#080808` and black on white. Each instance gets a unique mask id.
- The social image renders the mark beside the name.

**Not verified**
- Not looked at in a real browser this session (no browser tools). Check the navbar, footer, `/product` eyebrow and the tab icon in both themes.

**Note**
- ParallelFlow is still a working name. The mark has no text in it, so it would survive a rename.

## Change after Phase 11: Product navbar label links to /product

**Owner request (2026-10-15)**
- Clicking "Product" in the navbar now opens `/product`. Hovering it with a mouse still opens the Product dropdown.
- **Mobile menu:** the "Product" group heading is now a link to `/product`, with the three product rows under it.
- Solutions and Resources have no page of their own, so they stay click-to-open dropdowns.

**Files changed**
- `src/components/layout/NavDropdown.tsx` (a group with an `href` uses a link as its trigger)
- `src/components/layout/MobileMenu.tsx`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.

**Note**
- On touch and keyboard, the Product label now goes straight to `/product`, so the dropdown opens only on mouse hover. The same three products are listed on `/product`.

## Change after Phase 11: Buttons glow on hover

**Owner request (2026-10-15)**
- Every pill button on the site now glows on hover instead of fading. Before, the white primary pill faded to grey (`hover:bg-muted`).
- **Owner override:** this goes against the brief's design rule to avoid "unnecessary glow", like the earlier approved glow exceptions.

**Behaviour**
- **Primary (white pill):** keeps its colour. On hover and on keyboard focus it gets a thin ring and a soft white halo (`--button-glow`).
- **Secondary and soft:** keep their hover fill, plus a fainter halo (`--button-glow-soft`).
- **Waitlist form submit:** glows like the primary, but not while it is sending.
- **Light theme:** the halo is dark, because a white glow is invisible on white.
- **Transition:** 200ms on colour, background and shadow. Under reduced motion the glow appears instantly.
- **`DisabledButton`:** never glows. No page uses it today.
- **Unchanged:** icon buttons (menu, theme toggle, modal close) and plain-text nav items.

**Files changed**
- `src/app/globals.css` (`--button-glow` and `--button-glow-soft` for both themes; `shadow-glow` and `shadow-glow-soft` utilities)
- `src/components/ui/Button.tsx`
- `src/components/waitlist/WaitlistForm.tsx`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- In headless Chrome, in dark and light, hovering each of these changes `box-shadow` from none to the glow:
  - the navbar's Join Waitlist
  - the `/product` hero's "Get early access" and "Explore the modes"
  - the closing band's Join Waitlist
  - the Home hero's "Talk to us"
  - the SDLC page's "Explore the Platform"
  - the waitlist modal's submit
- The white pill's background stays white on hover. No console errors.

## Change after Phase 11: /product hero button label

**Owner decision (2026-10-15)**
- The owner asked for "Try ParallelFlow" in place of the hero's "Join Waitlist >". That wording implies the product can be used today, which conflicts with CLAUDE.md (waitlist-first, avoid "try it free"-style wording), so the owner chose the brief's own "early access" wording instead.
- The hero's primary button now reads **"Get early access >"** (`PRODUCT_PAGE.hero.primaryCta`). It is the same white pill and still opens the waitlist modal.
- The closing band at the bottom of `/product` keeps "Join Waitlist" (owner choice), as does the navbar.

**Files changed**
- `src/content/product-modes.ts`
- `src/app/product/page.tsx`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- In headless Chrome, `/product` shows "Get early access", "Explore the modes" and the closing "Join Waitlist", and clicking "Get early access" opens the waitlist modal.

## Change after Phase 11: Product navbar menu after x.ai

**Owner decision (2026-10-15)**
- "Product" in the navbar is a dropdown again. This **reverses the 2026-10-14 decision** (in "One Product page" below) that made it a plain link.
- It follows the list half of x.ai's Products menu (pattern only, nothing copied), inside the existing OpenAI-style full-width panel:
  - Workspace, Arena and Developer Space as rows, each with its name above its one-liner from `products.ts` (no new copy) and a soft `bg-hover` highlight on hover and focus
  - an "Overview →" link to `/product` was added, then removed at the owner's request; `/product` is still reachable from any row
- Rows link to `/product#workspace`, `#arena` and `#developer-space`.
- Solutions and Resources are unchanged. The footer still shows one "Product" link, because it uses the group's `href`.
- Mobile menu: Product is a section heading with Workspace, Arena and Developer Space under it.

**Follow-up (when the mode videos exist)**
- Add x.ai's right-hand preview pane: a `PreviewWindow` beside the rows that switches on hover. It is left out for now because a blank pane in a menu looks broken.

**Files changed**
- `src/lib/nav.ts` (optional `description` on items; the Product group gets its items)
- `src/components/layout/Navbar.tsx` and `MobileMenu.tsx` (a group is a plain link only when it has an `href` and no items)
- `src/components/layout/NavItemRow.tsx` (the rich row)
- `src/components/layout/NavDropdown.tsx` (the rich list and the Overview link)
- `PROGRESS.md`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass.
- Headless Chrome on the production build, at 1440x900 in dark and light:
  - **Hover:** hovering Product opens the panel with the 3 rows. Hovering Arena highlights it.
  - **Links:** clicking Arena lands on `/product#arena` at the navbar edge with the panel closed.
  - **Keyboard:** Enter opens the menu, Tab focuses Workspace, and Escape closes it and returns focus to Product.
  - **Footer:** shows a single "Product" link.
- At 390x844, the mobile menu lists the three modes, and tapping Developer Space goes to `/product#developer-space`.
- No horizontal overflow and no console errors.

## Change after Phase 11: /product hero in the x.ai/grok style

**Owner request (2026-10-15)**
- **Eyebrow:** a placeholder logo mark, "ParallelFlow", a thin 12px divider, then "Desktop apps are coming soon" in dimmer grey (75% of `text-muted` in the dark theme; full `text-muted` in light, for contrast).
- **Headline (owner-supplied):** "Where teams and AI agents / ship together." It replaces "Product". The style is `clamp(44px, 7vw, 80px)`, weight 500, line-height 1, tracking -0.04em.
- **Subtext (owner-supplied):** "Plan, build, and ship in one connected workspace. / Your team, your agents, your context, all in sync." It is near-white (`text-foreground/90`) and replaces the value proposition in the hero. The value proposition stays as the page's meta description.
- **Buttons:** "Join Waitlist >" is unchanged. "Explore the modes" is now a filled pill with no border, using a new `soft` button variant (`bg-hover`, hover `bg-line`).
- **Spacing:** centred, with 20px between eyebrow, headline and subtext, and 112 to 160px above and 112 to 144px below the hero.
- **Preview card:** the dots, mode title and "Product preview" pill are removed. What remains is a rounded card with a border and the existing glow, around the blank 16:9 screen.

**Owner decisions**
- **`LogoMark`** (two parallel slanted bars, from the brief's logo description) is a placeholder until real logo assets exist. It is used only in this eyebrow. The navbar and footer still use the text wordmark. (Superseded: see "Real logo".)
- **"Product preview" label:** removed while the card is blank. **When videos are added, a visible "Product preview" label must come back** (CLAUDE.md rule). Screen readers still hear "<Mode> product preview, video coming soon".

**Files changed**
- `src/app/product/page.tsx` (hero only)
- `src/components/brand/Logo.tsx` (adds `LogoMark`)
- `src/components/ui/Button.tsx` (adds the `soft` variant)
- `src/components/product/PreviewWindow.tsx`
- `src/content/product-modes.ts` (`PRODUCT_PAGE.hero.title` and `.subtitle`)
- `PROGRESS.md`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass. `/product` is still static.
- Headless Chrome on the production build:
  - **1440x900:** the H1 is 80px with an 80px line-height, -3.2px letter-spacing and weight 500. The subtext is white at 90%. The soft button has a filled background and a 0px border.
  - **390x844:** the H1 is 44px.
  - **Card and showcase:** the card has no chrome or text, and the showcase still follows the active mode.
  - **Themes and stability:** dark and light both checked. No horizontal overflow and no console errors.

## Change after Phase 11: Navbar restyled after openai.com

**Owner request (2026-10-15)**
- The line under the navbar is removed, and the bar now follows openai.com's (pattern only; nothing copied). Measured in headless Chrome:
  - **openai.com's bar:** 64px tall, solid page background and no border. It spans the full width with 32px gutters, and the plain-text items sit right after the logo.
  - **Hover:** hovering one item dims the others to 60%.
  - **Buttons:** 36px pills.
  - **Dropdowns:** a full-width panel in the page colour (a muted label above large links), with the page behind blurred and dimmed.
- **Owner choices:** the bar spans the full width, and dropdowns open as a full-width panel.

**Behaviour**
- **Bar:**
  - no bottom border
  - full width, with 16, 24 and 32px gutters by screen size
  - Product, Solutions and Resources as plain `text-sm` items 28px apart, with no hover background and no chevrons
  - Join Waitlist is the only action, as a 36px pill
- **Hover:** hovering an item dims the others to `text-muted`. An open dropdown's trigger stays bright.
- **Solutions and Resources:** each opens a full-width panel under the bar, with the group label in muted text above `text-2xl` links. Resources items stay non-clickable with "Coming soon".
  - The page below is blurred and dimmed (`bg-background/40 backdrop-blur-md`). Moving the pointer onto it, clicking it, Escape, an outside click, or focus leaving closes the panel.
  - It still opens on click and keyboard, with `aria-expanded` and `aria-controls`.
  - It fades in with `motion-safe:animate-fade-in`.
- **Mobile menu:** fills the screen below the bar, with no border, muted `text-sm` group labels and `text-lg` links. Behaviour is unchanged.

**Files changed**
- `src/components/layout/Navbar.tsx`
- `src/components/layout/NavDropdown.tsx` (rewritten)
- `src/components/layout/NavItemRow.tsx` (adds `NAV_ITEM_CLASS` and a `size` prop)
- `src/components/layout/MobileMenu.tsx`
- `PROGRESS.md`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass.
- Headless Chrome on the production build, at 1440x900 in dark and light:
  - **Bar measurements:** the bottom border is 0px, the logo is 32px from the left, and Join Waitlist is 32px from the right and 36px tall.
  - **Hover:** hovering Solutions dims Product and Resources and opens the panel. Moving onto the dimmed page closes it.
  - **Resources:** shows three "Coming soon" labels and no links.
  - **Keyboard:** Enter opens Solutions, Tab reaches "Engineering: SDLC", and Escape closes the panel and returns focus to Solutions.
  - **Navigation:** clicking "Engineering: SDLC" goes to the SDLC page with the panel closed.
- At 390x844, the menu fills the screen and tapping Product navigates and closes it.
- No horizontal overflow and no console errors.

**Still incomplete / notes**
- Not checked by hand: Safari (`backdrop-filter`), real touch devices, and tablets between 768 and 1024px wide.

## Change after Phase 11: Product page showcase tweaks

**Owner request (2026-10-15)**
- The "Coming soon" pills beside Workspace, Arena and Developer Space are removed. The page still marks the products as coming soon in the hero eyebrow ("Desktop apps are coming soon"), the "What it's designed to do" subline and the closing band.
- Each mode's text now lines up with the preview window. At lg and up, each block is as tall as the window's sticky box (`100svh` minus the navbar) and centres its text. The section is about 3 screens tall instead of 1.5.
- The window is a little larger: the grid is now `minmax(0,1fr)_minmax(0,1.6fr)` with `gap-12` (was `1fr_1.3fr`, `gap-16`). At 1280px wide and up it is about 650x406 (was about 588 wide). The text column is about 406px.

**Files changed**
- `src/components/product/ModeShowcase.tsx`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- In headless Chrome on the production build:
  - **Alignment:** at 1280x720, 1440x900 and 1920x1080, with each mode centred on screen, the vertical centre of the text and of the window match to the pixel. The opacity and window title follow the active mode. `/product#arena` also lands aligned.
  - **Other checks:** 390x844 is unchanged apart from the pills. There is no horizontal overflow.

## Change after Phase 11: Product page in the style of x.ai/grok

**Owner decisions (2026-10-15)**
- `/product` is restyled after the product page on x.ai/grok (layout, spacing, typography and motion only; no text, marks or images copied). It replaces the split sections from "Product page work modes" below, in the same session.
- The three modes are the scroll-linked "features", beside one sticky "Product preview" window. The window is still blank for the owner's videos.
- The sticky mode switcher is removed. The `#workspace`, `#arena` and `#developer-space` anchors still work.
- Headings on this page are medium weight with tight tracking, as on Grok, instead of the brief's bold.

**What x.ai/grok does** (measured in headless Chrome at 1440x900)
- **Hero:** centred. An eyebrow ("Grok ∣ Available on…"), an H1 at 60px and weight 450 with -1% tracking, an 18px subline, and a primary pill with a chevron plus a soft secondary pill.
- **Feature section:** `grid-cols-[1fr_1.3fr] gap-16`. Each feature block is `min-h-[50vh]` and centred, with an icon, a 30px/500 H3, a 16/26 paragraph and 3 check bullets.
  - A single sticky demo card (`top: calc(50vh - 220px)`) swaps its contents to match the active feature.
  - The block crossing the middle of the screen is at opacity 1, and the others at 0.2, with a 500ms fade.
- **Below it:**
  - an "And much more" 3-column grid (16px muted icon, 14px title, 12px muted line, no cards)
  - "Get started", with 3 bordered cards numbered 01 to 03
  - a soft-filled closing CTA band
  - contained hairline dividers between sections

**The page now**
1. **Hero:**
   - an eyebrow, "ParallelFlow ∣ Desktop apps are coming soon"
   - H1 "Product"
   - the value proposition, verbatim
   - Join Waitlist (with a chevron) and a secondary "Explore the modes" link to `#workspace`
2. **Mode showcase** (`ModeShowcase.tsx`):
   - Left: Workspace, Arena and Developer Space, each with an icon, the name (H2), "Coming soon", the `products.ts` one-liner and 3 check bullets.
   - Right (at lg and up): one sticky window, centred in the screen below the navbar. Its title bar shows the active mode and fades in on change (`motion-safe` only).
   - The active block comes from an IntersectionObserver on the line across the middle of the screen. Inactive blocks dim to 20% at lg and up.
   - Below lg: no dimming, and each block shows its own blank window.
3. **"What it's designed to do"** (`FeatureGrid.tsx`): all 15 features, one column per mode.
4. **"How it connects":** 01 Arena, 02 Workspace, 03 Developer Space cards, using the brief's sentences.
5. **Closing band:** "Join the waitlist", the closing line and Join Waitlist.

**Copy for the owner to review** (`src/content/product-modes.ts`)
- **Check bullets:** from the brief's Part 1 "Lead with" column, lightly trimmed:
  - Workspace:
    - "Sessions tied to projects"
    - "Roles, tools, skills, and MCP connections managed in one place"
    - "Interactive or autonomous mode within granted permissions"
  - Arena:
    - "One shared feed for people and a shared project agent"
    - "One clear project goal, with task owners, status, and blockers"
    - "Human approval for consequential actions"
  - Developer Space:
    - "Visual, low-code builder for roles and skills"
    - "Personal and team libraries with versioning"
    - "Secure sharing, with credentials never embedded"
- **New lines, marked "Draft":**
  - "Explore the modes"
  - "Across Workspace, Arena, and Developer Space. All coming soon."
  - "Join the waitlist"
- The six draft features listed in the entry below are still awaiting review.

**Files changed**
- New: `src/components/product/ModeShowcase.tsx`, `src/components/product/FeatureGrid.tsx`
- Changed:
  - `src/app/product/page.tsx` (rewritten; same metadata)
  - `src/components/product/PreviewWindow.tsx` (title and screen fade in on change)
  - `src/components/product/modes.ts` (adds `MODE_ICON`)
  - `src/content/product-modes.ts` (adds `highlights`, drops `number`, new `PRODUCT_PAGE` strings)
  - `src/app/globals.css` (removes `--mode-nav-height`, adds `--animate-fade-in`)
  - `PROGRESS.md`
- Removed: `src/components/product/ModeNav.tsx`, `ModeSection.tsx`, `useMedia.ts`

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass. `/product` is still prerendered as static.
- Headless Chrome on the production build:
  - **Scroll state:** at 1440x900 (dark and light) and 1920x1080, scrolling makes exactly one block opaque (opacity 1, others 0.2), and the sticky window's label matches it: Workspace, then Arena, then Developer Space. The window sits centred below the navbar and releases after the last block.
  - **Anchors:** `/product#arena`, the old `/product/arena` redirect and "Explore the modes" all land at the top of the right block, below the navbar.
  - **Other sizes and motion:** 390x844 and 768x1024 (with reduced motion) stack with inline windows.
  - **Stability:** no horizontal overflow, a CLS of 0 at every size, and no console errors.

**Still incomplete / notes**
- The motion graphic videos are needed. They go in the screen in `PreviewWindow.tsx`, one per mode. The sticky window then swaps videos as the active mode changes.
- Lighthouse was not run, because it is not installed here.
- Not checked by hand: Safari, real phones, and trackpad scrolling feel.

## Change after Phase 11: Product page work modes

**Owner decisions (2026-10-15)**
- `/product` shows the three work modes one at a time, in the order Workspace, Arena, Developer Space. Each mode has a split section: a framed "Product preview" window on one side, and its heading and feature list on the other. The window is on the left for Workspace and Developer Space and on the right for Arena. On phones the heading comes first, then the window, then the features.
- **Windows left blank for motion graphic videos (owner request).** Coded scene animations were built first in this session, then deleted at the owner's request before any commit, so they are not in git history. Each window is a fixed 16:9 dark screen under a title bar with the mode name and a "Product preview" pill, so adding a video later causes no layout shift.
- The feature list is static until the videos exist: no auto-cycling highlight, no click-to-scene sync. Syncing features to video timestamps can be added with the videos.
- Accent: indigo `#6B6BFF`, now used only for the active dot in the mode switcher. Everything else stays monochrome.
- Navbar: unchanged. Product stays a plain link. Instead, the page has a sticky mode switcher below the navbar.
- The per-product "How it connects" blocks and closing lines are removed. They are replaced by one "How it connects" strip (the brief's three sentences) and one closing CTA.

**Copy for the owner to review** (`src/content/product-modes.ts`)
- Headlines are each product's `role` from `products.ts`, and value props are its `body`. Both are unchanged.
- Each mode has five features. These are new drafts written from PROJECT_BRIEF.md Part 6 and marked `// Draft.` in the file:
  - Workspace: "Project context, attached", "Deliverables to review"
  - Arena: "A shared project agent", "Private personal assistants"
  - Developer Space: "Distinct extension types", "Preview and test before sharing"
- Approved Phase 8 text is reused for the other features, with two trims:
  - "One shared feed" drops "Private conversations are never automatically exposed", which "Private personal assistants" now covers.
  - "Visual, low-code builder" now reads "Create roles and skills step by step, without building every tool from scratch."
- Closing line: "Workspace, Arena, and Developer Space are coming soon. Join the waitlist for early access and product updates."

**Behaviour**
- **Mode switcher:** sticky below the navbar while the three modes are on screen. The mode crossing the middle of the screen gets `aria-current`, and links smooth-scroll (instant under reduced motion). Anchors land just below the switcher.
- **Preview windows:** each is `role="img"` with the label "<Mode> product preview, video coming soon".
- **Anchors:** ids `#workspace`, `#arena` and `#developer-space` are unchanged, so the product cards and the old `/product/*` redirects still work.

**Adding the videos later**
- Put each video inside the 16:9 screen `div` in `src/components/product/PreviewWindow.tsx`, for example by passing a `src` per mode. Keep it muted, with no autoplay audio, and pause it under `prefers-reduced-motion`. Drop `role="img"` once a real video with its own label is there.
- To add or reorder a feature, change the feature in `product-modes.ts` and its icon in `components/product/modes.ts` together.

**Files changed**
- New:
  - `src/content/product-modes.ts`
  - `src/components/product/`: `ModeNav.tsx`, `ModeSection.tsx`, `PreviewWindow.tsx`, `modes.ts` (feature icons), `useMedia.ts`
- Changed:
  - `src/app/product/page.tsx` (rewritten; same metadata)
  - `src/app/globals.css` (`--mode-nav-height` only)
  - `PROGRESS.md`
- Removed: `src/components/sections/ProductSection.tsx` and `src/content/product-pages.ts`, which nothing else used. `PreviewSlot` and `ProductCards` stay, because the SDLC page uses them.
- No new dependencies.

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass. `/product` is still prerendered as static.
- Headless Chrome on the production build, before the windows were blanked: the switcher marks the current mode, anchor jumps land at the switcher's bottom edge, `/product/arena` redirects to `/product#arena`, and there is no horizontal overflow and a CLS of 0 at 390, 768, 1440 and 1920 wide.
- After blanking: screenshots at 1440x900 and 390x844 show the empty 16:9 windows, the switcher marks Arena as current, there is no horizontal overflow and there are no console errors.

**Still incomplete / notes**
- The motion graphic videos are needed for all three modes.
- Lighthouse was not run, because it is not installed here.
- Not checked by hand: Safari, real phones, and keyboard focus rings in the light theme.

## Change after Phase 11: Hover effect on the Problems and Solution cards

**Owner request (2026-10-15)**
- A subtle hover animation on the two dithered visual cards, inspired by memorable.sh. Nothing else changes.

**Behaviour**
- Only for mouse pointers on hover-capable screens. Off under reduced motion, and the dot glow is off while the card is off screen.
- A soft lavender glow follows the pointer through the dots. It eases in and out over about 400ms, and the canvas redraws at about 30fps while hovered (20fps otherwise).
- The frosted frame tilts up to about 3° toward the pointer and lifts 3px. It eases back over 700ms when the pointer leaves.
- A faint white sheen follows the pointer across the frame's glass border, under the black screen. The scenes are untouched.

**Files changed**
- New: `src/components/home/problems/useCardHover.ts`, which sets `data-hover` and `--pf-hover-x`/`--pf-hover-y` on the card.
- Changed:
  - `src/components/home/problems/DitherBackground.tsx` (the pointer glow)
  - `ProblemCard.tsx` and `SolutionCard.tsx` (one `useCardHover` call each)
  - `problems.css` and `solution.css` (an appended hover block only)
  - `PROGRESS.md`

**Setup needed from the owner**
- None.

**Verified**
- Lint, type-check and production build pass.
- In headless Chrome at 1440x900 on the production build, a mouse hover on each card:
  - sets `data-hover`
  - tilts and lifts the frame
  - brightens the dots under the pointer
  - resets to `transform: none` after leaving
- No console errors.

**Still incomplete / notes**
- Not checked by hand: real mouse feel, Safari, the light theme.

## Change after Phase 11: "The Solution" matches "The Problems"

**Owner decisions (2026-10-15)**
- "The Solution" uses the same design system and behaviour as "The Problems", mirrored: the dithered visual card on the left (about 52%) and the heading, subtitle and accordion on the right (about 45%).
- **Colour exception extended (owner request):** the Solution card uses the same dither and the same scene accents (indigo, orange, green). The rest of the site stays monochrome.
- New subtitle copy: "One place where humans and agents build, track, and ship together." (`SOLUTION.subtitle`). Item copy is unchanged. For items 01 to 04, the description is the hook and support line joined. Item 05's three sentences form one title with no description.
- Each scene resolves its matching problem scene and ends in a green "resolved" state:
  - 01: the Plan → Ship flow turns solid and ships
  - 02: one project window links people, agents, tasks and context
  - 03: the decision is pinned and restored in session #2
  - 04: agents move cards across the board, and the person only approves
  - 05: shipped rises with tasks, and "=" replaces "≠"

**Behaviour**
- Same as "The Problems", with its own scroll, observers and state:
  - pinned 350svh wrapper (`pin` variant), with scroll picking the row
  - clicking a row scrolls to its stretch
  - outside the `pin` variant, 6s auto-advance until a tap
  - reduced motion: no shimmer, no advance and instant swaps
  - accessibility: `aria-expanded`/`aria-controls`, arrow keys, `aria-live` title
- The section keeps `aria-labelledby="solution-title"` (it had no anchor id).

**Files changed**
- New in `src/components/home/solution/`:
  - `SolutionCard.tsx`, a copy of `ProblemCard.tsx` with the solution scenes
  - `SolutionScene01.tsx` to `SolutionScene05.tsx`
  - `solution.css`, a `pf-solution-` copy of the accordion and card rules
- Changed:
  - `src/components/home/SolutionStory.tsx` (rewritten)
  - `src/content/home.ts` (`SOLUTION.subtitle` only)
  - `PROGRESS.md`
- Reused unchanged from `src/components/home/problems/`: `DitherBackground.tsx`, `sceneKit.tsx` and `problems.css` (for the canvas and scene SVG classes). No Problems file was edited.
- `src/components/home/SolutionDiagram.tsx` is now unused but kept, as is the `pin-tall` variant in `globals.css`. Both can be removed later.

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass.
- Headless Chrome on the production build:
  - at 1440x900, scroll opens rows 1 to 5 with the matching scene, counter and `aria-live` text, and both cards are 549px square at the same height
  - clicking row 4 opens it, ArrowDown moves focus to row 5, and "The Problems" keeps its own open row
  - under reduced motion, final frames show
  - at 390x844, the card sits above the rows and auto-advance moved to row 2 after 6s
  - no console errors

**Still incomplete / notes**
- Not checked by hand: the light theme, real trackpad scrolling feel, Safari, and keyboard focus rings.
- In scene 01, the pulse briefly covers each node's label as it passes.

## Change after Phase 11: "The Problems" accordion and dithered card

**Owner decisions (2026-10-15)**
- Layout and motion modelled on memorable.sh's "One Memory For Every Agent Type" section (pattern only; no text, marks or images copied). The left column has a light-weight heading, a new subtitle and a bordered accordion. The right column has a square card with a dithered background, a frosted frame and a black screen showing one coded scene per item.
- **Colour exception (owner approved):** the card's dither uses indigo, violet and sunset colours, and the scenes use indigo `#6B6BFF`, orange `#FF7A45` and green `#3DDC84` accents. This applies to the Problems card only; the rest of the site stays monochrome.
- New subtitle copy: "Coding got faster. Everything around it didn't." (`PROBLEM.subtitle`). Item copy is unchanged. Item 05 opens with its title only, because it has no description.
- Rows follow the light and dark theme. The card stays dark in both themes.
- The frame sits in the vertical centre of the card (22.5% above and below), with the indigo above it and the sunset below (owner request).

**Behaviour**
- Pinned (`pin` variant: at least 1024px wide and 672px tall): a 350svh wrapper. Scroll position picks the open row, and the row's 1px progress line fills with scroll. Clicking a row opens it and smooth-scrolls to its stretch, without flashing the rows it passes.
- Elsewhere: one column with the card above the rows. Rows auto-advance every 6s; the advance pauses on hover, on focus and off screen, and stops once a row is tapped.
- Reduced motion: the dither is a still frame, nothing advances on its own, and scene swaps are instant and show a fixed final frame.
- Rows are buttons with `aria-expanded` and `aria-controls`; closed panels are `inert`. Arrow keys, Home and End move focus between rows. The card announces the active title through `aria-live="polite"`.
- The dither runs on a canvas: 5px cells, a 4x4 Bayer ordered dither, about 20fps. It pauses off screen and in a hidden tab, and sizes itself with ResizeObserver and devicePixelRatio. Scenes are SVGs animated with `motion` (opacity, transform and pathLength only), and they unmount once faded out.

**Files changed**
- New: `src/components/home/problems/` (`ProblemCard.tsx`, `DitherBackground.tsx`, `ProblemScene01.tsx` to `ProblemScene05.tsx`, `sceneKit.tsx`, `problems.css`)
- Changed: `src/components/home/ProblemStory.tsx` (rewritten), `src/content/home.ts` (`PROBLEM.subtitle`), `PROGRESS.md`
- `src/components/home/ProblemVisuals.tsx` is now unused but kept, because a comment in `SolutionDiagram.tsx` refers to it. It can be deleted later along with that comment.

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass.
- Headless Chrome screenshots of the production build at 1440x900 (all five rows by scroll, each with the right scene, counter and `aria-live` text), in the light theme, under reduced motion, at 1280x650 (unpinned fallback) and at 390x844 (auto-advance moved to row 2). No console errors.

**Still incomplete / notes**
- `problems.css` is a plain stylesheet, not a CSS module: the Tailwind Turbopack loader drops CSS-module scoping (and `:global`), and it polyfills `light-dark()` into variables that never get set. Every class is prefixed `pf-problems-` instead.
- On phones, scene labels scale down to about 6 to 7px, because each scene is one SVG scaled to the screen. At 1440px they are about 10 to 11px.
- Not checked by hand: real trackpad scrolling feel, click-to-scroll smoothness, keyboard focus rings, and Safari (`backdrop-filter`, `inert`).

## Change after Phase 11: Hero light beams

**Owner decisions (2026-10-14)**
- Animated monochrome light beams sit behind the hero heading and subheading. A red (crimson) version and a two-strip silver version were tried first and rejected.
- Six diagonal beams (-41.5°), each with one sharp edge and one grainy, feathered edge, fade in and out at staggered times, slide along the diagonal, and carry a travelling bright wave. A soft white glow pulses behind them (4.6s). A radial mask fades everything to black before the navbar and the Product preview.
- The beams peak at mid silver-grey (`#8C8C98`, 85% opacity) rather than white, and the glow is at 0.12, so the white heading stays readable.
- Dark theme only; hidden in the light theme. Under prefers-reduced-motion the beams show one still frame and the glow does not pulse.

**Files changed**
- New: `src/components/home/HeroBeams.tsx` (WebGL shader with a 2D canvas fallback)
- Changed: `src/components/home/Hero.tsx` (mounts `<HeroBeams />`; section is `relative`, content wrapper is `relative z-10`), `src/app/globals.css` (`.hero-beams` rules and keyframes, added at the end), `PROGRESS.md`

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass. Committed and pushed as `45f8c3a`.
- Headless Chrome screenshots at 1440px (2x), 1024px and 500px (2x) wide, and in the light theme: beams centre behind the heading, fade before the navbar and the preview, and are hidden in the light theme. No copy, spacing, buttons or other sections changed.

**Still incomplete / notes**
- The shader works in CSS pixels and scales the beams to the box width (`beamScale`), so they look the same on 2x screens. Below 640px the box is 440px tall instead of 550px, so the beams stay clear of the "Talk to us" button.
- Drawing pauses while the hero is off screen or hidden.
- Where a beam is brightest, the grey subheading (`#B3B3B3`) has only about 2:1 contrast (readable body text needs 4.5:1). Left as is for now. If it needs fixing, fade the beams out before the subheading rather than brightening the text.
- Not checked: phone widths below 500px, the no-WebGL fallback, and a frame at a beam's exact peak (headless screenshots barely advance the animation).

## Change after Phase 11: One Product page

**Owner decisions (2026-10-14)**
- "Product" in the navbar is now a plain link to `/product`, with no dropdown, on desktop and mobile. The footer's Product column has one "Product" link.
- `/product` shows Workspace, Arena and Developer Space as sections, in that order. Each section reuses the old product page layout and copy unchanged ("How it connects" cards and the closing Join Waitlist line included). Product names are now H2s.
- Page copy adds nothing new: title "Product | ParallelFlow", H1 "Product", a "Coming soon" badge, and the core value proposition as the subline and meta description.
- The product cards (SDLC page and inside each section) link to `/product#workspace`, `/product#arena` and `/product#developer-space`. The cards keep their old order.
- The old URLs `/product/arena`, `/product/workspace` and `/product/developer-space` are removed and permanently redirect (308) to the matching anchor.

**Files changed**
- New: `src/app/product/page.tsx`
- Removed: `src/app/product/arena/page.tsx`, `src/app/product/workspace/page.tsx`, `src/app/product/developer-space/page.tsx`
- Renamed: `src/components/sections/ProductPage.tsx` to `ProductSection.tsx` (wrapper `<main>` became a `<div>` with the anchor id, H1 became H2)
- Changed: `src/content/products.ts` (hrefs), `src/lib/nav.ts` (groups can be a plain link), `src/components/layout/Navbar.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `src/components/sections/ProductCards.tsx` (comment), `src/lib/seo.ts` (sitemap lists `/product`), `next.config.ts` (redirects), `PROGRESS.md`

**Setup needed from the owner**
- None. No migrations, env vars or dependencies.

**Verified**
- Lint, type-check and production build pass. `/product` is prerendered as static.
- With `next start`: the old URLs return 308 to the anchors, `/product` has one H1 and the three section ids, and the sitemap lists `/product` instead of the three old URLs.

**Still incomplete / notes**
- Not checked visually in a browser. Check the page at desktop and phone width, and that the navbar link and anchor jumps land below the sticky navbar.
- `/product` has no row in the brief's Part 7 metadata table. The per-product titles and descriptions there are no longer used.

## Change after Phase 11: "How it works" and "Trust" sections removed from the home page

**Owner decision (2026-10-14)**
- The "How it works" section (product cards) and the "Trust" / "Human oversight" section are removed from the home page. "The Solution" now leads straight into "Who it's for".
- This changes the section order approved in Phase 5, which followed the brief's "Product page key points for YC" table.
- `HOW_IT_WORKS` and `OVERSIGHT` are deleted from `src/content/home.ts`. `ProductCards` stays, since the SDLC and product pages still use it.
- The owner chose to change only the home page. The SDLC page is unchanged.

**Files changed**
- `src/components/home/HomeBody.tsx`
- `src/content/home.ts`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.

**Still incomplete / open decision**
- The SDLC hero's "Explore the Platform" button (`SDLC_HERO.secondaryCta` in `src/content/sdlc.ts`) still links to `/#how-it-works`, an anchor that no longer exists. It now just opens the top of the home page. The owner needs to decide whether to repoint it or remove it.
- The Solution finale's scroll handoff was built to release into "How it works". It now releases into "Who it's for". Check it in a browser.

## Change after Phase 11: "The Solution" rebuilt as a scroll-built diagram

**Owner decisions (2026-10-13)**
- "The solution" section below "The Problems" is replaced by "The Solution", with owner-supplied copy (`SOLUTION` in `src/content/home.ts`). Four steps have a title, a hook and a support line. The finale is "Plan together. / Execute with AI. / Move forward as a team." The Phase 5 solution paragraphs, label and headline are gone from the home page. The SDLC page's own solution copy (`SDLC_SOLUTION`) is unchanged.
- Same brand as "The Problems" (heading size, mono "0N / 05" pill, rounded dark card with hairline border, mono pills, monochrome), but flipped: the canvas is on the left and the text on the right.
- Pinned scroll model, on screens at least 1024px wide and 768px tall (the `pin-tall` variant in `globals.css`), with motion allowed: a 500svh wrapper pins a full-viewport stage. Scroll progress (smoothed with `useSpring`) drives one diagram that builds itself. Each step owns a fifth of the scroll: the first 70% builds its part, and the rest holds.
  1. The scattered, dashed Plan / Chat / Code / Test / Ship pills from "The Problems" drift into one row. The dashes fade, a solid line draws itself between them, the pills light up, and a light pulse travels along it.
  2. People, AI, Tasks and Context spiral in and a glowing core ring draws around the flow, with a core dot at its centre.
  3. Seven context dots leave the Context node and trail the head almost a full lap around the ring, then park on the bottom arc. Nothing fades.
  4. A connector drops from the flow to a lane, and Plan / Assign / Track cards snap in (slight overshoot), then tick off in sequence.
  5. The system shrinks, blurs and fades while three parallel flowing lines draw in with a glow and pulses.
- Text column, owner request: it replaces the first version's masked reveal, stacking recaps and vertical rail. It uses exactly the format of the rows in "The Problems": "The Solution" heading, then a list with a top border. Each row has a lucide line icon, a `text-lg font-semibold` title, and the hook and support as `mt-1 text-muted` lines (16px), with a hairline divider below. Font sizes are the same as the problem rows (owner request). Icons (owner approved): Workflow, Boxes, History, ListChecks, Rocket (finale). The finale's three lines use the title style.
- While scrolling, all five rows stay visible. The active row is bright and the others dim to 40%. The active row's divider fills left to right as its share of the scroll passes, as in "The Problems". Scrolling up reverses everything.
- The Solution rows have three lines each, more than the problem rows, so this section pins only on screens at least 768px tall (`pin-tall`), not 672px. Between 768px and 800px tall its rows use `py-3` instead of `py-4` to fit.
- Creative touches: four parallax depth layers (pointer and scroll), a faint dot grid that bends towards the core (rings of dots scale towards the centre, no per-dot animation), a cursor spotlight at about 5% of the text colour, and an idle shimmer on the pulses. The pulses pause while the card is off screen.
- The glowing ring, lines and pulse are an owner-requested exception to the brief's "no unnecessary glow" rule, like the spotlight. In the light theme the glows drop to 30% so they read as a soft shadow, not a smudge.
- Everywhere else (mobile, tablet, screens under 768px tall) there is no pinning. The rows stack in the same format as the stacked problem rows: icon, text, then the row's own smaller canvas (counter included) below it, with a divider. Each row fades in on view, and its canvas builds its part once half visible. While scrolling, the row crossing the middle of the screen is highlighted and the other rows' text dims to 40% (owner request); the canvases never dim. Before any row reaches the middle, all are bright, and the last one stays lit once the list has passed. No dimming under reduced motion.
- Reduced motion, at any size: the finished connected system (steps 1 to 4) in one still canvas, with the five rows beside it (below it on narrow screens), all at full brightness. No scroll-linked motion, no pulses.
- Only opacity, transform, stroke-dashoffset (`pathLength`) and blur animate. No images, logos, stats or new dependencies.

**Files changed**
- New: `src/components/home/SolutionStory.tsx` (section, pinned stage, stacked and reduced layouts)
- New: `src/components/home/SolutionDiagram.tsx` (the diagram, driven by one `stage` value from 0 to 5)
- `src/components/home/HomeBody.tsx` (renders `SolutionStory`)
- `src/content/home.ts` (`SOLUTION` only)
- `src/app/globals.css` (`pin-tall` variant, `flow-pulse` and `shimmer` keyframes)
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- Tested in headless Chrome against the production build:
  - Pinned: 1440×900 (dark and light, all five steps forward and in reverse), 1024×768 (light), 1280×768, 1440×790, 1440×800 and 1920×1080. At each step the counter, the highlighted row and the diagram match, scrolling down and back up. The heading and list fit inside the pinned panel at every size; the tightest is 1024×768, with 31px to spare. There is no horizontal overflow.
  - 1024×767 and 1280×680 fall back to the stacked layout as intended.
  - Handoffs: "The Problems" releases into the Solution's scattered pills, and the finale releases into "How it works".
  - Stacked: 375×812 (dark, light), 1280×680 and 1366×650. The rows reveal and build on view. At 375×812 and 1280×680, centring each row in turn, down and back up, lights exactly that row and dims the other four. Under reduced motion all five stay bright.
  - Reduced motion: 1440×900 (light) and 375×812. Still canvas and all five steps, no CSS animations running.
- Layout shift is 0 while scrolling the whole section down and back up at 375, 1280 and 1440 widths. The 99th-percentile frame is 19–21ms. A single long frame appeared twice but did not repeat in four re-runs.
- Pointer parallax moves the layers, and the spotlight follows the pointer.
- Headings: h2 "The Solution", then five h3s (row icons are `aria-hidden`), between "The Problems" and "How it works". No text inside SVGs, and every canvas is `aria-hidden`. The finale's lines have spaces between them for screen readers.

**Notes**
- "The Problems" is untouched. The spotlight, the card classes and the reveal-on-view hook are small copies in `SolutionStory.tsx`, not shared imports, so that file did not need to change. If both sections should share them, moving them to a shared module is a follow-up.
- The pinned and stacked layouts are two DOM trees, and CSS shows one. The h2 used for `aria-labelledby` lives in the pinned tree. A label still resolves when its element is hidden.
- Not checked in Safari or on a real phone; headless Chrome only.

## Change after Phase 11: "Why now" section removed from the home page

**Owner decision (2026-10-13)**
- The "Why now" section is removed from the home page. It sat between "The Problems" and "The solution", so "The Problems" now leads straight into "The solution".
- This changes the section order approved in Phase 5, which followed the brief's "Product page key points for YC" table.
- `WHY_NOW` is deleted from `src/content/home.ts`. Nothing else used it.

**Files changed**
- `src/components/home/HomeBody.tsx`
- `src/content/home.ts`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.

## Change after Phase 11: "The Problems" restyled as a pinned list

**Owner decisions (2026-10-13)**
- The problem section is restyled after the "Replies drafted in seconds" section on slashy.com (layout only, no imagery). The heading is now "The Problems", and the mono "THE PROBLEM" label is gone.
- Five equal rows replace the old headline, three blocks and result line:
  1. "Coding is getting faster." / "Shipping software is still complicated."
  2. Fragmented workflows, with its two lines.
  3. Lost context, with its two lines.
  4. Coordination overhead, with its two lines.
  5. "Faster tasks ≠ faster shipping." (title only).
- Each row has a lucide line icon (fast-forward, waypoints, chat, users, not-equal), a title and its support lines, with a hairline divider below.
- Pinned scroll model: on screens at least 1024px wide and 672px tall (the `pin` variant in `globals.css`), a 400svh wrapper pins the heading, the list and the visual card. Each row owns a fifth of the scroll. The active row is full opacity and the others dim to 40%. The active row's divider fills left to right with scroll, then the next row starts from empty. Scrolling back reverses all of it.
- Visual card: about 58% of the 72rem container, 24px corners, hairline border, the window shadow and a faint dot grid. Each visual sits in a smaller inner "app card". The "0N / 05" counter, the spotlight, the crossfade and the play-on-active behaviour are kept.
- Two new visuals for the new rows:
  - Row 1: a "Coding" bar fills fast while the "Shipping" stages light up slowly; two of four never do.
  - Row 5: a grid of 12 tasks ticks off, a "≠" appears, and the "Shipped" slot stays empty.
- Everywhere else (mobile, tablet, short screens) each row stacks with its own visual and fades in on view, as before.

**Files changed**
- `src/components/home/ProblemStory.tsx`
- `src/components/home/ProblemVisuals.tsx`
- `src/content/home.ts` (`PROBLEM` only)
- `src/app/globals.css` (`pin` and `unpinned` variants)
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- Tested in headless Chrome against the production build:
  - Pinned: 1440×900 (dark, light, reduced motion), 1440×700, 1280×680, 1024×768 (light) and 1920×1080.
  - Stacked: 1366×650, 768×1024, and 375×812 (dark, light, reduced motion) and 320×640.
- Pinned: at every row's midpoint, forward and back, the active row, counter and card visual match, and the progress line is at 50% (80% later in the row). Heading, list and card fit inside the pinned panel at every size; the tightest is 1280×680, with 8px to spare. The card is centred in the panel.
- Light theme: the page background is white and the tokens switch.
- Reduced motion: the card swaps instantly with no blur.
- Stacked: rows fade in on view, never dim, and show no progress line.
- Layout shift is 0, the worst frame was 17ms, and there is no horizontal overflow. Headings are one `h2` and five `h3`s, with no text inside SVGs. The spotlight follows the pointer.

**Notes**
- Tailwind's `not-*` does not negate a custom media variant, so `unpinned` is a separate variant with the inverted query. Keep the two in step if the pin size changes.

## Change after Phase 11: Light theme and footer theme toggle

**Owner decisions (2026-10-13)**
- The site now has a light theme next to the existing dark one. A small icon-only button in the bottom-left of the footer, before the copyright, switches between them. It works like the one on x.ai/bot. In the dark theme it shows a sun, and in the light theme a moon, so it always shows the mode you switch to. It is grey and gets brighter on hover. The icons swap with a 0.3s fade and rotate, and the swap is instant under reduced motion.
- On a first visit the theme follows the system setting (`prefers-color-scheme`), and it keeps following live changes until the visitor picks one. Clicking saves only `"light"` or `"dark"` in `localStorage` under the key `theme`. Without JavaScript the site stays dark.
- No flash of the wrong theme: an inline script in `<head>` (`THEME_SCRIPT` in `src/lib/theme.ts`, the pattern from Next's "Preventing flash" guide) sets `data-theme` on `<html>` before the first paint. `ThemeScript.tsx` renders it as a client component that outputs `text/plain` on the client, so React doesn't log its "script tag" error in dev. Pages stay statically prerendered.
- The whole site switches at once. There is no colour crossfade, apart from the usual 150ms `transition-colors` on buttons and links.
- The light palette overrides the same tokens and stays monochrome: `#ffffff` background, `#f4f4f4` cards, `#e8e8e8` hover, `#0a0a0a` text, `#555555` secondary text (7:1 on white), `#dcdcdc` borders and `#858585` form-field borders (3.3:1 on cards). Primary buttons become black pills with white text.
- Theme-aware replacements for the few hard-coded colours:
  - The hero and problem windows use a new `shadow-window` utility. In the dark theme it is the same white glow and dark shadow as before. In the light theme it is a soft drop shadow.
  - The problem spotlight and dot grid now use the text colour at 5% and 7%, not white.
  - The modal backdrop is a new `scrim` token: 70% black in the dark theme, 40% in the light theme. The modal's shadow is lighter in the light theme.
- New `light:` Tailwind variant for light-only styles. Today only the toggle icons and the modal shadow use it. No new dependencies.

**Files changed**
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/lib/theme.ts` (new)
- `src/components/layout/ThemeToggle.tsx` (new)
- `src/components/layout/ThemeScript.tsx` (new)
- `src/components/layout/Footer.tsx`
- `src/components/home/Hero.tsx`
- `src/components/home/ProblemStory.tsx`
- `src/components/waitlist/WaitlistModal.tsx`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass. All pages are still static.
- Tested in Chrome with Playwright against the production build:
  - Toggling works both ways. The label switches between "Switch to light mode" and "Switch to dark mode", and the choice survives a refresh.
  - With no saved choice, a dark system setting gives dark and a light one gives light. The theme was already correct when `<body>` was first parsed, so there is no flash.
  - The toggle is reachable with Tab and works with Enter and Space. The focus ring is white in the dark theme and near-black in the light theme.
  - Under reduced motion the icon transition is effectively 0s.
  - No console errors or hydration warnings.
- Screenshots of both themes at 1440×900 and 390×844 covered:
  - the navbar, its dropdown and the mobile menu
  - the hero and "Talk to us"
  - the video window
  - all three problem visuals
  - the rest of the home page
  - the footer lanes and doodles
  - the waitlist modal, with validation errors showing
  - the SDLC, Arena and 404 pages

**Notes**
- If the toggle changes the button label but not the colours under `npm run dev`, the dev server is serving stale CSS. It missed the `globals.css` edit once. Restart it, or save `globals.css` again.
- The social share image (`opengraph-image.tsx`) stays dark. It is a static image, not a themed page.

## Change after Phase 11: "The problem" with a sticky visual window

**Owner decisions (2026-10-13)**
- The static "The problem" section below the hero is replaced. On desktop (1024px and up) it has two columns:
  - The left column scrolls normally: a mono "THE PROBLEM" label, the headline, three problem blocks (each 45svh tall, shortened from 80svh at the owner's request) and the result line "Faster tasks ≠ faster shipping." The result line sits in its own 45svh block.
  - The right column holds a sticky visual window, styled like the hero video window. It stays vertically centred below the navbar at any viewport height.
- The block nearest the viewport centre is active. It is white and the others dim to 35%. It also sets the window's visual and the "01 / 03" counter in the window's corner. The result line lights up once its top passes 70% of the viewport height. All of this is worked out from scroll position on every scroll event, so scrolling back reverses it.
- Visuals crossfade with opacity, a slight scale and blur (0.5s). Each visual's own animation plays when it becomes active and resets once it has faded out:
  - 01: scattered tool pills drift apart, joined by broken dashed lines.
  - 02: a chat message dissolves, last words first, then "What did we decide?" appears.
  - 03: assign, track and unblock chips pile onto three tasks while "Manual steps" ticks from 00 to 09.
  - All visuals are CSS and SVG only and `aria-hidden`.
- Reduced motion: visuals swap instantly with no blur or scale, and each shows a fixed frame. The text dims without a transition.
- Mobile and tablet (under 1024px): no sticky. Each problem is text followed by its own window. Blocks fade in once on view, and each visual plays while on screen.
- New owner-supplied copy, used exactly. The brief's three intro paragraphs and the longer result line ("Faster individual tasks do not always translate…") are off the home page. The SDLC page keeps its own copy (`SDLC_PROBLEM`), unchanged.
- Cursor-follow spotlight on the visual window (white at 5%). This is an owner-approved exception to the brief's "no unnecessary glow" rule. It works on hover-capable pointers only and is off under reduced motion. There is also a faint dot grid behind the section and in the windows.
- New dependency: `motion` (Framer Motion) 14.1.0, the one allowed. Only opacity, transform and blur animate.

**Files changed**
- `src/components/home/ProblemStory.tsx` (new)
- `src/components/home/ProblemVisuals.tsx` (new)
- `src/components/home/HomeBody.tsx`
- `src/content/home.ts`
- `package.json`, `package-lock.json`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- Tested in headless Chrome against the production build. Desktop at 1440×900, 1440×700, 1920×1080, 1280×1200 and 1024×768; reduced motion at 1440×900; tablet at 768×1024; mobile at 375×812 and 320×640.
- At every desktop size the window is exactly centred below the navbar while each of the three blocks is centred. Scrolling down then back up gives the same active block, counter and visual at each point. The coordination counter reaches 09 while active and resets to 00 after it leaves.
- The result line goes from 20% to full opacity, then the window scrolls away with the end of the section.
- Layout shift is 0 everywhere, and a frame-by-frame scroll through the section had no frame over 17ms. There is no horizontal overflow at 320, 375 or 1440px. The three problem titles are real `h3` headings under the `h2`, and the spotlight follows the pointer.

**Notes**
- Not tested with JavaScript off. The server-rendered HTML starts with problem 01 active, the others dimmed and visual 01 in the window. All the text is in the HTML.
- `npm audit` reports 5 high-severity issues in `braces`, from the existing lint and build tooling, not from `motion`.

## Change after Phase 11: Value-proposition line removed from the home page

**Owner decision (2026-10-13)**
- The line "ParallelFlow brings teams, AI agents, tasks, and project context into a connected workspace to help them plan, build, and ship together." is removed from the home page. It sat in a short section between the hero and "The problem". The hero now leads straight into "The problem" section.
- This departs from the CLAUDE.md rule to reuse the core value proposition word for word.
- **Visible page only.** `VALUE_PROPOSITION` in `src/content/home.ts` is kept and still used off-page:
  - the social share image (`src/app/opengraph-image.tsx`)
  - its alt text (`src/lib/seo.ts`)
  - the home page's structured data (`src/app/page.tsx`)

**Files changed**
- `src/components/home/HomeBody.tsx`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass. The sentence is no longer in the page's visible text. A screenshot shows the hero's bottom padding running into "The problem" section's top border, with no extra gap.

## Change after Phase 11: Large hero video window

**Owner decision (2026-10-13)**
- The hero's "Product preview" window is now a wide app-window frame that dominates the hero, styled after boxes.dev. It fills the hero container: the section went from `max-w-5xl` to `max-w-7xl`, so the window is 1232×693 at 1440px and above. It stays 16:9 with the same border and rounded corners. The "Product preview" badge and placeholder text are kept.
- The window may run past the first screen, so its top peeks in and invites scrolling. At 1440×900 about 300px of it shows. This replaces the earlier "fit everything in one viewport" goal, for the video only.
- App-window look: `bg-card` fill, a soft white glow above it (16% white, lifting the strip just above to about `#161616`) and a dark drop shadow below. It is monochrome, with no gradients or colour.
- The gap from the button to the window went from `mt-16 sm:mt-20` to `mt-12 sm:mt-16`, so more of the window shows on the first screen.

**Files changed**
- `src/components/home/Hero.tsx`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- Measured at 1920px, 1440px, 768px and 375px. The pill, H1, subheading and button keep their exact sizes and positions, because their own `ch` limits keep them unchanged in the wider section. The window is 1232px wide on desktop, 720px on tablet and 343px on mobile (full width with the existing 16–24px side margins).
- Sampled pixels confirm the page background stays `#080808` away from the window.

## Change after Phase 11: Hero copy update

**Owner decisions (2026-10-13)**
- H1 is now "Let agents flow with your team." It replaces "You imagine. Agents execute."
- The subheading is now "AI-native development lifecycle enabling human-agent collaboration to build, track, communicate, and ship faster."
- The "How it works →" link and the "Early access is coming soon. Join the waitlist for updates." line are removed from the hero. "Talk to us" is now the only hero action, centred on its own. The `HERO.note` copy is deleted.
- **Hero only.** The home page title ("ParallelFlow | You imagine. Agents execute.") and meta description still use the old headline and subheading. So does the footer line under parallelflow.ai (`SITE_TAGLINE`). The owner chose to leave them for now.

**Files changed**
- `src/content/home.ts`
- `src/components/home/Hero.tsx`
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- Screenshots and measurements at 1440px, 768px and 375px. Content is centred, and the spacing between the pill, H1, subheading, button and video is the same as before. The longer subheading wraps to 2 lines on desktop and 4 on mobile.

**Notes**
- The hero is still taller than one 1440×900 screen. The video's lower part needs a scroll, as before this change.
- The `#how-it-works` section id stays on the home page, though the hero no longer links to it.

## Change after Phase 11: Wider hero video window

**Owner decision (2026-10-13)**
- The hero's "Product preview" window is a bit wider on desktop: `max-w-3xl` became `max-w-4xl`, so 768×432 is now 896×504 at 1440px. It stays 16:9 with the same border and rounded corners. Nothing else in the hero changed. An earlier ask to fit the whole hero on one screen was dropped by the owner in favour of this.

**Files changed**
- `src/components/home/Hero.tsx`
- `PROGRESS.md`

**Verified**
- Lint and production build pass.
- Measured in headless Chrome. At 1440px the video is 896×504 and the other hero elements keep their exact positions. At 768px and 375px the video already filled the available width, so nothing changed there.

## Change after Phase 11: Hero "Talk to us" button

**Owner decision (2026-10-13)**
- The hero's Join Waitlist button is replaced by a "Talk to us" button. It opens a Calendly booking page in a new tab (`rel="noopener noreferrer"`). All other Join Waitlist buttons (navbar, mobile menu, footer, product pages) still open the waitlist modal.
- Style: the shared secondary button (outlined, `#333333` border, white text, pill, same size as other buttons), with a lucide `MessageCircle` icon on the left. Full width on mobile, as before.

**Files changed**
- `src/components/home/Hero.tsx`
- `src/lib/site.ts` (`TALK_TO_US_URL` added)
- `PROGRESS.md`

**Setup needed from the owner**
- `TALK_TO_US_URL` in `src/lib/site.ts` is a **placeholder** (`https://calendly.com/parallelflow/30min`). Replace it with the real Calendly link before the site goes public.

**Verified**
- Lint, type-check and production build pass.
- Headless Chrome at 1440px and 375px:
  - The link has the right URL, `target` and `rel`, and the icon is hidden from screen readers. Screen readers hear "(opens in a new tab)".
  - The border and text colours are right.
  - Tab reaches it with the `:focus-visible` ring, and Enter opens a new tab while the page stays put.
  - The hero has no Join Waitlist button, and the navbar and footer ones still open the modal.

**Notes**
- The placeholder link departs from the CLAUDE.md rule "no broken or placeholder links". The owner asked for it, as with `SOCIAL_LINKS`.
- The hero note "Early access is coming soon. Join the waitlist for updates." is unchanged. The nearest Join Waitlist button is now the one in the navbar.

## Change after Phase 11: Waitlist modal

**Owner decisions (2026-10-13)**
- Every Join Waitlist button opens one shared, centred modal. Nothing navigates away.
- The modal has the heading "Join the Waitlist" and the subtitle "Get early access to ParallelFlow and help shape the future of team collaboration."
- Five fields:
  - Full name and Work email are required.
  - Role (Founder, Software Engineer, Product Manager, Designer, Student, Other) is optional.
  - Team size (Just me, 2–5, 6–10, 11–50, 50+) is optional.
  - "Tell us about your company's workflow and any suggestions you have" is an optional multi-line text box, up to 2,000 characters, stored in `workflow_notes`. It replaced an earlier "What are you interested in?" (Arena, Workspace, Developer Space) multi-select the same day, at the owner's request.
- The brief's Part 5 extra questions (AI tools, workflow challenge, early-access testing, organization interest) and the "Tell us more (optional)" section are dropped from the form. Their DB columns stay and are left empty for new signups. This departs from Part 5 and from the CLAUDE.md waitlist notes.
- Success text: "You're on the list! We'll be in touch when ParallelFlow is ready."
- The home page `#waitlist` section with the inline form is removed. Loading `/#waitlist` opens the modal so old links still work.

**How it works**
- `WaitlistModalProvider` (in `layout.tsx`) renders one native `<dialog>` opened with `showModal()`. The page behind is inert, so focus stays inside the dialog.
- Close with the x button, a click outside the card, or Escape. Focus moves to the name field on open and returns to the trigger on close. Page scroll is locked while it is open.
- Fade and scale-in on open through `@starting-style`, which is off under `prefers-reduced-motion`.
- The form remounts on each open. The honeypot, minimum fill time, rate limit, and the "success only after the DB confirms" rule are unchanged.
- `WaitlistButton` is the one button component every Join Waitlist uses. `buttonClass()` is now exported from `Button.tsx` so it shares the pill styles.

**Files changed**
- New: `src/components/waitlist/WaitlistModal.tsx`, `src/components/waitlist/WaitlistButton.tsx`, `supabase/migrations/0002_waitlist_modal_fields.sql`
- Changed:
  - Form and backend: `src/components/waitlist/WaitlistForm.tsx`, `src/lib/waitlist/schema.ts`, `src/app/api/waitlist/route.ts`
  - Wiring: `src/app/layout.tsx`, `src/app/page.tsx` (section removed)
  - Buttons: `src/components/layout/Navbar.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `src/components/home/Hero.tsx`, `src/components/sections/ProductPage.tsx`, `src/components/ui/Button.tsx`
  - Cleanup: `src/components/home/HomeBody.tsx` (comment), `src/lib/site.ts` (`WAITLIST_HREF` removed), `PROGRESS.md`

**Setup needed from the owner**
- None. Migration `0002_waitlist_modal_fields.sql` was applied to the ParallelFlow Supabase project (`iwbyrebxrtmctiispzet`) on 2026-10-13 through the Supabase MCP, at the owner's request. It adds the `workflow_notes` column and the new team sizes, and keeps the old ones for existing rows. It is safe to run again.

**Verified**
- Lint, type-check and production build pass.
- Headless Chrome, driven by a script in the session scratchpad, not added to the project. Checked at 1440px and 375px:
  - The modal opens from the navbar, mobile menu, hero, footer, each product page's closing CTA, and the SDLC navbar.
  - x, backdrop click and Escape all close it. Focus returns to the trigger each time.
  - A click inside the card does not close it.
  - Scroll is locked while it is open.
  - Tab and Shift+Tab never reach the page behind.
  - An empty submit shows both inline errors and focuses name. A bad email shows the email error.
  - "Joining…" shows while submitting.
  - A real submit before the migration shows the error and no success.
  - The success text was checked with a mocked 200 only.
  - The workflow text box takes multi-line text and is sent as `workflow_notes`. The interests checkboxes are gone.
  - The form resets on reopen. Nothing is written to local or session storage.
  - The card fits the 375px viewport, and Escape over the mobile menu closes only the modal.
  - `/#waitlist` opens the modal.
  - No transition under reduced motion.
- After migration 0002 was applied, a real signup through `POST /api/waitlist` returned `{"ok":true}`. The saved row had the right role, team size (`6_10`) and multi-line `workflow_notes`. That test row (`claude-migration-test@example.com`) was then deleted. RLS is still on.

**Notes**
- Without JavaScript the Join Waitlist buttons do nothing, because there is no inline form left to fall back to.
- Old `team_size` values (`2_10`, `51_200`, `200_plus`) can still be in existing rows.

## Change after Phase 11: Footer redesign

**Owner decisions (2026-10-13)**
- Fresh footer design in the site's monochrome language, using existing tokens and components. An earlier version from the same day (giant animated wordmark, neon gradient edge, full-viewport height) was replaced and is not in the site.
- The domain **parallelflow.ai** is confirmed as the owner's. It is shown large in the footer as plain text (`SITE_DOMAIN` in `src/lib/site.ts`), not linked while the site is localhost-only.
- Link columns: only those with live pages (Product, Solutions), plus Connect. Resources, Company and Legal stay hidden until their pages exist. No placeholder links.
- Social links (Email, X, LinkedIn) use **dummy values** (`SOCIAL_LINKS` in `src/lib/site.ts`) at the owner's request. The owner will supply the real ones.
- Bottom bar: "© {year} ParallelFlow" and a dot with "Pre-launch · Waitlist open". "All systems normal" and "built with ParallelFlow" were not used because neither is true before launch.

**What it looks like**
- Top band: two thin parallel lanes labelled HUMANS and AGENTS (mono). A solid dot crosses the human lane; two outlined dots cross the agent lane faster. Pure CSS (transform only, no JS), decorative (`aria-hidden`), and still under `prefers-reduced-motion`.
- Doodles (owner request), all thin grey line drawings in `src/components/layout/FooterDoodles.tsx`, decorative and still under reduced motion:
  - Lanes: a tiny walking stick figure on HUMANS and two tiny robots on AGENTS, bobbing as they travel.
  - High-five at the right end of the lanes: the person's and robot's arms swing in and meet, and a spark flashes on contact.
  - "Idea to done" next to the footer Join Waitlist button: a light bulb with twinkling rays, a dashed arrow flowing right, and a box whose tick draws itself in.
- Brand block: shared `Logo`, large "parallelflow.ai" (".ai" in muted grey), the tagline (`SITE_TAGLINE`, now the hero subheading), and the shared Join Waitlist `LinkButton`.
- Columns: Product, Solutions, Connect, with mono uppercase `h2` headings. On hover and keyboard focus, two parallel underlines draw in, the second a beat behind. External links say "(opens in a new tab)" to screen readers.

**Files changed**
- `src/components/layout/Footer.tsx` (rewritten; X and LinkedIn icons are inline SVG because lucide-react v1 has no brand icons)
- New: `src/components/layout/FooterDoodles.tsx`
- `src/app/globals.css` (lane and doodle keyframes and `--animate-*` tokens in `@theme`)
- `src/lib/site.ts` (`SITE_DOMAIN` and `SOCIAL_LINKS` added, `SITE_TAGLINE` updated)
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass.
- Driven in Chrome on the home page at 1440px and 375px, and with reduced motion: lanes animate, and stop with reduced motion; footer links point to real routes; Tab gives `:focus-visible` with the focus ring and underlines; hover draws the underlines.

**Setup needed from the owner**
- Replace the dummy email, X and LinkedIn values in `SOCIAL_LINKS` before the site goes public.

**Notes**
- The footer no longer says "All rights reserved." The brief's Part 3 bottom bar has it; add it back if wanted.
- Mono column and lane labels depart from the CLAUDE.md rule that JetBrains Mono is for code or technical text only. The owner asked for mono headings.
- On the home page the footer's Join Waitlist button sits just below the waitlist form.

## Change after Phase 11: Home hero redesign

**Owner decision (2026-10-13)**
- New hero copy, overriding the brief's Part 4 hero copy. H1: "You imagine. Agents execute." Subheading: "A shared workspace where humans and AI turn ideas into finished work."
- Home page title and meta description changed to match: "ParallelFlow | You imagine. Agents execute." and "A shared workspace where humans and AI turn ideas into finished work." This departs from the Part 7 SEO metadata table.
- The macOS and Windows download buttons and the "Desktop apps are coming soon" line are removed from the hero. This departs from the brief's decision to show them disabled as "Coming soon". Join Waitlist is the only primary action, with a quiet "How it works" link to `/#how-it-works` and the status line "Early access is coming soon. Join the waitlist for updates."
- YC-style layout: centred, "Pre-launch · Waitlist open" pill, bold H1 (max 18ch, `text-balance`), muted subheading (max 60ch), smaller and quieter 16:9 "Product preview" frame, fade-in on load that is off under `prefers-reduced-motion`.

**Files changed**
- `src/components/home/Hero.tsx` (rewritten; the preview frame is inline so the shared `PreviewSlot` used by other pages is unchanged)
- `src/content/home.ts` (`HOME_HEADLINE` replaced by a `HERO` object holding the hero copy)
- `src/app/page.tsx` (home page title and meta description)
- `src/components/home/HomeBody.tsx` (headline removed from the first section below the hero; the value-proposition line stays)
- `PROGRESS.md`

**Verified**
- Lint, type-check and production build pass. Screenshots checked at 375px and 1440px.

**Setup needed from the owner**
- None.

**Notes**
- `DisabledButton` in `src/components/ui/Button.tsx` is no longer used anywhere. It was left in place.
- The earlier hero lines "A collaborative workspace where people and AI work together to turn ideas into finished work." and "AI-native development lifecycle enabling human-agent collaboration to build, track, communicate, and ship faster." are no longer on the home page.
- The "Work moves forward." heading and the "Workspace for teams to plan, build & ship together" tagline are no longer on the home page.
- The download-button rule in `CLAUDE.md` and the Part 4 hero copy in `PROJECT_BRIEF.md` no longer match the site. Neither file was edited.

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
