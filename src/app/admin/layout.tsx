'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    router.push('/login?next=/admin');
                    return;
                }

                // Check user role
                const { data: profile, error } = await supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (error || profile?.role !== 'admin') {
                    console.error('Access denied: Not an admin');
                    router.push('/'); // Redirect unauthorized users to home
                    return;
                }

                setAuthorized(true);
            } catch (err) {
                console.error('Auth check failed', err);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="animate-spin text-emerald-500" />
                    <p className="text-slate-400 font-medium">Verifying Admin Access...</p>
                </div>
            </div>
        );
    }

    if (!authorized) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-emerald-500/30">
            <AdminSidebar />

            {/* Main Content Area - Adjusted margin for sidebar */}
            <main className="lg:ml-64 min-h-screen relative transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
