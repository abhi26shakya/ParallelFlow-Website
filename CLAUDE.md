# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

Next.js 16 (App Router, `src/`), React 19, TypeScript, Tailwind CSS v4, lucide-react, Zod, Supabase (`@supabase/supabase-js`). Built so far: foundation (tokens, fonts, Logo, sticky navbar, footer), the home hero, and the waitlist form with `POST /api/waitlist`. See `PROGRESS.md` for phase status. Next.js here has breaking changes from older versions, so read `node_modules/next/dist/docs/` (see `AGENTS.md`) before writing Next code.

Use npm. The folder name has a space, so scaffolding tools reject it as a package name.

```
npm run dev         # dev server
npm run lint        # eslint
npm run typecheck   # next typegen && tsc --noEmit (typegen creates the LayoutProps types)
npm run build       # production build; run lint, typecheck and build before finishing
```

There is no test runner yet. The waitlist needs `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (names in `.env.example`) and the SQL in `supabase/migrations/` applied by hand in the Supabase SQL editor. `cacheComponents` is enabled in `next.config.ts`, so reading `new Date()` during prerender fails the build. Do it inside a `"use cache"` component (see `CopyrightYear.tsx`).

## Source of truth

`PROJECT_BRIEF.md` is authoritative. It is long, so read the part you need instead of the whole file:

- Part 1: build phases, approved and open decisions, guardrails, definition of done
- Part 3: design tokens, typography, logo, footer
- Part 4: navbar, home hero, SDLC page copy, pricing spec
- Part 5: waitlist form fields, validation, DB schema
- Part 6: product specs (Arena, Workspace, Developer Space). Use these only as source material for marketing copy. Do not build the product.
- Part 7: audience, SEO metadata table, recommended stack, checklist

If two instructions conflict, or something is listed under "Decisions still open" in Part 1, **stop and ask the owner. Do not guess.** Items marked "Suggestion" need the owner's approval before you act on them.

## How work is run

- Do **one build phase per session**, following the Part 1 build-order table. Phase 1 (audit) is read-only.
- End every session with a report: files changed, migrations or env vars needed, and what is still incomplete.
- Inspect before implementing. Preserve the existing framework and don't migrate stacks to match the Part 7 table. That table (Next.js + React + TypeScript + Tailwind + Supabase + Zod + Lucide) applies only to a new or compatible project.
- Run lint, type-check, and the production build before finishing.

## Non-negotiable content rules (pre-launch, YC-facing site)

- The site is **waitlist-first**. The macOS and Windows download buttons stay disabled, labelled "Coming soon", with no link. Join Waitlist is the only active primary action. Do not add a Login button.
- **Never publish prices.** The $25/user Teams price and the Enterprise pilot offer are unapproved. The Enterprise CTA is "Join Waitlist". Do not add "Contact Sales".
- No invented features, integrations, metrics, testimonials, logos, customer counts, "Most Popular" labels, checkout, or billing. Do not mention SSO, compliance, SLAs, or other enterprise guarantees.
- Describe products as what ParallelFlow is "designed to" or "aims to" do, and mark them coming soon. Avoid "download now", "try it free", and "get started". Label product visuals "Product preview".
- No broken or placeholder links. Nav and footer items without a real page are either a non-clickable "Coming soon" label or left out.
- Reuse the core value proposition word for word: "ParallelFlow brings teams, AI agents, tasks, and project context into a connected workspace to help them plan, build, and ship together."

## Architecture intent

- **Design tokens are centralized.** The site uses a monochrome dark palette: `#080808` bg, `#151515` cards, `#242424` hover, `#FFFFFF` text, `#B3B3B3` secondary, `#333333` borders. Primary buttons are white pills with black text. No gradients, neon, or colour accents. Fonts are Inter, plus JetBrains Mono for code or technical text only.
- **Shared components:** one replaceable `Logo` component (a text wordmark until real assets exist, never emoji or random characters), a sticky navbar with dropdowns that is always visible on desktop and mobile, and one reusable footer.
- **Waitlist:** only name and email are required. Optional questions sit in a collapsible "Tell us more (optional)" section. Validate on both client and server, and store in Supabase with RLS and a unique normalized email. `organization_interest` is limited to `yes`, `maybe`, or `no_individual_or_team` (or empty) through a DB constraint plus a migration. Add spam protection. Show success **only after the DB confirms the save**, and never simulate it. Keep secrets server-side and list variable names in `.env.example`. Supabase keys live in the owner's `.env.local`, so never paste them into files or chat.
- **Pricing content** comes from a single config or data file.
- Keep the public marketing site separate from any future authenticated product code.
- Respect `prefers-reduced-motion`. Reserve fixed 16:9 space for the hero video slot to avoid layout shift.
- Use readable URLs (e.g. `/solutions/engineering/sdlc`). Per-page titles and meta descriptions are in the Part 7 table.
- `/reference` (if present) holds screenshots of x.ai/bot and OpenAI's navbar. Use them for inspiration only.



# Rules

## Ask, Don't Assume

If any part of the task is unclear or missing details, ask me to clarify before you start. Do not assume.

## Phase handoff
Work one phase per session. At the end of a phase:
- Update PROGRESS.md with: phase completed, files changed, environment variables or migrations needed, what is still incomplete, and any open decisions.
- Tell me to commit.
- Then tell me to end this session, and give me the exact name for the next session in the form "PF Phase N - <phase name>".
Do not start the next phase in the same session.
