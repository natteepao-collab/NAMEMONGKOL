CREATE TABLE IF NOT EXISTS public.app_secrets (
    key text PRIMARY KEY,
    value text NOT NULL,
    description text,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.app_secrets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admin read secrets" ON public.app_secrets;
CREATE POLICY "Allow admin read secrets"
ON public.app_secrets FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
);

DROP POLICY IF EXISTS "Allow admin manage secrets" ON public.app_secrets;
CREATE POLICY "Allow admin manage secrets"
ON public.app_secrets FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
);
