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
                <div className="relative bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Golden Glow Top Border Effect */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />

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
                                        {/* Active Highlight Pill */}
                                        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-b from-amber-500/20 to-transparent border border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.25),inset_0_0_10px_rgba(251,191,36,0.1)]'
                                            : 'bg-transparent border border-transparent'
                                            }`} />

                                        {/* Icon */}
                                        <div className={`relative z-10 transition-all duration-300 ${isActive ? '-translate-y-0.5 scale-110' : 'group-hover:-translate-y-0.5'}`}>
                                            <Icon
                                                size={20}
                                                strokeWidth={isActive ? 2.5 : 2}
                                                className={`transition-colors duration-300 ${isActive ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-slate-400 group-hover:text-amber-200'}`}
                                            />
                                        </div>

                                        {/* Active Dot */}
                                        {isActive && (
                                            <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_4px_#fbbf24] animate-pulse z-20" />
                                        )}
                                    </div>

                                    {/* Label */}
                                    <span className={`text-[10px] font-medium tracking-wide transition-all duration-300 ${isActive
                                        ? 'text-amber-200 opacity-100'
                                        : 'text-slate-500 opacity-70 group-hover:text-slate-300'
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
