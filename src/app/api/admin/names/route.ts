/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabaseServer';

const PAGE_SIZE = 1000;

async function fetchAllAuspiciousNames() {
    const supabase = await createClient();
    const names: string[] = [];
    let from = 0;

    while (true) {
        const { data, error } = await supabase
            .from('auspicious_names')
            .select('name')
            .order('name', { ascending: true })
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            throw error;
        }

        const batch = data?.map((row: { name: string }) => row.name) ?? [];
        names.push(...batch);

        if (batch.length < PAGE_SIZE) {
            break;
        }

        from += PAGE_SIZE;
    }

    return names;
}

export async function GET() {
    try {
        const names = await fetchAllAuspiciousNames();

        return NextResponse.json({
            success: true,
            count: names.length,
            names: names
        });
    } catch (error: any) {
        console.error('Fetch error:', error);
        return NextResponse.json({ success: false, error: 'Failed to read names' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { names } = body;

        console.log('Admin Names POST:', { count: names?.length });

        if (!Array.isArray(names)) {
            return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Check admin role
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        // De-duplicate immediately
        const uniqueNames = [...new Set(names)].sort((a: any, b: any) => a.localeCompare(b, 'th'));

        // Prepare data for insertion
        const insertData = uniqueNames.map((name: string) => ({ name }));

        // Strategy: Replace all names. 
        // 1. Delete all existing names (using always-true condition)
        const { error: deleteError } = await supabase
            .from('auspicious_names')
            .delete()
            .gte('created_at', '1900-01-01'); // This will delete all rows (created_at is always >= 1900-01-01)

        if (deleteError) {
            console.error('Delete error:', deleteError);
            throw deleteError;
        }
        
        console.log('[Admin Names] Deleted all existing names, preparing to insert new batch...');

        // 2. Insert new names
        // Insert in chunks if necessary, but for ~600 names it should be fine in one go or batches of 100.
        const batchSize = 1000;
        for (let i = 0; i < insertData.length; i += batchSize) {
            const chunk = insertData.slice(i, i + batchSize);
            const { error: insertError } = await supabase
                .from('auspicious_names')
                .insert(chunk);

            if (insertError) {
                console.error('Insert error:', insertError);
                throw insertError;
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Saved successfully',
            count: uniqueNames.length,
            names: uniqueNames
        });

    } catch (error: any) {
        console.error('Save error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
