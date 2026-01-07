-- Fix User Deletion Issue (Database Error)
-- This script updates the foreign key constraints to allow deleting a user from Authentication
-- to automatically delete their related data (Cascading Delete).

-- 1. Fix 'slips' table
DO $$
BEGIN
    -- Try to drop the existing constraint (name might vary, so we try standard names)
    ALTER TABLE public.slips DROP CONSTRAINT IF EXISTS slips_user_id_fkey;
    
    -- Add the constraint back with ON DELETE CASCADE
    ALTER TABLE public.slips
    ADD CONSTRAINT slips_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
END $$;

-- 2. Fix 'analysis_history' table
DO $$
BEGIN
    ALTER TABLE public.analysis_history DROP CONSTRAINT IF EXISTS analysis_history_user_id_fkey;
    
    ALTER TABLE public.analysis_history
    ADD CONSTRAINT analysis_history_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
END $$;

-- 3. Fix 'user_profiles' table (Just in case)
DO $$
BEGIN
    ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;
    
    ALTER TABLE public.user_profiles
    ADD CONSTRAINT user_profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
END $$;
