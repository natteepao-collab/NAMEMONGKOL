'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Sparkles, Calendar, Clock, User, Target,
    ChevronRight, ArrowLeft, Star, Crown,
    Lock, CheckCircle2, AlertCircle, RefreshCw,
    Coins, Briefcase, Activity, Heart, HelpingHand, Check,
    Search, ShieldCheck, Gem, Info, XCircle, Zap, TrendingUp, MessageSquareQuote
} from 'lucide-react';
import Link from 'next/link';

import { supabase } from '@/utils/supabase';
import { generatePremiumNames, PremiumResult, FocusTopic, getAstrologicalDay } from '@/utils/premiumAnalysisUtils';
import { formatThaiBirthDate, ThaiDateResult } from '@/utils/thaiDateUtils';

export default function PremiumAnalysisPage() {
    const router = useRouter();
    // Form State
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [focus, setFocus] = useState<FocusTopic>('WEALTH');

    const [results, setResults] = useState<PremiumResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [userCredits, setUserCredits] = useState<number | null>(null);

    // New state for extended date details
    const [dateDetails, setDateDetails] = useState<ThaiDateResult | null>(null);

    // Derived state for display input to allow typing
    const [dateInput, setDateInput] = useState('');
    const [isUnknownTime, setIsUnknownTime] = useState(false);
    const timeInputRef = useRef<HTMLInputElement | null>(null);
    const dateInputRef = useRef<HTMLInputElement | null>(null);

    const openTimePicker = () => {
        if (isUnknownTime) return;
        const el = timeInputRef.current;
        if (!el) return;
        if (typeof el.showPicker === 'function') {
            el.showPicker();
        } else {
            el.focus();
        }
    };

    const openDatePicker = () => {
        const el = dateInputRef.current;
        if (!el) return;
        if (typeof el.showPicker === 'function') {
            el.showPicker();
        } else {
            el.focus();
        }
    };

    const [shownNames, setShownNames] = useState<string[]>([]);

    // Sync birthDate to dateInput when picked from calendar
    useEffect(() => {
        if (birthDate) {
            const [y, m, d] = birthDate.split('-');
            setDateInput(`${d}/${m}/${y}`);
        }
    }, [birthDate]);

    const focusOptions: Array<{ key: FocusTopic; title: string; subtitle: string; icon: React.ReactNode }> = [
        { key: 'WEALTH', title: 'โชคลาภ', subtitle: 'การเงินมั่งคั่ง', icon: <Coins size={20} /> },
        { key: 'JOB', title: 'การงาน', subtitle: 'เลื่อนขั้น อำนาจ', icon: <Briefcase size={20} /> },
        { key: 'HEALTH', title: 'สุขภาพ', subtitle: 'แข็งแรง ยั่งยืน', icon: <Activity size={20} /> },
        { key: 'LOVE', title: 'ความรัก', subtitle: 'เสน่ห์ คู่ครอง', icon: <Heart size={20} /> },
        { key: 'PATRON', title: 'อุปถัมภ์', subtitle: 'ผู้ใหญ่เมตตา', icon: <HelpingHand size={20} /> },
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
                    .maybeSingle();
                if (data) setUserCredits(data.credits);
            }
        };
        fetchCredits();
    }, []);

    const handleAnalyze = async (isNewBatch = false) => {
        // @ts-ignore
        const Swal = (await import('sweetalert2')).default;

        if (!surname || !birthDate || (!birthTime && !isUnknownTime)) {
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

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            const result = await Swal.fire({
                title: 'กรุณาเข้าสู่ระบบ',
                text: 'ท่านจำเป็นต้องเข้าสู่ระบบก่อนใช้งานฟีเจอร์วิเคราะห์ชื่อมงคลขั้นสูง',
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

        if (userCredits !== null && userCredits < 50) {
            const result = await Swal.fire({
                title: 'เครดิตไม่เพียงพอ',
                text: 'การวิเคราะห์ต้องใช้ 50 เครดิต ต้องการเติมเครดิตเลยหรือไม่?',
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

        const result = await Swal.fire({
            title: isNewBatch ? 'ยืนยันการขอรายชื่อใหม่' : 'ยืนยันการวิเคราะห์',
            text: isNewBatch ? 'ระบบจะหัก 50 เครดิตเพื่อสุ่มชื่อชุดใหม่ที่ไม่ซ้ำเดิม' : 'ระบบจะหัก 50 เครดิตเพื่อเริ่มการวิเคราะห์',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน (ใช้ 50 เครดิต)',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#ef4444',
            background: '#1e293b',
            color: '#fff',
            iconColor: '#fcd34d'
        });

        if (!result.isConfirmed) return;

        setIsLoading(true);

        try {
            const { error: deductError } = await supabase.rpc('deduct_credits', { amount: 50 });
            if (deductError) throw deductError;

            setUserCredits(prev => (prev !== null ? prev - 50 : null));
            window.dispatchEvent(new Event('force_credits_update'));

            const dateObj = new Date(birthDate);
            const astDay = getAstrologicalDay(dateObj, birthTime);

            // Calculate Thai Date Details
            const dateInfo = formatThaiBirthDate(birthDate);
            setDateDetails(dateInfo);

            await new Promise(resolve => setTimeout(resolve, 1500));

            let currentExclusions: string[] = [];
            if (isNewBatch) {
                currentExclusions = shownNames;
            } else {
                currentExclusions = [];
                setShownNames([]);
            }

            const generatedNames = generatePremiumNames(surname, astDay, focus, 20, currentExclusions);

            const { error: historyError } = await supabase.from('analysis_history').insert({
                user_id: (await supabase.auth.getUser()).data.user?.id,
                type: 'premium_analysis',
                input_data: { surname, birthDate, birthTime, gender, focus, astDay, batch: isNewBatch ? 'reroll' : 'initial' },
                result_data: generatedNames
            });

            if (historyError) {
                console.error('Failed to save history:', historyError);
            }

            setResults(generatedNames);

            const newNameList = generatedNames.map(r => r.name);
            if (isNewBatch) {
                setShownNames(prev => [...prev, ...newNameList]);
            } else {
                setShownNames(newNameList);
            }

            setHasAnalyzed(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });

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
        setShownNames([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Components ---

    const resultsContent = (
        <div className="space-y-10 animate-fade-in-up">

            {/* Header / Actions */}
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-all px-4 py-2 hover:bg-white/5 rounded-lg text-sm"
                >
                    <ArrowLeft size={16} />
                    <span>คำนวณใหม่</span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm">ค้นพบ</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
                        {results.length}
                    </span>
                    <span className="text-slate-400 text-sm">รายชื่อมงคล</span>
                </div>
            </div>

            {/* Date Details Box */}
            {dateDetails && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4">
                    <p className="text-xl text-slate-200">
                        คุณเกิดวัน <span className="text-amber-400 font-bold">{dateDetails.dayOfWeek}</span> ครับ
                    </p>
                    <div className="text-sm text-slate-400 space-y-2 bg-black/20 p-4 rounded-xl border border-white/5 inline-block w-full max-w-2xl">
                        <p>สำหรับรายละเอียดเพิ่มเติมของวันที่ {dateDetails.fullSolarDateWithType} มีดังนี้ครับ:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-left md:text-center">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <span className="block text-xs text-slate-500 mb-1">ตรงกับวัน</span>
                                <span className="text-white font-medium">{dateDetails.dayOfWeek}</span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                <span className="block text-xs text-slate-500 mb-1">วันทางจันทรคติ</span>
                                <span className="text-amber-200 font-medium">{dateDetails.lunarDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendation Box */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-3xl p-8 text-center space-y-3">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

                <h3 className="text-emerald-300 font-bold text-xl flex items-center justify-center gap-2">
                    <ShieldCheck size={24} />
                    ผลลัพธ์การวิเคราะห์
                </h3>
                <p className="text-slate-200">
                    ชื่อมงคลสำหรับนามสกุล <span className="text-white font-bold underline decoration-amber-500/50 underline-offset-4 px-1">&quot;{surname}&quot;</span>
                </p>
                <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                    รายชื่อเหล่านี้ถูกคัดสรรจากศาสตร์ทักษาปกรณ์และเลขศาสตร์ชั้นสูง โดยคำนวณจากวันเดือนปีเกิดและเวลาเกิดของท่านโดยเฉพาะ
                </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.length > 0 ? results.map((result, idx) => {
                    const isPremium = result.grade === 'A+';
                    return (
                        <div
                            key={idx}
                            className={`relative group p-6 rounded-3xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between overflow-hidden
                                ${isPremium
                                    ? 'bg-gradient-to-br from-slate-900/90 to-slate-900/50 border-amber-500/40 shadow-lg shadow-amber-900/20'
                                    : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                                }`}
                        >
                            {/* Decorative Elements for Premium Cards */}
                            {isPremium && (
                                <>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
                                    <div className="absolute top-4 right-4 text-amber-300 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                                        <Crown size={24} />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/50 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </>
                            )}

                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold font-mono border ${isPremium
                                        ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                                        : 'bg-slate-800 text-slate-400 border-slate-700'
                                        }`}>
                                        Grade {result.grade}
                                    </div>
                                    {isPremium && <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Premium</span>}
                                </div>

                                <h3 className={`text-3xl font-bold mb-2 transition-colors ${isPremium ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                    {result.name}
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    {result.meaning}
                                </p>

                                <div className="space-y-3 mb-6">
                                    {result.notes.map((note, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                                            <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${isPremium ? 'text-amber-400' : 'text-emerald-500/70'}`} />
                                            <span className="opacity-90">{note}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
                                <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Score</span>
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-2xl font-black text-transparent bg-clip-text ${isPremium
                                        ? 'bg-gradient-to-r from-amber-200 to-yellow-400'
                                        : 'bg-gradient-to-r from-slate-200 to-slate-400'
                                        }`}>
                                        {result.totalScore}
                                    </span>
                                    <span className="text-xs text-slate-500">/ 100</span>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full py-20 text-center text-slate-400 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                        <AlertCircle size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl font-bold text-slate-300">ไม่พบรายชื่อที่ตรงกับเงื่อนไข</p>
                        <p className="mt-2 text-sm text-slate-500">กรุณาลองเปลี่ยนค่าพลัง (Focus) หรือตรวจสอบข้อมูลอีกครั้ง</p>
                    </div>
                )}

                {/* Load More Button */}
                {results.length > 0 && (
                    <div className="col-span-full pt-8 flex justify-center pb-12">
                        <button
                            onClick={() => handleAnalyze(true)}
                            disabled={isLoading}
                            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-amber-500/20 hover:border-amber-500/50 shadow-lg shadow-black/40 transition-all hover:-translate-y-1 hover:shadow-amber-500/10 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="bg-amber-500/20 p-2 rounded-full group-hover:bg-amber-500/30 transition-colors">
                                <RefreshCw size={24} className="text-amber-400 group-hover:rotate-180 transition-transform duration-700" />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-lg font-bold text-amber-100 group-hover:text-white">ค้นหารายชื่อชุดใหม่</span>
                                <span className="text-xs text-amber-500/80">สุ่มใหม่โดยใช้เงื่อนไขเดิม</span>
                            </div>
                            <div className="ml-4 px-3 py-1 bg-amber-500/20 rounded-full border border-amber-500/20">
                                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                                    -50 <Coins size={10} />
                                </span>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const formContent = (
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-2xl animate-fade-in-up max-w-7xl mx-auto relative overflow-hidden">

            {/* Background Texture inside form */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none -mr-32 -mt-32"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 relative z-10">

                {/* Left Column: Personal Inputs (User Data) */}
                <div className="lg:col-span-5 space-y-8">

                    <div className="flex items-center gap-3 text-amber-200/80 mb-2">
                        <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                        <h3 className="text-lg font-bold uppercase tracking-wider">ข้อมูลส่วนตัว</h3>
                    </div>

                    {/* Surname */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300 ml-1">นามสกุล <span className="text-red-400">*</span></label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors">
                                <User size={20} />
                            </div>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                placeholder="กรอกนามสกุลของท่าน"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-lg focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all placeholder:text-slate-600 text-white"
                            />
                        </div>
                    </div>

                    {/* Birth Date & Time */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Birth Date */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-300 ml-1">วันเกิด</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors pointer-events-none z-10">
                                    <Calendar size={20} />
                                </div>
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
                                    placeholder="DD/MM/YYYY"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-base focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-slate-200 placeholder:text-slate-600 font-mono"
                                />
                                <div
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer p-2"
                                    onClick={openDatePicker}
                                >
                                    <input
                                        ref={dateInputRef}
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <ChevronRight size={16} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        {/* Birth Time */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-300 ml-1 flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    เวลาเกิด
                                    {/* Tooltip for birth time */}
                                    <div className="relative group/tooltip">
                                        <Info size={14} className="text-slate-500 hover:text-amber-400 cursor-help transition-colors" />
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-800 border border-amber-500/20 rounded-xl text-xs text-slate-300 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 shadow-xl">
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800 border-r border-b border-amber-500/20 rotate-45"></div>
                                            <p className="leading-relaxed">
                                                <strong className="text-amber-400">การระบุเวลาเกิด</strong> จะช่วยให้คำนวณลัคนาราศีได้แม่นยำขึ้น หากไม่ทราบให้เลือก &quot;ไม่ทราบเวลา&quot;
                                            </p>
                                        </div>
                                    </div>
                                </span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="unknownTime"
                                        checked={isUnknownTime}
                                        onChange={(e) => {
                                            setIsUnknownTime(e.target.checked);
                                            if (e.target.checked) setBirthTime('');
                                        }}
                                        className="rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500/50"
                                    />
                                    <label htmlFor="unknownTime" className="text-xs text-slate-400 cursor-pointer hover:text-white transition-colors">ไม่ทราบเวลา</label>
                                </div>
                            </label>
                            <div className={`relative group ${isUnknownTime ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-400 transition-colors pointer-events-none z-10">
                                    <Clock size={20} />
                                </div>
                                <input
                                    type="time"
                                    value={birthTime}
                                    disabled={isUnknownTime}
                                    onChange={(e) => setBirthTime(e.target.value)}
                                    ref={timeInputRef}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-base focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-slate-200 disabled:bg-slate-900/30 time-picker-light font-mono"
                                />
                                <div
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer p-2"
                                    onClick={openTimePicker}
                                >
                                    <Clock size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-slate-300 ml-1">เพศ</label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/10">
                            <button
                                onClick={() => setGender('male')}
                                className={`py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${gender === 'male'
                                    ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-lg'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                    }`}
                            >
                                <span>ชาย</span>
                            </button>
                            <button
                                onClick={() => setGender('female')}
                                className={`py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${gender === 'female'
                                    ? 'bg-gradient-to-br from-pink-900/80 to-pink-800/80 text-pink-100 shadow-lg'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                    }`}
                            >
                                <span>หญิง</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Focus Selection (Grid Cards) */}
                <div className="lg:col-span-7 flex flex-col h-full">
                    <div className="flex items-center gap-3 text-amber-200/80 mb-6 lg:mb-10">
                        <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                        <h3 className="text-lg font-bold uppercase tracking-wider">เลือกสิ่งที่คุณต้องการเน้น (Focus)</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                        {focusOptions.map((option) => {
                            const isActive = focus === option.key;
                            return (
                                <button
                                    key={option.key}
                                    onClick={() => setFocus(option.key)}
                                    className={`group relative px-4 py-3 rounded-xl border transition-all duration-300 flex items-center gap-4 overflow-hidden
                                        ${isActive
                                            ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 via-amber-900/40 to-black shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                            : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                                        }`}
                                >
                                    {/* Active border glow */}
                                    {isActive && <div className="absolute inset-0 border border-amber-400/50 rounded-xl pointer-events-none animate-pulse"></div>}

                                    {/* Icon Box */}
                                    <div className={`p-2 rounded-lg transition-all duration-300 shrink-0 ${isActive
                                        ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/30'
                                        : 'bg-slate-800 text-slate-400 group-hover:text-amber-200 group-hover:bg-slate-700'
                                        }`}>
                                        {React.cloneElement(option.icon as React.ReactElement<{ size: number }>, { size: 20 })}
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 text-left z-10">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-sm font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                                {option.title}
                                            </h4>
                                            {isActive && (
                                                <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center shadow-lg transform scale-100 transition-transform">
                                                    <Check size={10} className="text-black stroke-[3px]" />
                                                </div>
                                            )}
                                        </div>
                                        <p className={`text-[11px] leading-tight mt-0.5 ${isActive ? 'text-amber-100/80' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                            {option.subtitle}
                                        </p>
                                    </div>

                                    {/* Lustrous effect for active state */}
                                    {isActive && (
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Action Area */}
            <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <button
                        onClick={() => handleAnalyze(false)}
                        disabled={isLoading}
                        className="group relative w-full md:max-w-2xl mx-auto overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 p-[1px] shadow-2xl transition-all hover:scale-[1.02] hover:shadow-amber-500/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:grayscale"
                    >
                        <div className="relative flex items-center justify-between rounded-2xl bg-[#0f172a] px-10 py-6 transition-all group-hover:bg-[#0f172a]/90">
                            <div className="flex items-center gap-4">
                                <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-500 group-hover:text-amber-300 transition-colors">
                                    {isLoading ? <span className="animate-spin block"><RefreshCw size={24} /></span> : <Sparkles className="animate-pulse w-6 h-6" />}
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-white leading-tight">วิเคราะห์ชื่อมงคล</h3>
                                    <p className="text-xs text-slate-400 group-hover:text-amber-200/80 transition-colors">ใช้ศาสตร์ชั้นสูง + พลังตัวเลข</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                <span className="text-sm font-bold text-amber-500">ใช้ 50 เครดิต</span>
                                <Coins size={16} className="text-amber-500" />
                            </div>
                        </div>
                        {/* Shimmer Effect */}
                        {!isLoading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none"></div>}
                    </button>

                    <p className="text-slate-500 text-xs flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                        <Lock size={12} />
                        ปลอดภัยสูงสุด • ข้อมูลของท่านจะถูกเก็บเป็นความลับ
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050b14] text-slate-200 font-sans selection:bg-amber-500/30">

            <main className="w-full max-w-[1400px] min-h-screen relative overflow-hidden pb-20 px-4">
                {/* Background Decor - Fixed Position */}
                <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-20%] left-[20%] w-[1000px] h-[1000px] rounded-full bg-blue-900/10 blur-[130px] opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-amber-600/5 blur-[100px] opacity-60" />
                    <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Header Section */}
                    <header className="text-center space-y-6 pt-6 md:pt-32 pb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 text-amber-400/90 text-xs font-bold tracking-wider uppercase shadow-lg shadow-amber-900/10 backdrop-blur-sm mb-4">
                            <Crown size={14} />
                            <span>Professional Naming Analysis</span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-amber-100 to-amber-500 drop-shadow-sm tracking-tight">
                                วิเคราะห์ชื่อมงคลขั้นสูง
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full opacity-50"></div>
                        </div>

                        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                            เจาะลึกชะตาชีวิตด้วย <span className="text-amber-200 font-medium">ทักษาปกรณ์</span> และ <span className="text-amber-200 font-medium">เลขศาสตร์ชั้นสูง</span>
                            <br className="hidden md:block" />
                            เพื่อค้นหาชื่อที่ส่งเสริมดวงชะตาของท่านอย่างแท้จริง
                        </p>
                    </header>

                    {/* Main Content Area */}
                    <div className="pb-28">
                        {!hasAnalyzed ? formContent : resultsContent}
                    </div>

                    {/* ==================== SEO CONTENT SECTION (Below the Fold) ==================== */}
                    {!hasAnalyzed && (
                        <section className="mt-8 pt-16 border-t border-white/10 space-y-16 pb-20">

                            {/* Section A: ความแตกต่างของการ "วิเคราะห์ขั้นสูง" */}
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
                                    ความแตกต่างของ <span className="text-amber-400">&quot;วิเคราะห์ชื่อมงคลขั้นสูง&quot;</span>
                                </h2>
                                <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-3xl p-8 md:p-10">
                                    <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                        การวิเคราะห์ชื่อทั่วไปดูเพียงแค่ <span className="text-slate-200">ผลรวมเลขศาสตร์</span> แต่ <strong className="text-amber-400">การวิเคราะห์ชื่อมงคลขั้นสูง</strong> ของเรานำ <strong className="text-white">&quot;เวลาตกฟาก&quot;</strong> มาคำนวณหาลัคนาราศีที่แท้จริง เพื่อดูว่าชื่อส่งผลต่อดวงกำเนิดของคุณในมุมลึกอย่างไร
                                    </p>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                                                <Clock className="w-5 h-5 text-amber-400" />
                                            </div>
                                            <h3 className="font-bold text-white mb-2">เวลาตกฟาก</h3>
                                            <p className="text-sm text-slate-400">คำนวณลัคนาราศีจริง ไม่ใช่แค่ราศีตามวันเกิด</p>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                                                <Target className="w-5 h-5 text-amber-400" />
                                            </div>
                                            <h3 className="font-bold text-white mb-2">เจาะลึกเฉพาะด้าน</h3>
                                            <p className="text-sm text-slate-400">เลือก Focus ได้ว่าต้องการเสริมดวงด้านไหน</p>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-3">
                                                <TrendingUp className="w-5 h-5 text-amber-400" />
                                            </div>
                                            <h3 className="font-bold text-white mb-2">Personalization</h3>
                                            <p className="text-sm text-slate-400">ผลลัพธ์เฉพาะบุคคล ไม่ใช่สูตรสำเร็จรูป</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section B: เจาะลึก 5 ด้านที่เลือกเน้นได้ */}
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-center text-white mb-4">
                                    เจาะลึก <span className="text-amber-400">5 ด้าน</span> ที่คุณเลือกเน้นได้
                                </h2>
                                <p className="text-center text-slate-400 mb-8">
                                    เลือก Focus ที่ต้องการ ระบบจะคำนวณหาชื่อที่เสริมดวงด้านนั้นโดยเฉพาะ
                                </p>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-2xl p-5 hover:border-yellow-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                                <Coins className="w-5 h-5 text-yellow-400" />
                                            </div>
                                            <h3 className="font-bold text-white">💰 การเงิน</h3>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            วิเคราะห์หาเลขที่ดึงดูดทรัพย์และสภาพคล่อง ตัดตัวเลขที่ทำให้เก็บเงินไม่อยู่
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 rounded-2xl p-5 hover:border-blue-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                <Briefcase className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <h3 className="font-bold text-white">💼 การงาน</h3>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            เน้นเลขกลุ่มอำนาจบารมี (วรรคเดช) เพื่อการเลื่อนขั้นและเป็นเจ้าคนนายคน
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20 rounded-2xl p-5 hover:border-pink-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                                <Heart className="w-5 h-5 text-pink-400" />
                                            </div>
                                            <h3 className="font-bold text-white">❤️ ความรัก</h3>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            ตรวจสอบเลขเสน่ห์และคู่ครอง แก้ดวงอาภัพรักจากชื่อเดิม
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5 hover:border-green-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                                <Activity className="w-5 h-5 text-green-400" />
                                            </div>
                                            <h3 className="font-bold text-white">🏥 สุขภาพ</h3>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            หาเลขที่ส่งเสริมความแข็งแรง หลีกเลี่ยงเลขที่ทำให้อ่อนไหวด้านสุขภาพ
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/20 rounded-2xl p-5 hover:border-purple-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                                <HelpingHand className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <h3 className="font-bold text-white">🤝 อุปถัมภ์</h3>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            เสริมดวงผู้ใหญ่เมตตา มีคนคอยช่วยเหลือ ได้รับการสนับสนุน
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section C: ตารางเปรียบเทียบ Free vs Premium */}
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-center text-white mb-8">
                                    เปรียบเทียบ <span className="text-slate-400">วิเคราะห์เบื้องต้น</span> vs <span className="text-amber-400">วิเคราะห์ชื่อมงคลขั้นสูง</span>
                                </h2>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-4 px-4 text-slate-400 font-medium">หัวข้อการวิเคราะห์</th>
                                                <th className="text-center py-4 px-4 text-slate-400 font-medium">วิเคราะห์เบื้องต้น</th>
                                                <th className="text-center py-4 px-4 text-amber-400 font-medium">วิเคราะห์ขั้นสูง</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 text-slate-300">ดูผลรวมเลขศาสตร์</td>
                                                <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                                <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                            </tr>
                                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 text-slate-300">ดูอักษรกาลกิณี</td>
                                                <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                                <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                            </tr>
                                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 text-slate-300">วิเคราะห์ร่วมกับเวลาเกิด (ลัคนาราศี)</td>
                                                <td className="text-center py-4 px-4"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                                                <td className="text-center py-4 px-4 text-amber-400 font-semibold">✅ แม่นยำ 100%</td>
                                            </tr>
                                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 text-slate-300">เจาะลึกเฉพาะด้าน (การเงิน/งาน/รัก)</td>
                                                <td className="text-center py-4 px-4"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                                                <td className="text-center py-4 px-4 text-amber-400 font-semibold">✅ Customizable</td>
                                            </tr>
                                            <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 text-slate-300">แนะนำชื่อมงคลใหม่พร้อมความหมาย</td>
                                                <td className="text-center py-4 px-4"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                                                <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="py-4 px-4 text-slate-300">คะแนนและเกรดรายชื่อ</td>
                                                <td className="text-center py-4 px-4"><XCircle className="w-5 h-5 text-red-400 mx-auto" /></td>
                                                <td className="text-center py-4 px-4"><CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Section D: Testimonial */}
                            <div className="max-w-4xl mx-auto">
                                <h2 className="text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-3">
                                    <MessageSquareQuote className="w-8 h-8 text-amber-400" />
                                    รีวิวจากผู้ใช้จริง
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                            &quot;วิเคราะห์ละเอียดมาก เห็นภาพชัดว่าชื่อเดิมมีปัญหาตรงไหน ระบบแนะนำชื่อใหม่มาพร้อมคำอธิบายครบถ้วน ตัดสินใจเปลี่ยนชื่อได้ง่ายขึ้นเยอะเลยค่ะ&quot;
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-sm">ส</div>
                                            <div>
                                                <div className="text-white font-medium text-sm">คุณสมใจ</div>
                                                <div className="text-slate-500 text-xs">ใช้บริการ: วิเคราะห์ขั้นสูง</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                        <div className="flex items-center gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                            &quot;ชอบที่เลือก Focus ได้ ผมเน้นเรื่องการงานเพราะอยากเลื่อนตำแหน่ง ระบบเลือกชื่อที่มีอักษรวรรคเดชนำมาให้หมดเลย สะดวกมากครับ&quot;
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">ก</div>
                                            <div>
                                                <div className="text-white font-medium text-sm">คุณกิตติ</div>
                                                <div className="text-slate-500 text-xs">ใช้บริการ: วิเคราะห์ขั้นสูง</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <Link
                                        href="/reviews"
                                        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm"
                                    >
                                        ดูรีวิวทั้งหมด
                                        <ChevronRight size={16} />
                                    </Link>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="max-w-3xl mx-auto">
                                <h2 className="text-3xl font-bold text-center text-white mb-8">
                                    คำถามที่พบบ่อย
                                </h2>

                                <div className="space-y-4">
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-amber-400 mb-2">
                                            Q: การวิเคราะห์ชื่อมงคลขั้นสูงต่างจากการวิเคราะห์ทั่วไปอย่างไร?
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">
                                            A: การ<strong className="text-white">วิเคราะห์ชื่อมงคลขั้นสูง</strong>นำ &quot;เวลาตกฟาก&quot; มาคำนวณหาลัคนาราศีที่แท้จริง เพื่อดูว่าชื่อส่งผลต่อดวงกำเนิดของคุณในมุมลึกอย่างไร นอกจากนี้ยังสามารถเลือกเน้นเจาะลึกเฉพาะด้านที่ต้องการได้ เช่น <Link href="/name-analysis" className="text-amber-400 hover:text-amber-300 underline">การเงิน การงาน หรือความรัก</Link>
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-amber-400 mb-2">
                                            Q: ทำไมต้องระบุเวลาเกิด?
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">
                                            A: การระบุเวลาเกิดจะช่วยให้คำนวณลัคนาราศีได้แม่นยำขึ้น ซึ่งมีผลต่อการวิเคราะห์ว่าอักษรและตัวเลขในชื่อจะส่งผลอย่างไรกับดวงชะตาเฉพาะบุคคลของคุณ หากไม่ทราบเวลาเกิดสามารถเลือก &quot;ไม่ทราบเวลา&quot; ได้
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-amber-400 mb-2">
                                            Q: วิเคราะห์ชื่อมงคลขั้นสูงใช้กี่เครดิต?
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed">
                                            A: การวิเคราะห์ใช้ <strong className="text-white">50 เครดิต</strong> ต่อ 1 ครั้ง โดยระบบจะแสดงรายชื่อมงคล 20 ชื่อ พร้อมคำอธิบายละเอียดและคะแนน หากต้องการเติมเครดิต สามารถไปที่หน้า <Link href="/topup" className="text-amber-400 hover:text-amber-300 underline">เติมเครดิต</Link> ได้ทันที
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    พร้อมค้นหาชื่อมงคลที่ใช่สำหรับคุณ?
                                </h3>
                                <p className="text-slate-400 mb-6">
                                    เริ่มต้นวิเคราะห์ชื่อมงคลขั้นสูงด้วยศาสตร์ทักษาปกรณ์และเลขศาสตร์ชั้นสูง
                                </p>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-colors shadow-lg shadow-amber-500/20"
                                >
                                    <Sparkles size={20} />
                                    เริ่มวิเคราะห์เลย
                                </button>
                            </div>

                        </section>
                    )}
                    {/* ==================== END SEO CONTENT SECTION ==================== */}

                </div>
            </main>
        </div>
    );
}
