'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, Calendar, Award } from 'lucide-react';
import { premiumNamesRaw } from '@/data/premiumNamesRaw';
import { parsePremiumNames, PremiumNameData } from '@/utils/premiumDataParser';
import { Sidebar } from '@/components/Sidebar';

export default function PremiumSearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDay, setSelectedDay] = useState('All');

    // Memoize the parsed data so we only parse it once
    const allNames = useMemo(() => parsePremiumNames(premiumNamesRaw), []);

    // Filter logic
    const filteredNames = useMemo(() => {
        return allNames.filter(item => {
            const matchesSearch = item.name.includes(searchTerm) ||
                item.totalScore.toString().includes(searchTerm);
            const matchesDay = selectedDay === 'All' || item.suitableDays.includes(selectedDay);

            return matchesSearch && matchesDay;
        });
    }, [allNames, searchTerm, selectedDay]);

    const daysOfWeek = [
        'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ(กลางวัน)', 'พุธ(กลางคืน)', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">
            <Sidebar />
            <main className="lg:ml-64 transition-all duration-300 min-h-screen p-4 md:p-8 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <header className="text-center space-y-4 mb-12 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium mb-4">
                            <Sparkles size={16} />
                            <span>รายชื่อคัดพิเศษ</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">
                            Premium Name Search
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            ค้นหารายชื่อมงคลระดับพรีเมียม ที่ผ่านการคัดสรรมาอย่างดี พร้อมวิเคราะห์คะแนนและวันที่เหมาะสม
                        </p>
                    </header>

                    {/* Search & Filter Controls */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            {/* Search Input */}
                            <div className="md:col-span-8 relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-400 transition-colors">
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อ หรือ คะแนน..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium text-lg"
                                />
                            </div>

                            {/* Day Filter */}
                            <div className="md:col-span-4">
                                <select
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium text-lg appearance-none cursor-pointer"
                                >
                                    <option value="All">ทุกวันเกิด</option>
                                    {daysOfWeek.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {filteredNames.length > 0 ? (
                            filteredNames.map((item, index) => (
                                <div
                                    key={index}
                                    className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                                            {item.name}
                                        </h3>
                                        <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold">
                                            <Award size={16} />
                                            <span>{item.totalScore}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Days */}
                                        <div className="flex items-start gap-2 text-sm text-slate-400">
                                            <Calendar size={16} className="mt-1 shrink-0 text-slate-500" />
                                            <div className="flex flex-wrap gap-2">
                                                {item.suitableDays.map((day, i) => (
                                                    <span key={i} className="inline-block px-2 py-0.5 rounded bg-slate-800/50 border border-white/5 text-slate-300 text-xs">
                                                        {day}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Breakdown */}
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">ผลรวมย่อย</p>
                                            <div className="flex flex-wrap gap-2">
                                                {item.scoreBreakdown.map((score, i) => (
                                                    <span key={i} className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                                                        {score}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-slate-500 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                <Search size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-xl">ไม่พบรายชื่อที่ค้นหา</p>
                                <p className="text-sm mt-2">ลองเปลี่ยนคำค้นหา หรือเลือกวันเกิดใหม่</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
