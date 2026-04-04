'use client';

import React from 'react';
import { Target, Zap } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export const HeroBanner = () => {
    const { t } = useLanguage();

    return (
        <div className="relative mb-3 sm:mb-6">
            <div className="cosmic-panel ancient-frame relative rounded-[1.75rem] p-5 sm:p-7 overflow-hidden group">

                <div className="absolute inset-0 z-0 bg-[linear-gradient(145deg,rgba(11,14,25,0.82),rgba(18,22,37,0.54))]" />
                <div className="absolute inset-y-0 right-[-5%] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(255,211,128,0.14)_0%,rgba(93,63,168,0.10)_42%,transparent_72%)] blur-3xl" />
                <div className="absolute inset-y-0 left-[-5%] w-[16rem] rounded-full bg-[radial-gradient(circle,rgba(104,67,177,0.14)_0%,transparent_70%)] blur-3xl" />

                <div className="text-center z-10 relative">
                    <div className="mb-3 inline-flex items-center rounded-full border border-amber-200/20 bg-black/25 px-4 py-1.5 text-[11px] uppercase tracking-[0.35em] text-amber-50/88 backdrop-blur-md shadow-[0_0_18px_rgba(245,158,11,0.08)]">
                        ✦ วิเคราะห์ชื่อมงคล
                    </div>

                    <h1 className="cosmic-text-crisp text-[1.4rem] sm:text-[2rem] font-bold leading-tight mb-2 sm:mb-3 tracking-tight">
                        {t('home.hero.titlePrefix')}<span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(245,158,11,0.30)]">{t('home.hero.titleHighlight')}</span>{t('home.hero.titleFree') ? <span className="text-amber-400"> {t('home.hero.titleFree')}</span> : <span className="text-amber-400">:</span>}{' '}
                        <span className="bg-gradient-to-r from-[#fde047] via-[#fbbf24] to-[#fde047] bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(253,224,71,0.28)]">{t('home.hero.titleSuffix')}</span>
                    </h1>

                    <p className="cosmic-text-soft max-w-lg mx-auto text-xs leading-relaxed sm:text-sm line-clamp-2 sm:line-clamp-none mb-4">
                        {t('home.hero.description')}
                    </p>

                    {/* Stats inline */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="cosmic-chip flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md">
                            <Target className="w-4 h-4 text-emerald-300" />
                            <span className="text-sm font-bold text-white">99%</span>
                            <span className="text-[10px] uppercase tracking-wide text-slate-300/80">{t('home.hero.statAccuracy')}</span>
                        </div>
                        <div className="cosmic-chip flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-bold text-white">AI</span>
                            <span className="text-[10px] uppercase tracking-wide text-slate-300/80">{t('home.hero.statSpeed')}</span>
                        </div>
                    </div>

                    <p className="mt-3 text-[11px] text-emerald-300/80 font-medium tracking-wide">
                        ✨ ลองฟรีทันที ไม่ต้องสมัครสมาชิก
                    </p>
                </div>

            </div>
        </div>
    );
};
