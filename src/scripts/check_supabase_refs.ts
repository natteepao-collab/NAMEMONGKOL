
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRemainingSupabaseUrls() {
    console.log('Checking for remaining Supabase URLs in database...');

    // Check Wallpapers
    const { data: wallpapers, error: wpError } = await supabase
        .from('wallpapers')
        .select('id, image')
        .ilike('image', '%supabase.co%');

    if (wpError) console.error('Error checking wallpapers:', wpError);
    else if (wallpapers && wallpapers.length > 0) {
        console.log(`WARNING: Found ${wallpapers.length} wallpapers still pointing to Supabase:`);
        wallpapers.forEach(wp => console.log(` - ID ${wp.id}: ${wp.image}`));
    } else {
        console.log('OK: No wallpapers pointing to Supabase.');
    }

    // Check Articles
    const { data: articles, error: artError } = await supabase
        .from('articles')
        .select('id, slug, cover_image')
        .ilike('cover_image', '%supabase.co%');

    if (artError) console.error('Error checking articles:', artError);
    else if (articles && articles.length > 0) {
        console.log(`WARNING: Found ${articles.length} articles still pointing to Supabase:`);
        articles.forEach(a => console.log(` - ${a.slug}: ${a.cover_image}`));
    } else {
        console.log('OK: No articles pointing to Supabase (cover_image).');
    }

    // Content check is heavier, skipping for now unless needed, as we assumed content was clean previously and only migrated covers.
    // But let's do a quick check on content if possible 
    const { data: articlesContent, error: contentError } = await supabase
        .from('articles')
        .select('slug')
        .ilike('content', '%supabase.co%');

    if (contentError) console.error('Error checking article content:', contentError);
    else if (articlesContent && articlesContent.length > 0) {
        console.log(`WARNING: Found ${articlesContent.length} articles with Supabase URLs in CONTENT:`);
        articlesContent.forEach(a => console.log(` - ${a.slug}`));
    } else {
        console.log('OK: No Supabase URLs found in article content.');
    }
}

checkRemainingSupabaseUrls();
