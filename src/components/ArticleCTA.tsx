
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Image as ImageIcon, Phone, Users } from 'lucide-react';

export const ArticleCTA = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 animate-fade-in-up">

            {/* Premium Analysis Card */}
            <Link href="/premium-analysis" className="group relative overflow-hidden rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-purple-500/40 transition-all p-5 hover:bg-slate-800/60">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3 text-purple-400">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">วิเคราะห์ชื่อ Premium</h3>
                        <p className="text-slate-400 text-xs mb-0 line-clamp-2">
                            เจาะลึก 4 ศาสตร์ ทักษา เลขศาสตร์ อายตนะ 6 และพลังเงา
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Wallpapers Card */}
            <Link href="/wallpapers" className="group relative overflow-hidden rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-amber-500/40 transition-all p-5 hover:bg-slate-800/60">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3 text-amber-400">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">วอลเปเปอร์มงคล</h3>
                        <p className="text-slate-400 text-xs mb-0 line-clamp-2">
                            เสริมดวงด้วยภาพหน้าจอมือถือ ออกแบบเฉพาะดวงชะตาคุณ
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Phone Analysis Card */}
            <Link href="/phone-analysis" className="group relative overflow-hidden rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/40 transition-all p-5 hover:bg-slate-800/60">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                            <Phone className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">วิเคราะห์เบอร์มือถือ</h3>
                        <p className="text-slate-400 text-xs mb-0 line-clamp-2">
                            เช็คเบอร์มงคล ผลรวมดี ความหมายรุ่งเรือง
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Bulk Analysis Card */}
            <Link href="/name-analysis" className="group relative overflow-hidden rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/40 transition-all p-5 hover:bg-slate-800/60">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 text-blue-400">
                            <Users className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">วิเคราะห์ชื่อกลุ่ม (Bulk)</h3>
                        <p className="text-slate-400 text-xs mb-0 line-clamp-2">
                            ตรวจสอบหลายชื่อพร้อมกัน เหมาะสำหรับตั้งชื่อลูก
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

        </div>
    );
};
