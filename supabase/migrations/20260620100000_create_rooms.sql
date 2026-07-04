-- Quick Note v1: one shared note per room ID
-- Apply: supabase db push (remote) or supabase migration up (local)

create table public.rooms (
  id          text primary key,
  content     text not null default '',
  updated_at  timestamptz not null default now(),
  created_at  timestamptz not null default now(),

  constraint rooms_id_format check (
    char_length(id) between 2 and 64
    and id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  )
);

comment on table public.rooms is 'Shared note room — same id = same content across devices';
comment on column public.rooms.id is 'Normalized room id (lowercase, hyphens), matches URL /:roomId';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger rooms_set_updated_at
before update on public.rooms
for each row
execute function public.set_updated_at();

create index rooms_updated_at_idx on public.rooms (updated_at desc);

alter table public.rooms enable row level security;

create policy "rooms_select_anon"
  on public.rooms
  for select
  to anon
  using (true);

create policy "rooms_insert_anon"
  on public.rooms
  for insert
  to anon
  with check (true);

create policy "rooms_update_anon"
  on public.rooms
  for update
  to anon
  using (true)
  with check (true);

alter publication supabase_realtime add table public.rooms;
