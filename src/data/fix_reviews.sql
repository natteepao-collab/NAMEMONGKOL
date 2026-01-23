-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Fix default value for ID to use gen_random_uuid() (Available in all standard Supabase instances)
ALTER TABLE reviews ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 2. Drop the old function signature just in case
DROP FUNCTION IF EXISTS submit_review(text, text, text, text, integer, text[]);

-- 3. Re-create the RPC Function with improved error handling
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
  
  -- Handle Unauthenticated
  IF v_user_id IS NULL THEN
     RETURN jsonb_build_object('success', false, 'error', 'User not authenticated');
  END IF;

  -- Check if user has already submitted a review
  SELECT EXISTS (
    SELECT 1 FROM reviews WHERE user_id = v_user_id
  ) INTO v_already_reviewed;

  -- Insert Review (Using gen_random_uuid() implicitly if not provided)
  INSERT INTO reviews (user_id, nickname, role, content, category, rating, tags, status)
  VALUES (v_user_id, p_nickname, p_role, p_content, p_category, p_rating, p_tags, 'pending')
  RETURNING id INTO v_review_id;

  -- Award Credits (Only if first review)
  IF NOT v_already_reviewed THEN
    -- Update credits, handling potential NULLs
    UPDATE user_profiles
    SET credits = COALESCE(credits, 0) + v_bonus_credits
    WHERE id = v_user_id;

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
  -- Catch any SQL errors and return them as JSON
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;
