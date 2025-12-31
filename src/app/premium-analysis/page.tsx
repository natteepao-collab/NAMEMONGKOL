'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import {
    Sparkles, Calendar, Clock, User, Target,
    ChevronRight, ArrowLeft, Star, Crown,
    Lock, CheckCircle2, AlertCircle, RefreshCw,
    Coins, Briefcase, Activity, Heart, HelpingHand, Check
} from 'lucide-react';

import { supabase } from '@/utils/supabase';
import { generatePremiumNames, PremiumResult, FocusTopic, FOCUS_TOPIC_LABELS, getAstrologicalDay } from '@/utils/premiumAnalysisUtils';
import { DayKey } from '@/data/thaksa';

export default function PremiumAnalysisPage() {
    const router = useRouter();
    // Form State
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [focus, setFocus] = useState<FocusTopic>('WEALTH');

    // Derived state for display input to allow typing
    const [dateInput, setDateInput] = useState('');
    const [isUnknownTime, setIsUnknownTime] = useState(false);

    // Sync birthDate (YYYY-MM-DD from picker/logic) to dateInput (DD/MM/YYYY)
    useEffect(() => {
        if (birthDate) {
            const [y, m, d] = birthDate.split('-');
            setDateInput(`${d}/${m}/${y}`);
        } else {
            // Only clear if birthDate is explicitly empty (reset)
            if (!birthDate && dateInput.length === 10) setDateInput(''); // loose check?
        }
    }, [birthDate]);

    // App State
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<PremiumResult[]>([]);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [userCredits, setUserCredits] = useState<number | null>(null);

    // Track shown names to avoid duplicates in re-rolls
    const [shownNames, setShownNames] = useState<string[]>([]);

    const focusOptions: Array<{ key: FocusTopic; title: string; subtitle: string; icon: React.ReactNode }> = [
        { key: 'WEALTH', title: 'โชคลาภและการเงิน', subtitle: 'เพิ่มพลังรายได้และทรัพย์สิน', icon: <Coins size={18} /> },
        { key: 'JOB', title: 'การงานและอำนาจ', subtitle: 'ดันตำแหน่ง บารมี และโอกาส', icon: <Briefcase size={18} /> },
        { key: 'HEALTH', title: 'สุขภาพ', subtitle: 'เสริมพลังชีวิตและสมดุล', icon: <Activity size={18} /> },
        { key: 'LOVE', title: 'ความรักและเสน่ห์', subtitle: 'ดึงดูดเสน่ห์และความอบอุ่น', icon: <Heart size={18} /> },
        { key: 'PATRON', title: 'คนอุปถัมภ์', subtitle: 'มีผู้สนับสนุนและเมตตา', icon: <HelpingHand size={18} /> },
    ];

    // Fetch Credits
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

    // ... other imports

    const handleAnalyze = async (isNewBatch = false) => {
        if (!surname || !birthDate || !birthTime) {
            Swal.fire({
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอก นามสกุล, วันเกิด และเวลาเกิด ให้ครบทุกช่อง',
                icon: 'warning',
                confirmButtonText: 'เข้าใจแล้ว',
                confirmButtonColor: '#f59e0b',
                background: '#1e293b',
                color: '#fff'
            });
            return;
        }

        if (userCredits !== null && userCredits < 10) {
            const result = await Swal.fire({
                title: 'เครดิตไม่เพียงพอ',
                text: 'การวิเคราะห์ต้องใช้ 10 เครดิต ต้องการเติมเครดิตเลยหรือไม่?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'เติมเครดิต',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#64748b',
                background: '#1e293b',
                color: '#fff',
                iconColor: '#f59e0b'
            });

            if (result.isConfirmed) {
                router.push('/topup');
            }
            return;
        }

        const confirmMsg = isNewBatch
            ? 'ต้องการใช้ 10 เครดิตเพื่อค้นหาชื่อมงคลชุดใหม่หรือไม่?'
            : 'ต้องการใช้ 10 เครดิตเพื่อวิเคราะห์ชื่อหรือไม่?';

        const result = await Swal.fire({
            title: isNewBatch ? 'ยืนยันการขอรายชื่อใหม่' : 'ยืนยันการวิเคราะห์',
            text: isNewBatch ? 'ระบบจะหัก 10 เครดิตเพื่อสุ่มชื่อชุดใหม่ที่ไม่ซ้ำเดิม' : 'ระบบจะหัก 10 เครดิตเพื่อเริ่มการวิเคราะห์',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน (ใช้ 10 เครดิต)',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#f59e0b', // Amber for Analysis
            cancelButtonColor: '#ef4444',
            background: '#1e293b',
            color: '#fff',
            iconColor: '#fcd34d'
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);

        try {
            // 1. Deduct Credits
            const { error: deductError } = await supabase.rpc('deduct_credits', { amount: 10 });
            if (deductError) throw deductError;

            // Updated Credits locally
            setUserCredits(prev => (prev !== null ? prev - 10 : null));

            // 2. Determine Astrological Day
            const dateObj = new Date(birthDate);
            const astDay = getAstrologicalDay(dateObj, birthTime);

            // 3. Generate Names
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Determine exclusions
            let currentExclusions: string[] = [];
            if (isNewBatch) {
                currentExclusions = shownNames;
            } else {
                // First analysis or Reset implicit
                currentExclusions = [];
                setShownNames([]);
            }

            // Generate 20 names, excluding previous ones
            const generatedNames = generatePremiumNames(surname, astDay, focus, 20, currentExclusions);

            // 4. Save to History
            const { error: historyError } = await supabase.from('analysis_history').insert({
                user_id: (await supabase.auth.getUser()).data.user?.id,
                type: 'premium_analysis',
                input_data: { surname, birthDate, birthTime, gender, focus, astDay, batch: isNewBatch ? 'reroll' : 'initial' },
                result_data: generatedNames
            });

            if (historyError) {
                console.error("Failed to save history:", historyError);
            }

            setResults(generatedNames);

            // Update shownNames history
            const newNameList = generatedNames.map(r => r.name);
            if (isNewBatch) {
                setShownNames(prev => [...prev, ...newNameList]);
            } else {
                setShownNames(newNameList);
            }

            setHasAnalyzed(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Success Toast
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#10b981',
                color: '#fff',
                iconColor: '#fff'
            });

            Toast.fire({
                icon: 'success',
                title: 'วิเคราะห์ข้อมูลเสร็จสิ้นเรียบร้อย'
            });

        } catch (error) {
            console.error('Analysis error:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถทำการวิเคราะห์ได้ กรุณาลองใหม่ภายหลัง',
                icon: 'error',
                confirmButtonText: 'ตกลง',
                background: '#1e293b',
                color: '#fff'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setHasAnalyzed(false);
        setResults([]);
        setShownNames([]); // Clear history so next analysis starts fresh
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">

            <main className="min-h-screen relative overflow-hidden">
                {/* Background Decor */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-amber-500/5 blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8 space-y-8">

                    {/* Header */}
                    <header className="text-center space-y-4 pt-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-300 text-sm font-medium">
                            <Crown size={16} />
                            <span>Advanced Analysis (PRO)</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200">
                            วิเคราะห์ชื่อมงคลขั้นสูง
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
                            ค้นหาชื่อที่เหมาะสมที่สุดด้วยศาสตร์ทักษาปกรณ์และเลขศาสตร์ชั้นสูง
                            <br className="hidden md:block" />
                            วิเคราะห์เจาะลึกเฉพาะบุคคล ตามวันเวลาเกิดจริง
                        </p>
                    </header>

                    {!hasAnalyzed ? (
                        /* Input Form */
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl animate-fade-in-up max-w-6xl mx-auto">

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                                {/* Left Column: Personal Inputs */}
                                <div className="lg:col-span-5 space-y-6">
                                    {/* Surname */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-2">
                                            <User size={16} /> นามสกุล * (ใช้เพื่อคำนวณความเข้ากันได้)
                                        </label>
                                        <input
                                            type="text"
                                            value={surname}
                                            onChange={(e) => setSurname(e.target.value)}
                                            placeholder="กรอกนามสกุลของคุณ"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Birth Date */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-2">
                                                <Calendar size={16} /> วันเกิด
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={dateInput}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setDateInput(val);

                                                        if (val.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                                                            const [d, m, y] = val.split('/');
                                                            if (parseInt(d) > 0 && parseInt(d) <= 31 && parseInt(m) > 0 && parseInt(m) <= 12) {
                                                                setBirthDate(`${y}-${m}-${d}`);
                                                            }
                                                        } else if (val === '') {
                                                            setBirthDate('');
                                                        }
                                                    }}
                                                    placeholder="dd/mm/yyyy"
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-amber-500/50 transition-all text-slate-300 placeholder:text-slate-500"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer w-8 h-8 flex items-center justify-center">
                                                    <Calendar size={18} className="pointer-events-none" />
                                                    <input
                                                        type="date"
                                                        value={birthDate}
                                                        onChange={(e) => {
                                                            setBirthDate(e.target.value);
                                                        }}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Birth Time */}
                                        {/* Birth Time */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-2">
                                                <Clock size={16} /> เวลาเกิด
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="time"
                                                    value={birthTime}
                                                    disabled={isUnknownTime}
                                                    onChange={(e) => setBirthTime(e.target.value)}
                                                    className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-base focus:outline-none transition-all ${isUnknownTime
                                                        ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-500'
                                                        : 'border-white/10 text-slate-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50'
                                                        }`}
                                                />
                                            </div>

                                            {/* Unknown Time Toggle */}
                                            <label className="flex items-center gap-3 cursor-pointer group select-none mt-2 pl-1">
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isUnknownTime ? 'bg-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-black/20 border-slate-600 group-hover:border-amber-400/50'}`}>
                                                    {isUnknownTime && <Check size={14} className="text-[#0f172a] stroke-[4]" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={isUnknownTime}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setIsUnknownTime(checked);
                                                        if (checked) {
                                                            setBirthTime('12:00');
                                                        } else {
                                                            setBirthTime('');
                                                        }
                                                    }}
                                                    className="hidden"
                                                />
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium transition-colors ${isUnknownTime ? 'text-amber-300' : 'text-slate-400 group-hover:text-amber-200'}`}>
                                                        ไม่ทราบเวลาเกิด
                                                    </span>
                                                    {isUnknownTime && (
                                                        <span className="text-[10px] text-amber-500/60 font-medium">
                                                            * ระบบจะใช้ค่ากลาง (12:00 น.) ในการคำนวณ
                                                        </span>
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Gender */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-2">
                                            เพศ
                                        </label>
                                        <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                                            <button
                                                onClick={() => setGender('male')}
                                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${gender === 'male' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                ชาย
                                            </button>
                                            <button
                                                onClick={() => setGender('female')}
                                                className={`flex-1 py-3 rounded-lg font-medium transition-all ${gender === 'female' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                            >
                                                หญิง
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Focus Topic */}
                                <div className="lg:col-span-7">
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-amber-200/80 uppercase tracking-wider flex items-center gap-2">
                                            <Target size={16} /> เรื่องที่เน้นเสริม (Focus)
                                        </label>

                                        <div className="flex flex-col gap-3 mt-4">
                                            {focusOptions.map((option) => {
                                                const isActive = focus === option.key;
                                                return (
                                                    <button
                                                        key={option.key}
                                                        onClick={() => setFocus(option.key)}
                                                        className={`group relative w-full p-4 rounded-xl border-2 text-left transition-all duration-300 overflow-hidden ${isActive
                                                            ? 'border-amber-500 bg-gradient-to-r from-amber-500/20 via-black/40 to-black/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                                            : 'border-white/5 bg-white/5 hover:border-amber-500/30 hover:bg-white/10'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4 relative z-10">
                                                            {/* Icon Box */}
                                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isActive ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50' : 'bg-white/10 text-slate-400 group-hover:text-amber-300'
                                                                }`}>
                                                                {React.cloneElement(option.icon as React.ReactElement<{ size: number }>, { size: 24 })}
                                                            </div>

                                                            {/* Text Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className={`text-lg font-bold mb-0.5 leading-tight ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                                                    {option.title}
                                                                </h3>
                                                                <p className={`text-sm font-light leading-snug ${isActive ? 'text-amber-100/80' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                                                    {option.subtitle}
                                                                </p>
                                                            </div>

                                                            {/* Selection Indicator */}
                                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${isActive ? 'border-amber-500 bg-amber-500' : 'border-white/20 group-hover:border-amber-500/50'
                                                                }`}>
                                                                {isActive && <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />}
                                                            </div>
                                                        </div>

                                                        {/* Animated Glow BG */}
                                                        {isActive && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent blur-xl pointer-events-none" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <button
                                    onClick={() => handleAnalyze(false)}
                                    disabled={isLoading}
                                    className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-1 shadow-2xl transition-all hover:scale-[1.02] hover:shadow-amber-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <div className="relative flex flex-col items-center justify-center rounded-xl bg-[#0f172a] px-6 py-6 transition-all group-hover:bg-[#0f172a]/90">
                                        <div className="flex items-center gap-3 text-2xl font-bold text-white mb-1">
                                            <div className="bg-amber-500/20 p-2 rounded-full text-amber-300">
                                                {isLoading ? (
                                                    <span className="animate-spin block">⏳</span>
                                                ) : (
                                                    <Sparkles className="animate-pulse w-6 h-6" />
                                                )}
                                            </div>
                                            <span>วิเคราะห์ชื่อมงคล</span>
                                        </div>
                                        <div className="text-amber-400/80 text-sm font-medium flex items-center gap-2">
                                            ( ใช้ 10 Credits <Coins size={14} /> )
                                        </div>
                                    </div>
                                </button>
                                <p className="text-center text-slate-500 text-xs mt-3">
                                    * ระบบจะทำการตัด 10 เครดิตทันทีที่กดยืนยัน
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Results View */
                        <div className="space-y-8 animate-fade-in-up">

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    <ArrowLeft size={20} />
                                    วิเคราะห์ใหม่ (กรอกข้อมูลใหม่)
                                </button>
                                <div className="text-amber-400 font-bold flex items-center gap-2">
                                    <CheckCircle2 size={20} />
                                    วิเคราะห์เสร็จสิ้น (แสดง {results.length} รายชื่อ)
                                </div>
                            </div>

                            {/* Recommendation Box */}
                            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-2">
                                <p className="text-emerald-300 font-medium text-lg">
                                    นี่คือผลลัพธ์ชื่อมงคลที่ผ่านการคำนวณร่วมกับนามสกุล <span className="text-white font-bold underline decoration-amber-500/50 underline-offset-4">"{surname}"</span> ของท่านเรียบร้อยแล้ว
                                </p>
                                <p className="text-slate-400 text-sm">
                                    💡 <span className="text-amber-300 font-medium">คำแนะนำ:</span> เมื่อได้ชื่อที่ถูกใจแล้ว อย่าลืมนำไปตรวจสอบความไพเราะ และความเหมาะสมตามความชอบส่วนบุคคลอีกครั้งก่อนนำไปใช้งานนะคะ
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.length > 0 ? results.map((result, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative group p-6 rounded-3xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${result.grade === 'A+'
                                            ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/5 border-amber-500/30 hover:shadow-amber-500/20'
                                            : 'bg-white/5 border-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        {result.grade === 'A+' && (
                                            <div className="absolute top-4 right-4 text-amber-300 animate-pulse">
                                                <Crown size={24} />
                                            </div>
                                        )}

                                        <div className="flex items-start justify-between mb-4">
                                            <div className="px-3 py-1 rounded-lg bg-black/40 text-xs font-mono text-slate-400 border border-white/5">
                                                Grade {result.grade}
                                            </div>
                                        </div>

                                        <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                                            {result.name}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                            {result.meaning}
                                        </p>

                                        <div className="space-y-3">
                                            {result.notes.map((note, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                                    <span>{note}</span>
                                                </div>
                                            ))}
                                            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-slate-500 text-xs uppercase tracking-wider">Total Score</span>
                                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                                    {result.totalScore}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center text-slate-400 bg-white/5 rounded-3xl border border-white/10">
                                        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-xl font-bold">ไม่พบรายชื่อที่ตรงกับเงื่อนไขขั้นสูงเพิ่มเติม</p>
                                        <p className="mt-2 text-sm">ลองเปลี่ยนเรื่องที่เน้น หรือใช้นามสกุลอื่น</p>
                                    </div>
                                )}

                                {/* Load More Button */}
                                {results.length > 0 && (
                                    <div className="col-span-full pt-8 flex justify-center pb-12">
                                        <button
                                            onClick={() => handleAnalyze(true)}
                                            disabled={isLoading}
                                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-2xl border border-amber-500/30 hover:border-amber-500/60 shadow-lg shadow-black/20 transition-all hover:-translate-y-1 hover:shadow-amber-500/10"
                                        >
                                            <div className="bg-amber-500/10 p-2 rounded-full group-hover:rotate-180 transition-transform duration-500">
                                                <RefreshCw size={20} />
                                            </div>
                                            <span className="text-lg">ค้นหาชื่อชุดใหม่ (ไม่ซ้ำเดิม)</span>
                                            <span className="absolute -top-3 -right-3 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                                -10 Credits
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
