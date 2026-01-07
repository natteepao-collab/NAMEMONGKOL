-- Fix User Deletion Issue V2 (ROBUST)
-- This script safely updates tables to enable "Cascade Delete" (Auto-delete data when User is deleted).
-- It handles missing columns or constraints gracefully.

-- 1. Fix 'user_profiles' table (Most critical)
DO $$
BEGIN
    -- Check if constraint exists, drop it to be safe
    ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;
    
    -- Re-add with CASCADE
    ALTER TABLE public.user_profiles
    ADD CONSTRAINT user_profiles_id_fkey
    FOREIGN KEY (id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error fixing user_profiles: %', SQLERRM;
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
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error fixing analysis_history: %', SQLERRM;
END $$;

-- 3. Fix 'slips' table (With column check)
DO $$
BEGIN
    -- Check if 'user_id' column exists first
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'slips' 
        AND column_name = 'user_id'
    ) THEN
        -- Drop existing constraint
        ALTER TABLE public.slips DROP CONSTRAINT IF EXISTS slips_user_id_fkey;
        
        -- Add Cascade constraint
        ALTER TABLE public.slips
        ADD CONSTRAINT slips_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE;
    ELSE
        RAISE NOTICE 'Table "slips" has no "user_id" column. Skipping slips fix.';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error fixing slips: %', SQLERRM;
END $$;
