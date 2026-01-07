'use client';

import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { thaksaConfig } from '@/data/thaksaConfig';

interface InputFormProps {
    name: string;
    surname: string;
    day: string;
    onNameChange: (val: string) => void;
    onSurnameChange: (val: string) => void;
    onDayChange: (val: string) => void;
    onAnalyze: () => void;
    loading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
    name,
    surname,
    day,
    onNameChange,
    onSurnameChange,
    onDayChange,
    onAnalyze,
    loading
}) => {
    return (
        <div className="w-full max-w-lg animate-fade-in-up">
            {/* Compact Hero Banner */}
            <div className="relative mb-6">
                <div className="relative bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-xl rounded-2xl p-5 border border-white/10 shadow-2xl overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 group">

                    {/* Decorative Elements */}
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-600" />
                    <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-500/20 transition-colors" />

                    {/* Left Content */}
                    <div className="text-center sm:text-left z-10 flex-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI-Powered Analysis</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                            วิเคราะห์ชื่อ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">มงคลพลิกชีวิต</span>
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                            เจาะลึกศาสตร์ตัวเลข ทักษา อายตนะ ครบจบทันที
                        </p>
                    </div>

                    {/* Right Content / Visual */}
                    <div className="flex gap-2 z-10 shrink-0">
                        <div className="text-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm">
                            <span className="block text-lg font-bold text-amber-400 leading-none">99%</span>
                            <span className="text-[9px] text-slate-500 uppercase font-medium">แม่นยำ</span>
                        </div>
                        <div className="text-center px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm">
                            <span className="block text-lg font-bold text-amber-400 leading-none">AI</span>
                            <span className="text-[9px] text-slate-500 uppercase font-medium">รวดเร็ว</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-5 sm:p-8 rounded-2xl shadow-2xl shadow-purple-900/20">
                <div className="space-y-5 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">วันเกิด</label>
                        <div className="relative">
                            <select
                                value={day}
                                onChange={(e) => onDayChange(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-base sm:text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-200 cursor-pointer"
                            >
                                {Object.entries(thaksaConfig).map(([key, config]) => (
                                    <option key={key} value={key}>{config.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">ชื่อจริง</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => onNameChange(e.target.value)}
                                placeholder="เช่น สมชาย"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-base sm:text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">นามสกุล</label>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => onSurnameChange(e.target.value)}
                                placeholder="เช่น ใจดี"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-base sm:text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onAnalyze}
                        disabled={!name || loading}
                        className={`w-full group relative overflow-hidden rounded-xl py-3.5 sm:py-4 font-semibold text-base sm:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${!name ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25'
                            }`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" /> กำลังวิเคราะห์...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" /> วิเคราะห์ดวงชะตา
                                </>
                            )}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
