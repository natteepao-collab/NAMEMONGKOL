'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Search, Sparkles, Calendar, Award, RotateCcw, Lock } from 'lucide-react';
import { premiumNamesRaw } from '@/data/premiumNamesRaw';
import { parsePremiumNames } from '@/utils/premiumDataParser';
import { Sidebar } from '@/components/Sidebar';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function PremiumSearchPage() {
    const router = useRouter();
    // Inputs
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDay, setSelectedDay] = useState('All');
    const [selectedScore, setSelectedScore] = useState('All');

    // Search State
    const [hasSearched, setHasSearched] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userCredits, setUserCredits] = useState<number | null>(null);

    // Load Data & Credits
    const allNames = useMemo(() => parsePremiumNames(premiumNamesRaw), []);

    const uniqueScores = useMemo(() => {
        const scores = new Set(allNames.map(item => item.totalScore));
        return Array.from(scores).sort((a, b) => a - b);
    }, [allNames]);

    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('user_profiles')
                    .select('credits')
                    .eq('id', user.id)
                    .single();
                if (data) setUserCredits(data.credits);
            }
        };
        fetchCredits();
    }, []);

    const daysOfWeek = [
        'อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ(กลางวัน)', 'พุธ(กลางคืน)', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'
    ];

    const handleSearch = async () => {
        // Check for insufficient credits first
        if (userCredits !== null && userCredits < 10) {
            const result = await Swal.fire({
                title: 'เครดิตไม่เพียงพอ',
                text: 'การค้นหาต้องใช้ 10 เครดิต ต้องการเติมเครดิตเลยหรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'เติมเครดิต',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#10b981', // Emerald 500
                cancelButtonColor: '#64748b', // Slate 500
                background: '#1e293b',
                color: '#fff',
                iconColor: '#f59e0b' // Amber
            });

            if (result.isConfirmed) {
                router.push('/topup');
            }
            return;
        }

        // Confirm Search
        const result = await Swal.fire({
            title: 'ยืนยันการค้นหา',
            text: 'ระบบจะหัก 10 เครดิตเพื่อค้นรหัสรายชื่อมงคลชุดใหม่',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน (ใช้ 10 เครดิต)',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#059669', // Emerald 600
            cancelButtonColor: '#ef4444', // Red 500
            background: '#1e293b', // Slate 800
            color: '#fff',
            iconColor: '#34d399' // Emerald 400
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);

        try {
            // 1. Deduct Credits
            const { error } = await supabase.rpc('deduct_credits', { amount: 10 });
            if (error) throw error;

            // Update local credits
            setUserCredits(prev => (prev !== null ? prev - 10 : null));

            // 2. Perform Search
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake delay for UX

            // Filter
            const filtered = allNames.filter(item => {
                const matchesSearch = searchTerm === '' ||
                    item.name.includes(searchTerm) ||
                    item.totalScore.toString().includes(searchTerm);
                const matchesDay = selectedDay === 'All' || item.suitableDays.includes(selectedDay);
                const matchesScore = selectedScore === 'All' || item.totalScore.toString() === selectedScore;

                return matchesSearch && matchesDay && matchesScore;
            });

            // Shuffle and Limit to 30
            const shuffled = [...filtered].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 20);

            setSearchResults(selected);
            setHasSearched(true);

            // 3. Save History
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('analysis_history').insert({
                    user_id: user.id,
                    type: 'premium_search',
                    input_data: { searchTerm, selectedDay, selectedScore },
                    result_data: { count: selected.length, note: 'Random 20 from filter' }
                });
            }

            // Success Alert (Optional, maybe just show results? - User asked for improved alerts, maybe a quick toast?)
            // Let's just scroll to results.

            // Swal.fire({
            //     title: 'ค้นหาสำเร็จ!',
            //     text: `พบ ${selected.length} รายชื่อ`,
            //     icon: 'success',
            //     timer: 1500,
            //     showConfirmButton: false,
            //     background: '#1e293b',
            //     color: '#fff'
            // });

        } catch (err) {
            console.error('Search Error:', err);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดำเนินการได้ในขณะนี้',
                icon: 'error',
                confirmButtonText: 'ตกลง',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setHasSearched(false);
        setSearchResults([]);
        // Keep inputs for re-search convenience? Or clear? 
        // User said "When press search new...", implying keeping inputs but allowing search again is good.
        // But "Reset" usually clears everything.
        setSearchTerm('');
        setSelectedDay('All');
        setSelectedScore('All');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">
            <Sidebar />
            <main className="lg:ml-96 transition-all duration-300 min-h-screen p-4 md:p-8 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <header className="text-center space-y-4 mb-8 pt-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
                            <Sparkles size={16} />
                            <span>Premium Database</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-200">
                            ค้นหาชื่อมงคล Pro
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                            เข้าถึงฐานข้อมูลรายชื่อมงคลกว่า {allNames.length.toLocaleString()} รายชื่อ
                            <br className="hidden md:block" />
                            แสดงผล 20 รายชื่อต่อการค้นหาโดยการสุ่มจากผลลัพธ์ที่ตรงเงื่อนไข
                        </p>
                    </header>

                    {/* Search Controls */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in-up md:mx-auto max-w-4xl relative overflow-hidden group">

                        {/* inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                            {/* Search Name */}
                            <div className="md:col-span-12">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">คำค้นหา (ชื่อ / ผลรวม)</label>
                                <div className="relative group/input">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-emerald-400 transition-colors">
                                        <Search size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="ระบุชื่อ หรือ ผลรวมที่ต้องการ..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="md:col-span-6">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">วันเกิดที่เหมาะสม</label>
                                <div className="relative">
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => setSelectedDay(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium text-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="All">ทุกวันเกิด</option>
                                        {daysOfWeek.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="md:col-span-6">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ผลรวมเลขศาสตร์</label>
                                <div className="relative">
                                    <select
                                        value={selectedScore}
                                        onChange={(e) => setSelectedScore(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium text-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="All">ทุกผลรวม</option>
                                        {uniqueScores.map(score => (
                                            <option key={score} value={score.toString()}>
                                                ผลรวม {score}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 justify-center relative z-10">
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex-1 justify-center max-w-md"
                            >
                                {isLoading ? <span className="animate-spin">⏳</span> : <Search size={20} />}
                                <span className="text-lg">ค้นหารายชื่อ</span>
                                <span className="ml-2 bg-black/20 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
                                    <Lock size={12} /> -10 เครดิต
                                </span>
                            </button>

                            {hasSearched && (
                                <button
                                    onClick={handleClear}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-2xl transition-colors"
                                >
                                    <RotateCcw size={18} />
                                    ล้างค่า
                                </button>
                            )}
                        </div>
                        {hasSearched && (
                            <p className="text-center text-slate-400 text-sm mt-4">
                                * การกดค้นหาใหม่ จะสุ่มรายชื่อใหม่และหักเครดิตทุกครั้ง
                            </p>
                        )}
                    </div>

                    {/* Results Section */}
                    {hasSearched && (
                        <div id="results-section" className="space-y-6 animate-fade-in-up">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Sparkles className="text-emerald-400" />
                                    ผลลัพธ์การค้นหา {searchResults.length > 0 ? `(แสดง 20 รายชื่อ)` : '(0)'}
                                </h2>
                            </div>

                            {searchResults.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {searchResults.map((item, index) => (
                                        <div
                                            key={index}
                                            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-3xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold">
                                                    <Award size={16} />
                                                    <span>{item.totalScore}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-start gap-2 text-sm text-slate-400">
                                                    <Calendar size={16} className="mt-1 shrink-0 text-slate-500" />
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.suitableDays.map((day: string, i: number) => (
                                                            <span key={i} className="inline-block px-2 py-0.5 rounded bg-slate-800/50 border border-white/5 text-slate-300 text-xs text-center">
                                                                {day}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-white/5">
                                                    <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">พลังเลขคู่</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.scoreBreakdown.map((score: string, i: number) => (
                                                            <span key={i} className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                                                                {score}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search size={32} className="text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">ไม่พบรายชื่อที่ตรงกับเงื่อนไข</h3>
                                    <p className="text-slate-400">ลองปรับเปลี่ยนตัวกรอง หรือค้นหาด้วยคำอื่น</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
