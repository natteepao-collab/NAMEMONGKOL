'use client';

import React, { useEffect, useState } from 'react';
import { Users, BarChart3, Star } from 'lucide-react';

interface PublicStats {
    totalAnalyses: number;
    totalUsers: number;
    avgRating: number;
    reviewCount: number;
}

export const TrustStrip = () => {
    const [stats, setStats] = useState<PublicStats | null>(null);

    useEffect(() => {
        fetch('/api/public/stats')
            .then(res => res.json())
            .then(data => { if (data.success) setStats(data.stats); })
            .catch(() => { /* silent */ });
    }, []);

    if (!stats) return null;

    const items = [
        {
            icon: BarChart3,
            value: stats.totalAnalyses > 0 ? stats.totalAnalyses.toLocaleString() : '10,000+',
            label: 'ครั้งที่วิเคราะห์แล้ว',
            color: 'text-amber-400',
        },
        {
            icon: Users,
            value: stats.totalUsers > 0 ? `${stats.totalUsers.toLocaleString()}+` : '1,000+',
            label: 'สมาชิก',
            color: 'text-emerald-400',
        },
        {
            icon: Star,
            value: `${stats.avgRating}/5`,
            label: `จาก ${stats.reviewCount} รีวิว`,
            color: 'text-yellow-400',
        },
    ];

    return (
        <div className="w-full max-w-lg mt-4 animate-fade-in">
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                        <span className="text-xs font-bold text-slate-200">{item.value}</span>
                        <span className="text-[10px] text-slate-400">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
