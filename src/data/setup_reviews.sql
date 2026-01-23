-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Only admin can update (approve/reject)
CREATE POLICY "Admins can update reviews" ON reviews
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Policy: Everyone can read approved reviews
CREATE POLICY "Public can view approved reviews" ON reviews
  FOR SELECT
  USING (status = 'approved');

-- Policy: Users can view their own reviews (even pending)
CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert reviews
CREATE POLICY "Users can insert reviews" ON reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RPC Function to submit review and award credits
CREATE OR REPLACE FUNCTION submit_review(
  p_nickname TEXT,
  p_role TEXT,
  p_content TEXT,
  p_category TEXT,
  p_rating INTEGER,
  p_tags TEXT[]
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_review_id UUID;
  v_already_reviewed BOOLEAN;
  v_bonus_credits INTEGER := 50;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if user has already submitted a review (to limit bonus)
  -- Optional: You strictly want to give bonus ONLY for the first review?
  -- Or give for every review? Usually 1 bonus per user is safer.
  SELECT EXISTS (
    SELECT 1 FROM reviews WHERE user_id = v_user_id
  ) INTO v_already_reviewed;

  -- Insert Review
  INSERT INTO reviews (user_id, nickname, role, content, category, rating, tags, status)
  VALUES (v_user_id, p_nickname, p_role, p_content, p_category, p_rating, p_tags, 'pending')
  RETURNING id INTO v_review_id;

  -- Award Credits (Only if first review)
  IF NOT v_already_reviewed THEN
    UPDATE user_profiles
    SET credits = credits + v_bonus_credits
    WHERE id = v_user_id;
    
    -- Record Transaction Log (Optional but recommended)
    -- INSERT INTO credit_transactions ... (if you have table)
    
    RETURN jsonb_build_object(
      'success', true,
      'review_id', v_review_id,
      'bonus_credits', v_bonus_credits,
      'message', 'Review submitted and credits awarded'
    );
  ELSE
    RETURN jsonb_build_object(
      'success', true,
      'review_id', v_review_id,
      'bonus_credits', 0,
      'message', 'Review submitted (No bonus for repeat review)'
    );
  END IF;

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;
