-- Migration: Add SEO-related columns to reviews table
-- Purpose: Support E-E-A-T signals, user engagement, and structured data for Google SEO

-- Add service_type column to identify which service the review is for
-- This enables proper itemReviewed in Schema markup
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS service_type VARCHAR(50) DEFAULT 'general';

-- Add is_verified column for E-E-A-T trust signals
-- Marks users who have actually used the service
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Add helpful_count column for user engagement metrics
-- Google values user interactions on content
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0;

-- Create index for service_type to speed up filtering
CREATE INDEX IF NOT EXISTS idx_reviews_service_type ON reviews(service_type);

-- Update existing reviews: set is_verified to true if user_id exists (logged in users)
UPDATE reviews 
SET is_verified = TRUE 
WHERE user_id IS NOT NULL AND is_verified IS NULL;

-- Auto-infer service_type for existing reviews based on tags (optional)
-- This is a best-effort migration for backward compatibility
UPDATE reviews 
SET service_type = CASE
    WHEN tags::text ILIKE '%เบอร์%' OR tags::text ILIKE '%โทร%' THEN 'phone-analysis'
    WHEN tags::text ILIKE '%ชื่อ%' AND tags::text NOT ILIKE '%เบอร์%' THEN 'name-analysis'
    WHEN tags::text ILIKE '%วอลเปเปอร์%' THEN 'wallpapers'
    ELSE 'general'
END
WHERE service_type IS NULL OR service_type = 'general';

-- Add comment for documentation
COMMENT ON COLUMN reviews.service_type IS 'Type of service reviewed: name-analysis, phone-analysis, premium-search, premium-analysis, wallpapers, general';
COMMENT ON COLUMN reviews.is_verified IS 'Whether the reviewer is a verified user (has account and/or purchase history)';
COMMENT ON COLUMN reviews.helpful_count IS 'Number of users who found this review helpful - user engagement metric';
