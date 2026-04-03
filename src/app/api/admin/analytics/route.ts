/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Auth helper (same pattern as other admin routes)
// ---------------------------------------------------------------------------
async function createAuthedClient() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { /* Server Component context */ }
                },
            },
        },
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Unauthorized');

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') throw new Error('Forbidden');

    return supabase;
}

// ---------------------------------------------------------------------------
// GET /api/admin/analytics?type=summary|top-buttons|daily-trend
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
    try {
        const supabase = await createAuthedClient();
        const { searchParams } = new URL(request.url);

        const type = searchParams.get('type') ?? 'summary';
        const days = Math.min(Number(searchParams.get('days') ?? 7), 365);
        const dateFrom = new Date(Date.now() - days * 86_400_000).toISOString();

        switch (type) {
            case 'summary': {
                // Total events
                const { count: totalEvents } = await supabase
                    .from('user_action_events')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', dateFrom);

                // Unique users (non-null user_id)
                const { data: usersData } = await supabase
                    .from('user_action_events')
                    .select('user_id')
                    .gte('created_at', dateFrom)
                    .not('user_id', 'is', null);

                const uniqueUsers = new Set(usersData?.map((r: any) => r.user_id)).size;

                // Unique sessions
                const { data: sessionsData } = await supabase
                    .from('user_action_events')
                    .select('session_id')
                    .gte('created_at', dateFrom);

                const uniqueSessions = new Set(sessionsData?.map((r: any) => r.session_id)).size;

                // Top page
                const { data: topPageData } = await supabase
                    .from('user_action_events')
                    .select('page_path')
                    .gte('created_at', dateFrom);

                const pageCounts: Record<string, number> = {};
                topPageData?.forEach((r: any) => {
                    pageCounts[r.page_path] = (pageCounts[r.page_path] || 0) + 1;
                });
                const topPage = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';

                return NextResponse.json({
                    success: true,
                    data: { totalEvents: totalEvents ?? 0, uniqueUsers, uniqueSessions, topPage },
                });
            }

            case 'top-buttons': {
                const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);

                const { data: rows } = await supabase
                    .from('user_action_events')
                    .select('button_key, page_path, user_id')
                    .gte('created_at', dateFrom);

                // Aggregate in JS (Supabase JS client doesn't support GROUP BY)
                const map = new Map<string, { clicks: number; users: Set<string>; page: string }>();
                rows?.forEach((r: any) => {
                    const key = r.button_key;
                    if (!map.has(key)) map.set(key, { clicks: 0, users: new Set(), page: r.page_path });
                    const entry = map.get(key)!;
                    entry.clicks++;
                    if (r.user_id) entry.users.add(r.user_id);
                });

                const topButtons = [...map.entries()]
                    .map(([button_key, v]) => ({
                        button_key,
                        page_path: v.page,
                        clicks: v.clicks,
                        unique_users: v.users.size,
                    }))
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, limit);

                return NextResponse.json({ success: true, data: topButtons });
            }

            case 'daily-trend': {
                const { data: rows } = await supabase
                    .from('user_action_events')
                    .select('created_at, user_id')
                    .gte('created_at', dateFrom)
                    .order('created_at', { ascending: true });

                const dayMap = new Map<string, { clicks: number; users: Set<string> }>();
                rows?.forEach((r: any) => {
                    const day = r.created_at.slice(0, 10); // YYYY-MM-DD
                    if (!dayMap.has(day)) dayMap.set(day, { clicks: 0, users: new Set() });
                    const entry = dayMap.get(day)!;
                    entry.clicks++;
                    if (r.user_id) entry.users.add(r.user_id);
                });

                const trend = [...dayMap.entries()].map(([date, v]) => ({
                    date,
                    clicks: v.clicks,
                    unique_users: v.users.size,
                }));

                return NextResponse.json({ success: true, data: trend });
            }

            default:
                return NextResponse.json(
                    { success: false, error: `Unknown type: ${type}` },
                    { status: 400 },
                );
        }
    } catch (err: any) {
        const msg = err?.message ?? 'Server error';
        const status = msg === 'Unauthorized' ? 401 : msg === 'Forbidden' ? 403 : 500;
        return NextResponse.json({ success: false, error: msg }, { status });
    }
}
