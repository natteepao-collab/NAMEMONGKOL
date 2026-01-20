import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabaseServer';

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch names from Supabase
        const { data, error } = await supabase
            .from('auspicious_names')
            .select('name')
            .order('name', { ascending: true });

        if (error) {
            console.error('Supabase fetch error:', error);
            throw error;
        }

        const names = data?.map((d: { name: string }) => d.name) || [];

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

        // Check admin role logic here if needed, though RLS should handle it.


        // De-duplicate immediately
        const uniqueNames = [...new Set(names)].sort((a: any, b: any) => a.localeCompare(b, 'th'));

        // Prepare data for insertion
        const insertData = uniqueNames.map((name: string) => ({ name }));

        // Strategy: Replace all names. 
        // 1. Delete all existing names
        const { error: deleteError } = await supabase
            .from('auspicious_names')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (hacky way if no WHERE condition allowed usually, but Supabase allows .neq id 0)
        // Better: .gt('created_at', '1900-01-01') or similar always-true condition if .delete() requires a filter.
        // Supabase/Postgrest often requires a WHERE clause for delete to prevent accidents.

        if (deleteError) {
            console.error('Delete error:', deleteError);
            throw deleteError;
        }

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
