
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function downloadImage(url: string, filepath: string) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const file = fs.createWriteStream(filepath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(true);
                });
            } else {
                reject(new Error(`Failed to download ${url}: Status Code ${res.statusCode}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function migrate() {
    console.log('Starting migration...');

    // 1. Fetch all wallpapers
    const { data: wallpapers, error } = await supabase
        .from('wallpapers')
        .select('*');

    if (error) {
        console.error('Error fetching wallpapers:', error);
        return;
    }

    console.log(`Found ${wallpapers.length} wallpapers.`);

    // 2. Create public/wallpapers directory
    const publicDir = path.join(process.cwd(), 'public', 'wallpapers');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const migrationSQL = [];

    // 3. Download and rename
    for (const wp of wallpapers) {
        if (!wp.image || !wp.image.startsWith('http')) {
            console.log(`Skipping ${wp.id} (${wp.name}): Invalid URL or already migrated -> ${wp.image}`);
            continue;
        }

        const ext = path.extname(wp.image.split('?')[0]) || '.png';
        const filename = `wallpaper-${wp.id}${ext}`; // simple naming strategy: wallpaper-{id}.png
        const localPath = path.join(publicDir, filename);
        const publicPath = `/wallpapers/${filename}`;

        console.log(`Downloading ${wp.name} to ${localPath}...`);

        try {
            await downloadImage(wp.image, localPath);
            console.log(`✔ Downloaded.`);

            // Add to SQL update list
            migrationSQL.push(`UPDATE wallpapers SET image = '${publicPath}' WHERE id = ${wp.id};`);

        } catch (err) {
            console.error(`✘ Failed to download ${wp.name}:`, err);
        }
    }

    // 4. Output SQL
    console.log('\n--- MIGRATION SQL ---');
    console.log(migrationSQL.join('\n'));
    console.log('---------------------');

    // Save SQL to file
    fs.writeFileSync('src/data/migrate_wallpapers.sql', migrationSQL.join('\n'));
    console.log('Migration SQL saved to src/data/migrate_wallpapers.sql');
}

migrate();
