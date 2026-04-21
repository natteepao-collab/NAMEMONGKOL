import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key';

if (supabaseUrl === 'http://dummy.supabase.co' || supabaseAnonKey === 'dummy_anon_key') {
    console.warn('⚠️ Missing Next.js Supabase environment variables. Using dummy values for static build.');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
