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
            <div className="glass-card ancient-frame rounded-[1.75rem] p-6 shadow-2xl shadow-purple-900/20 sm:p-8">
                <div className="space-y-5 sm:space-y-6">
                    <div>
                        <label htmlFor="birth-day" className="cosmic-label mb-2 ml-1 block text-sm font-medium tracking-wide">วันเกิด</label>
                        <div className="relative">
                            <select
                                id="birth-day"
                                value={day}
                                onChange={(e) => onDayChange(e.target.value)}
                                className="cosmic-input cosmic-text-crisp w-full cursor-pointer rounded-xl px-4 py-3.5 text-base outline-none transition-all sm:text-lg"
                            >
                                {Object.entries(thaksaConfig).map(([key, config]) => (
                                    <option key={key} value={key}>{config.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:gap-4">
                        <div>
                            <label htmlFor="input-name" className="cosmic-label mb-2 ml-1 block text-sm font-medium tracking-wide">ชื่อจริง</label>
                            <input
                                id="input-name"
                                type="text"
                                value={name}
                                onChange={(e) => onNameChange(e.target.value)}
                                placeholder="เช่น สมชาย"
                                className="cosmic-input cosmic-text-crisp cosmic-muted-placeholder w-full rounded-xl px-3 py-3 text-base outline-none transition-all sm:px-4 sm:text-lg"
                            />
                        </div>
                        <div>
                            <label htmlFor="input-surname" className="cosmic-label mb-2 ml-1 block text-sm font-medium tracking-wide">นามสกุล</label>
                            <input
                                id="input-surname"
                                type="text"
                                value={surname}
                                onChange={(e) => onSurnameChange(e.target.value)}
                                placeholder="เช่น ใจดี"
                                className="cosmic-input cosmic-text-crisp cosmic-muted-placeholder w-full rounded-xl px-3 py-3 text-base outline-none transition-all sm:px-4 sm:text-lg"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onAnalyze}
                        disabled={!name || loading}
                        data-track="home.hero.analyze"
                        className={`w-full group relative overflow-hidden rounded-xl py-4 font-semibold text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] sm:text-lg ${!name ? 'cosmic-button-disabled cursor-not-allowed' : 'cosmic-primary-button'
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
