-- Create a table for application-wide settings
CREATE TABLE IF NOT EXISTS public.app_settings (
    key text PRIMARY KEY,
    value text,
    description text,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow specific keys to be public
DROP POLICY IF EXISTS "Allow public read access" ON public.app_settings;
CREATE POLICY "Allow public read access"
ON public.app_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Allow only ADMINS to manage settings
DROP POLICY IF EXISTS "Allow admin to manage settings" ON public.app_settings;
CREATE POLICY "Allow admin to manage settings"
ON public.app_settings
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
);

-- Insert initial data
INSERT INTO public.app_settings (key, value, description)
VALUES 
    ('gtm_id', 'GTM-WCW8R5BK', 'Google Tag Manager Container ID'),
    ('tiktok_pixel_id', '', 'TikTok Pixel ID'),
    ('facebook_pixel_id', '', 'Facebook Pixel ID')
ON CONFLICT (key) DO NOTHING;
