create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_draft jsonb not null default '{}'::jsonb,
  published_profile jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid not null references auth.users(id) on delete cascade,
  action text not null check (action in ('like', 'pass')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (swiper_id <> target_id)
);

create unique index if not exists swipes_swiper_target_key
on public.swipes (swiper_id, target_id);

alter table public.user_profiles enable row level security;
alter table public.swipes enable row level security;

create or replace function public.weld_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
before update on public.user_profiles
for each row execute function public.weld_set_updated_at();

drop trigger if exists swipes_set_updated_at on public.swipes;
create trigger swipes_set_updated_at
before update on public.swipes
for each row execute function public.weld_set_updated_at();

drop policy if exists "Users can read their own profile" on public.user_profiles;
create policy "Users can read their own profile"
on public.user_profiles
for select
using (auth.uid() = user_id);

drop policy if exists "Users can read published profiles" on public.user_profiles;
create policy "Users can read published profiles"
on public.user_profiles
for select
using (published_profile is not null);

drop policy if exists "Users can create their own profile" on public.user_profiles;
create policy "Users can create their own profile"
on public.user_profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.user_profiles;
create policy "Users can update their own profile"
on public.user_profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read swipes they participate in" on public.swipes;
create policy "Users can read swipes they participate in"
on public.swipes
for select
using (auth.uid() = swiper_id or auth.uid() = target_id);

drop policy if exists "Users can create their own swipes" on public.swipes;
create policy "Users can create their own swipes"
on public.swipes
for insert
with check (auth.uid() = swiper_id);

drop policy if exists "Users can update their own swipes" on public.swipes;
create policy "Users can update their own swipes"
on public.swipes
for update
using (auth.uid() = swiper_id)
with check (auth.uid() = swiper_id);
