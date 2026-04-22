'use client';

import React from 'react';
import { Book, Star, Shield, TrendingUp } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import Image from 'next/image';

export const HomeSeoContent = () => {
    const { t } = useLanguage();

    return (
        <section className="w-full max-w-4xl mx-auto mt-16 mb-12 px-4">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        {t('sections.homeSeo.whyTitle')}
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        {t('sections.homeSeo.whyDesc1')}
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        {t('sections.homeSeo.whyDesc2')}
                    </p>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {t('sections.homeSeo.changeTitle')}
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        {t('sections.homeSeo.changeDesc1')}
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        {t('sections.homeSeo.changeDesc2')}
                    </p>
                </div>
            </div>

            <div className="mb-16">
                <div className="text-center mb-10">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold border border-blue-500/20 mb-4 inline-block">
                        {t('sections.homeSeo.pillarBadge')}
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">{t('sections.homeSeo.pillarTitle')}</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        {t('sections.homeSeo.pillarDesc')}
                    </p>
                </div>

                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 px-1 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-5 rounded-xl bg-slate-800/50 border border-white/5 hover:border-amber-500/30 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">1</div>
                        <h3 className="font-bold text-lg text-white mb-2">{t('sections.knowledge.tabs.numerology')}</h3>
                        <p className="text-sm text-slate-400">
                            แปลงค่าอักษรเป็นตัวเลข เพื่อดูอิทธิพลดาวเคราะห์ที่ส่งผลต่อเจ้าชะตา (ผลรวมที่ดี เช่น 14, 15, 24, 45, 59)
                        </p>
                    </div>
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-5 rounded-xl bg-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">2</div>
                        <h3 className="font-bold text-lg text-white mb-2">{t('sections.knowledge.tabs.thaksa')}</h3>
                        <p className="text-sm text-slate-400">
                            ภูมิพยากรณ์ประจำวันเกิด หาอักษรที่เป็น &quot;เดช&quot; &quot;ศรี&quot; &quot;มนตรี&quot; และหลีกเลี่ยง &quot;กาลกิณี&quot; อย่างเด็ดขาด
                        </p>
                    </div>
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-5 rounded-xl bg-slate-800/50 border border-white/5 hover:border-rose-500/30 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-transform">3</div>
                        <h3 className="font-bold text-lg text-white mb-2">{t('sections.knowledge.tabs.ayatana')}</h3>
                        <p className="text-sm text-slate-400">
                            ศาสตร์แห่งการยอมรับทางสังคม สะท้อนว่าคนรอบข้างมองเราอย่างไร (เปรียบเทียบกับคน 9 ประเภท เช่น ราชินี, เศรษฐี)
                        </p>
                    </div>
                    <div className="w-[86%] sm:w-[68%] md:w-auto shrink-0 md:shrink snap-start md:snap-none p-5 rounded-xl bg-slate-800/50 border border-white/5 hover:border-blue-500/30 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">4</div>
                        <h3 className="font-bold text-lg text-white mb-2">{t('sections.knowledge.tabs.nirun')}</h3>
                        <p className="text-sm text-slate-400">
                            หัวใจสำคัญ! ตรวจสอบความสมพงศ์ระหว่าง &quot;ชื่อต้น&quot; และ &quot;นามสกุล&quot; ให้อยู่ร่วมกันแล้วส่งเสริมกัน ไม่ขัดแย้ง
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-white/10 mt-8 hover:shadow-xl transition-shadow bg-slate-900/40">
                <Image
                    src="/banner/ศัพท์น่ารู้ก่อนตั้งชื่ออมงคล-_ทักษา_.webp"
                    alt="ศัพท์น่ารู้ก่อนตั้งชื่อมงคล (ทักษา)"
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority={false}
                />
            </div>
        </section>
    );
};
