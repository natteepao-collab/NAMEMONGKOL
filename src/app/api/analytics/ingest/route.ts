import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabaseServer';

export const dynamic = 'force-dynamic';

// Allowlist of valid event_name values
const VALID_EVENTS = new Set(['click', 'view', 'submit']);

// Max metadata JSON size (2 KB)
const MAX_METADATA_SIZE = 2048;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            event_name,
            button_key,
            page_path,
            user_id,
            session_id,
            referrer,
            metadata,
        } = body;

        // --- Validation ---
        if (!event_name || !VALID_EVENTS.has(event_name)) {
            return NextResponse.json(
                { success: false, error: 'Invalid event_name' },
                { status: 400 },
            );
        }

        if (!button_key || typeof button_key !== 'string' || button_key.length > 200) {
            return NextResponse.json(
                { success: false, error: 'Invalid button_key' },
                { status: 400 },
            );
        }

        if (!page_path || typeof page_path !== 'string' || page_path.length > 500) {
            return NextResponse.json(
                { success: false, error: 'Invalid page_path' },
                { status: 400 },
            );
        }

        if (!session_id || typeof session_id !== 'string' || session_id.length > 100) {
            return NextResponse.json(
                { success: false, error: 'Invalid session_id' },
                { status: 400 },
            );
        }

        // Validate metadata size
        const metaStr = metadata ? JSON.stringify(metadata) : '{}';
        if (metaStr.length > MAX_METADATA_SIZE) {
            return NextResponse.json(
                { success: false, error: 'metadata too large' },
                { status: 400 },
            );
        }

        // --- Insert ---
        const supabase = await createClient();

        const { error } = await supabase.from('user_action_events').insert({
            event_name,
            button_key: button_key.slice(0, 200),
            page_path: page_path.slice(0, 500),
            user_id: user_id || null,
            session_id: session_id.slice(0, 100),
            referrer: typeof referrer === 'string' ? referrer.slice(0, 500) : '',
            metadata: metadata ?? {},
        });

        if (error) {
            console.error('[analytics/ingest] insert error:', error.message);
            return NextResponse.json(
                { success: false, error: 'Failed to record event' },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { success: false, error: 'Bad request' },
            { status: 400 },
        );
    }
}
