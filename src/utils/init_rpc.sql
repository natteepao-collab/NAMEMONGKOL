-- Function to safely increment user credits
-- This runs with SECURITY DEFINER to bypass RLS and ensure atomic updates

create or replace function public.increment_credits(user_uuid uuid, amount int)
returns void
language plpgsql
security definer
as $$
begin
  update public.user_profiles
  set credits = coalesce(credits, 0) + amount
  where id = user_uuid;
end;
$$;
