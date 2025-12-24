'use client';

import React from 'react';
import { Sidebar } from './Sidebar';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 lg:pl-64 transition-all duration-300">
                {children}
            </div>
        </div>
    );
};
