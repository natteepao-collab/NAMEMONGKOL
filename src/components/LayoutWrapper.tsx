'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TopNav } from './TopNav';
import { WelcomeCreditModal } from './WelcomeCreditModal';
import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 min-w-0 lg:pl-[360px] transition-all duration-300 pb-20 lg:pb-0 relative bg-[#0f172a]">
                <TopNav />
                {children}
            </div>
            <BottomNav />
            <WelcomeCreditModal user={user} />
        </div>
    );
};
