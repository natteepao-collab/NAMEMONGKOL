
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAyatana() {
    console.log('Fixing ayatana image path...');

    const { error } = await supabase
        .from('articles')
        .update({ cover_image: '/images/articles/what-is-ayatana-6.png' })
        .eq('slug', 'what-is-ayatana-6');

    if (error) {
        console.error('Error updating article:', error);
    } else {
        console.log('Successfully updated article cover image.');
    }
}

fixAyatana();
