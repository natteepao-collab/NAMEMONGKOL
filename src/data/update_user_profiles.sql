-- Add line_user_id column to user_profiles if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS line_user_id text;

-- Create an index for faster lookups by line_user_id (used in webhook)
CREATE INDEX IF NOT EXISTS idx_user_profiles_line_user_id ON public.user_profiles(line_user_id);
