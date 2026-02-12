'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sparkles, History, Crown } from 'lucide-react';

export const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'ค้นหา', icon: Search, path: '/search', color: 'cyan', activeGlow: 'shadow-[0_4px_14px_rgba(34,211,238,0.35)]', activeBg: 'bg-gradient-to-br from-cyan-400 to-cyan-500', iconColor: 'text-cyan-400', labelColor: 'text-cyan-300' },
        { name: 'ชื่อมงคล Pro', icon: Crown, path: '/premium-search', color: 'amber', activeGlow: 'shadow-[0_4px_14px_rgba(251,191,36,0.35)]', activeBg: 'bg-gradient-to-br from-amber-400 to-amber-500', iconColor: 'text-amber-400', labelColor: 'text-amber-300' },
        { name: 'ชื่อ Premium', icon: Sparkles, path: '/premium-analysis', color: 'purple', activeGlow: 'shadow-[0_4px_14px_rgba(192,132,252,0.35)]', activeBg: 'bg-gradient-to-br from-purple-400 to-purple-500', iconColor: 'text-purple-400', labelColor: 'text-purple-300' },
        { name: 'ประวัติ', icon: History, path: '/history', color: 'emerald', activeGlow: 'shadow-[0_4px_14px_rgba(52,211,153,0.35)]', activeBg: 'bg-gradient-to-br from-emerald-400 to-emerald-500', iconColor: 'text-emerald-400', labelColor: 'text-emerald-300' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full z-[60] lg:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]">
            <div className="pointer-events-auto">
                <div className="relative bg-[#0f172a]/94 backdrop-blur-2xl border-t border-white/10 shadow-[0_-4px_16px_rgba(0,0,0,0.3)] overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                    <div className="grid grid-cols-4 h-[48px] items-center relative z-10">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className="flex flex-col items-center justify-center relative group gap-0.5"
                                >
                                    <div className="relative w-7 h-7 flex items-center justify-center">
                                        <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${isActive
                                            ? `${item.activeBg} ${item.activeGlow} border border-white/30`
                                            : 'bg-white/5 border border-white/8 group-hover:bg-white/10'
                                            }`} />

                                        <div className={`relative z-10 transition-all duration-300 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                                            <Icon
                                                size={15}
                                                strokeWidth={isActive ? 2.5 : 2}
                                                className={`transition-colors duration-300 ${isActive ? 'text-white drop-shadow-sm' : `${item.iconColor} group-hover:brightness-125`}`}
                                            />
                                        </div>
                                    </div>

                                    <span className={`text-[9px] font-medium tracking-wide transition-all duration-300 leading-none ${isActive
                                        ? `${item.labelColor} font-semibold`
                                        : `${item.iconColor}/60 group-hover:${item.iconColor}`
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
