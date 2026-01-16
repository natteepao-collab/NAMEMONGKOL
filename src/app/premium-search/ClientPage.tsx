
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
// import Swal from 'sweetalert2';
import { Search, Sparkles, Calendar, Award, RotateCcw, Lock, ChevronDown } from 'lucide-react';
import { premiumNamesRaw } from '@/data/premiumNamesRaw';
import { parsePremiumNames, PremiumNameData } from '@/utils/premiumDataParser';

import { supabase } from '@/utils/supabase';
import { getPrediction } from '@/utils/getPrediction';
import { useRouter } from 'next/navigation';
import { thaksaConfig } from '@/data/thaksaConfig';
import { DayKey } from '@/types';

type LeadingCharType = 'Any' | 'Dech' | 'Si';

const thaiDayToKey: Record<string, DayKey> = {
    'อาทิตย์': 'sunday',
    'จันทร์': 'monday',
    'อังคาร': 'tuesday',
    'พุธ(กลางวัน)': 'wednesday',
    'พุธ(กลางคืน)': 'wednesday_night',
    'พฤหัสบดี': 'thursday',
    'ศุกร์': 'friday',
    'เสาร์': 'saturday'
};

function ScoreDropdown({
    value,
    onChange,
    scores,
    disabled,
}: {
    value: string;
    onChange: (value: string) => void;
    scores: number[];
    disabled: boolean;
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            const root = rootRef.current;
            if (!root) return;
            const target = event.target;
            if (target instanceof Node && !root.contains(target)) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('touchstart', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('touchstart', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    useEffect(() => {
        if (disabled) setOpen(false);
    }, [disabled]);

    const selectedLabel = value ? `ผลรวม ${value}` : 'ทุกผลรวม';

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(v => !v)}
                className={`block w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all cursor-pointer font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed text-left flex items-center justify-between ${open ? 'rounded-b-none border-b-white/5' : ''
                    }`}
            >
                <span>{selectedLabel}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>



            {open && (
                <div className="absolute left-0 right-0 top-full mt-0 z-[200] max-h-80 overflow-y-auto bg-[#0c1224] border border-white/10 border-t-0 rounded-xl rounded-t-none shadow-[0_20px_60px_rgba(0,0,0,0.45)] custom-scrollbar">
                    <button
                        type="button"
                        onClick={() => {
                            onChange('');
                            setOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left transition-colors border-b border-white/5 ${value === ''
                            ? 'bg-[#1d4ed8] text-white'
                            : 'text-slate-200 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        ทุกผลรวม
                    </button>
                    {scores.map(score => {
                        const { desc, color, level } = getPrediction(score);
                        return (
                            <button
                                key={score}
                                type="button"
                                onClick={() => {
                                    onChange(score.toString());
                                    setOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left transition-colors border-b border-white/5 last:border-0 flex items-center justify-between group/item ${value === score.toString()
                                    ? 'bg-[#1d4ed8]/20 text-white'
                                    : 'text-slate-200 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex flex-col flex-1 min-w-0 mr-4">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`font-medium transition-colors ${value === score.toString() ? 'text-white' : 'text-slate-200 group-hover/item:text-amber-400'}`}>
                                            ผลรวม {score}
                                        </span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 ${color}`}>
                                            {level}
                                        </span>
                                    </div>
                                    <span className={`text-xs truncate transition-colors ${value === score.toString() ? 'text-slate-300' : 'text-slate-500 group-hover/item:text-slate-400'}`}>
                                        {desc}
                                    </span>
                                </div>
                                {value === score.toString() && <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function PremiumSearchPage() {
    const router = useRouter();
    // Inputs
    // Inputs
    // const [searchTerm, setSearchTerm] = useState(''); // Removed
    const [selectedDay, setSelectedDay] = useState('All');
    const [selectedGender, setSelectedGender] = useState('all');
    const [targetScore, setTargetScore] = useState('');
    const [leadingCharType, setLeadingCharType] = useState<LeadingCharType>('Any');

    // Search State
    const [hasSearched, setHasSearched] = useState(false);
    const [searchResults, setSearchResults] = useState<PremiumNameData[]>([]);
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
                    .maybeSingle();
                if (data) setUserCredits(data.credits);
            }
        };
        fetchCredits();
    }, []);

    const daysOfWeek = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ(กลางวัน)', 'พุธ(กลางคืน)', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

    const handleSearch = async () => {
        const Swal = (await import('sweetalert2')).default;
        // Check Authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            const result = await Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'ท่านจำเป็นต้องเข้าสู่ระบบก่อนใช้งานฟีเจอร์ค้นหาชื่อมงคลขั้นสูง',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'เข้าสู่ระบบ',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#f59e0b',
                background: '#1e293b',
                color: '#fff'
            });

            if (result.isConfirmed) {
                router.push('/login');
            }
            return;
        }

        // Check for insufficient credits first
        if (userCredits !== null && userCredits < 15) {
            const result = await Swal.fire({
                title: 'เครดิตไม่เพียงพอ',
                text: 'การค้นหาต้องใช้ 15 เครดิต ต้องการเติมเครดิตเลยหรือไม่?',
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
            text: 'ระบบจะหัก 15 เครดิตเพื่อค้นรหัสรายชื่อมงคลชุดใหม่',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน (ใช้ 15 เครดิต)',
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
            const { error } = await supabase.rpc('deduct_credits', { amount: 15 });
            if (error) throw error;

            // Update local credits
            setUserCredits(prev => (prev !== null ? prev - 15 : null));
            window.dispatchEvent(new Event('force_credits_update'));

            // 2. Perform Search
            await new Promise(resolve => setTimeout(resolve, 800)); // Fake delay for UX

            // Filter
            // Filter
            const filtered = allNames.filter(item => {
                // 1. Filter by Score (if selected)
                const matchesScore = !targetScore || item.totalScore.toString() === targetScore;

                // 2. Filter by Gender (if selected)
                let matchesGender = true;
                if (selectedGender !== 'all') {
                    if (selectedGender === 'male' && item.gender !== 'male' && item.gender !== 'neutral') matchesGender = false;
                    if (selectedGender === 'female' && item.gender !== 'female' && item.gender !== 'neutral') matchesGender = false;
                    if (selectedGender === 'neutral' && item.gender !== 'neutral') matchesGender = false;
                }

                // 3. Filter by Day (if selected)
                const matchesDay = selectedDay === 'All' || item.suitableDays.includes(selectedDay);

                // 3. Filter by Leading Character (if Day is selected and Filter is active)
                let matchesLeadingChar = true;
                if (selectedDay !== 'All' && leadingCharType !== 'Any') {
                    const dayKey = thaiDayToKey[selectedDay];
                    if (dayKey && thaksaConfig[dayKey]) {
                        const firstChar = item.name.charAt(0);
                        const config = thaksaConfig[dayKey];

                        if (leadingCharType === 'Dech') {
                            matchesLeadingChar = config.dech.includes(firstChar);
                        } else if (leadingCharType === 'Si') {
                            matchesLeadingChar = config.si.includes(firstChar);
                        }
                    }
                }

                return matchesScore && matchesGender && matchesDay && matchesLeadingChar;
            });

            // Shuffle and Limit to 30
            const shuffled = [...filtered].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 20);

            setSearchResults(selected);
            setHasSearched(true);

            // 3. Save History (Only if user exists, but we checked logic)
            // Note: If you want to force login, you might handle earlier.
            // 3. Save History (Only if user exists, but we checked logic)
            // Note: If you want to force login, you might handle earlier.
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('analysis_history').insert({
                    user_id: user.id,
                    type: 'gacha',
                    input_data: {
                        selectedDay,
                        selectedScore: targetScore || 'All',
                        leadingChar: leadingCharType
                    },
                    result_data: selected.map(item => ({
                        name: item.name,
                        totalScore: item.totalScore,
                        meaning: `เหมาะกับวัน: ${item.suitableDays.join(', ')}`,
                        notes: item.scoreBreakdown
                    }))
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
        // setSearchTerm(''); // Gone
        setLeadingCharType('Any');
        setSelectedDay('All');
        setSelectedGender('all');
        setTargetScore('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">

            <main className="w-full max-w-[1400px] transition-all duration-300 min-h-screen px-4 pt-24 md:pt-32 pb-8 relative">
                {/* Background Gradients */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-6xl space-y-8">
                    {/* Header */}
                    <header className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-pulse">
                            <Sparkles size={14} />
                            <span>Premium Database</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                            ค้นหาชื่อมงคล Pro
                        </h1>
                        <div className="max-w-2xl mx-auto space-y-2">
                            <p className="text-slate-400">
                                เข้าถึงฐานข้อมูลรายชื่อมงคลกว่า {allNames.length.toLocaleString()} รายชื่อ คัดสรรมาอย่างดี
                            </p>
                            <p className="text-emerald-300 font-medium text-lg">
                                เลือกใช้อักษรทุกวรรค ยกเว้นวรรคกาลกิณี นำหน้าชื่อ
                            </p>

                            <div className="mt-4 mx-auto w-fit bg-[#0F1C2E] border border-emerald-500/30 rounded-xl px-6 py-3 shadow-lg shadow-emerald-900/20">
                                <p className="text-emerald-400 font-medium text-sm md:text-base">
                                    💡 คำแนะนำ: ได้ชื่อที่ต้องการแล้วอย่าลืมนำไป <a href="/" className="underline decoration-emerald-500/50 hover:text-emerald-300 transition-colors">วิเคราะห์ชื่อ - สกุล</a> ก่อนนำไปใช้ด้วยนะครับ
                                </p>
                            </div>
                            <p className="text-slate-500 text-sm pt-4">
                                แสดงผล 20 รายชื่อต่อการค้นหาโดยการสุ่มจากผลลัพธ์ที่ตรงเงื่อนไข
                            </p>
                        </div>
                    </header>

                    {/* Search Controls */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in-up md:mx-auto max-w-4xl relative overflow-visible group">

                        {/* inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
                            {/* Filters */}
                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">วันเกิดที่เหมาะสม</label>
                                <div className="relative">
                                    <select
                                        value={selectedDay}
                                        onChange={(e) => {
                                            const newVal = e.target.value;
                                            setSelectedDay(newVal);
                                            // Reset leading char if switching to 'All'
                                            if (newVal === 'All') setLeadingCharType('Any');
                                        }}
                                        className="block w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all appearance-none cursor-pointer font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isLoading}
                                    >
                                        <option value="All">ทุกวันเกิด</option>
                                        {daysOfWeek.map(day => (
                                            <option key={day} value={day} className="bg-[#0f172a]">
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ผลรวมเลขศาสตร์</label>
                                <ScoreDropdown value={targetScore} onChange={setTargetScore} scores={uniqueScores} disabled={isLoading} />
                            </div>

                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">เพศ</label>
                                <div className="relative">
                                    <select
                                        value={selectedGender}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                        className="block w-full px-4 py-4 bg-black/40 border border-white/10 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-xl transition-all appearance-none cursor-pointer font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isLoading}
                                    >
                                        <option value="all" className="bg-[#0f172a]">ทั้งหมด</option>
                                        <option value="male" className="bg-[#0f172a]">ชาย</option>
                                        <option value="female" className="bg-[#0f172a]">หญิง</option>
                                        <option value="neutral" className="bg-[#0f172a]">ไม่ระบุ</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Leading Character Filter (Replaces Search) */}
                            <div className="md:col-span-12">
                                <label className="block text-xs font-bold uppercase tracking-wider mb-4 text-slate-400 transition-colors">
                                    อักษรนำ {selectedDay === 'All' && <span className="text-amber-500/80 ml-2 normal-case font-normal">(ผลลัพธ์จะแสดงเมื่อเลือกวันเกิด)</span>}
                                </label>
                                <div className="flex flex-wrap items-center gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name="leadingChar"
                                                value="Dech"
                                                checked={leadingCharType === 'Dech'}
                                                onChange={() => setLeadingCharType('Dech')}
                                                className="peer appearance-none w-6 h-6 border-2 border-slate-500 rounded-full bg-transparent checked:border-emerald-500 checked:bg-emerald-500/20 transition-all"
                                            />
                                            <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className={`text-lg font-medium transition-colors ${leadingCharType === 'Dech' ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                            วรรคเดช (อำนาจบารมี / เลื่อนขั้นเลื่อนตำแหน่ง)
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name="leadingChar"
                                                value="Si"
                                                checked={leadingCharType === 'Si'}
                                                onChange={() => setLeadingCharType('Si')}
                                                className="peer appearance-none w-6 h-6 border-2 border-slate-500 rounded-full bg-transparent checked:border-emerald-500 checked:bg-emerald-500/20 transition-all"
                                            />
                                            <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-emerald-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className={`text-lg font-medium transition-colors ${leadingCharType === 'Si' ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                            วรรคศรี (โชคลาภ / เสน่ห์ความรัก)
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="radio"
                                                name="leadingChar"
                                                value="Any"
                                                checked={leadingCharType === 'Any'}
                                                onChange={() => setLeadingCharType('Any')}
                                                className="peer appearance-none w-6 h-6 border-2 border-blue-500 rounded-full bg-transparent checked:border-blue-500 checked:bg-blue-500/20 transition-all"
                                            />
                                            <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-blue-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className={`text-lg font-medium transition-colors ${leadingCharType === 'Any' ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                            ไม่กำหนด
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 justify-center relative z-0">
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex-1 justify-center max-w-md"
                            >
                                {isLoading ? <span className="animate-spin">⏳</span> : <Search size={20} />}
                                <span className="text-lg">ค้นหารายชื่อ</span>
                                <span className="ml-2 bg-black/20 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1">
                                    <Lock size={12} /> -15 เครดิต
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

                            {/* Recommendation Context */}
                            <div className="mx-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                                <p className="text-emerald-300 font-medium text-lg leading-relaxed">
                                    นี่คือผลการค้นหาชื่อมงคลสำหรับ <span className="text-white font-bold underline decoration-amber-500/50 underline-offset-4">ผู้ที่เกิดวัน{selectedDay === 'All' ? 'ทุกวัน' : selectedDay}</span> เลือกใช้อักษรทุกวรรค ยกเว้นวรรคกาลกิณี นำหน้าชื่อ มีรายชื่อที่สุ่มมาแสดงทั้งหมด {searchResults.length} ชื่อค่ะ
                                </p>
                            </div>

                            {/* Tip Match Image */}
                            <div className="mx-4 bg-[#0F1C2E] border border-emerald-500/30 rounded-xl p-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20">
                                <p className="text-emerald-400 font-medium text-sm md:text-base">
                                    💡 คำแนะนำ: ได้ชื่อที่ต้องการแล้วอย่าลืมนำไป <a href="/" className="underline decoration-emerald-500/50 hover:text-emerald-300 transition-colors">วิเคราะห์ชื่อ - สกุล</a> ก่อนนำไปใช้ด้วยนะครับ
                                </p>
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
