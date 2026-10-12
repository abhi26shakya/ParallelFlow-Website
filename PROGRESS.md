# ParallelFlow Build Progress

Phase 1 audit done. Phases 2 (foundation) and 3 (home hero) built, committed and pushed. Phase 4 (waitlist) built, awaiting owner review and commit.

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
