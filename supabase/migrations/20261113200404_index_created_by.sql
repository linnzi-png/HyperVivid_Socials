-- Cover the created_by foreign keys so deleting a user (on delete set null)
-- doesn't scan these tables. Flagged by the Supabase performance advisor.
create index workspaces_created_by_idx on public.workspaces (created_by);
create index brands_created_by_idx on public.brands (created_by);
