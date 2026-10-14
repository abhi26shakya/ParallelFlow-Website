# ParallelFlow Build Progress

Phase 1 audit done. Phases 2 (foundation), 3 (home hero), 4 (waitlist), 5 (home body), 6 (SDLC page), 7 (pricing page), 8 (remaining pages), 9 (SEO) and 10 (quality gate) built and committed. Phase 11 (launch) done on localhost: a real signup is saved in the Supabase database. Hosting waits for the owner's go-ahead. The pricing page was removed after Phase 11 at the owner's request. The home hero and then the footer were redesigned after that, also at the owner's request. Then the waitlist moved into a shared modal, "The problem" got a sticky visual window, the site got a light theme with a footer toggle, "The problem" became the pinned "The Problems" list, the "Why now" section was removed, "The solution" became the scroll-built "The Solution" diagram, and the "How it works" and "Trust" sections were removed from the home page.

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
