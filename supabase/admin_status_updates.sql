-- Admin status updates for applications and contact messages.
-- Run this in Supabase SQL Editor after existing table scripts.

-- Applications: status workflow
alter table if exists public.applications
  add column if not exists status text;

alter table if exists public.applications
  alter column status set default 'New';

update public.applications
set status = 'New'
where status is null or btrim(status) = '';

create index if not exists idx_applications_status
  on public.applications (status);

-- Allow authenticated admins to update application status from dashboard modal.
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'applications'
  ) then
    execute '
      drop policy if exists "Authenticated can update applications status" on public.applications
    ';
    execute '
      create policy "Authenticated can update applications status"
      on public.applications
      for update
      to authenticated
      using (true)
      with check (true)
    ';
  end if;
end
$$;

-- Contact messages: replied flag
alter table if exists public.contact_messages
  add column if not exists is_replied boolean;

alter table if exists public.contact_messages
  alter column is_replied set default false;

update public.contact_messages
set is_replied = false
where is_replied is null;

create index if not exists idx_contact_messages_is_read
  on public.contact_messages (is_read);

create index if not exists idx_contact_messages_is_replied
  on public.contact_messages (is_replied);

-- Allow authenticated admins to mark messages as read/replied.
drop policy if exists "Authenticated can update contact messages" on public.contact_messages;
create policy "Authenticated can update contact messages"
on public.contact_messages
for update
to authenticated
using (true)
with check (true);
