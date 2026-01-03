import React, { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { AnalysisResult } from '@/types';
import { calculateScore } from '@/utils/calculateScore';

interface SocialCardProps {
    result: AnalysisResult;
    format: 'story' | 'post';
}

export const SocialCard = forwardRef<HTMLDivElement, SocialCardProps>(({ result, format }, ref) => {
    const isStory = format === 'story';

    // Size reference (will be scaled down by CSS transform for preview, 
    // but captured at full resolution by html2canvas)
    // Story: 1080x1920, Post: 1080x1080
    const dimensions = isStory
        ? { width: 1080, height: 1920 }
        : { width: 1080, height: 1080 };

    return (
        <div
            ref={ref}
            className="relative overflow-hidden bg-[#0f172a] text-white flex flex-col"
            style={{
                width: dimensions.width,
                height: dimensions.height,
                fontFeatureSettings: '"tnum" on,"lnum" on',
            }}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(245,158,11,0.15),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_rgba(168,85,247,0.15),transparent_70%)]" />

            <div className={`relative z-10 w-full h-full flex flex-col ${isStory ? 'p-12' : 'p-10'} justify-between`}>

                {/* Header */}
                <div className="flex flex-col items-center gap-4 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-white to-amber-200">
                                NAMEMONGKOL
                            </h1>
                            <p className="text-xs text-amber-500/80 font-medium tracking-[0.2em] uppercase">
                                Numerology Analysis
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex flex-col gap-6 items-center flex-1 justify-center">

                    {/* Name & Grade Section */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
                            <span className="text-amber-400 font-bold">Grade</span>
                            <span className={`text-xl font-black ${result.grade === 'A+' ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200' : 'text-white'}`}>
                                {result.grade || '-'}
                            </span>
                        </div>
                        <h2 className="text-5xl font-bold text-white leading-tight">
                            {result.name}
                        </h2>
                        {result.surname && (
                            <h3 className="text-3xl text-slate-400 font-medium">
                                {result.surname}
                            </h3>
                        )}
                    </div>

                    {/* Scores Breakdown */}
                    <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-4">
                        <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">ชื่อ</span>
                            <span className="text-2xl font-bold text-white">{result.nameScore}</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-amber-500/10 blur-xl"></div>
                            <span className="relative text-xs text-amber-200 uppercase tracking-wider mb-1">ผลรวม</span>
                            <span className="relative text-4xl font-black text-amber-400">{result.totalScore}</span>
                        </div>
                        <div className="flex flex-col items-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">นามสกุล</span>
                            <span className="text-2xl font-bold text-white">{result.surnameScore || '-'}</span>
                        </div>
                    </div>

                    {/* Prediction Box */}
                    <div className="w-full max-w-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

                        <h4 className="text-lg font-bold text-amber-200 mb-2">คำทำนายผลรวม</h4>
                        <p className="text-xl text-slate-100 font-medium leading-relaxed mb-4">
                            "{result.prediction?.desc}"
                        </p>

                        <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/10">
                            <div className="flex flex-col items-center">
                                <span className="text-xs text-slate-500 uppercase">ระดับความมงคล</span>
                                <span className="text-lg font-bold text-emerald-400">{result.prediction?.level}</span>
                            </div>
                            {result.ayatana && (
                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-slate-500 uppercase">อายตนะ 6</span>
                                    <span className="text-lg font-bold text-blue-400">{result.ayatana.title}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Extra Details (Only for Story or if ample space) */}
                    {(isStory && result.thaksa) && (
                        <div className="flex gap-3 mt-2">
                            {!result.thaksa.hasKali && (
                                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-bold flex items-center gap-2">
                                    <span>✓ ไม่มีกาลกิณี</span>
                                </div>
                            )}
                            {result.ayatana && (
                                <div className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold">
                                    <span>★ {result.ayatana.desc}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center pt-8 opacity-60">
                    <span className="text-sm text-slate-400 font-medium tracking-wide">
                        www.namemongkol.com
                    </span>
                </div>
            </div>
        </div>
    );
});


SocialCard.displayName = 'SocialCard';
