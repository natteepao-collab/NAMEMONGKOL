'use client';

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { saveAnalysisResult } from '@/services/analysisService';
import { checkNirunName } from '@/app/actions/checkNirunName';
import { InputForm } from '@/components/InputForm';
import { ResultHeader } from '@/components/ResultHeader';
import { PairAnalysisCard } from '@/components/PairAnalysisCard';
import { ThaksaTable } from '@/components/ThaksaTable';
import { ShadowPowerCard } from '@/components/ShadowPowerCard';
import { PredictionCard } from '@/components/PredictionCard';
import { ShareButton } from '@/components/ShareButton';
import { calculateScore } from '@/utils/calculateScore';
import { analyzePairs } from '@/utils/analyzePairs';
import { analyzeThaksa } from '@/utils/analyzeThaksa';
import { getPrediction } from '@/utils/getPrediction';
import { calculateAyatana } from '@/utils/ayatana';
import { calculateGrade } from '@/utils/gradeResult';
import { AnalysisResult } from '@/types';
import { HeroBanner } from '@/components/HeroBanner';
import { HomeFallback } from '@/components/HomeFallback';
import { useLanguage } from '@/components/LanguageProvider';

// Dynamic Imports for heavy components below the fold or conditional
const WallpaperShowcase = dynamic(() => import('@/components/WallpaperShowcase').then(mod => mod.WallpaperShowcase), {
    loading: () => <div className="h-96 w-full animate-pulse bg-slate-800/50 rounded-2xl" />
});
const WallpaperUpsell = dynamic(() => import('@/components/WallpaperUpsell').then(mod => mod.WallpaperUpsell));
const KnowledgeSection = dynamic(() => import('@/components/KnowledgeSection').then(mod => mod.KnowledgeSection));
const ArticleSection = dynamic(() => import('@/components/ArticleSection').then(mod => mod.ArticleSection));
const FAQSection = dynamic(() => import('@/components/FAQSection').then(mod => mod.FAQSection));
const HomeSeoContent = dynamic(() => import('@/components/HomeSeoContent').then(mod => mod.HomeSeoContent));
const TestimonialSection = dynamic(() => import('@/components/TestimonialSection').then(mod => mod.TestimonialSection));
const WelcomeOffer = dynamic(() => import('@/components/WelcomeOffer').then(mod => mod.WelcomeOffer), { ssr: false });
const UspSection = dynamic(() => import('@/components/UspSection').then(mod => mod.UspSection));
const ComparisonSection = dynamic(() => import('@/components/ComparisonSection').then(mod => mod.ComparisonSection));

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

        const nameScore = calculateScore(inputName);
        const surnameScore = calculateScore(inputSurname);
        const totalScore = nameScore + surnameScore;

        const namePairs = analyzePairs(inputName);
        const surnamePairs = analyzePairs(inputSurname);
        const cleanName = inputName.replace(/\s/g, '');
        const cleanSurname = inputSurname.replace(/\s/g, '');

        // Parallel execution for server check and local calculations
        const [isNirun] = await Promise.all([
            checkNirunName(inputName),
            // Artificial delay to minimalize flicker if needed
            new Promise(resolve => setTimeout(resolve, 800))
        ]);

        // Get predictions
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
            isNirun: isNirun
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
            // Defer execution to avoid synchronous state update warning
            setTimeout(() => {
                performAnalysis(initialName, initialSurname, initialDay);
            }, 0);
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

    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] right-[20%] w-[2px] h-[2px] bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-[40%] left-[10%] w-[3px] h-[3px] bg-amber-200 rounded-full animate-pulse delay-75"></div>
            </div>



            <main className="relative z-10 w-full max-w-[1400px] px-4 sm:px-6 lg:px-12 xl:px-16 pt-24 md:pt-32 pb-28 flex flex-col items-center min-h-[80vh]">

                {!result ? (
                    <div className="w-full max-w-lg flex flex-col items-center">
                        {/* HeroBanner decoupled for LCP - No fade-in delay */}
                        <div className="w-full animate-fade-in">
                            <h2 className="text-center text-amber-200/60 font-medium tracking-widest uppercase text-xs mb-4">
                                {t('home.hero.badge')}
                            </h2>
                            <HeroBanner />
                        </div>
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
                    </div>
                ) : (
                    <div className="w-full max-w-5xl animate-fade-in flex flex-col gap-6">
                        <div className="flex justify-start">
                            <button
                                onClick={resetForm}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" /> {t('home.backHome')}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Main Score & Ayatana (Left Column - 4 cols) */}
                            <div className="md:col-span-4 space-y-6">
                                <ResultHeader result={result} />
                                <ShadowPowerCard name={result.name} surname={result.surname} />
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
                    <UspSection />
                    <ComparisonSection />
                    <HomeSeoContent />
                    <KnowledgeSection />
                    <TestimonialSection />
                    <FAQSection />
                    <ArticleSection />
                </>
            )}

            {/* Footer */}
            <footer className="w-full py-6 text-center text-slate-600 text-sm relative z-10 px-4">
                <p>{t('home.footer')}</p>
            </footer>
        </div>
    );
}

export default function ClientHome() {
    return (
        <Suspense fallback={<HomeFallback />}>
            <HomeContent />
            <WelcomeOffer />
        </Suspense>
    );
}
