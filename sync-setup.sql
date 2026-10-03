-- Study Terminal cloud sync: run this once in Supabase (SQL Editor → New query → paste → Run).
-- It creates one private table and two functions. The public (anon) key can ONLY call these two
-- functions with a sync key it already knows. It can't list, browse, or delete anyone's progress.

create table if not exists public.study_progress (
  sync_key   text primary key check (length(sync_key) between 20 and 100),
  data       jsonb not null,
  rev        bigint not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.study_progress enable row level security;
revoke all on table public.study_progress from anon, authenticated;

-- Read one player's progress by sync key.
create or replace function public.get_progress(k text)
returns table (data jsonb, rev bigint)
language sql
security definer
set search_path = public
as $$
  select p.data, p.rev from public.study_progress p
  where p.sync_key = k and length(k) >= 20;
$$;

-- Save one player's progress. "expected" is the version the device last saw;
-- if another device saved in between, this returns -1 and the game merges and retries.
create or replace function public.put_progress(k text, d jsonb, expected bigint)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare cur bigint;
begin
  if k is null or length(k) < 20 or length(k) > 100 then
    raise exception 'sync key must be 20-100 characters';
  end if;
  if pg_column_size(d) > 3000000 then
    raise exception 'progress is too large';
  end if;
  select p.rev into cur from public.study_progress p where p.sync_key = k for update;
  if cur is null then
    if coalesce(expected, 0) <> 0 then return -1; end if;
    insert into public.study_progress (sync_key, data) values (k, d)
      on conflict (sync_key) do nothing;
    if not found then return -1; end if;
    return 1;
  end if;
  if cur <> coalesce(expected, 0) then return -1; end if;
  update public.study_progress set data = d, rev = cur + 1, updated_at = now() where sync_key = k;
  return cur + 1;
end;
$$;

revoke all on function public.get_progress(text) from public;
revoke all on function public.put_progress(text, jsonb, bigint) from public;
grant execute on function public.get_progress(text) to anon, authenticated;
grant execute on function public.put_progress(text, jsonb, bigint) to anon, authenticated;
