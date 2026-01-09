'use client';

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { saveAnalysisResult } from '@/services/analysisService';
import { premiumNamesRaw } from '@/data/premiumNamesRaw';
import { InputForm } from '@/components/InputForm';
import { ResultHeader } from '@/components/ResultHeader';
import { PairAnalysisCard } from '@/components/PairAnalysisCard';
import { ThaksaTable } from '@/components/ThaksaTable';
import { AyatanaCard } from '@/components/AyatanaCard';
import { PredictionCard } from '@/components/PredictionCard';
import { ShareButton } from '@/components/ShareButton';
import { calculateScore } from '@/utils/calculateScore';
import { analyzePairs } from '@/utils/analyzePairs';
import { analyzeThaksa } from '@/utils/analyzeThaksa';
import { getPrediction } from '@/utils/getPrediction';
import { calculateAyatana } from '@/utils/ayatana';
import { calculateGrade } from '@/utils/gradeResult';

import { AnalysisResult } from '@/types';
import { WallpaperShowcase } from '@/components/WallpaperShowcase';
import { WallpaperUpsell } from '@/components/WallpaperUpsell';
import { KnowledgeSection } from '@/components/KnowledgeSection';

function HomeContent() {
    const searchParams = useSearchParams();
    const initialName = searchParams.get('name') ?? '';
    const initialSurname = searchParams.get('surname') ?? '';
    const initialDay = searchParams.get('day') ?? 'sunday';

    const [name, setName] = useState(initialName);
    const [surname, setSurname] = useState(initialSurname);
    const [day, setDay] = useState(initialDay);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const didInitFromParams = useRef(false);

    const performAnalysis = useCallback(async (inputName: string, inputSurname: string, inputDay: string) => {
        if (!inputName.trim()) return;

        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        const nameScore = calculateScore(inputName);
        const surnameScore = calculateScore(inputSurname);
        const totalScore = nameScore + surnameScore;

        const namePairs = analyzePairs(inputName);
        const surnamePairs = analyzePairs(inputSurname);
        const cleanName = inputName.replace(/\s/g, '');
        const cleanSurname = inputSurname.replace(/\s/g, '');

        // Get predictions for all scores
        const namePrediction = getPrediction(nameScore);
        const surnamePrediction = getPrediction(surnameScore);
        const totalPrediction = getPrediction(totalScore);

        const newResult = {
            name: inputName,
            surname: inputSurname,
            nameScore,
            surnameScore,
            totalScore,
            namePairs,
            surnamePairs,
            namePrediction,
            surnamePrediction,
            prediction: totalPrediction,
            thaksa: analyzeThaksa(cleanName, inputDay, cleanSurname),
            ayatana: calculateAyatana(totalScore),
            grade: calculateGrade(totalScore, [...namePairs, ...surnamePairs]),
            isNirun: premiumNamesRaw.split('\n').some(line => line.trim() === inputName.trim())
        };

        setResult(newResult);
        setLoading(false);

        // Auto-save to Supabase
        try {
            await saveAnalysisResult({
                name: inputName,
                surname: inputSurname,
                day: inputDay,
                nameScore,
                surnameScore,
                totalScore
            });
            console.log('Auto-saved analysis result');
        } catch (error) {
            console.error('Failed to auto-save:', error);
        }
    }, []);

    // Handle URL params on first mount
    useEffect(() => {
        if (didInitFromParams.current) return;
        didInitFromParams.current = true;

        if (initialName) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            performAnalysis(initialName, initialSurname, initialDay);
        }
    }, [performAnalysis, initialName, initialSurname, initialDay]);

    const handleAnalyzeClick = () => {
        performAnalysis(name, surname, day);
    };

    const resetForm = () => {
        setResult(null);
        setName('');
        setSurname('');
        window.history.pushState({}, '', '/');
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] right-[20%] w-[2px] h-[2px] bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-[40%] left-[10%] w-[3px] h-[3px] bg-amber-200 rounded-full animate-pulse delay-75"></div>
            </div>

            {/* Header */}
            <nav className="lg:hidden sticky top-0 z-50 w-full px-4 lg:px-6 flex justify-center items-center backdrop-blur-md border-b border-white/5 bg-[#0f172a]/80 h-[calc(env(safe-area-inset-top)+4rem)] pt-[env(safe-area-inset-top)]">
                <Link href="/" className="flex items-center gap-3 group absolute left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
                        <div className="relative w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="hidden md:block w-px h-8 bg-white/10 mx-2"></div>

                    <div className="flex flex-col">
                        <span className="text-lg sm:text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 drop-shadow-sm">
                            NAMEMONGKOL
                        </span>
                        <span className="text-[10px] text-amber-500/80 font-medium tracking-widest uppercase hidden md:block">
                            Numerology Analysis
                        </span>
                    </div>
                </Link>

                <div className="hidden sm:flex items-center gap-6">
                    <Link href="/premium-search" className="text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors relative group">
                        ชื่อมงคลคัดพิเศษ
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-slate-400 hover:text-amber-400 transition-colors relative group">
                        เกี่ยวกับเรา
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 transition-all group-hover:w-full"></span>
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 container mx-auto px-4 py-6 sm:py-8 flex flex-col items-center justify-center min-h-[80vh] pb-[calc(env(safe-area-inset-bottom)+2rem)]">

                {!result ? (
                    <InputForm
                        name={name}
                        surname={surname}
                        day={day}
                        onNameChange={setName}
                        onSurnameChange={setSurname}
                        onDayChange={setDay}
                        onAnalyze={handleAnalyzeClick}
                        loading={loading}
                    />
                ) : (
                    <div className="w-full max-w-5xl animate-fade-in flex flex-col gap-6">
                        <div className="flex justify-start">
                            <button
                                onClick={resetForm}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" /> กลับหน้าหลัก
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Main Score & Ayatana (Left Column - 4 cols) */}
                            <div className="md:col-span-4 space-y-6">
                                <ResultHeader result={result} />
                                <AyatanaCard ayatana={result.ayatana} />
                                <PredictionCard prediction={result.prediction} />
                            </div>

                            {/* Details (Right Column - 8 cols) */}
                            <div className="md:col-span-8 space-y-6">
                                <PairAnalysisCard namePairs={result.namePairs} surnamePairs={result.surnamePairs} />
                                {result.thaksa && <ThaksaTable thaksa={result.thaksa} day={day} />}
                            </div>
                        </div>

                        <div className="mt-4">
                            <WallpaperUpsell result={result} day={day} />
                        </div>

                        <div className="mt-4">
                            <ShareButton result={result} day={day} />
                        </div>
                    </div>
                )}
            </main>

            {!result && (
                <>
                    <WallpaperShowcase />
                    <KnowledgeSection />
                </>
            )}

            {/* Footer */}
            <footer className="w-full py-6 text-center text-slate-600 text-sm relative z-10">
                © 2024 NameMongkol.com - ศาสตร์แห่งตัวเลขเพื่อชีวิตที่ดีกว่า
            </footer>
        </div>
    );
}

export default function ClientHome() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
        }>
            <HomeContent />
        </Suspense>
    );
}
