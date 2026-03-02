'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Smartphone, BookOpen, Info, Hand } from 'lucide-react';

export const MobileSecondaryNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'วิเคราะห์ชื่อ', icon: Home, path: '/' },
        { name: 'วิเคราะห์เบอร์', icon: Smartphone, path: '/phone-analysis' },
        { name: 'วิเคราะห์ลายมือ', icon: Hand, path: '/palm-analysis' },
        { name: 'บทความ', icon: BookOpen, path: '/articles' },
        { name: 'เกี่ยวกับเรา', icon: Info, path: '/about' },
    ];

    return (
        <>
            <div className="lg:hidden w-full fixed top-[68px] max-[400px]:top-[64px] z-40 bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2 px-3 py-1 overflow-x-auto custom-scrollbar no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-300 border backdrop-blur-md ${isActive
                                    ? 'bg-gradient-to-r from-violet-600 to-blue-500 text-white border-white/30 shadow-[0_0_10px_rgba(139,92,246,0.5)] scale-100'
                                    : 'bg-slate-800/80 border-white/20 text-slate-200 hover:bg-slate-700 hover:text-white hover:border-white/40'
                                    }`}
                            >
                                <Icon size={13} className={isActive ? 'text-white' : 'text-slate-300'} />
                                <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'text-white' : 'text-slate-200'}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Spacer to prevent layout shift */}
            <div className="lg:hidden h-9 w-full" />
        </>
    );
};
