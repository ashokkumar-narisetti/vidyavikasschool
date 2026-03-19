-- Popup banner schema for homepage modal achievements.
-- Run this in Supabase SQL Editor.

create table if not exists public.popup_banners (
  id bigint generated always as identity primary key,
  image_url text not null,
  title text,
  caption text,
  redirect_link text,
  priority integer not null default 100,
  is_active boolean not null default true,
  show_frequency text not null default 'session'
    check (show_frequency in ('session', 'daily')),
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint popup_banners_date_check
    check (start_date is null or end_date is null or end_date >= start_date)
);

create index if not exists idx_popup_banners_active_priority
  on public.popup_banners (is_active, priority desc, created_at desc);

create index if not exists idx_popup_banners_date_range
  on public.popup_banners (start_date, end_date);

create or replace function public.set_popup_banners_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_popup_banners_updated_at on public.popup_banners;
create trigger trg_popup_banners_updated_at
before update on public.popup_banners
for each row
execute function public.set_popup_banners_updated_at();

alter table public.popup_banners enable row level security;

drop policy if exists "Anon can read active popup banners" on public.popup_banners;
create policy "Anon can read active popup banners"
on public.popup_banners
for select
to anon
using (
  is_active = true
  and (start_date is null or start_date <= current_date)
  and (end_date is null or end_date >= current_date)
);

drop policy if exists "Authenticated can manage popup banners" on public.popup_banners;
create policy "Authenticated can manage popup banners"
on public.popup_banners
for all
to authenticated
using (true)
with check (true);

-- Optional storage policies (if your bucket policies are strict):
-- Allow authenticated users to upload/remove files under school-assets/popup-banners/*
-- and keep public read enabled for school-assets bucket.
