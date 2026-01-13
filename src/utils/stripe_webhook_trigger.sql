-- FUNCTION: handle_stripe_payment_success
-- Description: Triggered when a row in stripe.payment_intents is created or updated to 'succeeded'.
-- It extracts user_id and credits from the metadata (JSONB) and updates public.profiles.

create or replace function public.handle_stripe_payment_success()
returns trigger
language plpgsql
security definer
as $$
declare
  userId uuid;
  creditsAmount int;
begin
  -- Check if proper status transition or initial success state
  -- We handle both INSERT (if sync adds it as succeeded directly) and UPDATE (transition)
  if (TG_OP = 'INSERT' and new.status = 'succeeded') or
     (TG_OP = 'UPDATE' and new.status = 'succeeded' and old.status != 'succeeded') then
    
    -- Extract user_id and credits from metadata
    -- Note: metadata is usually a JSONB object in the 'stripe.payment_intents' table.
    userId := (new.metadata->>'user_id')::uuid;
    creditsAmount := (new.metadata->>'credits')::int;

    if userId is not null and creditsAmount is not null then
      -- Update user profile credits
      update public.profiles
      set credits = coalesce(credits, 0) + creditsAmount
      where id = userId;
    end if;
  end if;
  return new;
end;
$$;

-- TRIGGER: on_payment_intent_succeeded
-- Drops the trigger if it exists to avoid errors on multiple runs

drop trigger if exists on_payment_intent_succeeded on stripe.payment_intents;

create trigger on_payment_intent_succeeded
  after insert or update on stripe.payment_intents
  for each row
  execute function public.handle_stripe_payment_success();
