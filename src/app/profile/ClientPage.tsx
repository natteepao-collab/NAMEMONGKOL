'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { User as UserIcon, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ProfileClientPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUser(user);
            setLoading(false);
        };

        getUser();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-amber-500">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <UserIcon size={48} />
                    <span className="text-lg font-medium">Loading Profile...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] pb-28">
            {/* Header */}
            <header className="sticky top-0 z-10 backdrop-blur-xl bg-[#0f172a]/80 border-b border-white/5">
                <div className="max-w-2xl px-4 h-16 flex items-center gap-4">
                    <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-bold text-white tracking-wide">ข้อมูลส่วนตัว</h1>
                </div>
            </header>

            <main className="w-full max-w-[1400px] px-4 py-8 pt-6 md:pt-32">
                <div className="max-w-2xl">
                    {/* User Info Card */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                        <div className="flex items-center gap-6 mb-8 relative z-10">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white">
                                <UserIcon size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    {user?.user_metadata?.name || 'สมาชิก'}
                                </h2>
                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                    <Mail size={14} />
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1 block">Account ID</label>
                                <code className="text-xs text-slate-300 font-mono break-all">{user?.id}</code>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
