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
        <div className="fixed bottom-0 left-0 w-full z-[60] lg:hidden bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around py-2 pl-20 pr-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] py-1 transition-all duration-300 group ${isActive
                                ? 'text-amber-300'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <div className={`p-2 rounded-2xl transition-all duration-300 relative ${isActive
                                ? 'bg-gradient-to-tr from-amber-500/20 to-amber-500/5 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)] -translate-y-2 scale-110'
                                : 'bg-transparent border border-transparent'
                                }`}>
                                {isActive && (
                                    <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full" />
                                )}
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                            </div>
                            <span className={`text-[10px] transition-all duration-300 ${isActive
                                ? 'font-bold text-amber-200 tracking-wide opacity-100 translate-y-0'
                                : 'font-medium opacity-70 group-hover:opacity-100'
                                }`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
