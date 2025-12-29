-- Function to add credits
-- Usage: supabase.rpc('add_credits', { amount: 50 })

create or replace function add_credits(amount int)
returns void
language plpgsql
security definer
as $$
begin
  update user_profiles
  set credits = coalesce(credits, 0) + amount
  where id = auth.uid();
end;
$$;
