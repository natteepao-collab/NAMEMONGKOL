-- ============================================================
-- Migration: Create user_action_events table for analytics
-- Run this in Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS user_action_events (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_name  TEXT NOT NULL DEFAULT 'click',          -- click, submit, download, etc.
    button_key  TEXT NOT NULL,                           -- e.g. "home.hero.analyze", "login.social.google"
    page_path   TEXT NOT NULL,                           -- e.g. "/name-analysis"
    user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- nullable for anonymous
    session_id  TEXT,                                    -- fallback identifier for anonymous users
    referrer    TEXT,                                    -- document.referrer
    metadata    JSONB DEFAULT '{}',                      -- extra context (keep small)
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS idx_uae_created_at  ON user_action_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_uae_button_key  ON user_action_events (button_key);
CREATE INDEX IF NOT EXISTS idx_uae_page_path   ON user_action_events (page_path);
CREATE INDEX IF NOT EXISTS idx_uae_user_id     ON user_action_events (user_id);
CREATE INDEX IF NOT EXISTS idx_uae_session_id  ON user_action_events (session_id);

-- Composite index for date-range + button_key aggregation
CREATE INDEX IF NOT EXISTS idx_uae_date_button ON user_action_events (created_at, button_key);

-- 3. Row Level Security
ALTER TABLE user_action_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts via the anon key (ingest endpoint validates payload)
CREATE POLICY "Allow anon insert" ON user_action_events
    FOR INSERT
    WITH CHECK (true);

-- Allow authenticated inserts
CREATE POLICY "Allow auth insert" ON user_action_events
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Only service_role can SELECT (admin API uses service_role or server client)
-- The admin analytics API will read via server client with the user's session,
-- so we allow select for authenticated users whose profile role = 'admin'.
-- Alternatively, you can restrict SELECT to service_role only and use
-- supabase-admin client in the API. For simplicity we allow select for all
-- authenticated and rely on the API-level admin role check.
CREATE POLICY "Allow auth select" ON user_action_events
    FOR SELECT TO authenticated
    USING (true);

-- 4. Comment
COMMENT ON TABLE user_action_events IS 'Stores user interaction events (button clicks, form submits) for internal analytics dashboard.';
