-- Study Terminal cloud: run this once in Supabase (SQL Editor → New query → paste → Run). Safe to run again.
-- Creates private tables and a handful of functions. The public (anon) key can ONLY call these functions.
-- It can't list, browse, or delete anyone's progress, and PINs are stored hashed (bcrypt).

create extension if not exists pgcrypto with schema extensions;

-- ---------- progress (one row per player, found by a secret sync key) ----------
create table if not exists public.study_progress (
  sync_key   text primary key check (length(sync_key) between 20 and 100),
  data       jsonb not null,
  rev        bigint not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.study_progress enable row level security;
revoke all on table public.study_progress from anon, authenticated;

create or replace function public.get_progress(k text)
returns table (data jsonb, rev bigint) language sql security definer set search_path = public as $$
  select p.data, p.rev from public.study_progress p where p.sync_key = k and length(k) >= 20;
$$;

create or replace function public.put_progress(k text, d jsonb, expected bigint)
returns bigint language plpgsql security definer set search_path = public as $$
declare cur bigint;
begin
  if k is null or length(k) < 20 or length(k) > 100 then raise exception 'sync key must be 20-100 characters'; end if;
  if pg_column_size(d) > 3000000 then raise exception 'progress is too large'; end if;
  select p.rev into cur from public.study_progress p where p.sync_key = k for update;
  if cur is null then
    if coalesce(expected, 0) <> 0 then return -1; end if;
    insert into public.study_progress (sync_key, data) values (k, d) on conflict (sync_key) do nothing;
    if not found then return -1; end if;
    return 1;
  end if;
  if cur <> coalesce(expected, 0) then return -1; end if;
  update public.study_progress set data = d, rev = cur + 1, updated_at = now() where sync_key = k;
  return cur + 1;
end; $$;

-- ---------- accounts: username + PIN → the player's sync key ----------
create table if not exists public.study_accounts (
  username   text primary key check (username ~ '^[a-z0-9_.-]{3,20}$'),
  display    text not null,
  pin_hash   text not null,
  sync_key   text not null unique,
  fails      int not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now()
);
alter table public.study_accounts enable row level security;
revoke all on table public.study_accounts from anon, authenticated;

create or replace function public.create_account(u text, pin text, existing_key text default null)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare name text := lower(trim(u)); k text;
begin
  if name !~ '^[a-z0-9_.-]{3,20}$' then raise exception 'Usernames are 3-20 letters, numbers, dots, dashes or underscores.'; end if;
  if pin is null or length(pin) < 6 or length(pin) > 64 then raise exception 'Use a PIN or password of at least 6 characters.'; end if;
  if exists (select 1 from public.study_accounts a where a.username = name) then raise exception 'That username is taken.'; end if;
  -- Keep the progress a device already synced, if it brings its existing key; otherwise mint a fresh one.
  k := case when existing_key is not null and length(existing_key) between 20 and 100
                 and not exists (select 1 from public.study_accounts a where a.sync_key = existing_key)
            then existing_key else encode(gen_random_bytes(24), 'hex') end;
  insert into public.study_accounts (username, display, pin_hash, sync_key) values (name, left(trim(u), 20), crypt(pin, gen_salt('bf', 8)), k);
  return k;
end; $$;

-- Returns {"ok":true,"key":...} or {"ok":false,"error":...}. Errors are returned, not raised, so the failed-try counter is saved.
drop function if exists public.login(text, text);
create or replace function public.login(u text, pin text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare a public.study_accounts;
begin
  select * into a from public.study_accounts where username = lower(trim(u)) for update;
  if not found then perform pg_sleep(0.3); return jsonb_build_object('ok', false, 'error', 'Wrong username or PIN.'); end if;
  if a.locked_until is not null and a.locked_until > now() then return jsonb_build_object('ok', false, 'error', 'Too many wrong tries. Wait 15 minutes and try again.'); end if;
  if a.pin_hash = crypt(pin, a.pin_hash) then
    update public.study_accounts set fails = 0, locked_until = null where username = a.username;
    return jsonb_build_object('ok', true, 'key', a.sync_key, 'name', a.display);
  end if;
  update public.study_accounts set fails = a.fails + 1, locked_until = case when a.fails + 1 >= 8 then now() + interval '15 minutes' else null end where username = a.username;
  return jsonb_build_object('ok', false, 'error', 'Wrong username or PIN.');
end; $$;

-- ---------- leaderboard (scores only, posted by the owner of the sync key) ----------
create table if not exists public.study_scores (
  username text not null references public.study_accounts(username) on delete cascade,
  exam     int not null,
  xp int not null default 0, answers int not null default 0, accuracy int not null default 0,
  mock_best int not null default 0, bosses int not null default 0, daily_streak int not null default 0,
  daily_day text, daily_score int, daily_secs int, daily_grid text,
  updated_at timestamptz not null default now(),
  primary key (username, exam)
);
alter table public.study_scores enable row level security;
revoke all on table public.study_scores from anon, authenticated;

create or replace function public.post_score(k text, ex int, s jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare name text;
begin
  select username into name from public.study_accounts where sync_key = k;
  if name is null then raise exception 'Not signed in.'; end if;
  insert into public.study_scores as t (username, exam, xp, answers, accuracy, mock_best, bosses, daily_streak, daily_day, daily_score, daily_secs, daily_grid, updated_at)
  values (name, ex, least(coalesce((s->>'xp')::int,0), 1000000), least(coalesce((s->>'answers')::int,0), 1000000), least(greatest(coalesce((s->>'accuracy')::int,0),0),100),
          least(greatest(coalesce((s->>'mock_best')::int,0),0),100), least(coalesce((s->>'bosses')::int,0),50), least(coalesce((s->>'daily_streak')::int,0),3650),
          left(s->>'daily_day',10), least(greatest(coalesce((s->>'daily_score')::int,0),0),5), least(coalesce((s->>'daily_secs')::int,0),36000), left(s->>'daily_grid',40), now())
  on conflict (username, exam) do update set xp = excluded.xp, answers = excluded.answers, accuracy = excluded.accuracy, mock_best = excluded.mock_best,
    bosses = excluded.bosses, daily_streak = excluded.daily_streak, daily_day = excluded.daily_day, daily_score = excluded.daily_score,
    daily_secs = excluded.daily_secs, daily_grid = excluded.daily_grid, updated_at = now();
end; $$;

create or replace function public.get_leaderboard(ex int)
returns table (name text, xp int, answers int, accuracy int, mock_best int, bosses int, daily_streak int, daily_day text, daily_score int, daily_secs int, daily_grid text, updated_at timestamptz)
language sql security definer set search_path = public as $$
  select a.display, s.xp, s.answers, s.accuracy, s.mock_best, s.bosses, s.daily_streak, s.daily_day, s.daily_score, s.daily_secs, s.daily_grid, s.updated_at
  from public.study_scores s join public.study_accounts a using (username)
  where s.exam = ex order by s.xp desc limit 100;
$$;

-- ---------- live duels (progress while two players answer the same 10 questions) ----------
create table if not exists public.study_duels (
  code text not null check (code ~ '^[A-Z0-9]{6}$'),
  username text not null references public.study_accounts(username) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (code, username)
);
alter table public.study_duels enable row level security;
revoke all on table public.study_duels from anon, authenticated;

create or replace function public.duel_set(k text, c text, st jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare name text;
begin
  select username into name from public.study_accounts where sync_key = k;
  if name is null then raise exception 'Not signed in.'; end if;
  if pg_column_size(st) > 4000 then raise exception 'Too large.'; end if;
  insert into public.study_duels (code, username, state) values (upper(c), name, st)
  on conflict (code, username) do update set state = excluded.state, updated_at = now();
  delete from public.study_duels where updated_at < now() - interval '3 days';
end; $$;

create or replace function public.duel_get(c text)
returns table (name text, state jsonb, updated_at timestamptz) language sql security definer set search_path = public as $$
  select a.display, d.state, d.updated_at from public.study_duels d join public.study_accounts a using (username) where d.code = upper(c);
$$;

-- ---------- permissions: anon may call the functions, nothing else ----------
revoke all on function public.get_progress(text) from public;
revoke all on function public.put_progress(text, jsonb, bigint) from public;
revoke all on function public.create_account(text, text, text) from public;
revoke all on function public.login(text, text) from public;
revoke all on function public.post_score(text, int, jsonb) from public;
revoke all on function public.get_leaderboard(int) from public;
revoke all on function public.duel_set(text, text, jsonb) from public;
revoke all on function public.duel_get(text) from public;
grant execute on function public.get_progress(text), public.put_progress(text, jsonb, bigint), public.create_account(text, text, text),
  public.login(text, text), public.post_score(text, int, jsonb), public.get_leaderboard(int), public.duel_set(text, text, jsonb), public.duel_get(text)
  to anon, authenticated;
