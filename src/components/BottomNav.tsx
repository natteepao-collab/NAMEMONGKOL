'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Crown, Sparkles, History } from 'lucide-react';

export const BottomNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'ค้นหา', icon: Search, path: '/search' },
        { name: 'ชื่อมงคล Pro', icon: Crown, path: '/premium-search' },
        { name: 'ซื้อ Premium', icon: Sparkles, path: '/premium-analysis' },
        { name: 'ประวัติ', icon: History, path: '/history' },
    ];

    return (
        <div
            className="fixed bottom-0 left-0 w-full z-[60] lg:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {/* Subtle gradient top edge */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#c9933a]/30 to-transparent" />

            <div className="bg-[#0c0e13]/95 backdrop-blur-xl grid grid-cols-4 h-[52px] px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="flex flex-col items-center justify-center gap-[3px] group relative"
                        >
                            {/* Active glow behind the icon */}
                            {isActive && (
                                <div className="absolute top-1 w-8 h-8 rounded-lg bg-[#c9933a]/15 blur-md" />
                            )}

                            {/* Compact icon box */}
                            <div
                                className={`relative flex items-center justify-center w-[32px] h-[28px] rounded-lg transition-all duration-300 ease-out
                                    ${isActive
                                        ? 'bg-gradient-to-b from-[#1f2233] to-[#171a26] border border-[#c9933a] shadow-[0_0_6px_rgba(201,147,58,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]'
                                        : 'bg-[#16181f] border border-white/40 group-hover:border-white group-hover:bg-[#1a1d26]'
                                    }`}
                            >
                                <Icon
                                    size={16}
                                    strokeWidth={isActive ? 2.3 : 1.7}
                                    className={`transition-all duration-300 ${isActive
                                            ? 'text-[#c9933a] drop-shadow-[0_0_3px_rgba(201,147,58,0.55)]'
                                            : 'text-white/80 group-hover:text-white group-active:scale-90'
                                        }`}
                                />
                            </div>

                            {/* Label */}
                            <span
                                className={`text-[9px] font-semibold tracking-wide leading-none transition-all duration-300 ${isActive
                                        ? 'text-[#c9933a]'
                                        : 'text-white/80 group-hover:text-white'
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
