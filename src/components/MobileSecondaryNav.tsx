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
            <div className="lg:hidden w-full fixed top-[72px] z-40 bg-[#0f172a]/92 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
                <div className="flex items-center gap-3 px-4 py-3 overflow-x-auto custom-scrollbar no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all duration-250 border ${isActive
                                    ? 'bg-white text-slate-900 border-white/80 shadow-[0_10px_22px_rgba(255,255,255,0.18)]'
                                    : 'bg-white/12 border-white/15 text-slate-100/80 hover:bg-white/18 hover:text-white hover:border-white/30'
                                    }`}
                            >
                                <Icon size={14} className={isActive ? 'text-slate-900' : 'opacity-85'} />
                                <span className={`text-xs font-medium ${isActive ? 'text-slate-900' : ''}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Spacer to prevent layout shift */}
            <div className="lg:hidden h-14 w-full" />
        </>
    );
};
