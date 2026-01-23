-- Create credit_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'earn' or 'spend'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own transactions
CREATE POLICY "Users can view their own transactions" 
ON credit_transactions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Policy: Service role or functions can insert/update (implicitly allowed, but good to be explicit if needed for clients)
-- Usually for logs, we might not let users insert directly.
-- So we won't add an INSERT policy for public users, only SELECT.

-- Re-run the function just to be safe (optional, but good practice to ensure it's loaded)
CREATE OR REPLACE FUNCTION approve_review(p_review_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_current_status TEXT;
BEGIN
    -- Get review owner and status
    SELECT user_id, status INTO v_user_id, v_current_status
    FROM reviews
    WHERE id = p_review_id;

    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Review not found');
    END IF;

    -- Only award credits if not already approved
    IF v_current_status = 'approved' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Review is already approved');
    END IF;

    -- Update Review Status
    UPDATE reviews 
    SET status = 'approved', updated_at = NOW() 
    WHERE id = p_review_id;

    -- Award 50 Credits
    UPDATE user_profiles
    SET credits = credits + 50
    WHERE id = v_user_id;

    -- Log Transaction (Now table exists!)
    INSERT INTO credit_transactions (user_id, amount, type, description)
    VALUES (v_user_id, 50, 'earn', 'Reward: Review Approved');

    RETURN jsonb_build_object('success', true);
END;
$$;
