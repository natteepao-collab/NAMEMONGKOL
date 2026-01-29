'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sparkles, History, Crown } from 'lucide-react';

export const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'ค้นหา', icon: Search, path: '/search' },
        { name: 'ชื่อมงคล Pro', icon: Crown, path: '/premium-search' },
        { name: 'ชื่อ Premium', icon: Sparkles, path: '/premium-analysis' },
        { name: 'ประวัติ', icon: History, path: '/history' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-[60] lg:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]">
            <div className="mx-4 mb-4 pointer-events-auto">
                <div className="relative bg-[#0f172a]/94 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.35)] overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                    <div className="grid grid-cols-4 h-[64px] items-center relative z-10">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="flex flex-col items-center justify-center relative group"
                                >
                                    <div className="relative w-10 h-10 flex items-center justify-center mb-1">
                                        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${isActive
                                            ? 'bg-white shadow-[0_8px_20px_rgba(255,255,255,0.22)] border border-white/80'
                                            : 'bg-white/8 border border-white/12 group-hover:bg-white/12'
                                            }`} />

                                        <div className={`relative z-10 transition-all duration-300 ${isActive ? '-translate-y-0.5 scale-110' : 'group-hover:-translate-y-0.5'}`}>
                                            <Icon
                                                size={20}
                                                strokeWidth={isActive ? 2.5 : 2}
                                                className={`transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-200/85 group-hover:text-white'}`}
                                            />
                                        </div>

                                        {isActive && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
                                        )}
                                    </div>

                                    <span className={`text-[10px] font-medium tracking-wide transition-all duration-300 ${isActive
                                        ? 'text-white'
                                        : 'text-slate-200/85 group-hover:text-white'
                                        }`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
