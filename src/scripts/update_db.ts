
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function update() {
    console.log('Applying database updates...');

    const updates = [
        { id: 10, image: '/wallpapers/wallpaper-10.png' },
        { id: 12, image: '/wallpapers/wallpaper-12.png' },
        { id: 13, image: '/wallpapers/wallpaper-13.png' },
        { id: 11, image: '/wallpapers/wallpaper-11.png' }
    ];

    for (const up of updates) {
        const { error } = await supabase
            .from('wallpapers')
            .update({ image: up.image })
            .eq('id', up.id);

        if (error) {
            console.error(`Failed to update ID ${up.id}:`, error);
        } else {
            console.log(`Updated ID ${up.id} -> ${up.image}`);
        }
    }
    console.log('Database updates completed.');
}

update();
