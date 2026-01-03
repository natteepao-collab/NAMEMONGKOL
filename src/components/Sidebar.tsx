'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Info, Menu, X, Sparkles, LogIn, LogOut, User as UserIcon, ClipboardList, Crown, Zap, History as HistoryIcon } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const fetchCredits = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('credits')
            .eq('id', userId)
            .single();

        if (data) {
            setCredits(data.credits);
        } else {
            console.error('Error fetching credits:', error);
            // Default to 0 or handled by trigger if fetching fails but user exists
            setCredits(0);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                fetchCredits(user.id);
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchCredits(session.user.id);
            } else {
                setCredits(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setIsOpen(false);
    };

    const menuItems = [
        { name: 'วิเคราะห์ชื่อ', icon: Home, path: '/' },
        { name: 'ค้นหาชื่อมงคล', icon: Search, path: '/search' },
        { name: 'คัดสรรชื่อมงคล ', icon: Sparkles, path: '/premium-search' },
        { name: 'ออกแบบชื่อมงคล', icon: Crown, path: '/premium-analysis' },
        { name: 'ประวัติการใช้งาน', icon: HistoryIcon, path: '/history' },
        { name: 'ระบบคัดกรองชื่อ', icon: ClipboardList, path: '/name-analysis' },
        { name: 'เกี่ยวกับเรา', icon: Info, path: '/about' },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`lg:hidden fixed top-[calc(env(safe-area-inset-top)+0.75rem)] ${isOpen ? 'right-4 w-10 h-10 rounded-full p-0 flex items-center justify-center' : 'left-4 w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl flex items-center justify-center sm:justify-start gap-0 sm:gap-2'} z-[70] bg-white/10 text-white shadow-lg shadow-black/20 border border-white/20 backdrop-blur-md transition-all active:scale-95 hover:scale-105`}
            >
                {isOpen ? (
                    <X size={20} />
                ) : (
                    <>
                        <Menu size={20} strokeWidth={2.5} />
                        <span className="hidden sm:inline font-serif font-bold text-sm tracking-wider">MENU</span>
                    </>
                )}
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-x-0 bottom-0 top-[calc(env(safe-area-inset-top)+4rem)] bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed left-0 top-[calc(env(safe-area-inset-top)+4rem)] h-[calc(100dvh-(env(safe-area-inset-top)+4rem))] w-[86vw] max-w-sm sm:w-96 bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/10 z-40 transition-transform duration-300 ease-in-out lg:top-0 lg:h-full lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full p-5 sm:p-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
                    <div className="hidden lg:flex items-center gap-3 mb-6 lg:mb-10 pl-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="hidden sm:inline text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 tracking-tight">
                            NAMEMONGKOL
                        </span>
                    </div>

                    <nav className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;

                            // Custom Design for Premium Analysis (Large Card)
                            if (item.path === '/premium-analysis') {
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`relative group flex items-center justify-between px-4 py-3 my-3 lg:px-5 lg:py-5 lg:my-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent overflow-hidden transition-all duration-300 hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 ${isActive ? 'ring-1 ring-amber-500/50' : ''}`}
                                    >
                                        <div className="absolute left-0 top-0 h-full w-1.5 bg-amber-500 shadow-[0_0_15px_#f59e0b]" />

                                        <div className="flex items-center gap-4 pl-1">
                                            <div className="text-amber-400 animate-pulse bg-amber-500/10 p-2 rounded-lg">
                                                <item.icon size={26} />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-amber-100 font-bold leading-tight text-[16px] tracking-wide group-hover:text-white transition-colors">
                                                    {item.name}
                                                </span>
                                                <span className="text-amber-400/80 text-[11px] font-bold tracking-wider uppercase">
                                                    PREMIUM FEATURE
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg shadow-amber-500/40 transform group-hover:scale-105 transition-transform">
                                            Premium
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 lg:gap-4 px-4 py-3 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-r from-white/10 to-white/5 text-white shadow-lg shadow-black/20 border border-white/10'
                                        : 'text-slate-400 hover:bg-white/5 hover:text-white hover:pl-6'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-0 w-1 h-full bg-amber-400 rounded-r-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                    )}
                                    <item.icon
                                        className={`w-[22px] h-[22px] transition-colors ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                                            }`}
                                    />
                                    <span className="font-medium text-[16px] tracking-wide">
                                        {item.path === '/premium-search' ? (
                                            <span className="flex items-center gap-2">
                                                คัดสรรชื่อมงคล
                                                <span className="bg-emerald-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg shadow-emerald-500/20">
                                                    Pro
                                                </span>
                                            </span>
                                        ) : item.path === '/name-analysis' ? (
                                            <span className="flex items-center gap-2">
                                                ระบบคัดกรองชื่อ
                                                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                    BULK
                                                </span>
                                            </span>
                                        ) : (
                                            item.name
                                        )}
                                    </span>
                                </Link>
                            );
                        })}

                        {/* Divider */}
                        <div className="my-6 border-t border-white/5" />

                        {user ? (
                            <>
                                <div className="px-5 py-4 mb-2 rounded-2xl bg-white/5 border border-white/5">
                                    <p className="text-[11px] text-slate-500 mb-2 uppercase tracking-wider font-semibold">เข้าใช้งานโดย</p>
                                    <div className="flex items-center gap-3 text-slate-200 font-medium truncate mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 ring-2 ring-white/10">
                                            <UserIcon size={20} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm tracking-wide font-bold truncate">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
                                            <span className="text-[10px] text-slate-500">Member</span>
                                        </div>
                                    </div>
                                    {credits !== null && (
                                        <div className="flex items-center justify-between bg-black/40 rounded-xl p-1.5 pr-1.5 border border-white/5">
                                            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold px-3 py-1.5 rounded-lg">
                                                <Sparkles size={14} />
                                                <span>{credits} Credits</span>
                                            </div>
                                            <Link href="/topup" className="text-[11px] text-emerald-950 hover:text-emerald-900 font-bold bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5">
                                                <Zap size={12} fill="currentColor" /> เติมเงิน
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
                                >
                                    <LogOut className="w-[22px] h-[22px] transition-colors" />
                                    <span className="font-medium text-[15px]">ออกจากระบบ</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${pathname === '/login'
                                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-200 border border-amber-500/20 shadow-lg shadow-amber-900/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white hover:pl-6'
                                    }`}
                            >
                                <LogIn
                                    className={`w-[22px] h-[22px] transition-colors ${pathname === '/login' ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                                        }`}
                                />
                                <span className="font-medium text-[15px]">เข้าสู่ระบบ</span>
                            </Link>
                        )}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <p className="text-[10px] text-slate-600 text-center leading-relaxed font-medium">
                            © 2024 NameMongkol.com<br />
                            ศาสตร์แห่งตัวเลขเพื่อชีวิตที่ดีกว่า
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};
