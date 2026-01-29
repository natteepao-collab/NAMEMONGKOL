'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, Info, Sparkles, LogIn, LogOut, User as UserIcon, ClipboardList, Crown, Zap, History as HistoryIcon, Settings, Image as ImageIcon, BookOpen, Smartphone, ChevronDown, MessageCircle } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { LineOAButton } from './LineOAButton';
import { useLanguage } from './LanguageProvider';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useLanguage();

    // State for collapsible menus (currently unused but kept for future submenus)
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const fetchUserInfo = async (userId: string) => {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('credits, role')
            .eq('id', userId)
            .maybeSingle();

        if (data) {
            setCredits(data.credits);
            setRole(data.role);
        } else {
            if (error) console.error('Error fetching user info:', error);
            setCredits(0);
            setRole(null);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                fetchUserInfo(user.id);
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserInfo(session.user.id);
            } else {
                setCredits(null);
                setRole(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleCreditUpdate = () => {
            if (user) fetchUserInfo(user.id);
        };

        window.addEventListener('force_credits_update', handleCreditUpdate);

        return () => {
            window.removeEventListener('force_credits_update', handleCreditUpdate);
        };
    }, [user]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        onClose();
    };

    type MenuItem = {
        key: string;
        nameKey: string;
        icon: React.ElementType;
        path: string;
        mobileOnly?: boolean;
        subItems?: MenuItem[];
    };

    const baseMenuItems: MenuItem[] = [
        { key: 'analyze', nameKey: 'sidebar.analyzeName', icon: Home, path: '/' },
        { key: 'phone', nameKey: 'sidebar.phoneAnalysis', icon: Smartphone, path: '/phone-analysis' },
        { key: 'reviews', nameKey: 'sidebar.reviews', icon: MessageCircle, path: '/reviews' },
        { key: 'articles', nameKey: 'sidebar.articles', icon: BookOpen, path: '/articles' },
        { key: 'search', nameKey: 'sidebar.search', icon: Search, path: '/search' },
        { key: 'premium-search', nameKey: 'sidebar.premiumSearch', icon: Sparkles, path: '/premium-search' },
        { key: 'premium-analysis', nameKey: 'sidebar.premiumAnalysis', icon: Crown, path: '/premium-analysis' },
        { key: 'wallpapers', nameKey: 'sidebar.wallpapers', icon: ImageIcon, path: '/wallpapers' },
        { key: 'history', nameKey: 'sidebar.history', icon: HistoryIcon, path: '/history' },
        { key: 'name-analysis', nameKey: 'sidebar.bulkNameFilter', icon: ClipboardList, path: '/name-analysis' },
        { key: 'about', nameKey: 'sidebar.about', icon: Info, path: '/about', mobileOnly: true },
    ];

    const menuItems: MenuItem[] = [...baseMenuItems];

    if (role === 'admin') {
        menuItems.push(
            { key: 'admin-articles', nameKey: 'sidebar.adminArticles', icon: BookOpen, path: '/admin/articles' },
            { key: 'admin-users', nameKey: 'sidebar.adminUsers', icon: UserIcon, path: '/admin/users' },
            { key: 'admin-settings', nameKey: 'sidebar.adminSettings', icon: Settings, path: '/admin/settings' }
        );
    }

    const toggleSubMenu = (menuName: string) => {
        setExpandedMenu(expandedMenu === menuName ? null : menuName);
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => onClose()}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-80 lg:w-[360px] bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full px-5 pb-6 pt-20 lg:p-6 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
                    {/* Header */}
                    <div className="hidden lg:flex items-center gap-3 px-2 mb-8 mt-4">
                        <div className="relative shrink-0">
                            <div className="absolute -inset-1 bg-amber-500/20 rounded-2xl blur-md opacity-50"></div>
                            <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
                                <Sparkles size={26} className="text-white drop-shadow-md" />
                            </div>
                        </div>
                        <div className="flex items-baseline tracking-tight">
                            <span className="text-[26px] font-bold text-slate-900 dark:text-white font-sans mr-[1px]">Name</span>
                            <span className="text-[26px] font-bold text-amber-500 dark:text-amber-400 font-sans">Mongkol</span>
                        </div>
                    </div>

                    <nav className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        {menuItems.map((item) => {
                            const label = t(item.nameKey, item.nameKey);

                            // Handle Items with Submenu
                            if (item.subItems) {
                                const isExpanded = expandedMenu === item.key;
                                const hasActiveChild = item.subItems.some(sub => pathname === sub.path);
                                const isParentActive = pathname === item.path;
                                const isMenuExpandedOrActive = isExpanded || hasActiveChild;

                                return (
                                    <div key={item.key} className="space-y-1">
                                        <div
                                            className={`flex items-center justify-between w-full rounded-xl lg:rounded-2xl transition-all duration-200 group relative overflow-hidden ${isParentActive
                                                ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5 text-slate-900 dark:text-white shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-200 dark:border-white/10'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {isParentActive && (
                                                <div className="absolute left-0 top-0 w-1 h-full bg-amber-400 rounded-r-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                            )}

                                            <Link
                                                href={item.path}
                                                onClick={() => onClose()}
                                                className="flex-1 flex items-center gap-3 lg:gap-4 px-4 py-3 lg:px-5 lg:py-4"
                                            >
                                                <item.icon className="w-[22px] h-[22px]" />
                                                <span className="font-medium text-[16px] tracking-wide">{label}</span>
                                            </Link>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    toggleSubMenu(item.key);
                                                }}
                                                className="p-3 lg:p-4 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                            >
                                                <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>

                                        {/* Submenu */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isMenuExpandedOrActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="pt-1 pb-1 space-y-1">
                                                {item.subItems.map(subItem => {
                                                    const isSubActive = pathname === subItem.path;
                                                    const subLabel = t(subItem.nameKey, subItem.nameKey);
                                                    return (
                                                        <Link
                                                            key={subItem.path}
                                                            href={subItem.path}
                                                            onClick={(e) => {
                                                                onClose();
                                                                // Force reload to clean URL if clicking "Analyze Phone" while already on the page
                                                                if (subItem.path === '/phone-analysis' && pathname === '/phone-analysis') {
                                                                    e.preventDefault();
                                                                    window.location.href = '/phone-analysis';
                                                                }
                                                            }}
                                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 border-l-2 ml-4 ${isSubActive
                                                                ? 'border-amber-500 dark:border-amber-400 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white'
                                                                : 'border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                                                                }`}
                                                        >
                                                            <subItem.icon size={18} className={isSubActive ? 'text-amber-400' : 'opacity-70'} />
                                                            <span className="text-[14px]">
                                                                {subLabel}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // Custom Design for Premium Analysis
                            if (item.path === '/premium-analysis') {
                                const premiumLabel = t('sidebar.premiumAnalysis', 'Premium Name Design');
                                const premiumBadge = t('sidebar.premiumBadge', 'Premium');
                                const premiumFeature = t('sidebar.premiumFeature', 'Premium Feature');
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => onClose()}
                                        className="group relative flex items-center justify-between px-3 py-3 mx-0 lg:mx-2 my-2 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/50 overflow-hidden hover:bg-slate-50 dark:hover:bg-[#252f44] transition-all duration-300 shadow-lg shadow-black/5 dark:shadow-black/20"
                                    >
                                        {/* Left Accent Bar & Glow */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
                                        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-amber-500/20 to-transparent pointer-events-none"></div>

                                        <div className="flex items-center gap-3 relative z-10 pl-3">
                                            {/* Icon Box */}
                                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-black/40 flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/5 shadow-inner group-hover:border-amber-500/30 transition-colors">
                                                <item.icon size={22} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                            </div>

                                            {/* Text */}
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-slate-100 font-bold text-[15px] leading-tight mb-0.5 group-hover:text-black dark:group-hover:text-white transition-colors">{premiumLabel}</span>
                                                <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase">{premiumFeature}</span>
                                            </div>
                                        </div>

                                        {/* Badge */}
                                        <span className="relative z-10 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-amber-500/20 whitespace-nowrap scale-95 uppercase tracking-wide group-hover:scale-100 transition-transform">
                                            {premiumBadge}
                                        </span>
                                    </Link>
                                );
                            }

                            // Regular Items
                            const isActive = pathname === item.path;
                            const defaultLabel = t(item.nameKey, item.nameKey);
                            const proBadge = t('sidebar.proBadge', 'Pro');
                            const bulkBadge = t('sidebar.bulkBadge', 'Bulk');
                            const premiumBadge = t('sidebar.premiumBadge', 'Premium');
                            const premiumFeature = t('sidebar.premiumFeature', 'Premium Feature');
                            const newBadge = t('sidebar.newBadge', 'New');
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => onClose()}
                                    className={`flex items-center gap-3 lg:gap-4 px-4 py-3 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5 text-slate-900 dark:text-white shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-200 dark:border-white/10'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:pl-6'
                                        } ${item.mobileOnly ? 'lg:hidden' : ''}`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-0 w-1 h-full bg-amber-400 rounded-r-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                                    )}
                                    <item.icon
                                        className={`w-[22px] h-[22px] transition-colors ${isActive || item.path === '/premium-search' || item.path === '/premium-analysis'
                                            ? 'text-amber-400'
                                            : 'text-slate-500 group-hover:text-slate-300'
                                            } ${item.path === '/premium-analysis' ? 'animate-pulse' : ''}`}
                                    />
                                    <span className="font-medium text-[16px] tracking-wide w-full">
                                        {item.path === '/premium-search' ? (
                                            <span className="flex items-center gap-2">
                                                {defaultLabel}
                                                <span className="bg-emerald-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg shadow-emerald-500/20">
                                                    {proBadge}
                                                </span>
                                            </span>
                                        ) : item.path === '/name-analysis' ? (
                                            <span className="flex items-center gap-2">
                                                {defaultLabel}
                                                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                                    {bulkBadge}
                                                </span>
                                            </span>
                                        ) : item.path === '/premium-analysis' ? (
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex flex-col leading-tight">
                                                    <span className="text-slate-900 dark:text-slate-100 font-bold text-[15px]">{defaultLabel}</span>
                                                    <span className="text-[10px] font-bold text-amber-500 tracking-wider uppercase mt-0.5">{premiumFeature}</span>
                                                </div>
                                                <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg shadow-amber-500/20 ml-2 whitespace-nowrap">
                                                    {premiumBadge}
                                                </span>
                                            </div>
                                        ) : (
                                            defaultLabel
                                        )}
                                        {item.path === '/wallpapers' && (
                                            <span className="bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-lg shadow-pink-500/20 ml-2 animate-pulse">
                                                {newBadge}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            );
                        })}

                        <div className="my-6 border-t border-slate-200 dark:border-white/5 lg:hidden" />

                        {user ? (
                            <div className="lg:hidden">

                                <div className="px-5 py-4 mb-2 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <p className="text-[11px] text-slate-500 mb-2 uppercase tracking-wider font-semibold">{t('sidebar.loggedInAs', 'Logged in as')}</p>
                                    <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium truncate mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 ring-2 ring-white/10">
                                            <UserIcon size={20} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm tracking-wide font-bold truncate">{user.user_metadata?.name || user.email?.split('@')[0]}</span>
                                            <span className="text-[10px] text-slate-500">{t('sidebar.member', 'Member')}</span>
                                        </div>
                                    </div>
                                    {credits !== null && (
                                        <div className="flex items-center justify-between bg-white dark:bg-black/40 rounded-xl p-1.5 pr-1.5 border border-slate-200 dark:border-white/5">
                                            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold px-3 py-1.5 rounded-lg">
                                                <Sparkles size={14} />
                                                <span>{credits} {t('nav.credits', 'Credits')}</span>
                                            </div>
                                            <Link href="/topup" onClick={() => onClose()} className="text-[11px] text-emerald-950 hover:text-emerald-900 font-bold bg-emerald-400 hover:bg-emerald-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5">
                                                <Zap size={12} fill="currentColor" /> {t('nav.topup')}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
                                >
                                    <LogOut className="w-[22px] h-[22px] transition-colors" />
                                    <span className="font-medium text-[15px]">{t('nav.logout')}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="lg:hidden space-y-3 px-2">
                                <Link
                                    href="/login"
                                    onClick={() => onClose()}
                                    className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white font-medium transition-all group border border-slate-200 dark:border-white/5"
                                >
                                    <LogIn size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                                    <span>{t('nav.login')}</span>
                                </Link>
                            </div>
                        )}

                        {/* Line OA Button */}
                        <div className="mt-6 mb-20 lg:mb-6">
                            <LineOAButton />
                        </div>

                    </nav>
                </div>
            </aside>
        </>
    );
};
