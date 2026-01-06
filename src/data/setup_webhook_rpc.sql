-- Secure function to find user by LINE ID (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_by_line_id(line_id_input text)
RETURNS TABLE (id uuid, credits int)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT id, coalesce(credits, 0)
  FROM public.user_profiles
  WHERE line_user_id = line_id_input;
END;
$$ LANGUAGE plpgsql;

-- Allow anonymous access (needed if webhook uses ANON key)
GRANT EXECUTE ON FUNCTION get_user_by_line_id(text) TO anon;
GRANT EXECUTE ON FUNCTION get_user_by_line_id(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_by_line_id(text) TO service_role;
