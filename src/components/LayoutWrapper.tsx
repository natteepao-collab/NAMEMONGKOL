'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSecondaryNav } from './MobileSecondaryNav';
import { MobileHeader } from './MobileHeader';
const BottomNav = dynamic(() => import('./BottomNav').then(mod => mod.BottomNav), { ssr: false });
import { TopNav } from './TopNav';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import dynamic from 'next/dynamic';

const WelcomeCreditModal = dynamic(() => import('./WelcomeCreditModal').then(mod => mod.WelcomeCreditModal), {
    ssr: false
});

const LiveTicker = dynamic(() => import('./LiveTicker').then(mod => mod.LiveTicker), {
    ssr: false
});


export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 min-w-0 lg:pl-[360px] transition-all duration-300 relative bg-slate-50 dark:bg-[#0f172a]">
                <MobileHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} user={user} />
                <TopNav />
                <MobileSecondaryNav />
                {children}
            </div>
            <WelcomeCreditModal user={user} />
            <LiveTicker />
            <BottomNav />
        </div>
    );
};
