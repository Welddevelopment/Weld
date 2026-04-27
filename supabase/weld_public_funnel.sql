create extension if not exists "pgcrypto";

create table if not exists public.waitlist_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  audience text not null check (audience in ('developer', 'studio')),
  invite_code text not null unique,
  referred_by_lead_id uuid references public.waitlist_leads(id) on delete set null,
  source text not null default '',
  status text not null default 'invite_active',
  reward_tier text not null default 'invite-active',
  share_url text not null default '',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  utm_content text not null default '',
  utm_term text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.referral_events (
  id uuid primary key default gen_random_uuid(),
  referrer_lead_id uuid references public.waitlist_leads(id) on delete cascade,
  referee_lead_id uuid references public.waitlist_leads(id) on delete cascade,
  invite_code text not null default '',
  channel text not null default '',
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists referral_events_unique_referred_signup
  on public.referral_events (referrer_lead_id, referee_lead_id, event_type)
  where event_type = 'referred_signup';

create table if not exists public.profile_drafts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.waitlist_leads(id) on delete cascade unique,
  invite_code text not null unique,
  audience text not null check (audience in ('developer', 'studio')),
  current_step text not null default 'identity',
  completion_percent integer not null default 0,
  skipped boolean not null default false,
  draft jsonb not null default '{"identity":{},"proof":{},"fit":{}}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null default '',
  lead_id uuid references public.waitlist_leads(id) on delete set null,
  invite_code text not null default '',
  page text not null default '',
  audience text not null default '',
  event_name text not null,
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  utm_content text not null default '',
  utm_term text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists waitlist_leads_invite_code_idx
  on public.waitlist_leads (invite_code);

create index if not exists referral_events_referrer_idx
  on public.referral_events (referrer_lead_id, event_type);

create index if not exists profile_drafts_invite_code_idx
  on public.profile_drafts (invite_code);

create index if not exists analytics_events_event_name_idx
  on public.analytics_events (event_name, created_at desc);
