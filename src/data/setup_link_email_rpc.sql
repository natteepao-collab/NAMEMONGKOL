-- RPC: Link LINE ID using Email
CREATE OR REPLACE FUNCTION link_line_id_by_email(email_input text, line_id_input text)
RETURNS json
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- 1. Find user ID from auth.users (case-insensitive email)
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = email_input;
  
  IF target_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Email not found');
  END IF;

  -- 2. Update user_profiles
  -- We use the found ID to update the profile
  UPDATE public.user_profiles
  SET line_user_id = line_id_input
  WHERE id = target_user_id;
  
  -- Check if update happened (user_profile might not exist if trigger failed?)
  IF FOUND THEN
    RETURN json_build_object('success', true, 'message', 'Link successful');
  ELSE
    -- Try inserting if profile missing (Safe fallback)
    INSERT INTO public.user_profiles (id, line_user_id, credits)
    VALUES (target_user_id, line_id_input, 0);
    
    RETURN json_build_object('success', true, 'message', 'Link successful (Created Profile)');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION link_line_id_by_email(text, text) TO anon;
GRANT EXECUTE ON FUNCTION link_line_id_by_email(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION link_line_id_by_email(text, text) TO service_role;
