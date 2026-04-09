'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Smartphone, BookOpen, Info, Hand, Sparkles } from 'lucide-react';

export const MobileSecondaryNav = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'วิเคราะห์ชื่อ', icon: Home, iconImage: '/icon/วิเคราะห์ชื่อ.png', path: '/' },
        { name: 'วิเคราะห์ออร่า', icon: Sparkles, iconImage: '/icon/วิเคราะห์ออร่า.png', path: '/aura-analysis' },
        { name: 'วิเคราะห์เบอร์', icon: Smartphone, iconImage: '/icon/วิเคราะห์เบอร์โทร.png', path: '/phone-analysis' },
        { name: 'วิเคราะห์ลายมือ', icon: Hand, iconImage: '/icon/วิเคราะห์ลายมือ.png', path: '/palm-analysis' },
        { name: 'บทความ', icon: BookOpen, path: '/articles' },
        { name: 'เกี่ยวกับเรา', icon: Info, path: '/about' },
    ];

    return (
        <>
            <div className="lg:hidden w-full fixed top-[68px] max-[400px]:top-[64px] z-40 bg-[#0f172a]/92 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 overflow-x-auto custom-scrollbar no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-all duration-300 border ${isActive
                                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/35 shadow-[0_0_12px_rgba(201,147,58,0.3)] scale-[1.02]'
                                    : 'bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-700/80 hover:text-white hover:border-white/25 active:scale-95'
                                    }`}
                            >
                                {item.iconImage ? (
                                    <Image
                                        src={item.iconImage}
                                        alt={item.name}
                                        width={22}
                                        height={22}
                                        className={`h-[22px] w-[22px] object-contain transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_4px_rgba(201,147,58,0.5)]' : 'opacity-85'}`}
                                    />
                                ) : (
                                    <Icon size={16} className={isActive ? 'text-amber-400' : 'text-slate-400'} />
                                )}
                                <span className={`text-[10.5px] font-bold tracking-wide ${isActive ? 'text-white' : 'text-slate-200'}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Spacer to prevent layout shift */}
            <div className="lg:hidden h-[42px] w-full" />
        </>
    );
};
