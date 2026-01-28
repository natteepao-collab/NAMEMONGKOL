-- Migration: Update submit_review function to support service_type
-- Run this in Supabase SQL Editor

-- Drop existing function if exists (to update signature)
DROP FUNCTION IF EXISTS submit_review(text, text, text, text, integer, text[]);

-- Create updated function with service_type support
CREATE OR REPLACE FUNCTION submit_review(
    p_nickname text,
    p_role text,
    p_content text,
    p_category text,
    p_rating integer,
    p_tags text[],
    p_service_type text DEFAULT 'general'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id uuid;
    v_review_id uuid;
    v_result json;
BEGIN
    -- Get current user ID
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'User not authenticated');
    END IF;

    -- Insert the review
    INSERT INTO reviews (
        user_id,
        nickname,
        role,
        content,
        category,
        rating,
        tags,
        service_type,
        is_verified,
        helpful_count,
        status,
        created_at
    ) VALUES (
        v_user_id,
        p_nickname,
        p_role,
        p_content,
        p_category,
        p_rating,
        p_tags,
        COALESCE(p_service_type, 'general'),
        true, -- is_verified: true because user is logged in
        0,    -- helpful_count starts at 0
        'pending',
        now()
    )
    RETURNING id INTO v_review_id;

    -- Return success
    RETURN json_build_object(
        'success', true,
        'review_id', v_review_id,
        'message', 'รีวิวถูกส่งเรียบร้อยแล้ว รอการอนุมัติจากแอดมิน'
    );

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION submit_review(text, text, text, text, integer, text[], text) TO authenticated;

COMMENT ON FUNCTION submit_review IS 'Submit a new review with SEO-optimized fields including service_type for structured data';
