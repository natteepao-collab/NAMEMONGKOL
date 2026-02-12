-- 1. Storage Setup
-- Create 'review-images' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Give public access to review-images (SELECT)
DROP POLICY IF EXISTS "Give public access to review-images" ON storage.objects;
CREATE POLICY "Give public access to review-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'review-images' );

-- Policy: Allow authenticated users to upload review images (INSERT)
DROP POLICY IF EXISTS "Allow authenticated uploads for reviews" ON storage.objects;
CREATE POLICY "Allow authenticated uploads for reviews"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'review-images' AND auth.role() = 'authenticated' );

-- Policy: Allow users to update their own review images (UPDATE)
DROP POLICY IF EXISTS "Allow users to update own review images" ON storage.objects;
CREATE POLICY "Allow users to update own review images"
ON storage.objects FOR UPDATE
WITH CHECK ( bucket_id = 'review-images' AND auth.uid() = (storage.foldername(name))[1]::uuid );

-- Policy: Allow users to delete their own review images (DELETE)
DROP POLICY IF EXISTS "Allow users to delete own review images" ON storage.objects;
CREATE POLICY "Allow users to delete own review images"
ON storage.objects FOR DELETE
USING ( bucket_id = 'review-images' AND auth.uid() = (storage.foldername(name))[1]::uuid );


-- 2. Database Schema
-- Add images column to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- 3. RPC Function Update
-- Drop existing function to update signature
DROP FUNCTION IF EXISTS submit_review(text, text, text, text, integer, text[], text);

CREATE OR REPLACE FUNCTION submit_review(
    p_nickname text,
    p_role text,
    p_content text,
    p_category text,
    p_rating integer,
    p_tags text[],
    p_service_type text DEFAULT 'general',
    p_images text[] DEFAULT NULL
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
        images,
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
        p_images,
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

GRANT EXECUTE ON FUNCTION submit_review(text, text, text, text, integer, text[], text, text[]) TO authenticated;

COMMENT ON FUNCTION submit_review IS 'Submit a new review with SEO fields and image support';
