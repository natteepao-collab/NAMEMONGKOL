-- Create table to track used slips and prevent duplicates
CREATE TABLE IF NOT EXISTS payment_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  amount numeric NOT NULL,
  credits_added int NOT NULL,
  trans_ref text NOT NULL, -- This unique index prevents duplicate slips
  created_at timestamptz DEFAULT now(),
  CONSTRAINT payment_transactions_trans_ref_key UNIQUE (trans_ref)
);

-- RLS Policies
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" 
ON payment_transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Secure RPC function to add credits ONLY if slip is new
CREATE OR REPLACE FUNCTION add_credits_v2(
  credit_amount int,
  payment_amount numeric,
  slip_ref text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_ref text;
  new_balance int;
BEGIN
  -- 1. Check if slip already used (Double check, though UNIQUE constraint handles it)
  SELECT trans_ref INTO existing_ref FROM payment_transactions WHERE trans_ref = slip_ref LIMIT 1;
  
  IF existing_ref IS NOT NULL THEN
    RETURN json_build_object('success', false, 'message', 'สลิปนี้ถูกใช้งานไปแล้ว (Duplicate Slip)');
  END IF;

  -- 2. Insert transaction record
  INSERT INTO payment_transactions (user_id, amount, credits_added, trans_ref)
  VALUES (auth.uid(), payment_amount, credit_amount, slip_ref);

  -- 3. Update User Credits
  UPDATE user_profiles
  SET credits = coalesce(credits, 0) + credit_amount
  WHERE id = auth.uid()
  RETURNING credits INTO new_balance;

  RETURN json_build_object('success', true, 'new_balance', new_balance);

EXCEPTION WHEN unique_violation THEN
  RETURN json_build_object('success', false, 'message', 'สลิปนี้ถูกใช้งานไปแล้ว');
WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;
