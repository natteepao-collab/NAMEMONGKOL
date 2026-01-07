-- FUNCTION: Ensure User Profile Exists
-- Replace 'YOUR_USER_UID_HERE' with your actual User UID from Supabase Authentication
-- This will insert a profile if it doesn't exist, preserving existing data if it does.

INSERT INTO public.user_profiles (id, email, first_name, last_name, role, credits)
VALUES (
  'YOUR_USER_UID_HERE',  -- 🔴 REPLACE THIS with your UID
  'user@example.com',    -- Optional: Replace with email
  'Admin',               -- Optional: First Name
  'User',                -- Optional: Last Name
  'admin',               -- Role: set to 'admin' right away
  100000                 -- Credits: Give yourself some credits!
)
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',        -- Ensure admin role is set
  credits = CASE WHEN user_profiles.credits < 1000 THEN 1000 ELSE user_profiles.credits END; -- Top up if low
