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
            className="relative overflow-hidden bg-[#0f172a] text-white flex flex-col items-center"
            style={{
                width: dimensions.width,
                height: dimensions.height,
                // Ensure text rendering is consistent for capture
                fontFeatureSettings: '"tnum" on,"lnum" on',
            }}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(245,158,11,0.15),transparent_70%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_rgba(168,85,247,0.15),transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

            {/* Content Container */}
            <div className={`relative z-10 w-full h-full flex flex-col items-center ${isStory ? 'justify-between py-24 px-12' : 'justify-center gap-12 p-12'}`}>

                {/* Header / Logo */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-white to-amber-200">
                            NAMEMONGKOL
                        </h1>
                        <p className="text-xl text-amber-500/80 font-medium tracking-[0.2em] uppercase mt-2">
                            Numerology Analysis
                        </p>
                    </div>
                </div>

                {/* Main Result */}
                <div className="flex flex-col items-center text-center w-full max-w-2xl">
                    <div className="flex flex-col items-center gap-2 mb-8">
                        <h2 className="text-6xl font-bold text-white mb-2 leading-tight">
                            {result.name}
                        </h2>
                        {result.surname && (
                            <h2 className="text-5xl font-medium text-slate-300">
                                {result.surname}
                            </h2>
                        )}
                    </div>

                    <div className="relative mb-12">
                        <div className="absolute -inset-8 bg-gradient-to-r from-amber-500/20 to-purple-500/20 blur-3xl rounded-full" />
                        <div className="relative flex flex-col items-center gap-2">
                            <span className="text-2xl text-slate-400 font-medium uppercase tracking-widest">
                                Total Score
                            </span>
                            <span className="text-[10rem] leading-none font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl">
                                {result.totalScore}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full shadow-2xl">
                        <p className="text-3xl text-slate-200 font-medium leading-relaxed">
                            "{result.prediction?.desc}"
                        </p>
                    </div>
                </div>

                {/* Footer/Rank */}
                <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xl text-slate-500 uppercase tracking-widest font-medium">
                            Prediction Level
                        </span>
                        <div className="px-10 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25">
                            <span className="text-4xl font-bold text-white">
                                {result.prediction?.level}
                            </span>
                        </div>
                    </div>

                    {!isStory && (
                        <div className="text-slate-500 font-medium mt-4">
                            namemongkol.com
                        </div>
                    )}
                </div>

                {/* Story Footer */}
                {isStory && (
                    <div className="flex flex-col items-center gap-3 opacity-60">
                        <div className="w-16 h-1 rounded-full bg-white/20" />
                        <span className="text-xl text-slate-400 font-medium tracking-wide">
                            namemongkol.com
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
});

SocialCard.displayName = 'SocialCard';
