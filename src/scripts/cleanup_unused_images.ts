
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanup() {
    console.log('Starting cleanup of unused article images...');

    const imagesDir = path.join(process.cwd(), 'public', 'images', 'articles');
    if (!fs.existsSync(imagesDir)) {
        console.log('Directory not found:', imagesDir);
        return;
    }

    // 1. Get all files in directory
    const files = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.'));
    console.log(`Found ${files.length} files in ${imagesDir}`);

    // 2. Get all used images from DB
    const { data: articles, error } = await supabase
        .from('articles')
        .select('cover_image, content');

    if (error) {
        console.error('Error fetching articles:', error);
        return;
    }

    const usedImages = new Set<string>();

    articles.forEach(a => {
        if (a.cover_image) {
            const basename = path.basename(a.cover_image);
            usedImages.add(basename);
        }
        // Very basic check for images in content (e.g. Markdown or HTML)
        if (a.content) {
            files.forEach(f => {
                if (a.content.includes(f)) {
                    usedImages.add(f);
                }
            });
        }
    });

    // 3. Check codebase for hardcoded references (src/**/*)
    // We'll simplisticly read all files and check for string inclusion of filenames
    const srcDir = path.join(process.cwd(), 'src');
    const sourceFiles = await glob(`${srcDir}/**/*.{ts,tsx,js,jsx,json}`);

    console.log(`Scanning ${sourceFiles.length} source files for references...`);

    for (const srcFile of sourceFiles) {
        const content = fs.readFileSync(srcFile, 'utf-8');
        files.forEach(f => {
            if (content.includes(f)) {
                usedImages.add(f);
            }
        });
    }

    // 4. Determine unused
    const unusedFiles = files.filter(f => !usedImages.has(f));

    console.log(`\n--- Analysis Result ---`);
    console.log(`Total Files: ${files.length}`);
    console.log(`Used Files: ${usedImages.size}`);
    console.log(`Unused Files: ${unusedFiles.length}`);

    if (unusedFiles.length > 0) {
        console.log('\nDeleting unused files:');
        unusedFiles.forEach(f => {
            console.log(`- ${f}`);
            fs.unlinkSync(path.join(imagesDir, f));
        });
        console.log('\nCleanup completed.');
    } else {
        console.log('\nNo unused files found.');
    }
}

cleanup();
