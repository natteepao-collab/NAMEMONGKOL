import React, { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';
import { AnalysisResult } from '@/types';


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
            className="flex flex-col relative overflow-hidden"
            style={{
                width: dimensions.width,
                height: dimensions.height,
                fontFeatureSettings: '"tnum" on,"lnum" on',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                backgroundColor: '#0f172a',
                color: 'white',
            }}
        >
            {/* Background Effects */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(245,158,11,0.15), transparent 70%)'
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle at 50% 100%, rgba(168,85,247,0.15), transparent 70%)'
                }}
            />

            <div
                className={`relative z-10 w-full h-full flex flex-col justify-between ${isStory ? 'p-12' : 'p-10'}`}
                style={{
                    padding: isStory ? '3rem' : '2.5rem'
                }}
            >

                {/* Header */}
                <div className="flex flex-col items-center gap-4 pt-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{
                                backgroundImage: 'linear-gradient(to top right, #fbbf24, #d97706)',
                                boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3), 0 4px 6px -4px rgba(245, 158, 11, 0.3)'
                            }}
                        >
                            <Sparkles className="w-6 h-6" style={{ color: 'white' }} />
                        </div>
                        <div className="text-left">
                            <h1
                                className="text-2xl font-bold tracking-widest"
                                style={{
                                    color: '#fde68a',
                                    textShadow: '0 0 10px rgba(253, 230, 138, 0.3)'
                                }}
                            >
                                NAMEMONGKOL
                            </h1>
                            <p
                                className="text-xs font-medium tracking-[0.2em] uppercase"
                                style={{ color: 'rgba(245, 158, 11, 0.8)' }}
                            >
                                Numerology Analysis
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="flex flex-col gap-6 items-center flex-1 justify-center">

                    {/* Name & Grade Section */}
                    <div className="flex flex-col items-center text-center gap-2">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1 rounded-full mb-2 backdrop-blur-md"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <span className="font-bold" style={{ color: '#fbbf24' }}>Grade</span>
                            <span
                                className="text-xl font-black"
                                style={{
                                    color: result.grade === 'A+' ? '#fcd34d' : 'white',
                                    textShadow: result.grade === 'A+' ? '0 0 10px rgba(253, 230, 138, 0.5)' : 'none'
                                }}
                            >
                                {result.grade || '-'}
                            </span>
                        </div>
                        <h2 className="text-5xl font-bold leading-tight" style={{ color: 'white' }}>
                            {result.name}
                        </h2>
                        {result.surname && (
                            <h3 className="text-3xl font-medium" style={{ color: '#94a3b8' }}>
                                {result.surname}
                            </h3>
                        )}
                    </div>

                    {/* Scores Breakdown */}
                    <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-4">
                        <div
                            className="flex flex-col items-center p-4 rounded-2xl backdrop-blur-sm"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <span className="text-xs uppercase tracking-wider mb-1" style={{ color: '#94a3b8' }}>ชื่อ</span>
                            <span className="text-2xl font-bold" style={{ color: 'white' }}>{result.nameScore}</span>
                        </div>
                        <div
                            className="flex flex-col items-center p-4 rounded-2xl backdrop-blur-sm relative overflow-hidden"
                            style={{
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.3)'
                            }}
                        >
                            <div className="absolute inset-0 blur-xl" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}></div>
                            <span className="relative text-xs uppercase tracking-wider mb-1" style={{ color: '#fde68a' }}>ผลรวม</span>
                            <span className="relative text-4xl font-black" style={{ color: '#fbbf24' }}>{result.totalScore}</span>
                        </div>
                        <div
                            className="flex flex-col items-center p-4 rounded-2xl backdrop-blur-sm"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <span className="text-xs uppercase tracking-wider mb-1" style={{ color: '#94a3b8' }}>นามสกุล</span>
                            <span className="text-2xl font-bold" style={{ color: 'white' }}>{result.surnameScore || '-'}</span>
                        </div>
                    </div>

                    {/* Prediction Box */}
                    <div
                        className="w-full max-w-2xl backdrop-blur-xl rounded-3xl p-6 text-center relative overflow-hidden"
                        style={{
                            backgroundImage: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 w-full h-1"
                            style={{
                                backgroundImage: 'linear-gradient(to right, transparent, #f59e0b, transparent)',
                                opacity: 0.5
                            }}
                        ></div>

                        <h4 className="text-lg font-bold mb-2" style={{ color: '#fde68a' }}>คำทำนายผลรวม</h4>
                        <p className="text-xl font-medium leading-relaxed mb-4" style={{ color: '#f1f5f9' }}>
                            &quot;{result.prediction?.desc}&quot;
                        </p>

                        <div
                            className="flex items-center justify-center gap-6 pt-4"
                            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
                        >
                            <div className="flex flex-col items-center">
                                <span className="text-xs uppercase" style={{ color: '#64748b' }}>ระดับความมงคล</span>
                                <span className="text-lg font-bold" style={{ color: '#34d399' }}>{result.prediction?.level}</span>
                            </div>
                            {result.ayatana && (
                                <div className="flex flex-col items-center">
                                    <span className="text-xs uppercase" style={{ color: '#64748b' }}>อายตนะ 6</span>
                                    <span className="text-lg font-bold" style={{ color: '#60a5fa' }}>{result.ayatana.title}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Extra Details (Only for Story or if ample space) */}
                    {(isStory && result.thaksa) && (
                        <div className="flex gap-3 mt-2">
                            {!result.thaksa.hasKali && (
                                <div
                                    className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                                    style={{
                                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                        color: '#6ee7b7'
                                    }}
                                >
                                    <span>✓ ไม่มีกาลกิณี</span>
                                </div>
                            )}
                            {result.ayatana && (
                                <div
                                    className="px-4 py-2 rounded-xl text-sm font-bold"
                                    style={{
                                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        color: '#93c5fd'
                                    }}
                                >
                                    <span>★ {result.ayatana.desc}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center pt-8" style={{ opacity: 0.6 }}>
                    <span className="text-sm font-medium tracking-wide" style={{ color: '#94a3b8' }}>
                        www.namemongkol.com
                    </span>
                </div>
            </div>
        </div>
    );
});


SocialCard.displayName = 'SocialCard';
