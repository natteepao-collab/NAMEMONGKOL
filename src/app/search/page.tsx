'use client';

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, ChevronDown, ChevronUp, CheckCircle, XCircle, Filter } from 'lucide-react';
import { auspiciousNames } from '@/data/auspiciousNames';
import { calculateScore } from '@/utils/numerologyUtils';
import { getDayFromName, analyzeNameSuitability } from '@/utils/thaksaUtils';
import { thaksaConfig, DayKey } from '@/data/thaksa';

function NameRow({ name }: { name: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const day = getDayFromName(name);
    const score = calculateScore(name);
    const suitability = useMemo(() => isExpanded ? analyzeNameSuitability(name) : null, [name, isExpanded]);

    return (
        <>
            <tr
                className="hover:bg-white/5 transition-colors group cursor-pointer border-b border-white/5 last:border-0"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-amber-200 transition-colors">
                    <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        {name}
                    </div>
                </td>
                <td className="px-6 py-4 text-slate-400">
                    {day}
                </td>
                <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        {score}
                    </span>
                </td>
            </tr>
            {isExpanded && suitability && (
                <tr className="bg-white/[0.02]">
                    <td colSpan={3} className="px-6 py-4">
                        <div className="pl-6 space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="mt-1 min-w-[20px] text-emerald-400">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-semibold text-emerald-300 block mb-1">วันที่ใช้ได้ (ไม่มีกาลกิณี):</span>
                                    <div className="flex flex-wrap gap-2">
                                        {suitability.suitable.length > 0 ? (
                                            suitability.suitable.map((d, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs">
                                                    {d}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-500">- ไม่มี -</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-1 min-w-[20px] text-rose-400">
                                    <XCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-semibold text-rose-300 block mb-1">วันที่ห้ามใช้ (มีกาลกิณี):</span>
                                    <div className="flex flex-wrap gap-2">
                                        {suitability.unsuitable.length > 0 ? (
                                            suitability.unsuitable.map((d, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs">
                                                    {d}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-500">- ไม่มี -</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDay, setSelectedDay] = useState<DayKey | 'all'>('all');
    const [targetSum, setTargetSum] = useState('');

    const filteredNames = useMemo(() => {
        return auspiciousNames.filter((name) => {
            // 1. Search Term
            if (searchTerm && !name.includes(searchTerm)) return false;

            // 2. Day Filter (Suitability)
            if (selectedDay !== 'all') {
                const targetDayName = thaksaConfig[selectedDay].name;
                const suitability = analyzeNameSuitability(name);
                if (!suitability.suitable.includes(targetDayName)) return false;
            }

            // 3. Numerology Sum Filter
            if (targetSum) {
                const score = calculateScore(name);
                if (score !== parseInt(targetSum)) return false;
            }

            return true;
        });
    }, [searchTerm, selectedDay, targetSum]);

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-sm mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>รวมรายชื่อมงคล</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4">
                        ค้นหาชื่อมงคล
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        รวบรวมรายชื่อที่เป็นมงคล เปี่ยมด้วยความหมายที่ดี เพื่อความเป็นสิริมงคลแก่ชีวิต
                    </p>
                </div>

                {/* Search & Filter Section */}
                <div className="max-w-4xl mx-auto mb-12 space-y-4">
                    {/* Main Search Bar */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-11 pr-4 py-4 bg-[#1e293b]/80 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-xl transition-all"
                                placeholder="ค้นหาชื่อ..."
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Day Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-slate-400" />
                            </div>
                            <select
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value as DayKey | 'all')}
                                className="block w-full pl-11 pr-4 py-3 bg-[#1e293b]/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-xl transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">ทุกวันเกิด</option>
                                {Object.keys(thaksaConfig).map((key) => (
                                    <option key={key} value={key} className="bg-[#1e293b]">
                                        {thaksaConfig[key as DayKey].name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Sum Filter */}
                        <div className="relative">
                            <input
                                type="number"
                                value={targetSum}
                                onChange={(e) => setTargetSum(e.target.value)}
                                className="block w-full px-4 py-3 bg-[#1e293b]/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-xl transition-all"
                                placeholder="ระบุผลรวมที่ต้องการ... (เช่น 24)"
                            />
                        </div>
                    </div>
                </div>

                {/* Results Table */}
                <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/5 backdrop-blur-xl">
                    <table className="w-full text-left text-sm md:text-base">
                        <thead className="bg-white/5 text-slate-300">
                            <tr>
                                <th className="px-6 py-4 font-semibold">ชื่อมงคล</th>
                                <th className="px-6 py-4 font-semibold">วัน</th>
                                <th className="px-6 py-4 font-semibold text-center">ผลรวมเลขศาสตร์</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredNames.length > 0 ? (
                                filteredNames.map((name, index) => (
                                    <NameRow key={index} name={name} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                        ไม่พบรายชื่อที่ตรงกับเงื่อนไข
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-center text-slate-500 text-sm">
                    แสดงผล {filteredNames.length} รายชื่อ
                </div>
            </div>
        </div>
    );
}
