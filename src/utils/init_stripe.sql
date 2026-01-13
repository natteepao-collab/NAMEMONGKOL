-- Enable the wrappers extension
create extension if not exists wrappers with schema extensions;

-- Create the foreign data wrapper for Stripe
create foreign data wrapper stripe_wrapper
  handler stripe_fdw_handler
  validator stripe_fdw_validator;

-- Create the foreign server using the secret key from vault (or plain text for setup, but safer via vault if available)
-- NOTE: For simplicity, we are asking you to replace 'sk_test_...' with your actual secret key.
-- Ideally, use pgsodium or vault, but here is the direct configuration which works for most Quickstarts.

-- Drop if exists to clean up
drop server if exists stripe_server cascade;

create server stripe_server
  foreign data wrapper stripe_wrapper
  options (
    api_key 'sk_test_YOUR_STRIPE_SECRET_KEY_HERE'  -- REPLACE THIS WITH YOUR STRIPE SECRET KEY
  );

-- Create the schema for Stripe tables
-- FULL RESET: Drop the schema and all its objects to ensure no conflicts (regular vs foreign tables)
drop schema if exists stripe cascade;
create schema stripe;

-- Create payment_intents foreign table
-- Adjust the columns as necessary. This schema covers basic usage.
create foreign table stripe.payment_intents (
  id text,
  amount bigint,
  amount_received bigint,
  currency text,
  status text,
  created bigint,
  client_secret text,
  payment_method text,
  customer text,
  metadata jsonb,
  description text,
  receipt_email text,
  attrs jsonb  -- Catch-all for other fields
)
  server stripe_server
  options (
    object 'payment_intents'
  );

-- Create other useful tables if needed (optional)
create foreign table stripe.customers (
  id text,
  email text,
  name text,
  description text,
  created bigint,
  metadata jsonb,
  attrs jsonb
)
  server stripe_server
  options (
    object 'customers'
  );

-- Re-apply the Trigger from the previous step (stripe_webhook_trigger.sql)
-- after enabling the table.
