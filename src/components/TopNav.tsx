'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogIn, Info, User as UserIcon, LogOut, Sparkles, Zap } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';

export const TopNav = () => {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [role, setRole] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const menuRef = React.useRef<HTMLDivElement>(null);

    const fetchUserInfo = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('credits, role')
            .eq('id', userId)
            .maybeSingle();

        if (data) {
            setCredits(data.credits);
            setRole(data.role);
        } else {
            if (error) console.error('Error fetching user info:', error);
            setCredits(0);
            setRole(null);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                fetchUserInfo(user.id);
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserInfo(session.user.id);
            } else {
                setCredits(null);
                setRole(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleCreditUpdate = () => {
            if (user) fetchUserInfo(user.id);
        };

        window.addEventListener('force_credits_update', handleCreditUpdate);
        return () => {
            window.removeEventListener('force_credits_update', handleCreditUpdate);
        };
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setIsOpen(false);
    };

    // Only show on desktop (hidden on mobile/tablet)
    // Adjust breakpoint to match Sidebar (lg)
    return (
        <div className="hidden lg:flex absolute top-4 right-6 z-50 items-center gap-4">
            <Link
                href="/about"
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm backdrop-blur-md border ${pathname === '/about'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                    }`}
            >
                <Info size={16} />
                <span>เกี่ยวกับเรา</span>
            </Link>

            {user ? (
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 ring-2 ring-white/5 group-hover:scale-105 transition-transform">
                            <UserIcon size={16} />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors max-w-[100px] truncate">
                                {user.user_metadata?.name || user.email?.split('@')[0]}
                            </span>
                            {credits !== null && (
                                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                                    <Sparkles size={10} /> {credits} Credits
                                </span>
                            )}
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0f172a]/95 border border-white/10 shadow-xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                             <div className="p-3 border-b border-white/5 bg-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Credit Balance</span>
                                </div>
                                <div className="flex items-center justify-between bg-black/40 rounded-xl p-2 border border-white/5">
                                    <div className="flex items-center gap-2 text-sm text-amber-400 font-bold px-1">
                                        <Sparkles size={14} />
                                        <span>{credits ?? 0}</span>
                                    </div>
                                    <Link 
                                        href="/topup" 
                                        onClick={() => setIsOpen(false)}
                                        className="text-[10px] text-emerald-950 hover:text-emerald-900 font-bold bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5"
                                    >
                                        <Zap size={12} fill="currentColor" /> เติมเงิน
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="p-1.5">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                                >
                                    <LogOut size={16} />
                                    ออกจากระบบ
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <Link
                    href="/login"
                    className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 font-medium text-sm backdrop-blur-md border ${pathname === '/login'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-transparent hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:-translate-y-0.5'
                        }`}
                >
                    <LogIn size={16} />
                    <span>เข้าสู่ระบบ</span>
                </Link>
            )}
        </div>
    );
};
