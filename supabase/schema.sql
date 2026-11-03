-- Run this in Supabase SQL Editor. Add your admin user in the dashboard Auth section first.
create table if not exists public.portfolio_admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.portfolio_content (id integer primary key check(id=1), content jsonb not null, updated_at timestamptz default now());
alter table public.portfolio_admins enable row level security;
alter table public.portfolio_content enable row level security;
-- The site may read published content; only explicitly whitelisted authenticated users may edit it.
create policy "Anyone can read portfolio" on public.portfolio_content for select using (true);
create policy "Admins can read own membership" on public.portfolio_admins for select to authenticated using (user_id=auth.uid());
create policy "Admins can insert content" on public.portfolio_content for insert to authenticated with check (exists(select 1 from public.portfolio_admins where user_id=auth.uid()));
create policy "Admins can update content" on public.portfolio_content for update to authenticated using (exists(select 1 from public.portfolio_admins where user_id=auth.uid())) with check (exists(select 1 from public.portfolio_admins where user_id=auth.uid()));
-- After creating an Auth user, run this with that user's UUID:
-- insert into public.portfolio_admins(user_id) values ('YOUR-AUTH-USER-UUID');
