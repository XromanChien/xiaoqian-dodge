-- Run in Supabase SQL Editor. Browser uses only a public publishable/anon key.
begin;
create table if not exists public.coin_runs (
  run_id uuid primary key,
  player_name text not null check (char_length(player_name) between 1 and 20),
  coins integer not null check (coins between 0 and 1000000),
  created_at timestamptz not null default now()
);
alter table public.coin_runs enable row level security;
revoke all on public.coin_runs from anon, authenticated;
create index if not exists coin_runs_ranking on public.coin_runs (coins desc, created_at, run_id);
create or replace function public.submit_coin_run(p_run_id uuid, p_player_name text, p_coins integer)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_run_id is null or p_player_name is null or char_length(btrim(p_player_name)) not between 1 and 20
     or p_player_name ~ '[[:cntrl:]<>]' or p_coins is null or p_coins not between 0 and 1000000 then
    raise exception 'Invalid submission';
  end if;
  insert into public.coin_runs(run_id, player_name, coins)
  values(p_run_id,btrim(p_player_name),p_coins)
  on conflict(run_id) do nothing;
end;
$$;
create or replace function public.get_coin_leaderboard()
returns table(rank bigint, player_name text, coins integer)
language sql stable security definer set search_path = '' as $$
  select rank() over (order by c.coins desc), c.player_name, c.coins
  from public.coin_runs c
  order by c.coins desc,c.created_at,c.run_id limit 20;
$$;
revoke all on function public.submit_coin_run(uuid,text,integer) from public;
revoke all on function public.get_coin_leaderboard() from public;
grant execute on function public.submit_coin_run(uuid,text,integer) to anon;
grant execute on function public.get_coin_leaderboard() to anon;
commit;
