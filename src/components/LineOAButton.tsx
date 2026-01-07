'use client';

import { MessageCircle } from 'lucide-react';

export const LineOAButton = () => {
    return (
        <a
            href="https://lin.ee/4kpiVlu"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-2 mt-4 flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-[#06C755]/10 hover:border-[#06C755]/30 group transition-all duration-300"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#06C755]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5 text-[#06C755]" fill="currentColor" />
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-bold text-sm tracking-wide">LINE Official</span>
                    <span className="text-slate-400 text-[10px] group-hover:text-[#06C755] transition-colors">สอบถาม / แจ้งปัญหา</span>
                </div>
            </div>

            <div className="w-1.5 h-1.5 rounded-full bg-[#06C755] shadow-[0_0_8px_#06C755]" />
        </a>
    );
};
