/**
 * Migration: Add SEO-related nullable columns to the articles table.
 *
 * These columns are optional and backward-compatible — existing articles
 * continue to work with NULL values; the [slug]/page.tsx code falls back
 * to empty arrays / computed defaults when they're absent.
 *
 * Run with:  npx tsx scripts/migrate-articles-seo-columns.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * If your Supabase project uses the Dashboard SQL editor, you can also run
 * the raw SQL below directly:
 *
 *   ALTER TABLE articles ADD COLUMN IF NOT EXISTS toc jsonb DEFAULT NULL;
 *   ALTER TABLE articles ADD COLUMN IF NOT EXISTS faq_items jsonb DEFAULT NULL;
 *   ALTER TABLE articles ADD COLUMN IF NOT EXISTS related_slugs text[] DEFAULT NULL;
 *   ALTER TABLE articles ADD COLUMN IF NOT EXISTS date_modified date DEFAULT NULL;
 */

import { config } from 'dotenv';
config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(url, key);

const MIGRATION_SQL = `
  ALTER TABLE articles ADD COLUMN IF NOT EXISTS toc jsonb DEFAULT NULL;
  ALTER TABLE articles ADD COLUMN IF NOT EXISTS faq_items jsonb DEFAULT NULL;
  ALTER TABLE articles ADD COLUMN IF NOT EXISTS related_slugs text[] DEFAULT NULL;
  ALTER TABLE articles ADD COLUMN IF NOT EXISTS date_modified date DEFAULT NULL;
`;

async function main() {
  console.log('⏳ Running migration: add SEO columns to articles table …');

  const { error } = await supabase.rpc('exec_sql', { sql: MIGRATION_SQL });

  if (error) {
    // rpc 'exec_sql' may not exist; show the raw SQL for manual execution
    console.warn('⚠️  Could not run migration via RPC (this is normal if exec_sql is not enabled).');
    console.warn('   Please run the following SQL in your Supabase Dashboard SQL editor:\n');
    console.log(MIGRATION_SQL);
    console.warn('\n   Error details:', error.message);
  } else {
    console.log('✅ Migration completed successfully.');
  }
}

main();
