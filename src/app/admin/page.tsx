'use client';

import React, { useEffect, useState } from 'react';
import { Users, CreditCard, Receipt, TrendingUp, RefreshCw } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCredits: 0,
        totalSlips: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);



    // ... (in component)

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch('/api/admin/stats', {
                headers: {
                    Authorization: `Bearer ${session?.access_token || ''}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to load stats', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'ผู้ใช้งานทั้งหมด',
            value: stats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            desc: 'Users'
        },
        {
            title: 'รายได้รวม (บาท)',
            value: `฿${stats.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            desc: 'Total Revenue'
        },
        {
            title: 'เครดิตรวมในระบบ',
            value: stats.totalCredits.toLocaleString(),
            icon: CreditCard,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            desc: 'Total Credits Distributed'
        },
        {
            title: 'รายการแจ้งโอน',
            value: stats.totalSlips.toLocaleString(),
            icon: Receipt,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            desc: 'Verified Slips'
        }
    ];

    return (
        <div className="p-6 md:p-8 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-slate-400">ภาพรวมของระบบ NameMongkol</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <card.icon size={64} className={card.color} />
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div className={`p-3 rounded-xl w-fit mb-4 ${card.bg}`}>
                                <card.icon size={24} className={card.color} />
                            </div>
                            <div>
                                <h3 className="text-slate-400 text-sm font-medium mb-1">{card.title}</h3>
                                {loading ? (
                                    <div className="h-8 w-24 bg-slate-800 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-3xl font-bold text-slate-100">{card.value}</p>
                                )}
                                <p className="text-xs text-slate-500 mt-2">{card.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Placeholder or Graph could go here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">สถานะระบบ</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                            <span className="text-slate-300">Database Status</span>
                            <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400 font-bold">Connected</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                            <span className="text-slate-300">API Status</span>
                            <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400 font-bold">Operational</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-amber-200 mb-2">Admin Note</h3>
                    <p className="text-slate-400 text-sm">
                        สถิติทั้งหมดดึงมาจากฐานข้อมูล Supabase โดยตรง <br />
                        ยอดเครดิตคือผลรวมจากทุก User Profile <br />
                        ยอดรายได้คำนวณจากตาราง Slips ที่ผ่านการตรวจสอบแล้ว
                    </p>
                </div>
            </div>
        </div>
    );
}
