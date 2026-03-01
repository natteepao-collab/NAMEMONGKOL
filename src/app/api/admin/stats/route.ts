/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // The `setAll` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );

        // Security Check: Verify User Role
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        // 1. Total Users
        const { count: userCount, error: userError } = await supabase
            .from('user_profiles')
            .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // 2. Total Credits (Need to sum)
        // Note: .select('credits') and summing in JS might be heavy if users are many.
        // RPC is better, but let's try JS sum for now (assuming < 10k users).
        const { data: usersData, error: creditError } = await supabase
            .from('user_profiles')
            .select('credits, welcome_credits, welcome_credits_granted_at');

        if (creditError) throw creditError;
        const totalCredits = usersData?.reduce((acc, curr) => {
            let total = curr.credits || 0;
            // Include welcome_credits if not expired (30 days)
            if (curr.welcome_credits && curr.welcome_credits > 0 && curr.welcome_credits_granted_at) {
                const grantedAt = new Date(curr.welcome_credits_granted_at).getTime();
                if (Date.now() < grantedAt + 30 * 24 * 60 * 60 * 1000) {
                    total += curr.welcome_credits;
                }
            }
            return acc + total;
        }, 0) || 0;

        // 3. Total Slips count
        const { count: slipCount, error: slipError } = await supabase
            .from('slips')
            .select('*', { count: 'exact', head: true });

        if (slipError) throw slipError;

        // 4. Total Verified Revenue
        const { data: slipsData, error: revenueError } = await supabase
            .from('slips')
            .select('amount');

        if (revenueError) throw revenueError;
        const totalRevenue = slipsData?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0;

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers: userCount || 0,
                totalCredits,
                totalSlips: slipCount || 0,
                totalRevenue
            }
        });

    } catch (error: any) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
