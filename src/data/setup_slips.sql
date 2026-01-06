-- Table to store verified slip references
CREATE TABLE IF NOT EXISTS public.slips (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trans_id text NOT NULL UNIQUE,
  slip_ref text,
  amount numeric,
  sender_name text,
  file_hash text, -- Stores SHA256 hash of slip image for duplicate detection
  user_id uuid REFERENCES auth.users(id), -- Links slip to the user who uploaded it
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.slips ENABLE ROW LEVEL SECURITY;

-- Allow owners to see their own records (adjust policy to your model)
CREATE POLICY "insert slips" ON public.slips FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "select slips" ON public.slips FOR SELECT TO authenticated USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_slips_trans_id ON public.slips(trans_id);
CREATE INDEX IF NOT EXISTS idx_slips_file_hash ON public.slips(file_hash);
