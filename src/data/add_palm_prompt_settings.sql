-- Seed app_settings keys for Palm Analysis Gemini prompt management
INSERT INTO public.app_settings (key, value, description)
VALUES
    ('palm_system_prompt', '', 'Palm Analysis Gemini system instruction'),
    ('palm_user_prompt_template', '', 'Palm Analysis Gemini user prompt template'),
    ('palm_prompt_version', 'default', 'Palm Analysis prompt cache-busting version')
ON CONFLICT (key) DO NOTHING;
