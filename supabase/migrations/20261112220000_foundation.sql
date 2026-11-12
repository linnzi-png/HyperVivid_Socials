-- HyperVivid foundation: profiles, creator workspaces, members, brands.
-- Every table has row-level security. Helper functions live in the `private`
-- schema, which the Data API does not expose.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

-- ---------------------------------------------------------------- types

create type public.workspace_kind as enum ('creator', 'agency');
create type public.workspace_role as enum ('owner', 'editor');
create type public.social_network as enum ('tiktok', 'youtube', 'instagram', 'facebook', 'linkedin');

-- ---------------------------------------------------------------- tables

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  avatar_url text check (avatar_url is null or avatar_url ~ '^https://'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  kind public.workspace_kind not null default 'creator',
  -- Seats include the owner. A creator workspace is owner + one editor.
  seat_limit smallint not null default 2 check (seat_limit between 1 and 100),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.workspace_role not null,
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index workspace_members_user_id_idx on public.workspace_members (user_id);
-- Exactly one owner per workspace.
create unique index workspace_members_one_owner_idx
  on public.workspace_members (workspace_id) where role = 'owner';

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  color text check (color is null or color ~ '^#[0-9A-Fa-f]{6}$'),
  created_by uuid references auth.users (id) on delete set null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index brands_workspace_id_idx on public.brands (workspace_id);
create unique index brands_workspace_name_idx
  on public.brands (workspace_id, lower(btrim(name))) where archived_at is null;

-- ---------------------------------------------------------------- helpers

create function private.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();
create trigger workspaces_updated_at before update on public.workspaces
  for each row execute function private.set_updated_at();
create trigger brands_updated_at before update on public.brands
  for each row execute function private.set_updated_at();

-- Security definer so policies can check membership without recursing
-- through workspace_members' own RLS.
create function private.workspace_role(ws uuid) returns public.workspace_role
language sql stable security definer set search_path = '' as $$
  select m.role from public.workspace_members m
  where m.workspace_id = ws and m.user_id = (select auth.uid());
$$;

create function private.is_workspace_member(ws uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.workspace_role(ws) is not null;
$$;

create function private.is_workspace_owner(ws uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.workspace_role(ws) = 'owner';
$$;

create function private.shares_workspace_with(other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.workspace_members mine
    join public.workspace_members theirs on theirs.workspace_id = mine.workspace_id
    where mine.user_id = (select auth.uid()) and theirs.user_id = other
  );
$$;

revoke all on all functions in schema private from public;
grant execute on function
  private.workspace_role(uuid),
  private.is_workspace_member(uuid),
  private.is_workspace_owner(uuid),
  private.shares_workspace_with(uuid)
to authenticated;

-- Seat limit and owner protection on membership changes.
create function private.guard_workspace_members() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  seats int;
  used int;
begin
  if tg_op = 'INSERT' then
    select w.seat_limit into seats from public.workspaces w where w.id = new.workspace_id for update;
    select count(*) into used from public.workspace_members m where m.workspace_id = new.workspace_id;
    if used >= seats then
      raise exception 'workspace seat limit reached (%)', seats using errcode = 'P0001';
    end if;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.workspace_id <> old.workspace_id or new.user_id <> old.user_id then
      raise exception 'membership keys are immutable' using errcode = 'P0001';
    end if;
    if old.role = 'owner' and new.role <> 'owner' then
      raise exception 'the owner cannot be demoted' using errcode = 'P0001';
    end if;
    return new;
  end if;

  -- DELETE: the owner row only goes away with the workspace or the user.
  if old.role = 'owner' and pg_trigger_depth() = 1
     and exists (select 1 from public.workspaces w where w.id = old.workspace_id)
     and exists (select 1 from auth.users u where u.id = old.user_id) then
    raise exception 'the owner cannot leave or be removed' using errcode = 'P0001';
  end if;
  return old;
end;
$$;

create trigger workspace_members_guard
  before insert or update or delete on public.workspace_members
  for each row execute function private.guard_workspace_members();

-- New sign-up: profile, personal creator workspace, owner membership.
create function private.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  ws_id uuid;
  name text := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    ''
  );
begin
  insert into public.profiles (id, display_name) values (new.id, left(name, 80));

  insert into public.workspaces (name, kind, created_by)
  values (case when name = '' then 'My workspace' else left(name, 66) || '''s workspace' end, 'creator', new.id)
  returning id into ws_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (ws_id, new.id, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- Account deletion removes the workspaces the user owns (and, by cascade,
-- their brands and memberships), so no workspace is left without an owner.
create function private.handle_deleted_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.workspaces w
  using public.workspace_members m
  where m.workspace_id = w.id and m.user_id = old.id and m.role = 'owner';
  return old;
end;
$$;

create trigger on_auth_user_deleted
  before delete on auth.users
  for each row execute function private.handle_deleted_user();

-- ---------------------------------------------------------------- privileges

revoke all on public.profiles, public.workspaces, public.workspace_members, public.brands from anon, authenticated;
grant select, update (display_name, avatar_url) on public.profiles to authenticated;
grant select, update (name) on public.workspaces to authenticated;
-- Invitations are a server-side flow (service role); clients only read and leave/remove.
grant select, delete on public.workspace_members to authenticated;
grant select, insert (workspace_id, name, color), update (name, color, archived_at), delete on public.brands to authenticated;

-- ---------------------------------------------------------------- RLS

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.brands enable row level security;

-- profiles
create policy "profiles: read own and teammates" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or private.shares_workspace_with(id));
create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- workspaces
create policy "workspaces: members read" on public.workspaces
  for select to authenticated using (private.is_workspace_member(id));
create policy "workspaces: owner renames" on public.workspaces
  for update to authenticated
  using (private.is_workspace_owner(id)) with check (private.is_workspace_owner(id));

-- workspace_members
create policy "members: members read" on public.workspace_members
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "members: owner removes, editor leaves" on public.workspace_members
  for delete to authenticated
  using (private.is_workspace_owner(workspace_id) or user_id = (select auth.uid()));

-- brands
create policy "brands: members read" on public.brands
  for select to authenticated using (private.is_workspace_member(workspace_id));
create policy "brands: members create" on public.brands
  for insert to authenticated with check (private.is_workspace_member(workspace_id));
create policy "brands: members edit" on public.brands
  for update to authenticated
  using (private.is_workspace_member(workspace_id))
  with check (private.is_workspace_member(workspace_id));
create policy "brands: owner deletes" on public.brands
  for delete to authenticated using (private.is_workspace_owner(workspace_id));

-- brands.created_by is always the caller.
create function private.set_brand_creator() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.created_by := (select auth.uid());
  return new;
end;
$$;
create trigger brands_set_creator before insert on public.brands
  for each row execute function private.set_brand_creator();
