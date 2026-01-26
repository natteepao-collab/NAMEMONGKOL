'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Sparkles, ChevronDown, ChevronUp, CheckCircle, XCircle, Filter, X, Lock, Unlock } from 'lucide-react';

import { calculateScore } from '@/utils/numerologyUtils';
import { getDayFromName, analyzeNameSuitability } from '@/utils/thaksaUtils';
import { thaksaConfig, DayKey } from '@/data/thaksa';
import { getPrediction } from '@/utils/getPrediction';

function NameRow({ name }: { name: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const day = getDayFromName(name);
    const score = calculateScore(name);
    // Always calculate to know if it's usable on multiple days
    const suitability = useMemo(() => analyzeNameSuitability(name), [name]);

    return (
        <>
            <tr
                className={`group cursor-pointer border-b border-white/5 last:border-0 transition-all duration-300 ${isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.04]'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <td className="px-4 md:px-8 py-5">
                    <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1">
                        <div className={`p-1 rounded-full bg-white/5 transition-colors ${isExpanded ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 group-hover:text-amber-400 group-hover:bg-amber-400/10'}`}>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                        <span className="text-lg font-medium text-slate-200 group-hover:text-amber-200 transition-colors">
                            {name}
                        </span>
                    </div>
                </td>
                <td className="px-4 md:px-8 py-5 text-slate-400 group-hover:text-slate-300 transition-colors">
                    {day !== '-' && day !== 'ไม่ระบุ' ? (
                        day
                    ) : suitability.suitable.length === 8 ? (
                        <span className="text-emerald-400 font-medium">ใช้ได้ทุกวัน</span>
                    ) : suitability.suitable.length > 0 ? (
                        <span className="text-slate-400 text-sm">
                            {suitability.suitable.map(d => {
                                if (d.includes('อาทิตย์')) return 'อา.';
                                if (d.includes('จันทร์')) return 'จ.';
                                if (d.includes('อังคาร')) return 'อ.';
                                if (d.includes('พุธ (กลางวัน)')) return 'พ.(วัน)';
                                if (d.includes('พุธ (กลางคืน')) return 'พ.(คืน)';
                                if (d.includes('พฤหัส')) return 'พฤ.';
                                if (d.includes('ศุกร์')) return 'ศ.';
                                if (d.includes('เสาร์')) return 'ส.';
                                return d;
                            }).join(', ')}
                        </span>
                    ) : (
                        '-'
                    )}
                </td>
                <td className="px-4 md:px-8 py-5 text-center">
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

const ITEMS_PER_PAGE = 60;

export default function SearchPage() {
    const router = useRouter();
    const [selectedDay, setSelectedDay] = useState<DayKey | 'all'>('all');
    const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female' | 'neutral'>('all'); // NEW
    const [targetSum, setTargetSum] = useState('');
    const [isSumFocused, setIsSumFocused] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);

    // Freemium State
    const [visibleCount, setVisibleCount] = useState(10);
    const [userCredits, setUserCredits] = useState<number | null>(null);

    const [names, setNames] = useState<{ name: string; gender: string }[]>([]); // Update type
    const [loading, setLoading] = useState(true);

    // Fetch credits
    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from('user_profiles').select('credits').eq('id', user.id).maybeSingle();
                if (data) setUserCredits(data.credits);
            }
        };
        fetchCredits();
    }, []);

    // Fetch names from DB
    useEffect(() => {
        const fetchNames = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('auspicious_names')
                .select('name, gender') // Select gender
                .order('name', { ascending: true });

            if (data) {
                setNames(data.map(d => ({ name: d.name, gender: d.gender || 'neutral' })));
            } else if (error) {
                console.error('Error fetching names:', error);
            }
            setLoading(false);
        };
        fetchNames();
    }, []);

    // Calculate unique scores for datalist
    const uniqueScores = useMemo(() => {
        if (loading) return [];
        const scores = new Set(names.map(item => calculateScore(item.name)));
        return Array.from(scores).sort((a, b) => a - b);
    }, [names, loading]);

    // Filter Logic
    const filteredNames = useMemo(() => {
        if (loading) return [];
        return names.filter((item) => {
            const { name, gender } = item;

            // 1. Gender Filter
            if (selectedGender !== 'all') {
                if (selectedGender === 'male' && gender !== 'male' && gender !== 'neutral') return false;
                if (selectedGender === 'female' && gender !== 'female' && gender !== 'neutral') return false;
                if (selectedGender === 'neutral' && gender !== 'neutral') return false;
            }

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
        }).map(item => item.name); // Return just names for display
    }, [selectedDay, selectedGender, targetSum, names, loading]);

    // Reset to page 1 when filters change is now handled in event handlers



    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDay(e.target.value as DayKey | 'all');
        setVisibleCount(10); // Reset to initial 10
    };

    const handleSumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetSum(e.target.value);
        setHasTyped(true);
        setVisibleCount(10); // Reset to initial 10
    };

    const handleUnlock = async () => {
        // 1. Check Login Status
        const { data: { user } } = await supabase.auth.getUser();

        const Swal = (await import('sweetalert2')).default;

        if (!user) {
            const result = await Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'เพื่อทำการปลดล็อกรายชื่อและบันทึกประวัติ',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#3b82f6', // Blue-500
                cancelButtonColor: '#64748b'
            });

            if (result.isConfirmed) {
                router.push('/login');
            }
            return;
        }

        if ((userCredits || 0) < 5) {
            const result = await Swal.fire({
                title: 'เครดิตไม่เพียงพอ',
                text: 'การปลดล็อกต้องใช้ 5 เครดิต กดเพื่อเติมเงิน',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'เติมเครดิต',
                cancelButtonText: 'ยกเลิก',
                background: '#1e293b',
                color: '#fff',
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#64748b'
            });
            if (result.isConfirmed) router.push('/topup');
            return;
        }

        const result = await Swal.fire({
            title: 'ปลดล็อก 5 เครดิต',
            text: 'เพื่อดูรายชื่อที่เหลือทั้งหมด',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            background: '#1e293b',
            color: '#fff',
            confirmButtonColor: '#059669',
            cancelButtonColor: '#ef4444'
        });

        if (result.isConfirmed) {
            const { error } = await supabase.rpc('deduct_credits', { amount: 5 });
            if (!error) {
                setUserCredits(prev => (prev || 0) - 5);
                window.dispatchEvent(new Event('force_credits_update'));
                setVisibleCount(prev => prev + 50); // Load next 50
                Swal.fire({
                    title: 'โหลดรายชื่อสำเร็จ!',
                    text: 'เพิ่มรายชื่ออีก 50 ชื่อเรียบร้อยแล้ว',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1e293b',
                    color: '#fff'
                });
            } else {
                Swal.fire('Error', 'เกิดข้อผิดพลาดในการตัดเครดิต', 'error');
            }
        }
    };



    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-[1400px] px-4 pt-32 md:pt-32 pb-28">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-sm mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>รวมรายชื่อมงคล 2568</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 leading-tight pb-1">
                        ค้นหาชื่อมงคลฟรี: ตั้งชื่อลูก เปลี่ยนชื่อใหม่ เสริมดวงชะตา
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto mb-6">
                        รวมสุดยอดชื่อมงคลกว่า 5,000 รายชื่อ คัดเน้นๆ เฉพาะเกรด A+ ความหมายดี เป็นสิริมงคล
                        เหมาะสำหรับ <strong className="text-amber-400 font-normal">ตั้งชื่อลูก</strong> <strong className="text-amber-400 font-normal">เปลี่ยนชื่อใหม่</strong> หรือ <strong className="text-amber-400 font-normal">ตั้งชื่อเล่น</strong> ครอบคลุมทุกวันเกิด กรองง่ายตามหลักทักษาปกรณ์
                    </p>

                    {/* Pro Tip / Guidance Block */}
                    <div className="max-w-2xl mx-auto bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 text-left flex gap-4 items-start relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0 relative z-10">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-amber-200 font-semibold mb-1 text-sm">💡 ข้อแนะนำก่อนนำไปใช้:</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                รายชื่อเหล่านี้ผ่านการคัดกรองความหมายและทักษาที่ดีในเบื้องต้นแล้ว แต่เพื่อให้ได้ผลลัพธ์ที่ดีที่สุด <strong className="text-slate-200">มนุษย์ต้องมีนามสกุล</strong> เราแนะนำให้ท่านเลือกชื่อที่ชอบ 5-10 ชื่อ แล้วนำไป <a href="/" className="text-amber-400 hover:underline decoration-amber-400/30 underline-offset-4">"วิเคราะห์ชื่อร่วมกับนามสกุล"</a> อีกครั้ง เพื่อตรวจสอบผลรวมเลขศาสตร์ให้ได้เกรด A+ ที่สมพงศ์กับดวงชะตาของท่านที่สุด
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Section */}
                <div className="max-w-4xl mx-auto mb-12 space-y-4">


                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Day Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Filter className="h-4 w-4 text-slate-400" />
                            </div>
                            <select
                                value={selectedDay}
                                onChange={handleDayChange}
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

                        {/* Gender Filter */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 text-sm">เพศ</span>
                            </div>
                            <select
                                value={selectedGender}
                                onChange={(e) => {
                                    setSelectedGender(e.target.value as any);
                                    setVisibleCount(10);
                                }}
                                className="block w-full pl-12 pr-4 py-3 bg-[#1e293b]/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-xl transition-all appearance-none cursor-pointer"
                            >
                                <option value="all" className="bg-[#1e293b]">ทั้งหมด</option>
                                <option value="male" className="bg-[#1e293b]">ชาย</option>
                                <option value="female" className="bg-[#1e293b]">หญิง</option>
                                <option value="neutral" className="bg-[#1e293b]">ไม่ระบุ</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>

                        {/* Sum Filter */}
                        <div className="relative group">
                            <input
                                type="number"
                                value={targetSum}
                                onChange={handleSumChange}
                                onFocus={(e) => {
                                    setIsSumFocused(true);
                                    setHasTyped(false);
                                    e.target.select();
                                }}
                                onBlur={() => setTimeout(() => setIsSumFocused(false), 200)} // Delay to allow click
                                className="block w-full px-4 py-3 bg-[#1e293b]/80 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-xl transition-all appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="ระบุผลรวม... (หรือเลือก)"
                            />

                            <div className={`absolute top-full left-0 w-full mt-2 max-h-80 overflow-y-auto bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50 transition-all duration-200 custom-scrollbar ${isSumFocused ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
                                {uniqueScores
                                    .filter(score => (isSumFocused && !hasTyped) || !targetSum || score.toString().includes(targetSum))
                                    .map(score => {
                                        const { desc, color, level } = getPrediction(score);
                                        return (
                                            <div
                                                key={score}
                                                onClick={() => {
                                                    setTargetSum(score.toString());
                                                }}
                                                className="px-4 py-3 hover:bg-white/5 cursor-pointer text-slate-300 transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group/item"
                                            >
                                                <div className="flex flex-col flex-1 min-w-0 mr-4">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="font-medium text-slate-200 group-hover/item:text-amber-400 transition-colors">ผลรวม {score}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 ${color}`}>
                                                            {level}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-500 truncate group-hover/item:text-slate-400 transition-colors">
                                                        {desc}
                                                    </span>
                                                </div>
                                                {targetSum === score.toString() && <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />}
                                            </div>
                                        );
                                    })}
                                {uniqueScores.filter(score => !targetSum || score.toString().includes(targetSum)).length === 0 && (
                                    <div className="px-4 py-3 text-slate-500 text-center italic text-sm">
                                        ไม่พบผลรวมที่ค้นหา
                                    </div>
                                )}
                            </div>

                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                {targetSum ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTargetSum('');
                                            setHasTyped(false);
                                            setIsSumFocused(false);
                                        }}
                                        className="text-slate-400 hover:text-rose-400 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                ) : (
                                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isSumFocused ? 'rotate-180' : ''}`} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Helper / Recommendation */}
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                    <p className="text-emerald-300 text-sm md:text-base font-medium">
                        💡 คำแนะนำ: ได้ชื่อที่ต้องการแล้วอย่าลืมนำไป <a href="/" className="underline decoration-emerald-500/50 hover:text-emerald-200 transition-colors">วิเคราะห์ชื่อ - สกุล</a> ก่อนนำไปใช้ด้วยนะครับ
                    </p>
                </div>

                {/* Results Table */}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl mb-8 shadow-2xl shadow-black/20">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 border-b border-white/10 text-amber-200">
                                <th className="px-4 md:px-8 py-5 font-semibold text-lg tracking-wide">ชื่อมงคล</th>
                                <th className="px-4 md:px-8 py-5 font-semibold text-lg tracking-wide">วัน</th>
                                <th className="px-4 md:px-8 py-5 font-semibold text-lg tracking-wide text-center">ผลรวมเลขศาสตร์</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredNames.length > 0 ? (
                                <>
                                    {filteredNames.slice(0, visibleCount).map((name, index) => (
                                        <NameRow key={index} name={name} />
                                    ))}

                                    {/* Locked State / Load More Button */}
                                    {visibleCount < filteredNames.length && (
                                        <tr>
                                            <td colSpan={3} className="p-0 relative h-32 overflow-hidden">
                                                {/* Blurred content (fake rows) */}
                                                <div className="absolute inset-0 w-full h-full blur-md opacity-30 select-none pointer-events-none flex flex-col gap-4 p-4">
                                                    <div className="h-10 bg-white/10 rounded-xl w-full"></div>
                                                    <div className="h-10 bg-white/10 rounded-xl w-3/4"></div>
                                                </div>

                                                {/* Unlock Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent">
                                                    <button
                                                        onClick={handleUnlock}
                                                        className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                                                    >
                                                        <div className="p-1.5 bg-black/20 rounded-lg">
                                                            <Lock size={18} />
                                                        </div>
                                                        <span className="text-lg">โหลดเพิ่ม 50 รายชื่อ</span>
                                                        <div className="bg-black/80 text-amber-500 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1">
                                                            ใช้ 5 Credits
                                                        </div>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
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

                {filteredNames.length > 0 && (
                    <div className="mt-4 text-center text-slate-500 text-sm">
                        แสดงผล {Math.min(visibleCount, filteredNames.length)} จาก {filteredNames.length} รายชื่อ
                    </div>
                )}

                {/* FAQ Section */}
                <div className="mt-16 mb-12 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-amber-400 mb-8">
                        คำถามที่พบบ่อย (FAQ)
                    </h2>
                    <div className="space-y-4">
                        <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-4 cursor-pointer open:bg-white/[0.05] transition-colors">
                            <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                ค้นหาชื่อมงคลที่ NameMongkol เสียเงินไหม?
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="mt-3 text-slate-400 text-sm pl-4 border-l-2 border-amber-500">
                                <span className="text-emerald-400 font-bold">ฟรี! ไม่มีค่าใช้จ่าย</span> คุณสามารถค้นหาและตรวจสอบความหมายของชื่อมงคลกว่า 5,000 ชื่อได้ฟรีทันที โดยไม่มีข้อผูกมัดใดๆ
                            </p>
                        </details>

                        <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-4 cursor-pointer open:bg-white/[0.05] transition-colors">
                            <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                มีรายชื่อมงคลให้เลือกกี่ชื่อ?
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="mt-3 text-slate-400 text-sm pl-4 border-l-2 border-amber-500">
                                เรามีฐานข้อมูลชื่อมงคลที่คัดสรรมาแล้วกว่า <span className="text-amber-400 font-bold">5,000+ รายชื่อ</span> ครอบคลุมทุกวันเกิด ทั้งชายและหญิง พร้อมความหมายที่เป็นสิริมงคล
                            </p>
                        </details>

                        <details className="group bg-white/[0.03] border border-white/10 rounded-xl p-4 cursor-pointer open:bg-white/[0.05] transition-colors">
                            <summary className="font-semibold text-slate-200 list-none flex justify-between items-center">
                                เลือกชื่อจากที่นี่แล้วต้องทำอย่างไรต่อ?
                                <span className="transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <p className="mt-3 text-slate-400 text-sm pl-4 border-l-2 border-amber-500">
                                เมื่อได้ชื่อที่ถูกใจแล้ว แนะนำให้นำไป <a href="/" className="text-amber-400 hover:underline">วิเคราะห์ชื่อ-นามสกุล</a> อีกครั้งเพื่อดูผลรวมร่วมกับนามสกุลของคุณ ว่าได้เกรด A+ หรือไม่
                            </p>
                        </details>
                    </div>
                </div>


            </div>
        </div>
    );
}
