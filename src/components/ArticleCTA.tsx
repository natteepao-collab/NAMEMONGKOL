
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';

export const ArticleCTA = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12 animate-fade-in-up">

            {/* Premium Analysis Card */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/20 hover:border-purple-500/40 transition-all p-6">
                <div className="absolute inset-0 bg-purple-600/5 group-hover:bg-purple-600/10 transition-colors"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>

                <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">วิเคราะห์ชื่อแบบเจาะลึก?</h3>
                    <p className="text-slate-400 text-sm mb-6 min-h-[40px]">
                        เช็กผลรวมคู่, ทักษาปกรณ์ (กาลกิณี) และอายตนะ 6 เพื่อความมงคลสูงสุด
                    </p>
                    <Link
                        href="/premium-analysis"
                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition-colors group-hover:gap-3"
                    >
                        ดูวิเคราะห์ Premium <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Wallpapers Card */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/40 to-slate-900/40 border border-amber-500/20 hover:border-amber-500/40 transition-all p-6">
                <div className="absolute inset-0 bg-amber-600/5 group-hover:bg-amber-600/10 transition-colors"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>

                <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">เสริมดวงด้วยวอลเปเปอร์</h3>
                    <p className="text-slate-400 text-sm mb-6 min-h-[40px]">
                        ออกแบบเฉพาะคุณด้วยสีและเลขมงคล ปลดล็อคพลังความเฮงหน้าจอมือถือ
                    </p>
                    <Link
                        href="/wallpapers"
                        className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold transition-colors group-hover:gap-3"
                    >
                        เลือกวอลเปเปอร์ <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

        </div>
    );
};
