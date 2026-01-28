'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Sparkles, UserPlus, LogIn, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { User } from '@supabase/supabase-js';

interface MobileHeaderProps {
    onMenuClick: () => void;
    user: User | null;
}

export const MobileHeader = ({ onMenuClick, user }: MobileHeaderProps) => {
    return (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-[72px] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 flex items-center px-4 justify-between transition-all duration-300">
            {/* Left: Menu Button */}
            <div className="flex items-center gap-3 relative z-20">
                <button
                    onClick={onMenuClick}
                    className="p-2.5 text-amber-500 hover:bg-amber-500/10 rounded-2xl border border-amber-500/30 dark:border-amber-500/50 transition-all active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.15)]"
                    aria-label="Open Menu"
                >
                    <Menu size={20} className="stroke-[2.5]" />
                </button>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-fit ml-[-12px]">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/10 mr-1">
                        <Sparkles size={16} className="text-white drop-shadow-md" />
                    </div>
                    <div className="flex items-baseline tracking-tight">
                        <span className="text-base font-bold text-slate-800 dark:text-white font-sans mr-[1px]">Name</span>
                        <span className="text-base font-bold text-amber-500 dark:text-amber-400 font-sans">Mongkol</span>
                    </div>
                </Link>
            </div>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-2 relative z-20">
                <div className="mr-1">
                    <ThemeToggle />
                </div>
                {!user ? (
                    <>
                        <Link
                            href="/register"
                            className="w-9 h-9 rounded-xl bg-amber-600 hover:bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-600/20 transition-all active:scale-95"
                            aria-label="Register"
                        >
                            <UserPlus size={18} strokeWidth={2.5} />
                        </Link>
                        <Link
                            href="/login"
                            className="w-9 h-9 rounded-xl bg-amber-600 hover:bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-600/20 transition-all active:scale-95"
                            aria-label="Login"
                        >
                            <LogIn size={18} strokeWidth={2.5} />
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={onMenuClick}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-amber-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                        <UserIcon size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};
