'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Smartphone, Search, Loader2 } from 'lucide-react';
import { analyzePhone, PhoneAnalysisResult as IPhoneAnalysisResult } from '@/utils/analyzePhone';
import { PhoneAnalysisResult } from '@/components/PhoneAnalysisResult';
import { PhoneSeoContent } from '@/components/PhoneSeoContent';
import { PhoneFAQSection } from '@/components/PhoneFAQSection';

export default function ClientPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        }>
            <ClientPageContent />
        </React.Suspense>
    );
}

function ClientPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<IPhoneAnalysisResult | null>(null);
    const [error, setError] = useState('');

    // Check URL for number on mount/update
    useEffect(() => {
        const numberParam = searchParams.get('number');
        // Only run if we have a number param, it's valid, and we don't have a result yet (or the result doesn't match)
        if (numberParam && /^\d{10}$/.test(numberParam)) {
            // If the current result matches the param, don't re-analyze
            if (result && result.phoneNumber.replace(/-/g, '') === numberParam) return;

            setPhoneNumber(numberParam);
            performAnalysis(numberParam);
        }
    }, [searchParams]);

    const performAnalysis = async (number: string) => {
        setLoading(true);
        setError('');

        // Simulate API delay for UX (slightly faster for direct link visits)
        await new Promise(resolve => setTimeout(resolve, 500));

        const analysis = await analyzePhone(number);
        if (analysis) {
            setResult(analysis);
        } else {
            setError('เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง');
        }

        setLoading(false);
    };

    const handleAnalyze = async () => {
        setError('');
        if (!phoneNumber) return;

        // Basic validation
        const clean = phoneNumber.replace(/\D/g, '');
        if (clean.length !== 10) {
            setError('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
            return;
        }

        // Update URL - useEffect will handle the analysis
        const params = new URLSearchParams(searchParams.toString());
        params.set('number', clean);
        router.replace(`?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAnalyze();
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
            <main className="w-full max-w-[1400px] transition-all duration-300 min-h-screen px-4 pt-24 md:pt-32 pb-8 relative flex flex-col items-center">

                {/* Background Decor */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
                </div>

                {/* Header Section */}
                {!result && (
                    <div className="relative z-10 text-center mb-12 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/20">
                            <Smartphone className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            วิเคราะห์เบอร์มงคล <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">แม่นยำที่สุด!</span>
                        </h1>
                        <p className="text-2xl md:text-3xl font-semibold text-slate-200 mb-4">
                            เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน
                        </p>
                        <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                            เช็คเบอร์มงคลฟรี ด้วยระบบ AI อัจฉริยะ วิเคราะห์ลึกถึงคู่เลข ผลรวม และกราฟชีวิต
                            รู้ทันทีว่าเบอร์ดีหรือร้าย พร้อมวิธีแก้เคล็ดที่ Namemongkol
                        </p>
                    </div>
                )}

                {/* Input Section */}
                {!result && (
                    <div className="w-full max-w-xl relative z-10 animate-fade-in-up delay-100">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-2 sm:p-3 shadow-2xl backdrop-blur-xl">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 10) setPhoneNumber(val);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="ใส่เบอร์ทั้ง 10 หลัก (เช่น 0812345678)"
                                    className="flex-1 bg-slate-900/50 text-white placeholder:text-slate-500 px-6 py-4 rounded-2xl outline-none border border-transparent focus:border-amber-500/50 transition-all text-lg font-medium text-center sm:text-left tracking-wider"
                                />
                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading || phoneNumber.length !== 10}
                                    className={`
                                        px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 min-w-[160px]
                                        ${phoneNumber.length === 10
                                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/20 cursor-pointer'
                                            : 'bg-slate-700 text-slate-400 cursor-not-allowed'}
                                    `}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                                    <span>ทำนายเบอร์</span>
                                </button>
                            </div>
                        </div>

                        {/* Social Proof & Trust Indicators */}
                        <div className="flex items-center justify-center gap-6 mt-6 text-slate-400 text-xs sm:text-sm font-medium opacity-80">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-700 border-2 border-[#0f172a] flex items-center justify-center text-[8px] text-white">A</div>
                                    <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-[#0f172a] flex items-center justify-center text-[8px] text-white">B</div>
                                    <div className="w-6 h-6 rounded-full bg-slate-500 border-2 border-[#0f172a] flex items-center justify-center text-[8px] text-white">+</div>
                                </div>
                                <span>วิเคราะห์แล้วกว่า 150,000+ เบอร์</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-600" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-emerald-400">★ 4.9/5</span>
                                <span>จากผู้ใช้จริง</span>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-400 text-center mt-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20 text-sm font-medium animate-shake">
                                {error}
                            </p>
                        )}
                    </div>
                )}

                {/* SEO Content - Show only when no result */}
                {!result && (
                    <>
                        <PhoneSeoContent />
                        <PhoneFAQSection />
                    </>
                )}

                {result && (
                    <div className="w-full flex flex-col items-center gap-8 relative z-10">
                        <PhoneAnalysisResult
                            result={result}
                            onReset={() => {
                                window.location.href = '/phone-analysis';
                            }}
                        />

                        <button
                            onClick={() => {
                                window.location.href = '/phone-analysis';
                            }}
                            className="text-slate-400 hover:text-white transition-colors underline underline-offset-4"
                        >
                            วิเคราะห์เบอร์อื่น
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}
