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
        { name: 'ซื้อ Premium', icon: Sparkles, path: '/premium-analysis' },
        { name: 'ประวัติ', icon: History, path: '/history' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-[60] lg:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]">
            <div className="pointer-events-auto">
                <div className="relative bg-[#0f172a]/95 backdrop-blur-xl border-t border-x border-white/10 rounded-t-xl shadow-xl overflow-hidden">
                    {/* Top highlight line */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    <div className="grid grid-cols-4 h-[48px] items-center relative z-10">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="flex flex-col items-center justify-center relative group gap-[3px]"
                                >
                                    {/* Bordered square icon box */}
                                    <div className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all duration-300 ${isActive
                                        ? 'bg-amber-500/20 border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.25)]'
                                        : 'bg-white/5 border-white/20 group-hover:bg-white/10 group-hover:border-white/30'
                                        }`}>
                                        <Icon
                                            size={16}
                                            strokeWidth={isActive ? 2.5 : 2}
                                            className={`transition-all duration-300 ${isActive
                                                ? 'text-amber-400'
                                                : 'text-white group-hover:text-white'
                                                }`}
                                        />
                                    </div>

                                    <span className={`text-[8px] font-medium tracking-wide transition-all duration-200 ${isActive
                                        ? 'text-amber-400'
                                        : 'text-white/90 group-hover:text-white'
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
