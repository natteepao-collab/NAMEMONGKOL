import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '').trim();

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verify the user's JWT
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(accessToken);
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already claimed LINE bonus
    const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('line_bonus_granted')
        .eq('id', user.id)
        .maybeSingle();

    if (profile?.line_bonus_granted) {
        return NextResponse.json({ status: 'already_claimed' });
    }

    // Create a new one-time token (10-minute expiry set by DB default)
    const { data: tokenRecord, error: tokenError } = await supabaseAdmin
        .from('line_verification_tokens')
        .insert({ user_id: user.id })
        .select('token, expires_at')
        .single();

    if (tokenError || !tokenRecord) {
        console.error('Failed to create verification token:', tokenError);
        return NextResponse.json({ error: 'Failed to create token' }, { status: 500 });
    }

    // Build LINE OA deep link — user opens LINE and it pre-fills the verify message
    const lineOaId = process.env.LINE_OA_ID || 'namemongkol';
    const message = `verify:${tokenRecord.token}`;
    const lineUrl = `https://line.me/R/oaMessage/@${lineOaId}/?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
        status: 'pending',
        lineUrl,
        expiresAt: tokenRecord.expires_at,
    });
}
