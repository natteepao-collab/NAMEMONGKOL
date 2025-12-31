'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sparkles, History } from 'lucide-react';

export const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'หน้าแรก', icon: Home, path: '/' },
        { name: 'ค้นหา', icon: Search, path: '/search' },
        { name: 'ชื่อมงคล', icon: Sparkles, path: '/premium-search' },
        { name: 'ประวัติ', icon: History, path: '/history' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-[60] lg:hidden bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] py-1 transition-all duration-300 ${isActive
                                ? 'text-amber-400'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)] transform -translate-y-1'
                                : 'bg-transparent'
                                }`}>
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'font-bold opacity-100' : 'opacity-70'
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
