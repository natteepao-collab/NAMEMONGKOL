'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    BarChart3,
    MousePointerClick,
    Users,
    Globe,
    RefreshCw,
    TrendingUp,
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Summary {
    totalEvents: number;
    uniqueUsers: number;
    uniqueSessions: number;
    topPage: string;
}

interface TopButton {
    button_key: string;
    page_path: string;
    clicks: number;
    unique_users: number;
}

interface DailyTrend {
    date: string;
    clicks: number;
    unique_users: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AdminAnalyticsPage() {
    const [days, setDays] = useState(7);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [topButtons, setTopButtons] = useState<TopButton[]>([]);
    const [dailyTrend, setDailyTrend] = useState<DailyTrend[]>([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers = { Authorization: `Bearer ${session?.access_token || ''}` };
            const base = `/api/admin/analytics`;

            const [sumRes, btnRes, trendRes] = await Promise.all([
                fetch(`${base}?type=summary&days=${days}`, { headers }),
                fetch(`${base}?type=top-buttons&days=${days}&limit=20`, { headers }),
                fetch(`${base}?type=daily-trend&days=${days}`, { headers }),
            ]);

            const [sumJson, btnJson, trendJson] = await Promise.all([
                sumRes.json(),
                btnRes.json(),
                trendRes.json(),
            ]);

            if (sumJson.success) setSummary(sumJson.data);
            if (btnJson.success) setTopButtons(btnJson.data);
            if (trendJson.success) setDailyTrend(trendJson.data);
        } catch (err) {
            console.error('Failed to load analytics', err);
        } finally {
            setLoading(false);
        }
    }, [days]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Max clicks for bar chart scaling
    const maxClicks = Math.max(...dailyTrend.map((d) => d.clicks), 1);

    const summaryCards = summary
        ? [
              {
                  title: 'คลิกทั้งหมด',
                  value: summary.totalEvents.toLocaleString(),
                  icon: MousePointerClick,
                  color: 'text-blue-400',
                  bg: 'bg-blue-400/10',
                  desc: 'Total Events',
              },
              {
                  title: 'ผู้ใช้ (Unique)',
                  value: summary.uniqueUsers.toLocaleString(),
                  icon: Users,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-400/10',
                  desc: 'Logged-in Users',
              },
              {
                  title: 'Sessions',
                  value: summary.uniqueSessions.toLocaleString(),
                  icon: Globe,
                  color: 'text-amber-400',
                  bg: 'bg-amber-400/10',
                  desc: 'Unique Sessions',
              },
              {
                  title: 'หน้ายอดนิยม',
                  value: summary.topPage,
                  icon: TrendingUp,
                  color: 'text-purple-400',
                  bg: 'bg-purple-400/10',
                  desc: 'Top Page',
              },
          ]
        : [];

    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <BarChart3 className="text-emerald-400" size={32} />
                        Analytics
                    </h1>
                    <p className="text-slate-400">สถิติการคลิกปุ่มและการใช้งานเว็บไซต์</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Period selector */}
                    <div className="flex bg-slate-800 rounded-lg overflow-hidden">
                        {[7, 30, 90].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-2 text-sm font-medium transition-colors ${
                                    days === d
                                        ? 'bg-emerald-500 text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {d}d
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={fetchData}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                          <div
                              key={i}
                              className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 h-40 animate-pulse"
                          />
                      ))
                    : summaryCards.map((card, idx) => (
                          <div
                              key={idx}
                              className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden group"
                          >
                              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                  <card.icon size={64} className={card.color} />
                              </div>
                              <div className="relative z-10 flex flex-col justify-between h-full">
                                  <div className={`p-3 rounded-xl w-fit mb-4 ${card.bg}`}>
                                      <card.icon size={24} className={card.color} />
                                  </div>
                                  <div>
                                      <h3 className="text-slate-400 text-sm font-medium mb-1">
                                          {card.title}
                                      </h3>
                                      <p className={`font-bold text-slate-100 ${
                                          card.title === 'หน้ายอดนิยม' ? 'text-lg truncate' : 'text-3xl'
                                      }`}>
                                          {card.value}
                                      </p>
                                      <p className="text-xs text-slate-500 mt-2">{card.desc}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
            </div>

            {/* ---- Two-column: Top Buttons + Daily Trend ---- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Buttons Table */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">🔥 ปุ่มยอดนิยม</h3>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-10 bg-slate-800 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : topButtons.length === 0 ? (
                        <p className="text-slate-500 text-sm">ยังไม่มีข้อมูล</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-slate-400 border-b border-slate-700/50">
                                        <th className="text-left py-2 pr-4">#</th>
                                        <th className="text-left py-2 pr-4">Button Key</th>
                                        <th className="text-left py-2 pr-4">Page</th>
                                        <th className="text-right py-2 pr-4">Clicks</th>
                                        <th className="text-right py-2">Users</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topButtons.map((btn, i) => (
                                        <tr
                                            key={btn.button_key}
                                            className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="py-2 pr-4 text-slate-500">{i + 1}</td>
                                            <td className="py-2 pr-4 text-slate-200 font-mono text-xs">
                                                {btn.button_key}
                                            </td>
                                            <td className="py-2 pr-4 text-slate-400 truncate max-w-[120px]">
                                                {btn.page_path}
                                            </td>
                                            <td className="py-2 pr-4 text-right text-emerald-400 font-bold">
                                                {btn.clicks.toLocaleString()}
                                            </td>
                                            <td className="py-2 text-right text-blue-400">
                                                {btn.unique_users.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Daily Trend (Simple Bar Chart) */}
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📈 แนวโน้มรายวัน</h3>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-8 bg-slate-800 rounded animate-pulse" />
                            ))}
                        </div>
                    ) : dailyTrend.length === 0 ? (
                        <p className="text-slate-500 text-sm">ยังไม่มีข้อมูล</p>
                    ) : (
                        <div className="space-y-2">
                            {dailyTrend.map((day) => (
                                <div key={day.date} className="flex items-center gap-3">
                                    <span className="text-slate-400 text-xs w-20 shrink-0 font-mono">
                                        {day.date.slice(5)}
                                    </span>
                                    <div className="flex-1 bg-slate-800/50 rounded-full h-6 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                                            style={{
                                                width: `${Math.max((day.clicks / maxClicks) * 100, 4)}%`,
                                            }}
                                        >
                                            <span className="text-xs font-bold text-white whitespace-nowrap">
                                                {day.clicks}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-blue-400 text-xs w-16 text-right shrink-0">
                                        {day.unique_users} users
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
