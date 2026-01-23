-- 1. Update submit_review to REMOVE immediate credit rewarding
CREATE OR REPLACE FUNCTION submit_review(
    p_nickname TEXT,
    p_role TEXT,
    p_content TEXT,
    p_category TEXT,
    p_rating INTEGER,
    p_tags TEXT[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_review_id UUID;
BEGIN
    -- Get Current User ID from context
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
    END IF;

    -- Insert Review (Pending status by default)
    INSERT INTO reviews (user_id, nickname, role, content, category, rating, tags, status)
    VALUES (v_user_id, p_nickname, p_role, p_content, p_category, p_rating, p_tags, 'pending')
    RETURNING id INTO v_review_id;

    -- NO CREDITS AWARDED HERE ANYMORE

    RETURN jsonb_build_object(
        'success', true,
        'review_id', v_review_id,
        'message', 'Review submitted successfully'
    );
END;
$$;

-- 2. Create approve_review function to handle Approval + Credits
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

    -- Log Transaction
    INSERT INTO credit_transactions (user_id, amount, type, description)
    VALUES (v_user_id, 50, 'earn', 'Reward: Review Approved');

    RETURN jsonb_build_object('success', true);
END;
$$;
