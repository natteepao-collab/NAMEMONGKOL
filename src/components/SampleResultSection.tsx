'use client';

import React from 'react';
import { TrendingUp, TrendingDown, ArrowUp } from 'lucide-react';

// Static example data — calculated from calculateScore('สมชาย') and calculateScore('มงคล')
const examples = [
    {
        name: 'สมชาย ใจดี',
        score: 24,
        maxScore: 80,
        grade: 'C',
        label: 'ชื่อที่มีจุดอ่อน',
        color: 'text-red-400',
        bgGrade: 'bg-red-500/20 text-red-400',
        icon: TrendingDown,
        pairs: ['คู่เลข 24 = อุปสรรคเรื่องการเงิน', 'คู่เลข 19 = ต้องระวังสุขภาพ'],
    },
    {
        name: 'มงคล ศิริโชค',
        score: 65,
        maxScore: 80,
        grade: 'A+',
        label: 'ชื่อมงคลเยี่ยม',
        color: 'text-emerald-400',
        bgGrade: 'bg-emerald-500/20 text-emerald-400',
        icon: TrendingUp,
        pairs: ['คู่เลข 46 = การเงินมั่นคง', 'คู่เลข 65 = บารมีเด่น มีคนนับหน้าถือตา'],
    },
];

export const SampleResultSection = () => {
    const scrollToForm = () => {
        const el = document.getElementById('input-name');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => el.focus(), 500);
        }
    };

    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-12 sm:py-16 relative z-10">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                    ตัวอย่าง<span className="text-amber-400">ผลวิเคราะห์จริง</span>
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                    ดูว่าระบบวิเคราะห์ได้ละเอียดแค่ไหน ก่อนลองกับชื่อของคุณเอง
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examples.map((ex, i) => (
                    <div
                        key={i}
                        className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-600/50 transition-all"
                    >
                        {/* Grade badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${ex.bgGrade}`}>
                            {ex.grade}
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg ${i === 0 ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                                <ex.icon className={`w-5 h-5 ${ex.color}`} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">{ex.name}</h3>
                                <span className={`text-xs font-medium ${ex.color}`}>{ex.label}</span>
                            </div>
                        </div>

                        {/* Score bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>คะแนนรวม</span>
                                <span className={`font-bold ${ex.color}`}>{ex.score}/{ex.maxScore}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-gradient-to-r from-red-500 to-red-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`}
                                    style={{ width: `${(ex.score / ex.maxScore) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Sample pairs */}
                        <div className="space-y-2">
                            {ex.pairs.map((pair, j) => (
                                <div key={j} className="flex items-start gap-2 text-xs text-slate-300">
                                    <span className={`mt-0.5 ${ex.color}`}>•</span>
                                    <span>{pair}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
                <button
                    onClick={scrollToForm}
                    data-track="home.sample.try_my_name"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-1 active:scale-[0.98]"
                >
                    <ArrowUp className="w-5 h-5" />
                    ลองกับชื่อของคุณ
                </button>
            </div>
        </section>
    );
};
