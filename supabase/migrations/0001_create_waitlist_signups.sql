-- Waitlist signups. Run once in the Supabase SQL editor.
-- The site writes with the service-role key from a server-only route, so
-- row-level security stays on with no public policies: the anon and
-- authenticated roles cannot read or write this table.

create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null
    check (char_length(full_name) between 1 and 200),
  email text not null
    check (char_length(email) <= 254 and email = lower(btrim(email))),
  role text
    check (role in ('developer', 'founder', 'product_manager', 'designer', 'student', 'other')),
  team_size text
    check (team_size in ('just_me', '2_10', '11_50', '51_200', '200_plus')),
  current_ai_tools text[]
    check (current_ai_tools <@ array['claude_code', 'openai_codex', 'cursor', 'github_copilot', 'chatgpt', 'other', 'none']),
  workflow_challenges text[]
    check (workflow_challenges <@ array['tool_switching', 'coordinating_humans_agents', 'repetitive_tasks', 'tracking_progress', 'sharing_context', 'connecting_tools', 'other']),
  early_access_interest text
    check (early_access_interest in ('yes', 'maybe', 'no')),
  organization_interest text
    check (organization_interest in ('yes', 'maybe', 'no_individual_or_team')),
  source text,
  created_at timestamptz not null default now()
);

-- Unique on the normalized email. Optional answers stay NULL when unanswered.
create unique index waitlist_signups_email_key
  on public.waitlist_signups (lower(email));

alter table public.waitlist_signups enable row level security;

revoke all on public.waitlist_signups from anon, authenticated;
