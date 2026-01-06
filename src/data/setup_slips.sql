-- Table to store verified slip references
CREATE TABLE IF NOT EXISTS public.slips (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trans_id text NOT NULL UNIQUE,
  slip_ref text,
  amount numeric,
  sender_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.slips ENABLE ROW LEVEL SECURITY;

-- Allow owners to see their own records (adjust policy to your model)
-- Example policy assuming auth.uid() matches a column 'user_id'
-- You can adapt/extend as needed; currently open for insert/select by authenticated users
CREATE POLICY "insert slips" ON public.slips FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "select slips" ON public.slips FOR SELECT TO authenticated USING (true);
