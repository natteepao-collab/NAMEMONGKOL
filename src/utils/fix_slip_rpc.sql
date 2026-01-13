-- 1. Drop existing slips table to fix schema (Warning: Clears old slip logs)
-- Only run DROP if you are sure. Since user already ran it, we can keep it or comment it out.
-- Let's just create/replace the function which is the critical part now.

create or replace function public.add_credits_v3(
  credit_amount int,
  payment_amount int,
  slip_ref text,
  user_id_arg uuid default auth.uid()
)
returns json
language plpgsql
security definer
as $$
declare
  user_exists boolean;
begin
  select exists(select 1 from public.user_profiles where id = user_id_arg) into user_exists;
  
  if not user_exists then
    return json_build_object('success', false, 'message', 'User not found');
  end if;

  -- Check if transaction already exists in payment_history
  if exists(select 1 from public.payment_history where session_id = slip_ref) then
      return json_build_object('success', false, 'message', 'สลิปนี้ถูกใช้งานไปแล้ว (Duplicate)', 'code', 'DUPLICATE_SLIP');
  end if;

  update public.user_profiles
  set credits = coalesce(credits, 0) + credit_amount
  where id = user_id_arg;

  insert into public.payment_history (session_id, user_id, amount, credits, status)
  values (slip_ref, user_id_arg, payment_amount, credit_amount, 'completed');

  return json_build_object('success', true, 'message', 'Credits added successfully');
exception when others then
  return json_build_object('success', false, 'message', SQLERRM);
end;
$$;
