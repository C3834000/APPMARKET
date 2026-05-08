-- הרץ ב-Supabase → SQL Editor → Run (פעם אחת לפרויקט)

create table if not exists family_lists (
  list_id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists list_messages (
  id uuid primary key default gen_random_uuid(),
  list_id text not null,
  body text not null,
  sender text,
  user_id uuid,
  created_at timestamptz not null default now()
);

-- FK אופציונלי (אם כבר יש שורות ללא FK אפשר להסיר את השורה הבאה)
-- alter table list_messages add constraint fk_list foreign key (list_id) references family_lists(list_id) on delete cascade;

alter table family_lists enable row level security;
alter table list_messages enable row level security;

drop policy if exists "משתמשים רשימות" on family_lists;
create policy "משתמשים רשימות"
  on family_lists for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "משתמשים הודעות" on list_messages;
create policy "משתמשים הודעות"
  on list_messages for all
  to authenticated
  using (true)
  with check (true);

-- Realtime: Dashboard → Database → Publications → supabase_realtime → הוסף טבלאות
-- או:
alter publication supabase_realtime add table family_lists;
alter publication supabase_realtime add table list_messages;
