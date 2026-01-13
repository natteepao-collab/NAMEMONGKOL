-- Create a table to track processed Stripe sessions
-- This prevents double-crediting if the user refreshes the success page.

DROP TABLE IF EXISTS public.payment_history;

create table if not exists public.payment_history (
  id uuid default gen_random_uuid() primary key,
  session_id text not null unique,
  user_id uuid not null references auth.users(id),
  amount int not null,
  credits int not null,
  status text not null, -- 'completed', 'failed'
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.payment_history enable row level security;

-- Allow users to view their own transactions
create policy "Users can view own transactions"
  on public.payment_history
  for select
  using (auth.uid() = user_id);

-- Only service role (server action) can insert/update (by default, if no policy allows insert)
-- We typically don't add an INSERT policy for public users if we only want server-side insertion via Service Role or 'security definer' functions.
-- However, since we'll use Supabase Client in Server Action (Service Role or authenticated), we might need an insert policy if using standard client, 
-- but we will likely use Service Role client or rely on the fact that we are verifying on the server.
-- Actually, let's keep it simple: No public insert policy.
