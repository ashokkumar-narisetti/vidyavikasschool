-- Contact messages schema for website contact form submissions.
-- Run this in Supabase SQL Editor.

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text not null,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Reconcile columns for existing projects where table already exists.
alter table public.contact_messages add column if not exists name text;
alter table public.contact_messages add column if not exists phone text;
alter table public.contact_messages add column if not exists email text;
alter table public.contact_messages add column if not exists subject text;
alter table public.contact_messages add column if not exists message text;
alter table public.contact_messages add column if not exists is_read boolean;
alter table public.contact_messages add column if not exists created_at timestamptz;

alter table public.contact_messages alter column is_read set default false;
alter table public.contact_messages alter column created_at set default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'contact_messages'
      and column_name = 'full_name'
  ) then
    execute '
      update public.contact_messages
      set name = coalesce(name, full_name)
      where coalesce(name, '''') = ''''
    ';
  end if;

  execute '
    update public.contact_messages
    set created_at = now()
    where created_at is null
  ';

  execute '
    update public.contact_messages
    set is_read = false
    where is_read is null
  ';
end
$$;

create index if not exists idx_contact_messages_created_at
  on public.contact_messages (created_at desc);

create index if not exists idx_contact_messages_subject
  on public.contact_messages (subject);

alter table public.contact_messages enable row level security;

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
on public.contact_messages
for insert
to public
with check (true);

drop policy if exists "Authenticated can read contact messages" on public.contact_messages;
create policy "Authenticated can read contact messages"
on public.contact_messages
for select
to authenticated
using (true);

drop policy if exists "Authenticated can delete contact messages" on public.contact_messages;
create policy "Authenticated can delete contact messages"
on public.contact_messages
for delete
to authenticated
using (true);
