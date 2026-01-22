'use client';

import React from 'react';
import { Target, Zap } from 'lucide-react';

export const HeroBanner = () => {
    return (
        <div className="relative mb-6">
            <div className="relative bg-[#0F172A] rounded-2xl p-6 border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 group">

                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-900 z-0" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                {/* Gold Accent Line */}
                <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10" />

                {/* Left Content */}
                <div className="text-center sm:text-left z-10 flex-1 pl-2 relative">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm shadow-sm group-hover:border-emerald-500/30 transition-colors">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">AI-Powered Analysis</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3 tracking-tight">
                        วิเคราะห์<span className="text-emerald-400">ชื่อมงคลฟรี</span>: <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 drop-shadow-[0_2px_10px_rgba(251,191,36,0.2)]">พลิกชีวิต</span> ปลดล็อคดวงชะตาเศรษฐี
                    </h1>

                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed max-w-lg mb-2">
                        <span className="text-amber-400 font-semibold">"เปลี่ยนชื่อ เปลี่ยนชีวิต"</span> ตรวจสอบดวงชะตาที่ซ่อนอยู่ในชื่อของคุณด้วย <strong>4 ศาสตร์ศักดิ์สิทธิ์</strong>: เลขศาสตร์, ทักษาปกรณ์, อายตนะ 6 และนิรันดร์ศาสตร์ แม่นยำที่สุดด้วยระบบ AI
                    </p>
                </div>

                {/* Right Content / Stats Cards */}
                <div className="flex gap-3 z-10 shrink-0">
                    {/* Accuracy Card */}
                    <div className="flex flex-col items-center justify-center w-20 h-20 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-md shadow-lg group-hover:border-emerald-500/30 transition-colors relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Target className="w-5 h-5 text-emerald-400 mb-1" />
                        <span className="block text-lg font-bold text-white leading-none">99%</span>
                        <span className="text-[9px] text-slate-400 uppercase font-medium tracking-wide">แม่นยำ</span>
                    </div>

                    {/* AI / Speed Card */}
                    <div className="flex flex-col items-center justify-center w-20 h-20 rounded-xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-md shadow-lg group-hover:border-amber-500/30 transition-colors relative overflow-hidden">
                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Zap className="w-5 h-5 text-amber-400 mb-1" />
                        <span className="block text-lg font-bold text-white leading-none">AI</span>
                        <span className="text-[9px] text-slate-400 uppercase font-medium tracking-wide">รวดเร็ว</span>
                    </div>
                </div>

            </div>
        </div>
    );
};
