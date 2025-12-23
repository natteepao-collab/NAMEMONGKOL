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
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    วิเคราะห์พลัง<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">แห่งนามมงคล</span>
                </h1>
                <p className="text-slate-400">
                    ครบเครื่องเรื่องเลขศาสตร์ ทักษา อายตนะ และคู่ตัวเลข
                </p>
            </div>

            <div className="glass-card p-8 rounded-2xl shadow-2xl shadow-purple-900/20">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">วันเกิด</label>
                        <div className="relative">
                            <select
                                value={day}
                                onChange={(e) => onDayChange(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-slate-200 cursor-pointer"
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
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">นามสกุล</label>
                            <input
                                type="text"
                                value={surname}
                                onChange={(e) => onSurnameChange(e.target.value)}
                                placeholder="เช่น ใจดี"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onAnalyze}
                        disabled={!name || loading}
                        className={`w-full group relative overflow-hidden rounded-xl py-4 font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${!name ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25'
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
