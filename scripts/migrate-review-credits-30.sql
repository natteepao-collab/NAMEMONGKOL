-- Migration: ปรับระบบเครดิตรีวิว
-- 1. submit_review() — ลบการให้เครดิตตอนส่ง (ให้เฉพาะตอนอนุมัติ)
-- 2. approve_review() — เปลี่ยนจาก 50 → 30 เครดิต
-- วันที่: 2026-04-08
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. UPDATE submit_review() — ลบ bonus credits ตอนส่งรีวิว
-- ============================================================
DROP FUNCTION IF EXISTS public.submit_review(text,text,text,text,integer,text[],text,text[]);

CREATE OR REPLACE FUNCTION public.submit_review(
    p_nickname TEXT,
    p_role TEXT DEFAULT NULL,
    p_content TEXT DEFAULT '',
    p_category TEXT DEFAULT 'โชคลาภ',
    p_rating INTEGER DEFAULT 5,
    p_tags TEXT[] DEFAULT '{}',
    p_service_type TEXT DEFAULT 'general',
    p_images TEXT[] DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_review_id UUID;
    v_already_reviewed BOOLEAN;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
    END IF;

    -- Check if user already has a review
    SELECT EXISTS(
        SELECT 1 FROM reviews WHERE user_id = v_user_id
    ) INTO v_already_reviewed;

    -- Insert the review (status = pending, admin will approve)
    INSERT INTO reviews (user_id, nickname, role, content, category, rating, tags, service_type, images, status)
    VALUES (v_user_id, p_nickname, p_role, p_content, p_category, p_rating, p_tags, p_service_type, p_images, 'pending')
    RETURNING id INTO v_review_id;

    -- ไม่ให้เครดิตตอนส่งอีกแล้ว — จะให้เฉพาะตอน admin อนุมัติเท่านั้น
    RETURN jsonb_build_object(
        'success', true,
        'review_id', v_review_id,
        'bonus_credits', 0,
        'message', 'Review submitted successfully. Credits will be awarded upon approval.'
    );
END;
$$;

-- ============================================================
-- 2. UPDATE approve_review() — เปลี่ยนจาก 50 → 30 เครดิต
-- ============================================================
CREATE OR REPLACE FUNCTION public.approve_review(p_review_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_current_status TEXT;
BEGIN
    -- Get review info
    SELECT user_id, status INTO v_user_id, v_current_status
    FROM reviews
    WHERE id = p_review_id;

    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Review not found');
    END IF;

    -- Prevent double-approval
    IF v_current_status = 'approved' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already approved');
    END IF;

    -- Update review status
    UPDATE reviews
    SET status = 'approved', updated_at = NOW()
    WHERE id = p_review_id;

    -- Award 30 credits (changed from 50)
    UPDATE user_profiles
    SET credits = COALESCE(credits, 0) + 30
    WHERE id = v_user_id;

    -- Log credit transaction
    INSERT INTO credit_transactions (user_id, amount, type, description)
    VALUES (v_user_id, 30, 'earn', 'Reward: Review Approved — รีวิวได้รับการอนุมัติ +30 เครดิต');

    RETURN jsonb_build_object('success', true, 'message', 'Review approved, 30 credits awarded');
END;
$$;
