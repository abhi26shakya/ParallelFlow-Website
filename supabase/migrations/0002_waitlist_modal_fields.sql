-- Waitlist modal fields. Run once in the Supabase SQL editor, after 0001.
-- The modal asks for new team sizes and an optional free-text note about the
-- person's workflow. Old team-size values stay allowed so existing rows remain
-- valid. The columns the modal no longer asks about (current_ai_tools,
-- workflow_challenges, early_access_interest, organization_interest) are kept
-- and left empty for new signups. Safe to run more than once.

alter table public.waitlist_signups
  drop constraint if exists waitlist_signups_team_size_check;

alter table public.waitlist_signups
  add constraint waitlist_signups_team_size_check
    check (team_size in (
      'just_me', '2_5', '6_10', '11_50', '50_plus',
      -- Earlier options, kept for existing rows.
      '2_10', '51_200', '200_plus'
    ));

alter table public.waitlist_signups
  add column if not exists workflow_notes text
    check (char_length(workflow_notes) <= 2000);
