'use client';

import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { thaksaConfig } from '@/data/thaksaConfig';
import { HeroBanner } from '@/components/HeroBanner';

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
            {/* HeroBanner moved to parent for LCP optimization */}

            <div className="glass-card p-6 sm:p-8 rounded-2xl shadow-2xl shadow-purple-900/20">
                <div className="space-y-5 sm:space-y-6">
                    <div>
                        <label htmlFor="birth-day" className="block text-sm font-medium text-slate-300 mb-2 ml-1">วันเกิด</label>
                        <div className="relative">
                            <select
                                id="birth-day"
                                value={day}
                                onChange={(e) => onDayChange(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3.5 sm:py-4 text-base sm:text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-200 cursor-pointer"
                            >
                                {Object.entries(thaksaConfig).map(([key, config]) => (
                                    <option key={key} value={key}>{config.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:gap-4">
                        <div>
                            <label htmlFor="input-name" className="block text-sm font-medium text-slate-300 mb-2 ml-1">ชื่อจริง</label>
                            <input
                                id="input-name"
                                type="text"
                                value={name}
                                onChange={(e) => onNameChange(e.target.value)}
                                placeholder="เช่น สมชาย"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 sm:px-4 py-3 sm:py-3 text-base sm:text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <div>
                            <label htmlFor="input-surname" className="block text-sm font-medium text-slate-300 mb-2 ml-1">นามสกุล</label>
                            <input
                                id="input-surname"
                                type="text"
                                value={surname}
                                onChange={(e) => onSurnameChange(e.target.value)}
                                placeholder="เช่น ใจดี"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 sm:px-4 py-3 sm:py-3 text-base sm:text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onAnalyze}
                        disabled={!name || loading}
                        className={`w-full group relative overflow-hidden rounded-xl py-4 sm:py-4 font-semibold text-base sm:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${!name ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25'
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
