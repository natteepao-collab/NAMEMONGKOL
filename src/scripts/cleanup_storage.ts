
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function clearStorage() {
    console.log('Starting Supabase Storage cleanup...');

    const bucketsToClear = ['wallpapers', 'articles'];

    for (const bucket of bucketsToClear) {
        console.log(`\nChecking bucket: ${bucket}`);

        // 1. Check if bucket exists
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucket);
        if (bucketError) {
            console.log(`Bucket '${bucket}' not found or error accessing: ${bucketError.message}`);
            continue;
        }

        // 2. List files
        let allFiles: string[] = [];
        let page = 0;
        const limit = 100;

        while (true) {
            const { data: files, error: listError } = await supabase.storage
                .from(bucket)
                .list('', { limit, offset: page * limit });

            if (listError) {
                console.error(`Error listing files in '${bucket}':`, listError);
                break;
            }

            if (!files || files.length === 0) break;

            const filePaths = files.map(f => f.name);
            allFiles = allFiles.concat(filePaths);

            if (files.length < limit) break;
            page++;
        }

        console.log(`Found ${allFiles.length} files in '${bucket}'.`);

        // 3. Delete files
        if (allFiles.length > 0) {
            console.log(`Deleting ${allFiles.length} files...`);

            // Delete in batches of 100 if needed, but remove accepts array
            // Supabase limit might be higher, try batching just in case
            const batchSize = 100;
            for (let i = 0; i < allFiles.length; i += batchSize) {
                const batch = allFiles.slice(i, i + batchSize);
                const { error: deleteError } = await supabase.storage
                    .from(bucket)
                    .remove(batch);

                if (deleteError) {
                    console.error('Error deleting batch:', deleteError);
                } else {
                    console.log(`Deleted batch ${i / batchSize + 1}`);
                }
            }
            console.log(`Bucket '${bucket}' cleared.`);
        } else {
            console.log(`Bucket '${bucket}' is already empty.`);
        }
    }
    console.log('\nSupabase Storage cleanup completed.');
}

clearStorage();
