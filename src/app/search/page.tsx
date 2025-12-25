'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, ChevronDown, ChevronUp, CheckCircle, XCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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
                className={`group cursor-pointer border-b border-white/5 last:border-0 transition-all duration-300 ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <td className="px-8 py-5">
                    <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1">
                        <div className={`p-1 rounded-full bg-white/5 transition-colors ${isExpanded ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 group-hover:text-amber-400 group-hover:bg-amber-400/10'}`}>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                        <span className="text-lg font-medium text-slate-200 group-hover:text-amber-200 transition-colors">
                            {name}
                        </span>
                    </div>
                </td>
                <td className="px-8 py-5 text-slate-400 group-hover:text-slate-300 transition-colors">
                    {day}
                </td>
                <td className="px-8 py-5 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 text-amber-300 font-bold border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)] group-hover:border-amber-500/40 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] group-hover:text-amber-200 group-hover:scale-110 transition-all duration-300">
                        {score}
                    </span>
                </td>
            </tr>
            {isExpanded && suitability && (
                <tr className="bg-white/[0.02] animate-fade-in">
                    <td colSpan={3} className="p-0">
                        <div className="px-8 py-6 space-y-4 border-b border-white/5 bg-gradient-to-b from-black/20 to-transparent shadow-inner">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <div className="mt-1 min-w-[24px] text-emerald-400 p-1 rounded-full bg-emerald-500/10">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-semibold text-emerald-300 block mb-2 text-sm uppercase tracking-wider">วันที่ใช้ได้ (มงคล)</span>
                                    <div className="flex flex-wrap gap-2">
                                        {suitability.suitable.length > 0 ? (
                                            suitability.suitable.map((d, i) => (
                                                <span key={i} className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm hover:bg-emerald-500/20 transition-colors">
                                                    {d}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-500 italic">- ไม่มี -</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                                <div className="mt-1 min-w-[24px] text-rose-400 p-1 rounded-full bg-rose-500/10">
                                    <XCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-semibold text-rose-300 block mb-2 text-sm uppercase tracking-wider">วันที่ห้ามใช้ (กาลกิณี)</span>
                                    <div className="flex flex-wrap gap-2">
                                        {suitability.unsuitable.length > 0 ? (
                                            suitability.unsuitable.map((d, i) => (
                                                <span key={i} className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 text-sm hover:bg-rose-500/20 transition-colors">
                                                    {d}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-500 italic">- ไม่มี -</span>
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

const ITEMS_PER_PAGE = 50;

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDay, setSelectedDay] = useState<DayKey | 'all'>('all');
    const [targetSum, setTargetSum] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Logic
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

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDay, targetSum]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredNames.length / ITEMS_PER_PAGE);
    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredNames.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [currentPage, filteredNames]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl mb-8 shadow-2xl shadow-black/20">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 border-b border-white/10 text-amber-200">
                                <th className="px-8 py-5 font-semibold text-lg tracking-wide">ชื่อมงคล</th>
                                <th className="px-8 py-5 font-semibold text-lg tracking-wide">วัน</th>
                                <th className="px-8 py-5 font-semibold text-lg tracking-wide text-center">ผลรวมเลขศาสตร์</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentItems.length > 0 ? (
                                currentItems.map((name, index) => (
                                    <NameRow key={index} name={name} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-8 py-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <Sparkles className="w-8 h-8 opacity-20" />
                                            <span>ไม่พบรายชื่อที่ตรงกับเงื่อนไข</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {filteredNames.length > ITEMS_PER_PAGE && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                        <div>
                            แสดงผล {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredNames.length)} จาก {filteredNames.length} รายชื่อ
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <span className="px-4 py-2 rounded-lg border border-white/10 bg-white/5">
                                หน้า {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {filteredNames.length > 0 && filteredNames.length <= ITEMS_PER_PAGE && (
                    <div className="mt-4 text-center text-slate-500 text-sm">
                        แสดงผล {filteredNames.length} รายชื่อ
                    </div>
                )}
            </div>
        </div>
    );
}
