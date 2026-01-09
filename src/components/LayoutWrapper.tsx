'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { TopNav } from './TopNav';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 min-w-0 lg:pl-96 transition-all duration-300 pb-20 lg:pb-0 relative">
                <TopNav />
                {children}
            </div>
            <BottomNav />
        </div>
    );
};
