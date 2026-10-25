# ParallelFlow Website: Project Brief for Claude Code

> **This file is the single source of truth.** Read Part 1 first, then open the other parts as each build phase needs them.
> - **Suggestion** = not part of the original brief; needs the owner's approval before you act on it.
> - **Approved** = confirmed by the owner.
> - If two instructions conflict, **stop and ask. Do not guess.**

| Part | Contents |
|---|---|
| 1 | Build plan: decisions, page status, build order, inputs, guardrails, starter prompt |
| 2 | Strategy: problems and core product thesis |
| 3 | Brand and design system: palette, rules, logo, typography, footer |
| 4 | Pages: navigation, hero, tagline, download buttons, video, SDLC page, pricing, resources |
| 5 | Waitlist form |
| 6 | Product reference: Arena, Private, Developer Space (source material only) |
| 7 | Target audience, SEO, technical stack, implementation checklist, rules |

---

# Part 1: Build Plan

## Where the project stands

The product is **not ready to download**, so the website is **pre-launch and waitlist-first**.

Value proposition to use everywhere:
> ParallelFlow brings teams, AI agents, tasks, and project context into a connected workspace to help them plan, build, and ship together.

The owner is applying to YC, so the site must stay accurate. **Show no traction, customer, price or feature claim that isn't real.**

## Approved decisions

| # | Decision | Status | Applies to |
|---|---|---|---|
| 1 | macOS and Windows buttons stay visible, **disabled**, marked "Coming soon", **no link**. Join Waitlist is the main action. | Approved | Part 4 hero and download buttons |
| 2 | Enterprise button is **"Join Waitlist"**. Do not add "Contact Sales" until a working business email or inquiry form exists. | Approved | Part 4 Pricing |
| 3 | Add optional waitlist question **"Are you interested in ParallelFlow for your organization?"** with options **Yes, Maybe, No, individual or team use**. Use with team size to identify potential Enterprise leads. | Approved | Part 5, Pricing, Part 7 |
| 4 | Do not publish proposed pricing until explicitly approved. Covers the Teams price and the Enterprise pilot offer. | Standing rule | Part 4 Pricing |

## Decisions still open (ask the owner; do not decide yourself)

| # | Topic | What the brief says | Suggestion |
|---|---|---|---|
| 1 | Product sections | Arena, Private, Developer Space are written as specs for building the product itself. | Use them as source material for website product pages; keep the product build a separate project. |
| 2 | Front-page copy | Hero headline "Work moves forward." plus subheading. Separate tagline and headline are "for the website's front page, YC oriented". | Keep hero as written. Tagline as a short line near the hero; headline as first section heading below it. |
| 3 | Optional waitlist questions | Collapsible "Tell us more (optional)" section, or a second step after signup. | Use the collapsible section. |
| 4 | Unavailable destinations | Resources not available; footer links only to pages that exist. | Show these nav items as non-clickable "Coming soon" labels; leave them out of the footer until live. |
| 5 | "Explore the Platform" button | Secondary CTA on SDLC page, no destination. | Point to the home page product section, or hide until a product page exists. |
| 6 | Waitlist button wording | "Join waitlist" (nav), "Join Waitlist" (hero), "Join the Waitlist" (SDLC). | Keep as written, or one label everywhere. Low risk. |
| 7 | Accent colours | Design rules allow accents for product status; Brand Basics says no colourful accents. | Stay monochrome everywhere. Status colours only inside product preview visuals, if at all. |
| 8 | Reference designs | Whole site follows Grok Bot (x.ai/bot); navbar follows OpenAI's site. | You may not read these reliably. Owner saves screenshots in `/reference`; take inspiration, don't copy. |
| 9 | Existing repository | Stack applies only to a "new or compatible project". | Phase 1 audit decides. |
| 10 | Hero video template | "Make a template and leave the space." | Reserve a 16:9 slot with placeholder state, no autoplay audio, fixed dimensions so the page doesn't shift. |

## Page and content status

| Page or area | Status | Lives in |
|---|---|---|
| Navbar (Product, Solutions, Resources, Pricing, Join waitlist) | Ready | Part 4, Part 3 |
| Design system | Ready | Part 3 |
| Home hero | Ready; video pending | Part 4 |
| Home sections below hero | **Not written** | Implied by Part 7 and Part 2 |
| Waitlist form | Ready, with approved addition | Part 5 |
| Solutions → Engineering → SDLC | Full copy ready | Part 4 |
| Solutions and Engineering pages | SEO text only | Part 7 |
| Arena, Private, Developer Space | Product specs only, no page copy | Part 6 |
| Pricing | Spec ready; proposed prices stay unpublished | Part 4 |
| Resources (Packages, Documentation, Developer Resources) | Not available yet | Part 4 |
| Footer | Ready; links only to pages that exist | Part 3 |
| About, Careers, Contact, Privacy, Terms | Not provided | Part 3 |
| SEO and metadata | Ready | Part 7 |
| Stack and checklist | Ready | Part 7 |

## Build order

**Run one phase per Claude Code session.** End each session with a report: files changed, migrations or environment variables needed, what is still incomplete.

| Phase | Goal | Covers | Done when |
|---|---|---|---|
| 0 | Prepare | Gather inputs listed below | Inputs and files in place |
| 1 | Audit | Inspect structure, framework, routes, components, logo and fonts, navbar, footer, waitlist, backend. Run existing lint, type-check, build. Record issues. **No changes.** | Reported back; owner has settled open decisions 1 and 9 |
| 2 | Foundation | Colour, type, spacing tokens. Inter + JetBrains Mono. Logo component (text wordmark if no logo). Sticky navbar with dropdowns. Reusable footer. | Navbar stays visible on scroll on desktop and mobile. No broken links. |
| 3 | Home hero | "Work moves forward.", subheading, two disabled "Coming soon" download buttons, Join Waitlist button, video slot | Hero matches brief, centred, responsive |
| 4 | Waitlist | Name + email required, optional questions incl. organization interest, server validation, Supabase storage, duplicate handling, spam protection, privacy note | Success shows only after backend confirms save. All listed tests pass. |
| 5 | Home body | Sections below hero, written **only from existing brief text**, then approved by owner | Owner approved copy; sections render cleanly |
| 6 | SDLC page | Solutions → Engineering → SDLC, all 8 sections as written | Copy matches brief, no unsupported claims |
| 7 | Pricing page | Teams and Enterprise cards, both Join Waitlist, **no unapproved price shown** | Matches Pricing spec; no checkout or billing |
| 8 | Remaining pages | Arena, Private, Developer Space, Solutions, Engineering, as copy becomes available | Every nav page exists or is clearly "Coming soon" |
| 9 | SEO | Titles, meta descriptions, canonical URLs, sitemap, robots, Open Graph, structured data where accurate | Private and staging pages not indexed |
| 10 | Quality gate | Phase 6 of the Implementation Checklist (Part 7) | All checks pass |
| 11 | Launch | Domain + HTTPS, live waitlist test, sitemap submission, monitoring | A real signup lands in production DB |

## Inputs to gather first

| Input | Needed for | Status |
|---|---|---|
| Repository link, or confirmation none exists | Phase 1 | Missing |
| Supabase project (keys in `.env.local` on the owner's machine) | Phase 4 | Missing |
| Production domain | SEO, canonical URLs, launch | Missing |
| Logo files (text wordmark is the fallback) | Phase 2 | Missing |
| Screenshots of x.ai/bot and OpenAI's navbar (in `/reference`) | Phases 2 and 3 | Missing |
| Copy for home sections below hero | Phase 5 | Missing |
| Marketing copy for Arena, Private, Developer Space, Solutions, Engineering | Phase 8 | Missing |
| Social preview image | Phase 9 | Missing |
| Working business email or inquiry form | Needed before "Contact Sales" can appear | Missing |
| Social links, if any | Footer | Missing |
| Privacy Policy and Terms pages | Footer | Missing |
| Analytics choice, or none | Launch | Missing |
| Hero motion video | Phase 3 slot, filled later | Owner adds later |
| Installer links | Download buttons | Coming soon |
| Approval of Teams price and pilot offer | Publishing any price | Awaiting approval |

**Never paste Supabase keys into this file or into chat.**

## Guardrails for every session

- Inspect first, implement second.
- Preserve the existing framework and working functionality; don't rewrite unrelated pages.
- Do not invent working features, integrations, pricing, testimonials or signup success.
- Show a capability as available only when it is implemented.
- No fake or broken links, no fake checkout or payment, no empty placeholder pages just to fill the footer.
- Do not publish proposed prices until explicitly approved.
- Validate on the server; keep credentials out of client-side code.
- Prefer reusable components and shared design tokens.
- Run lint, type-check and the production build; fix regressions.
- Report files changed, setup required, and what remains incomplete.

## Starter prompt for Claude Code

```
Read PROJECT_BRIEF.md, which is the source of truth. Start with Part 1, the build plan. Do Phase 1 only: inspect the repository, run the existing lint, type-check and build commands, and report what exists (framework, routes, components, logo and font setup, navbar, footer, waitlist, backend). Do not change any files. Then propose the plan for Phase 2 and list the open decisions from Part 1. Follow the brief's rules: preserve existing working functionality, no fake links or integrations, no invented claims, and no published prices.
```

## Pre-launch treatment (Suggestion, built on approved decision 1)

| Element | Treatment |
|---|---|
| Download for macOS / Windows | Keep both buttons and icons side by side, disabled, marked "Coming soon". No link, no placeholder file. |
| Join Waitlist | The only fully active button. White pill, black text. Disabled buttons get the secondary style (transparent, subtle grey border). |
| Line under buttons | "Desktop apps are coming soon. Join the waitlist for early access and product updates." |
| Product visuals and video | Label any workspace preview **"Product preview"** so it isn't read as a live product. Exception: the home page product video has no visible badge (owner decision, 2026-10-25); its section keeps "Product preview" as an accessible label. |
| Message after signup | "You're on the waitlist. We'll be in touch about early access and product updates." Show only after the backend confirms the save. |
| When installers exist | Replace one button at a time with its real installer URL, test it, then remove "Coming soon". |

**Language rules for the whole site**
- Use: *coming soon, early access, designed to, aims to.*
- Avoid: *download now, available today, try it free, get started,* customer counts, usage numbers.
- Describe the three products as what ParallelFlow is **designed to do**.

## Pricing notes (Suggestions)

- Part 4 Pricing spec is the authority. The hybrid model matches its long-term model: platform fee + per-seat fee + metered usage.
- To set numbers: work out monthly cost per active team (model and compute, hosting, support); ask 5–10 early-access teams what they spend today on AI coding and project tools; quote one pilot price to first Enterprise customers before revising.
- Follow up first with waitlist signups who answer Yes or Maybe on organization interest and report a larger team size. The owner defines the exact rule.
- Enterprise buyers usually ask about SSO, security certifications, data location, uptime commitments, security review docs and contract terms. The brief commits to none of these, so **the site must not mention them until they are real.**

## Product page key points for YC (Suggestion)

Everything here comes from the brief; nothing new is added.

| # | Section | Key point | Source |
|---|---|---|---|
| 1 | Hero | "Work moves forward." with tagline "Workspace for teams to plan, build & ship together" | Part 4 |
| 2 | Problem | "Coding is getting faster. Shipping software is still complicated." Three problems: fragmented workflows, lost context, coordination overhead | SDLC section 2 |
| 3 | Why now | AI has made code generation faster, but the surrounding development lifecycle has not evolved at the same pace | Part 2, problem 3 |
| 4 | Solution | One connected workflow from idea to delivery: "Plan together. Execute with AI. Move forward as a team." | SDLC section 3 |
| 5 | How it works | Arena determines what the team needs to accomplish. Private is where the work is performed. Developer Space provides the reusable capabilities agents use. | Part 6, Developer Space section 2 |
| 6 | Product preview | The motion video, with no visible "Product preview" badge (owner decision, 2026-10-25) | Part 4 |
| 7 | Trust | Human oversight, permissions, private-by-default personal assistants, approval for sensitive actions | Part 6, Arena sections 4 and 11 |
| 8 | Who it's for | Software engineering teams using AI to build and ship software, starting with AI-native developers and startup teams | Part 7 |
| 9 | Status and CTA | Coming soon, with the waitlist | This part |

**Three products, one line each, with three points to lead with**

| Product | One line | Lead with |
|---|---|---|
| Arena | Align people and AI around project goals, tasks, discussions, responsibilities, and progress. | One shared feed for people and a shared project agent, with optional private personal assistants. One clear project goal, with task owners, status and blockers. Human approval for consequential actions. |
| Private | Run AI-assisted sessions, work with project context, use available tools, and produce deliverables. | Sessions tied to projects. Roles, tools, skills and MCP connections managed in one place. Interactive or autonomous mode within granted permissions, with tasks syncing back to Arena. |
| Developer Space | Create and manage reusable agent roles, skills, tools, and integrations to adapt AI capabilities to the team's workflow. | Visual, low-code builder for roles and skills. Personal and team libraries with versioning. Secure sharing, credentials never embedded in a shared extension. |

Describe all three as what ParallelFlow is designed to do; mark them **coming soon** until real.

- **Differentiator, in the brief's words:** "The goal is not simply to make individual developers faster. It is to help the entire team work more effectively together." Frame ParallelFlow as the team layer around AI-assisted work; **make no claims about other tools.**
- **Proof without inventing it:** show a waitlist count only when real and from the database. Use real answers to the early-access question. Add the demo video as soon as it exists. No logos, testimonials, ratings or metrics until they exist.
- **Questions only the owner can answer for the YC application:** who the first ten target customers are and whether they've been spoken to; what has been built and what can be shown today; why this team; how ParallelFlow differs from using AI coding tools separately.

## Definition of done

ParallelFlow has consistent messaging for its engineering audience, sound SEO foundations, a maintainable technical implementation, a working waitlist flow, and a responsive, accessible public website. In practice:

- Navbar stays visible while scrolling, desktop and mobile.
- Every visible link goes somewhere real, or is clearly marked "Coming soon".
- Nothing claims a feature, integration or price that doesn't exist.
- A signup is confirmed only after the database has saved it.
- No proposed price is published without explicit approval.
- Lint, type-check and production build all pass.

---

# Part 2: Strategy

## Problems ParallelFlow aims to solve

1. **Traditional SDLC is slow:** planning, approvals, reviews, testing, deployment and handoffs limit the speed of AI-assisted development.
2. **Fragmented tool ecosystem:** separate tools for communication, project management, coding, version control, testing and deployment create context switching and coordination overhead.
3. **Coding is no longer the only bottleneck:** AI made code generation faster, but the surrounding lifecycle hasn't evolved at the same pace.
4. **Complex agent customization:** configuring agents, tools, permissions and workflows is difficult and time-consuming.
5. **Siloed automation tools:** existing tools solve individual problems (testing, deployment, review) without a unified workflow.
6. **Poor support for long-running tasks:** need persistent context, resumable execution, progress tracking, error recovery and reliable handoffs over hours or days.
7. **Isolated AI conversations:** separate AI chats cause duplicated work, repeated explanations, fragmented decisions and lost context.
8. **Slow onboarding and knowledge transfer:** new members struggle to understand projects, decisions and progress scattered across chats, docs and tools.
9. **Fragmented organizational knowledge:** need a unified, searchable, access-controlled knowledge layer authorized agents can use securely.
10. **Communication creates an efficiency gap:** AI-assisted individuals work faster, but handoffs and coordination stop the whole team gaining the same productivity.
11. **Unclear task ownership and accountability:** multi-person, multi-agent tasks need owners, responsibilities, dependencies, status and completion criteria.
12. **Unreliable execution visibility:** teams must distinguish an agent *claiming* completion from *verified* results (passing tests, saved changes, completed reviews, confirmed deployments).
13. **Difficulty recovering from agent failures:** interruptions from errors, missing permissions, unavailable tools or human-input requests need transparent failure states and reliable resumption.
14. **Balancing autonomy and security:** agents need enough permission for routine work while sensitive actions (production deploys, destructive operations, permission changes) stay controlled.
15. **Lack of end-to-end productivity measurement:** faster code generation doesn't mean faster delivery; teams need visibility into waiting time, rework, bottlenecks, coordination overhead and time to ship.

## Core product thesis

ParallelFlow aims to close the gap between AI-assisted work and team-wide execution by bringing people, AI agents, project context, tasks, communication, tools and workflows into one collaborative workspace. The objective is to help teams plan, build, coordinate, track and ship together with less friction, duplicated work and manual coordination.

## Instructions

Use these points as the foundation for product strategy. Prioritize the most important problems, identify target users and their existing workflows, and map each problem to a concrete capability. **Do not assume every problem must be solved in the first version.** Distinguish essential MVP functionality from later-stage features, and **do not present unimplemented capabilities as existing features.**

---

# Part 3: Brand and Design System

**Overall design reference:** the entire website follows the Grok Bot design (https://x.ai/bot). Take inspiration, don't copy.

## Colour palette (monochrome dark theme)

| Token use | Value |
|---|---|
| Background | `#080808` |
| Cards and dropdowns | `#151515` |
| Hover and active surfaces | `#242424` |
| Primary text and buttons | `#FFFFFF` |
| Secondary text | `#B3B3B3` |
| Borders and dividers | `#333333` |
| Primary button | White background, black text |
| Secondary button | Transparent background, subtle grey border |

Define these as **shared design tokens**, not repeated values in components.

## Design rules

- Bold white headlines; white pill-shaped buttons with black text.
- Charcoal surfaces, subtle borders, muted grey descriptions.
- Minimal, premium, high-contrast.
- **Avoid** purple gradients, neon colours, colourful accents, excessive shadows, unnecessary glow.
- Keep colours consistent across navbar, dropdowns, workspace preview, buttons, footer.
- *(Conflict: design rules allow accents for product status; Brand Basics forbids colourful accents. See open decision 7.)*

## Brand personality

Minimal, modern, technical, professional. Built for engineering teams and AI-powered collaboration. Confident and clear, without exaggerated marketing language. Product-focused, emphasizing clarity and usability.

## Logo

- Clean geometric symbol built from two or more aligned or interconnected forms (minimal rhombus, parallel paths, connected shapes) representing parallel work, connected workflows, collaboration.
- White symbol on dark backgrounds; black on light. Pair with the ParallelFlow wordmark. Must be recognizable at small sizes (navbar, favicon).
- Variants when assets exist: primary horizontal (symbol + wordmark); symbol-only (favicon, compact sidebar); light-background; dark-background.
- **Implementation:** use real logo assets if they exist in the repo; inspect before creating or replacing; logo clickable → homepage; preserve aspect ratio and clear space; **no random text characters or emoji as a logo**; no per-page logo treatments; if no finalized logo exists, use a clean text wordmark temporarily and keep the Logo component easy to replace.

## Typography

- **Inter** for headings, body, navigation, buttons, forms.
- **JetBrains Mono** selectively for code snippets, technical identifiers, terminal output, dev metadata. Never for general marketing copy.
- Hierarchy: hero heading bold, large, responsive, concise; section headings semibold/bold; body regular with comfortable line spacing; nav medium and compact; buttons medium/semibold; supporting text smaller, muted grey.
- Rules: short scannable headings; consistent weights and line heights; avoid very thin text, oversized body copy, too many sizes; responsive type; load fonts efficiently with fallbacks; preserve an existing suitable font setup.

## Shared UI style

- Subtle grey borders, restrained corner radii, consistent spacing.
- White for primary actions and important text; muted grey for secondary info.
- Clear hover, focus, disabled, loading, error states.
- Subtle, purposeful animations; **respect reduced-motion**.
- Readable contrast, keyboard accessibility, desktop/tablet/mobile layouts.
- Avoid excessive cards, nested bordered containers, decorative icons, unnecessary UI.

## Footer (reusable component, shared across all public marketing pages)

| Column | Content |
|---|---|
| 1 Brand | Logo; "A collaborative workspace for teams and AI to plan, build, and ship together."; optional social links only for accounts that exist |
| 2 Product | Arena, Private, Developer Space, Pricing |
| 3 Solutions | Engineering, Software Development Lifecycle (SDLC) |
| 4 Resources | Documentation, Developer Resources, Packages |
| 5 Company | About, Careers, Contact |

- **Add links only when the destination exists.** No misleading or broken links.
- Bottom bar: "© [current year] ParallelFlow. All rights reserved." (year dynamic), Privacy Policy, Terms of Service (link only to real pages; no empty placeholder pages).
- Design: dark, subtle top border, white logo and primary labels, muted grey links with restrained hover, responsive multi-column on desktop and stacked/collapsible on mobile, touch-friendly targets.
- **No newsletter form** unless a real newsletter system exists. No decorative gradients, large illustrations, unnecessary social icons.

## Consistency and implementation

- Reuse the same Logo component in navbar, footer and compact layouts; same typography and tokens everywhere; footer links match real routes; consistent navbar/footer behavior.
- Steps: inspect structure, fonts, logo, tokens, routes, navbar, footer → reuse framework and styling conventions → create shared tokens (colour, type, spacing, borders, radii) → build reusable Logo, Wordmark, Footer → replace duplicated brand styles → update public pages without changing content/layout unnecessarily → verify logo sizing, fonts, footer links, responsiveness, accessibility, dark-mode consistency → run lint, type-check, build.
- **Do not** rebuild the site from scratch, overwrite unrelated components, invent routes, or claim unavailable pages and integrations work.

**Done when:** branding consistent; logo variants render where available; typography readable and responsive; footer links valid; footer works on desktop and mobile; existing content and functionality intact; checks and build pass.

---

# Part 4: Pages

## Navigation

```
Product ▾ | Solutions ▾ | Resources ▾ | Pricing | Join waitlist
```

- **Product:** Arena, Private, Developer Space
- **Solutions:** Engineering → SDLC
- **Resources:** Packages, Documentation, Developer Resources
- **Pricing:** direct link

**Navbar inspiration:** OpenAI's website for layout, dropdown interactions and subtle animations. Clean, smooth, minimal, responsive, tasteful hover effects. Preserve ParallelFlow's own branding.

## Home hero

1. **Navbar:** keep the minimal navbar. **No Login button.**
2. **Headline:** "Work moves forward."
3. **Subheading:** "A collaborative workspace where people and AI work together to turn ideas into finished work."
4. **Download buttons**, side by side: Download for macOS (Apple icon), Download for Windows (Windows/computer icon). **Currently: disabled, "Coming soon", no link** (approved decision 1).
5. **Join Waitlist:** separate button below, opens a functional signup form.
6. **Motion video:** wide cinematic product animation below hero content. For now, **make a template and leave the space**; owner adds the video later.
7. **Visual style:** Grok Bot-inspired; black background, white text, grey secondary text, minimal borders, subtle animations.
8. **Button functionality:** connect download buttons to installers when available; Join Waitlist opens a working form. No fake or broken download links.
9. **Layout:** centered, spacious, responsive, uncluttered.
10. **Restrictions:** no Login button, no excessive animation, no purple gradients, no unnecessary elements.
11. **Sticky navbar:** always visible at the top while scrolling (`position: sticky` or `fixed`, with z-index and background). Must not hide or slide away. Content must not overlap it. Works on desktop and mobile.

## Tagline and headline (front page, YC-oriented)

- **Tagline:** Workspace for teams to plan, build & ship together
- **Headline:** AI-native development lifecycle enabling human-agent collaboration to build, track, communicate, and ship faster.

## Solutions → Engineering → SDLC (URL e.g. `/solutions/engineering/sdlc`)

### 1. Hero
- Eyebrow: `SOLUTIONS / ENGINEERING`
- **The software development lifecycle, working as one.**
- Bring planning, coding, reviews, testing, and delivery into a connected workflow where people and AI can work together.
- ParallelFlow helps engineering teams coordinate work, maintain shared context, and move from an idea to a shipped product with less friction.
- Primary CTA: **Join the Waitlist**. Secondary CTA: **Explore the Platform** (no destination yet; see open decision 5).
- Visual: connected engineering workflow showing a project plan, assigned tasks, an AI coding session, code review, delivery status. Minimal, monochrome. Label as "Product preview".

### 2. The Problem
- **Coding is getting faster. Shipping software is still complicated.**
- AI can generate code, explain errors, and automate individual tasks. But software development involves much more than writing code.
- Engineering teams still need to coordinate work, manage dependencies, review changes, test features, share decisions, and keep everyone aligned.
- When these activities happen across disconnected tools and isolated AI sessions, teams lose context and spend more time coordinating the work than moving it forward.
- **The result:** Faster individual tasks do not always translate into faster software delivery.
- Three key problems:
  - **Fragmented workflows:** Planning, communication, development, testing, and delivery often happen in separate tools.
  - **Lost context:** Decisions, project knowledge, and previous AI interactions are difficult to carry across sessions and teammates.
  - **Coordination overhead:** People must manually assign tasks, track progress, resolve blockers, and connect the outputs of different tools.

### 3. The Solution
- **One connected workflow from idea to delivery.**
- ParallelFlow is designed to connect the people, AI capabilities, tasks, and project context involved in software development.
- Instead of treating every AI interaction as a separate conversation, ParallelFlow brings work into a shared project environment where teams can coordinate tasks, execute work, and maintain continuity.
- **Plan together. Execute with AI. Move forward as a team.**
- Core principles:
  - **Shared context:** Keep project goals, decisions, instructions, and relevant knowledge accessible to authorized teammates and agents.
  - **Connected execution:** Link planned work to the sessions, tools, and deliverables used to complete it.
  - **Human-agent collaboration:** Let people and AI contribute to the same broader workflow, with clear responsibilities and human oversight.
  - **Continuous progress:** Make task status, blockers, and completed work easier to follow.

### 4. The SDLC Workflow
**Every stage connected. Every handoff with context.**
- **01. Plan:** Turn product ideas and requirements into clear tasks, milestones, and priorities. Give the team a shared understanding of what needs to be built.
- **02. Design:** Define technical approaches, explore alternatives, document decisions, and establish the context needed before implementation begins.
- **03. Develop:** Use AI-assisted execution to work on code, explore repositories, solve problems, and produce development artifacts within the project's workflow.
- **04. Review:** Bring changes, explanations, and relevant context together to support code review, feedback, and human approval.
- **05. Test:** Connect implementation work with testing tasks, test results, and identified issues so problems can be tracked and addressed.
- **06. Deploy and Maintain:** Track delivery tasks, document releases, follow up on issues, and preserve knowledge for future development cycles.

> **Important:** Present this as the lifecycle ParallelFlow *aims to support*. Show specific actions as available features only when the corresponding integrations and functionality are implemented.

### 5. How ParallelFlow Connects the Workflow
**From isolated tools to coordinated work.**
- **Arena, Coordinate the team:** Align people and AI around project goals, tasks, discussions, responsibilities, and progress.
- **Private, Execute the work:** Run AI-assisted sessions, work with project context, use available tools, and produce deliverables.
- **Developer Space, Configure capabilities:** Create and manage reusable agent roles, skills, tools, and integrations to adapt AI capabilities to the team's workflow.
- Together, these areas form a connected approach to planning, execution, and customization without treating each activity as an isolated process.

### 6. Built for the Realities of Engineering Teams
**More than code generation.**
- **Long-running work:** Keep tasks and project context organized beyond a single AI conversation, supporting continuity where the underlying system permits it.
- **Team-wide knowledge:** Make important decisions, technical documentation, and project instructions easier to find and reuse, subject to access permissions.
- **Flexible workflows:** Configure reusable capabilities and tools around the needs of different projects and engineering teams.
- **Human oversight:** Keep people involved in important decisions and require approval for sensitive operations when appropriate.
- **Connected tools:** Bring supported development tools and integrations into the workflow without promising integrations that are not yet available.

### 7. The Outcome
**Spend less time coordinating work. Spend more time shipping it.**
ParallelFlow's goal is to help engineering teams:
- Reduce repetitive coordination and context switching.
- Make project status and ownership easier to understand.
- Reuse knowledge instead of repeatedly explaining the same context.
- Connect AI-assisted work with the team's broader development process.
- Build workflows that can evolve as AI capabilities improve.

The goal is not simply to make individual developers faster. It is to help the entire team work more effectively together.

### 8. Closing CTA
- **Your team's workflow should move as fast as your AI.**
- Connect planning, execution, and collaboration in a workspace designed for how software teams are evolving.
- Primary CTA: **Join the Waitlist**. Supporting text: *Be among the first to explore ParallelFlow.*

## Resources pages
Packages, Documentation, Developer Resources: **not yet available.** (See open decision 4.)

## Pricing page

### Objective
Two plans, **Teams** and **Enterprise**, in the existing monochrome design. Clearly distinguish audience, included capabilities and pricing model. **All prices and features are proposals until validated and approved.** Do not invent capabilities or imply unfinished features exist.

**Publication status:** the Teams price ($25 per user per month) and the Enterprise pilot offer are **unapproved proposals. Do not publish them.**

### Teams plan
- **Audience:** startups, small engineering teams, product teams using AI to build software.
- **Proposed price (DO NOT PUBLISH without approval):** $25 per user per month. Initial hypothesis only.
- **Proposed features:** shared team workspace; Arena for project coordination and collaboration; Private for AI-assisted task execution; shared project tasks and progress tracking; reusable agent roles and skills; supported tools and integrations; shared project context and knowledge; standard usage limits; standard support. **List only features implemented in the relevant release;** mark planned features appropriately or omit them.
- **CTA:** Join Waitlist. **Supporting text:** Get early access to collaborative AI-powered software development.

### Enterprise plan
- **Audience:** larger engineering organizations adopting AI-assisted development across multiple teams.
- **Price:** Custom pricing. Future quotes based on users and teams, AI execution and infrastructure usage, required integrations, workflow customization, onboarding and support, other enterprise requirements.
- **Potential scope:** Teams capabilities where applicable; organization-wide workspace management; advanced access controls and permissions; shared and managed agent extensions; custom workflow configuration; higher or tailored usage limits; optional onboarding and dedicated support; custom integrations where technically supported.
- **Do not promise SSO, compliance certifications, SLAs, dedicated deployment, or other enterprise capabilities** unless implemented and verified.
- **CTA (approved): Join Waitlist.** Do not add "Contact Sales" until a working business email or inquiry form exists.
- **Supporting text:** Discuss your team's requirements and explore a tailored ParallelFlow deployment.

### Enterprise pilot offer (INTERNAL PROPOSAL, do not publish)
Proposed price 5,000 per pilot; 4–6 weeks; guided pilot with a defined engineering team; scope of agreed workflows, supported capabilities, usage limits, onboarding and feedback sessions; success criteria defined with the customer beforehand; final review of adoption, workflow fit, feedback, next steps. **Do not guarantee productivity improvements;** report only verified results.

### Page design
- Two clear cards: Teams (name, brief audience, price only if approved, concise features, Join Waitlist) and Enterprise (name, brief audience, Custom pricing, concise scope, Join Waitlist).
- Existing dark monochrome palette, subtle borders, clear type, consistent spacing, visually balanced, responsive.
- No excessive shadows, gradients, neon, unnecessary animation.
- **No "Most Popular" or "Recommended" labels** without evidence. **No fake checkout buttons or payment functionality.**

### Pricing model
Potential long-term hybrid: platform fee + per-seat fee + metered usage. **Do not implement billing or metered usage** until billing rules, usage measurements, limits and payment infrastructure are defined. Before finalizing, estimate inference, hosting, integration, support costs and expected usage.

### Waitlist and Enterprise lead qualification
Reuse the existing waitlist (no separate disconnected form). Collect full name, email, role, team size, current AI tools, biggest workflow challenges, willingness to test early versions, and the approved organization-interest question. Optional fields stay optional. Combine organization interest with team size to flag potential Enterprise leads. Store securely, available only to authorized users, never exposed publicly.

### Pricing implementation rules
Inspect current Pricing page, routes, components, waitlist first; preserve framework and design system; don't rebuild unrelated pages; don't publish proposed prices; don't show unfinished features as available; no invented enterprise security guarantees, integrations, or customer results; all CTAs lead to valid destinations or working forms; keep pricing content maintainable and reusable (single config/data file); test responsive layouts, navigation, form behavior; run lint, type-check, build.

**Done when:** plans clearly differentiated; language accurate and consistent; proposed vs confirmed prices not confused; feature claims match reality; Enterprise inquiries have a valid next step; waitlist captures enterprise interest; works on desktop and mobile; no fake checkout, billing or sales workflows.

---

# Part 5: Waitlist Form

**Objective:** update the existing waitlist form to collect useful info about potential early users, their AI tools and workflow challenges. Preserve existing layout, design system and functionality. **Priority: keep signup friction low. Name and email are enough to join.**

## Fields

**Required (shown in the initial form, and only these):**
- Full Name: text, required.
- Email Address: email input, required, proper validation.

**Optional (inside a collapsible "Tell us more (optional)" section, or an optional second step):**
- **Role** (dropdown): Developer / Engineer; Founder; Product / Project Manager; Designer; Student; Other.
- **Team Size** (dropdown): Just me; 2–10; 11–50; 51–200; 200+.
- **Current AI Tools** (multi-select): Claude Code; OpenAI Codex; Cursor; GitHub Copilot; ChatGPT; Other; None.
- **Biggest Workflow Challenge** (multi-select): Switching between different tools; Coordinating humans and AI agents; Repetitive manual tasks; Tracking tasks and project progress; Sharing project knowledge and context; Connecting tools and automating workflows; Other.
- **Early Access Participation:** "Would you be willing to test early versions of ParallelFlow and share feedback?" Yes / Maybe / No.
- **Organization Interest (approved):** "Are you interested in ParallelFlow for your organization?" **Yes / Maybe / No, individual or team use.** Optional; sits with the other optional questions, **never in the initial form.**

## Layout and UX
Clean, minimal, professional, monochrome (dark background, subtle grey borders, white primary text, muted grey secondary). Clearly mark required vs optional. Appropriate input types, accessible labels, keyboard navigation, visible focus states. Responsive. Avoid unnecessary animation, clutter, excess fields on the initial screen.

## Submission and validation
- Validate required fields on **client and server**.
- Validate and normalize email consistently.
- Loading state while submitting.
- **Success message only after the backend confirms the save.**
- Handle duplicate emails gracefully with no duplicate records.
- Clear error messages, allow retry, **preserve entered values on failure.**
- **Do not simulate success or use placeholder submission logic.**
- Organization interest: accept only `Yes`, `Maybe`, `No, individual or team use`, or empty; reject anything else **on the server as well as the client.** Store unanswered as **empty, never a default.** A missing answer must not block signup.

## Backend and storage
- Inspect and reuse the existing backend/database. If none, use existing infrastructure or **Supabase**.
- Store required fields and any optional answers, plus signup timestamp and source when available.
- Server-side validation and appropriate database permissions (RLS).
- Spam / bot protection on the endpoint.
- **Never expose DB credentials, service-role keys or secrets client-side.**
- Short privacy note: information is used to manage early access and product updates.

## Database fields
`id`, `full_name`, `email` (unique on normalized value), `role` (opt), `team_size` (opt), `current_ai_tools` (opt array), `workflow_challenges` (opt array), `early_access_interest` (opt), `created_at`, `source` (opt), and **`organization_interest` (opt)**.

- `organization_interest` allowed values: `yes`, `maybe`, `no_individual_or_team` (or equivalent), plus empty. Enforce with a DB constraint or enum, and **add a migration** for the existing table. Existing records stay empty.
- Potential Enterprise leads = `organization_interest` combined with `team_size`, via an internal query or export available only to authorized users. Owner defines the exact rule (e.g. Yes or Maybe + larger team size). Never expose records publicly.

## Implementation
Inspect codebase, form, DB, API routes first. Preserve framework, styling, components, integrations. Reuse existing form components. Modular, maintainable code. No fake integrations or unnecessary dependencies. Don't overwrite environment variables or expose secrets. For the organization-interest change: update the form component, submission endpoint, shared validation schema, data types and DB migration; **do not alter existing fields or behavior.**

## Testing and definition of done
- Signup with only name + email; with all optional fields; with optional fields blank.
- Invalid emails, missing required fields, duplicates, server errors, retry.
- Each organization-interest answer, the question left blank, and server rejection of an invalid value; stored correctly; unanswered stays empty.
- Records persist in the database.
- Desktop and mobile; keyboard accessibility, visible focus, clear success/error messages.
- Run lint, type-check, production build.
- Report files changed, whether DB config or migrations are needed, remaining setup.

---

# Part 6: Product Reference

> **Source material only.** These are specs for building the *product* (Arena, Private, Developer Space), not website pages. Use them to write accurate marketing copy for the product pages. Do not build the product from them unless the owner starts a separate project. On the website, describe everything as what ParallelFlow is **designed to do** and mark it **coming soon**.

## Arena: Collaborate and Coordinate

**Vision:** an AI-powered team collaboration workspace where humans and AI agents work toward one clearly defined project goal. Not a traditional chatbot: a shared environment for communication, planning, delegation, execution, reviews, knowledge management and creative work.

**Layout (four areas):**
- **Left sidebar:** project navigation, team members and settings, conversation feed, tasks and activity, LLM Wiki / company knowledge, integrations and tools, Motion Design access, collapsible.
- **Main feed:** one shared chronological feed of humans and agents, clear sender identification, attachments, task references, timestamps, agent states (working, waiting for approval, completed, failed), filtering without splitting the feed.
- **Contextual work panel:** task details, plans, files, reviews, agent activity, version history; opens based on selection; collapsible.
- **Project Overview panel:** the shared goal, milestones, deadlines, priorities, dependencies, blockers, progress; collapsible; editable by authorized members.

**Hybrid agent architecture:**
- **Shared project agent** per project: uses authorized context, participates in discussion, proposes plans/milestones/tasks, delegates, tracks progress and blockers, assists review and documentation, uses tools only when authorized.
- **Optional personal assistants:** each member configures participation; help with research, planning, task prep; share results only explicitly; clearly distinguished from shared-agent and human messages; **private conversations never auto-exposed.**
- **Human oversight:** clear task ownership; visible agent status; **approval required for consequential operations** (sensitive code changes, merges, permission changes, production actions); audit record; agents cannot bypass permissions or approvals.

**Other capabilities:** shared goal and project management (no fabricated progress, no auto-marking unfinished work complete); task execution and review (approve / request changes / reject; execution logs); version control integration (**never claim it's available unless implemented and connected**); integrations and MCP (**don't simulate integrations**); LLM Wiki (searchable, sourced, permissioned, no silently publishing unreviewed info as verified); **Motion Design workspace** (canvas, timeline, properties panel, assets, AI-assisted suggestions distinguished from applied changes, save/export only for supported formats, no nonfunctional export controls); privacy, security, permissions enforced on the backend with audit trail.

**Build phases:** 1 core collaboration → 2 agent execution → 3 hybrid assistants → 4 Motion Design → 5 knowledge and refinement.

**Principles:** one shared goal; one shared project agent; personal assistants optional and member-controlled; one shared feed; goal in a collapsible panel; contextual tools only when relevant; Motion Design is a dedicated workspace; privacy, authorization, transparency, human oversight; no UI full of nonfunctional controls.

## Private: Execute Work

> Renamed from "Workspace" to "Private" by the owner on 2026-10-24. The website uses `/product#private`.

**Overview:** an AI work environment inspired by the usability of Claude Code and OpenAI Codex. Start AI sessions, manage projects, configure agents, connect tools, execute tasks in one place. Clean, developer-friendly, extensible; helps users move from instructions to completed work.

**Sidebar (collapsible):** New Session; Projects; Extensions (roles, tools, skills, MCP servers); Recent Sessions (title, project, last activity, status; search, reopen, rename, archive, delete with confirmation); Profile & Workspace settings (personal preferences separate from organization-wide settings).

**New Session:** clear prompt; pick or create project; choose agent role; attach files/context; use permitted tools and skills; view agent activity, progress, results, errors; resume prior sessions.

**Projects:** name, description, instructions; sessions and task history; files, repos, working directories; project-specific agent config; tools, skills, integrations; outputs and artifacts; dedicated overview page.

**Extensions** (do not treat as interchangeable): Roles, Tools, Skills, MCP, Integrations, Additional types. Each shows description, availability, configuration, connection status.

**Main work area:** conversation/task execution; composer with attachments and context controls; agent and task status; tool-call and execution output; file previews and artifacts; code diffs; terminal panels where supported; contextual panels. Default stays simple.

**Adaptive execution:** *Interactive* mode (step by step with the user) and *Autonomous* mode (within explicitly granted permissions and limits). Clear states: working, waiting for input/approval, completed, failed. Persistent progress, interruption handling and resumption where feasible. Sensitive actions need authorization and human approval.

**Design:** inspired by Claude Code, OpenAI Codex, boxes.dev (clarity, not copying). Dark monochrome, subtle borders, restrained animation, collapsible panels. A capable workbench, not a generic chatbot.

**Relationship with Arena:** Arena = communication, planning, goals, progress. Private = execution and deliverables. Tasks assigned in Arena open in Private; status and deliverables sync back. No disconnected copies of project state.

**Principles:** core navigation first → functional sessions and projects → extension management and real agent execution → incremental tool/MCP integration. **No fake integrations, simulated results, or controls that do nothing.**

## Developer Space: Configure Agent Capabilities

**Overview:** a visual, low-code environment to create, configure, test, manage and share extensions that enhance AI agent capabilities. For teams that want to customize agents without building every tool or integration from scratch. **Design principle: Configure visually. Reuse everywhere. Share securely.**

**The three areas:** Arena determines what the team needs to accomplish. Private is where the work is performed. Developer Space provides the reusable capabilities agents use. Extensions made in Developer Space are selectable in Private and shareable with authorized projects/teams in Arena.

**Target users:** teams configuring agents for dev and operational workflows; developers reusing tools and integrations; technical PMs standardizing agent behavior; non-programmers creating reusable instructions; organizations needing controlled sharing.

**Navigation:** Overview (real data only, no fabricated stats); My Extensions (private by default); Team Extensions (versioned, owners, private/shared/approved status); Extension Builder (step-by-step, draft/test/publish after validation); Integrations and MCP (**never show a connection active unless verified**); Templates (clearly labelled examples); Settings.

**Extension types (distinct):** *Roles* (behavior and responsibilities, not a separate model or runtime); *Skills* (reusable instructions and procedures); *Tools* (executable capabilities; **a text description is not an executable tool**); *MCP connections* (credentials never embedded in shareable extensions).

**Builder flow:** choose type → basic info → configure behavior → select dependencies → set permissions → preview and validate → test → save and share.

**Lifecycle and versioning:** draft, ready for testing, tested, published, deprecated, archived (only states backed by real behavior). Stable id, owner, type, visibility, version. Changes to shared extensions must not silently break projects.

**Security:** server-side authorization on every protected operation; no credentials client-side; least privilege; schema validation; approval for sensitive capabilities; audit trail; isolated execution for custom tools (defer rather than simulate).

**MVP phases:** 1 core extension management (roles and skills builders, drafts, ownership, visibility, backend) → 2 testing and Private integration → 3 integrations and MCP → 4 advanced ecosystem (public publishing only when appropriate).

---

# Part 7: Target Audience, SEO, Technical Stack and Checklist

## Target audience

**Primary:** software engineering teams using AI to build and ship software, wanting to coordinate people, AI agents, tasks, tools and shared context in one connected workflow.

**Segments (in messaging priority order):**
1. **AI-native developers:** use AI tools to write, debug, review, maintain code; want fewer context switches and reusable agent capabilities.
2. **Startup founders and small engineering teams:** limited resources; need coordination between people, AI, tasks, deliverables.
3. **Engineering leads and technical managers:** need visibility into progress, blockers, responsibilities, work by people and AI; want consistent AI adoption.
4. **AI agent builders and technical teams:** experimenting with agent workflows, tools, skills, MCP.

**Secondary:** product managers coordinating engineering; indie hackers; technical researchers; organizations exploring human-agent collaboration.

**Do not market to every industry at launch.** Keep positioning on software development and engineering workflows.

**Core user problems:** coding is faster but delivery stays fragmented; teams switch between PM, communication, code and AI tools; AI sessions lack shared context and continuity; progress and ownership hard to track across people and AI; customizing reusable agent capabilities is complicated; knowledge and decisions are scattered.

**Core value proposition (use consistently across homepage, SEO metadata, product pages, CTAs):** ParallelFlow brings teams, AI agents, tasks, and project context into a connected workspace to help them plan, build, and ship together.

## SEO strategy

**Goal:** make ParallelFlow discoverable to developers, engineering teams and founders searching for collaborative AI development workflows. Focus on search intent and useful content, not keyword repetition.

**Primary keywords:** AI development workspace; AI-powered software development; AI coding collaboration; human-agent collaboration; AI agent workspace; collaborative software development.

**Secondary keywords:** AI software development workflow; AI coding tools for teams; AI agent orchestration for development teams; AI-assisted software development lifecycle; shared context for AI coding agents; AI developer productivity tools; agent skills and tools management.

Treat these as candidates, not guaranteed volume. Validate with search data.

### Page metadata

| Page | Title | Meta description |
|---|---|---|
| Homepage | ParallelFlow \| Collaborative AI Development Workspace | Bring your team, AI agents, tasks, and project context together in one workspace to plan, build, and ship software. |
| Solutions | Solutions \| ParallelFlow | Explore how ParallelFlow helps teams connect AI-assisted work, collaboration, and engineering workflows. |
| Engineering | AI-Powered Engineering Workflows \| ParallelFlow | Help engineering teams coordinate people, AI agents, tasks, and project context across the software development workflow. |
| SDLC | AI Software Development Lifecycle \| ParallelFlow | Connect planning, development, code review, testing, and delivery in a collaborative AI-powered software development workflow. |
| Arena | Arena \| Team and AI Collaboration \| ParallelFlow | Coordinate engineering teams and AI around shared project goals, discussions, tasks, and progress. |
| Private | Private \| AI-Powered Development \| ParallelFlow | Execute development tasks with AI-assisted sessions, project context, tools, and connected workflows. |
| Developer Space | Developer Space \| Build and Manage Agent Extensions | Configure and manage reusable agent roles, skills, tools, and supported integrations for your development workflows. |
| Pricing | Pricing \| ParallelFlow | Explore ParallelFlow plans for collaborative AI development. Check the website for current availability and pricing details. |

**Do not publish claims about pricing, integrations or product availability that haven't been confirmed.**

### Technical SEO checklist
- Unique descriptive title and meta description per page; one H1 per page with logical H2/H3.
- Readable stable URLs (e.g. `/solutions/engineering/sdlc`); canonical URLs on the production domain.
- `sitemap.xml` generated from actual public routes; correct `robots.txt`.
- Open Graph metadata and a social preview image when available; descriptive alt text; essential content never only inside images or animations.
- Public pages server-rendered/indexable.
- Structured data only when accurate (Organization / WebSite). **No fake reviews, ratings, offers or unsupported schema.**
- Keep staging/preview out of the index; don't index dashboards, private projects, sessions or authenticated pages.
- Redirect obsolete URLs; real 404 for missing pages.

### Performance and accessibility
Optimize image formats and sizes; responsive images; lazy-load below-the-fold media; avoid unnecessary JS and large animation libraries; **reserve space for images and video** to avoid layout shift; semantic HTML and accessible labels; keyboard navigation and visible focus; respect reduced motion; measure Core Web Vitals and fix real issues.

### Content strategy
Few genuinely useful pages, not many thin SEO pages. Possible future topics: how AI changes the SDLC; why AI coding speed doesn't eliminate engineering coordination; sharing context across AI agents; building reusable agent skills; introducing human-agent collaboration to software teams. Publish only with useful insight, original examples or practical guidance.

## Technical stack

**First principle:** inspect the existing repo before changing the stack. Reuse working frameworks, components, dependencies, routes and infrastructure. **Do not migrate technologies just to match this table.**

| Layer | Recommended (new or compatible project) | Purpose |
|---|---|---|
| Framework | Next.js | Routing, rendering, server functionality |
| UI | React + TypeScript | Typed reusable components |
| Styling | Tailwind CSS | Consistent responsive styling |
| UI components | Existing library or shadcn/ui | Accessible components |
| Icons | Lucide | Consistent icons |
| Animation | CSS transitions or Motion when needed | Subtle interactions |
| Database | Supabase / PostgreSQL | Waitlist records |
| Validation | Zod or equivalent | Form data validation |
| Hosting | Vercel or existing provider | Deploy and previews |
| Analytics | Privacy-conscious, when needed | Visits and conversions |
| Email | Resend or equivalent, if required | Optional confirmations |
| Version control | Git + GitHub | History and review |

Recommendations, not a requirement to install everything. Prefer existing dependencies.

**Architecture principles:** keep the public marketing site separate from authenticated product functionality; reuse shared components (nav, footer, buttons, forms, layouts); centralize design tokens; env vars out of client code; **validate waitlist on the server**; DB constraint for unique normalized email; rate limiting or spam protection on public endpoints; explicit user-friendly errors; server-side authorization for any future private data; avoid unnecessary dependencies and premature complexity.

**Environment configuration:** maintain `.env.example` with names and safe placeholders; never commit real credentials, API keys, service-role keys or tokens; verify required env vars at startup or in checks; document local and deployment setup.

## Implementation checklist

**Phase 1: Repository audit**
- [ ] Inspect project structure and framework
- [ ] Identify routes, components, styles, dependencies
- [ ] Inspect logo assets and font configuration
- [ ] Identify current navbar, footer, waitlist
- [ ] Check backend and database connections
- [ ] Run existing lint, type-check, build
- [ ] Record existing issues before changing anything

**Phase 2: Brand and design system**
- [ ] Shared monochrome colour tokens
- [ ] Standardize typography and responsive sizes
- [ ] Create or reuse shared logo component
- [ ] Standardize buttons, links, inputs, borders, spacing
- [ ] Reusable navbar and footer
- [ ] Check desktop, tablet, mobile
- [ ] Preserve existing working content and interactions

**Phase 3: Audience and messaging**
- [ ] Homepage messaging focused on AI-assisted software development teams
- [ ] Explain fragmented tools, context, coordination
- [ ] Communicate the value proposition clearly
- [ ] Explain Arena, Private, Developer Space distinctly
- [ ] Consistent CTAs
- [ ] No unsupported claims about features or performance

**Phase 4: SEO**
- [ ] Page-specific titles and meta descriptions
- [ ] Logical heading hierarchy
- [ ] Canonical URLs and production metadata
- [ ] Sitemap from existing public routes
- [ ] Robots directives
- [ ] Open Graph + social preview image
- [ ] Alt text on content images
- [ ] Validate structured data where applicable
- [ ] Prevent private and staging pages from indexing
- [ ] Check broken links and 404 handling

**Phase 5: Waitlist**
- [ ] Full name and email only required
- [ ] Optional questions behind "Tell us more (optional)"
- [ ] Role and team-size fields
- [ ] Current AI tools multi-select
- [ ] Workflow challenges multi-select
- [ ] Early-access participation question
- [ ] Client-side and server-side validation
- [ ] Persist signups to the database
- [ ] Handle duplicate emails and failed requests
- [ ] Loading, success, error states
- [ ] Spam protection
- [ ] Clear privacy note
- [ ] Test the full submission flow
- [ ] Optional organization-interest question (Yes, Maybe, No, individual or team use) with server validation, DB constraint and migration

**Phase 6: Quality and accessibility**
- [ ] Test desktop, tablet, mobile
- [ ] Keyboard navigation and focus indicators
- [ ] Form labels, validation, accessible errors
- [ ] Contrast and readable typography
- [ ] Reduced-motion settings
- [ ] Optimize images and scripts
- [ ] Test all internal and external links
- [ ] Check browser console and server logs
- [ ] Run lint, type-check, tests, production build
- [ ] Confirm no secrets are exposed
- [ ] Verify production env vars before deployment

**Phase 7: Launch and monitoring**
- [ ] Verify production domain and HTTPS
- [ ] Test deployed waitlist end to end
- [ ] Confirm database persistence
- [ ] Submit sitemap to Google Search Console
- [ ] Check indexing and crawlability
- [ ] Monitor signup conversion and form errors
- [ ] Review analytics per the site's privacy practices
- [ ] Keep a list of issues and improvements from real user feedback

## Rules for Claude Code

1. Inspect first; implement second.
2. Preserve the existing framework and working functionality.
3. Avoid rewriting unrelated pages or components.
4. Do not invent working features, integrations, pricing, testimonials, or signup success.
5. Prefer reusable components and consistent design tokens.
6. Keep changes small, testable and maintainable.
7. Explain any required database migrations, environment variables or external service setup.
8. Run the project's available checks and fix regressions you caused.
9. Report which files were modified and what remains incomplete.
10. If a feature needs external credentials or configuration, implement the integration points and clearly document the remaining setup.
