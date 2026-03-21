alter table public.notifications enable row level security;

drop policy if exists "Users can view their own notifications" on public.notifications;
create policy "Users can view their own notifications"
on public.notifications
for select
using ((auth.uid())::text = user_id);

drop policy if exists "Users can insert notifications they send" on public.notifications;
create policy "Users can insert notifications they send"
on public.notifications
for insert
with check (
  (auth.uid())::text = from_user_id
  or (auth.uid())::text = user_id
);

drop policy if exists "Users can update their own notifications" on public.notifications;
create policy "Users can update their own notifications"
on public.notifications
for update
using ((auth.uid())::text = user_id)
with check ((auth.uid())::text = user_id);

drop policy if exists "Users can delete their own notifications" on public.notifications;
create policy "Users can delete their own notifications"
on public.notifications
for delete
using (
  (auth.uid())::text = user_id
  or (auth.uid())::text = from_user_id
);
