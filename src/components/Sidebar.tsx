'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Info, Menu, X, Sparkles } from 'lucide-react';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const menuItems = [
        { name: 'วิเคราะห์ชื่อ', icon: Home, path: '/' },
        { name: 'ค้นหาชื่อมงคล', icon: Search, path: '/search' },
        { name: 'เกี่ยวกับเรา', icon: Info, path: '/about' },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a]/95 backdrop-blur-xl border-r border-white/10 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                            NAMEMONGKOL
                        </span>
                    </div>

                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/5 text-amber-200 border border-amber-500/20 shadow-lg shadow-amber-900/20'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon
                                        className={`w-5 h-5 transition-colors ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                                            }`}
                                    />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
                    <p className="text-xs text-slate-500 text-center">
                        © 2024 NameMongkol.com<br />
                        ศาสตร์แห่งตัวเลขเพื่อชีวิตที่ดีกว่า
                    </p>
                </div>
            </aside>
        </>
    );
};
