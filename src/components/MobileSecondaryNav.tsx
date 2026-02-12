'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Smartphone, BookOpen, Info } from 'lucide-react';

export const MobileSecondaryNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'วิเคราะห์ชื่อ', icon: Home, path: '/' },
        { name: 'วิเคราะห์เบอร์', icon: Smartphone, path: '/phone-analysis' },
        { name: 'บทความ', icon: BookOpen, path: '/articles' },
        { name: 'เกี่ยวกับเรา', icon: Info, path: '/about' },
    ];

    return (
        <>
            <div className="lg:hidden w-full fixed top-[72px] z-40 bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2 px-3 py-1.5 overflow-x-auto custom-scrollbar no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-250 border ${isActive
                                    ? 'bg-gradient-to-r from-purple-500/90 to-blue-500/90 text-white border-white/25 shadow-[0_4px_12px_rgba(139,92,246,0.25)]'
                                    : 'bg-white/6 border-white/10 text-slate-300/80 hover:bg-white/12 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                <Icon size={12} className={isActive ? 'text-white' : 'opacity-70'} />
                                <span className={`text-[10px] font-medium ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Spacer to prevent layout shift */}
            <div className="lg:hidden h-10 w-full" />
        </>
    );
};
