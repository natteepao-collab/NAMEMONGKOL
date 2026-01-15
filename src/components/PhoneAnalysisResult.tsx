'use client';

import { useState } from 'react';
import { PhoneAnalysisResult as IPhoneAnalysisResult } from '@/utils/analyzePhone';
import { Activity, Brain, Heart, Share2, Skull, Crown, TrendingUp, Clover, Eye, Facebook, Link as LinkIcon, Check, Copy, X, ExternalLink, Search } from 'lucide-react';

// Custom Line Icon since Lucide doesn't include it
const LineIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.992 2.572-3.879 2.572-6.002z" />
    </svg>
);

interface PhoneAnalysisResultProps {
    result: IPhoneAnalysisResult;
}

export const PhoneAnalysisResult: React.FC<PhoneAnalysisResultProps> = ({ result }) => {
    const [isCopied, setIsCopied] = useState(false);

    // Split pairs into Good/Neutral vs Bad
    const goodPairs = result.pairs.filter(p => p.level !== 2);
    const badPairs = result.pairs.filter(p => p.level === 2);

    const handleShare = (platform: 'facebook' | 'line' | 'copy') => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const title = `ผลวิเคราะห์เบอร์มงคล: ${result.phoneNumber} - เกรด ${result.grade}`;

        if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank', 'noopener,noreferrer');
        } else if (platform === 'line') {
            window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(url).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    const StatBar = ({ label, score, icon: Icon }: { label: string, score: { pos: number, neg: number }, icon: any }) => {
        // Dual-Sided Logic:
        // Left Side (Red) -> Based on score.neg (0-100)
        // Right Side (Green) -> Based on score.pos (0-100)

        // Calculate segments (0 to 5)
        // Each segment represents 20 points
        const negFilled = Math.min(5, Math.ceil(score.neg / 20));
        const posFilled = Math.min(5, Math.ceil(score.pos / 20));

        // Extremity Flags
        const isCritical = score.neg >= 80; // Very high negative score -> Show Skull
        const isExcellent = score.pos >= 80; // Very high positive score -> Show Crown

        return (
            <div className="flex flex-col items-center w-full group">
                <span className="text-amber-500 font-bold text-[10px] mb-1 uppercase tracking-wide">{label}</span>

                <div className="flex items-center gap-2 w-full max-w-sm">

                    {/* Left Side (Red) - Fills Right to Left from Center */}
                    <div className="flex-1 flex items-center justify-end gap-1">
                        {/* Skull Icon */}
                        <div className={`w-5 flex justify-center transition-all duration-300 ${isCritical ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-rose-500 blur-sm opacity-50 animate-pulse"></div>
                                <Skull className="text-rose-500 w-4 h-4 relative z-10" />
                            </div>
                        </div>

                        {/* Segments (Right to Left logic) */}
                        <div className="flex flex-row-reverse gap-0.5 flex-1">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={`l-${i}`}
                                    className={`
                                        h-2.5 flex-1 rounded-[1px] skew-x-[-12deg] border border-white/5 transition-all duration-500
                                        ${i < negFilled
                                            ? 'bg-gradient-to-r from-rose-600 to-rose-500 shadow-[0_0_4px_rgba(225,29,72,0.6)]'
                                            : 'bg-slate-700/30'}
                                    `}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Center Icon */}
                    <div className="relative z-10 shrink-0">
                        <div className="absolute inset-0 bg-amber-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg border-[3px] border-[#1e293b] relative">
                            <Icon className="text-white w-5 h-5 drop-shadow-sm" />
                        </div>
                    </div>

                    {/* Right Side (Green) - Fills Left to Right from Center */}
                    <div className="flex-1 flex items-center gap-1">
                        {/* Segments */}
                        <div className="flex gap-0.5 flex-1">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={`r-${i}`}
                                    className={`
                                        h-2.5 flex-1 rounded-[1px] skew-x-[-12deg] border border-white/5 transition-all duration-500
                                        ${i < posFilled
                                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_0_4px_rgba(16,185,129,0.6)]'
                                            : 'bg-slate-700/30'}
                                    `}
                                />
                            ))}
                        </div>

                        {/* Crown Icon */}
                        <div className={`w-5 flex justify-center transition-all duration-300 ${isExcellent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-amber-400 blur-sm opacity-50 animate-pulse"></div>
                                <Crown className="text-amber-400 w-4 h-4 relative z-10 drop-shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    const PairBox = ({ type, pairs }: { type: 'good' | 'bad', pairs: typeof result.pairs }) => {
        const isGood = type === 'good';
        const title = isGood ? 'เลขดี' : 'เลขเสีย';

        // Tailwind classes handling for dynamic colors
        const containerBorder = isGood ? 'border-emerald-500/30' : 'border-rose-500/30';
        const titleBg = isGood ? 'bg-emerald-600' : 'bg-rose-600';
        const pairBg = isGood ? 'bg-emerald-500' : 'bg-rose-500';

        return (
            <div className={`relative border rounded-lg rounded-tl-none pt-5 p-3 ${containerBorder} bg-[#1e293b]/50`}>
                {/* Folder Tab */}
                <div className={`absolute -top-[1px] -left-[1px] px-4 py-1 rounded-t-md rounded-br-md text-white text-[10px] font-bold uppercase tracking-wider shadow-md ${titleBg}`}>
                    {title}
                </div>

                {pairs.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {pairs.map((p, idx) => {
                            // Determine color based on individual pair level
                            const chipColor = p.level === 1
                                ? 'bg-emerald-500 shadow-emerald-500/20'
                                : p.level === 2
                                    ? 'bg-rose-500 shadow-rose-500/20'
                                    : 'bg-amber-500 shadow-amber-500/20';

                            return (
                                <div key={idx} className={`w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold text-white shadow-md ${chipColor}`}>
                                    {p.pair}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-slate-500 text-xs italic py-1">ไม่มี{title}ในเบอร์นี้</div>
                )}
            </div>
        );
    };

    const HeroShareBanner = () => {
        return (
            <div className="relative w-full overflow-hidden rounded-2xl bg-[#0f172a] border border-slate-700/50 shadow-2xl group select-none">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />

                <div className="relative z-10 flex flex-col md:flex-row items-center p-6 sm:p-8 gap-6 md:gap-8">
                    {/* Left: Branding & Grade */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <span className="text-lg">🔮</span>
                            </div>
                            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">NameMongkol Analysis</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-sm font-mono">
                            {result.phoneNumber}
                        </h3>
                        <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full mx-auto md:mx-0" />
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md pt-2">
                            {result.prediction}
                        </p>
                    </div>

                    {/* Right: Big Grade Circle */}
                    <div className="shrink-0 relative">
                        <div className={`absolute inset-0 blur-2xl opacity-40 rounded-full ${result.grade.startsWith('A') ? 'bg-emerald-500' : result.grade.startsWith('B') ? 'bg-blue-500' : 'bg-amber-500'}`} />
                        <div className={`
                            w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 border-[#0f172a] shadow-2xl relative z-10
                            ${result.grade.startsWith('A')
                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                                : result.grade.startsWith('B')
                                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'
                                    : 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'}
                        `}>
                            <span className="text-5xl font-black tracking-tighter drop-shadow-md leading-none mt-1">{result.grade}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wide opacity-90 mt-1">Grade</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Strip */}
                <div className="flex items-center justify-between px-6 py-3 bg-slate-900/50 border-t border-slate-800 backdrop-blur-sm">
                    <span className="text-[10px] text-slate-500 font-mono">NAMEMONGKOL.COM</span>
                    <div className="flex gap-1.5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-1 h-1 rounded-full ${i < 4 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl animate-fade-in space-y-4 pb-8">

            {/* Main Result Card */}
            <div className="bg-[#1e293b]/90 backdrop-blur-xl rounded-2xl p-4 lg:p-6 border border-slate-700/50 shadow-xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Number & Analysis Boxes */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="text-center lg:text-left">
                            <h2 className="text-amber-500 font-medium tracking-wide uppercase text-[10px] mb-1">ผลวิเคราะห์ทำนายเบอร์</h2>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-mono mb-2 text-shadow-md">
                                {result.phoneNumber}
                            </h1>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-3" />
                        </div>

                        {/* Split Good/Bad Boxes */}
                        <div className="space-y-3">
                            <PairBox type="good" pairs={goodPairs} />

                            {badPairs.length > 0 && (
                                <div className="space-y-2 animate-pulse-gentle">
                                    <PairBox type="bad" pairs={badPairs} />
                                    <div className="flex items-center justify-center gap-2 text-rose-400 bg-rose-500/10 p-1.5 rounded-md border border-rose-500/20 shadow-inner shadow-rose-900/20 text-xs">
                                        <Skull size={14} />
                                        <span className="font-semibold">เบอร์ส่งผลเสีย แนะนำให้เปลี่ยน</span>
                                    </div>

                                    {/* Conversion CTA for Bad Numbers */}
                                    <a
                                        href="/search"
                                        className="block w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-center py-3 rounded-xl font-bold text-sm shadow-lg shadow-amber-900/20 transition-all hover:scale-[1.02] active:scale-95 animate-bounce-gentle"
                                    >
                                        เปลี่ยนเบอร์ร้ายให้กลายเป็นดี คลิก!
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Stats Center-Out */}
                    <div className="lg:col-span-7 flex flex-col justify-center gap-4 pl-0 lg:pl-6 relative">
                        {/* Divider for Desktop */}
                        <div className="absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent hidden lg:block" />

                        {/* Enhanced Desktop Grade Badge */}
                        <div className="hidden lg:flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 mb-2 self-center w-full max-w-md relative group overflow-hidden">
                            <div className={`absolute inset-0 opacity-10 blur-xl transition-opacity group-hover:opacity-20
                                ${result.grade.startsWith('A') ? 'bg-emerald-500' :
                                    result.grade.startsWith('B') ? 'bg-blue-500' : 'bg-amber-500'}
                             `} />

                            <div className={`
                                w-20 h-20 shrink-0 rounded-2xl flex flex-col items-center justify-center text-white shadow-2xl border-[3px] border-white/10 relative z-10
                                ${result.grade.startsWith('A') ? 'bg-gradient-to-br from-emerald-500 to-emerald-800' :
                                    result.grade.startsWith('B') ? 'bg-gradient-to-br from-blue-500 to-blue-800' :
                                        'bg-gradient-to-br from-amber-500 to-amber-800'}
                            `}>
                                <span className="text-4xl font-black leading-none mt-1 drop-shadow-md">{result.grade}</span>
                                <span className="text-[9px] font-bold uppercase opacity-80 mt-0.5">Grade</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">ผลทำนายเกรดเบอร์มงคล</p>
                                <p className="text-white font-semibold text-sm leading-relaxed">{result.prediction}</p>
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <div className="flex items-center justify-between mb-3 px-2">
                                <h3 className="text-base font-bold text-slate-300">กราฟสรุปคะแนน</h3>
                                <div className="flex items-center gap-3 text-[9px] text-slate-500 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                        <span>จุดอ่อน</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span>จุดแข็ง</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 px-1">
                                <StatBar label="การเงิน/การงาน" score={result.stats.finance} icon={TrendingUp} />
                                <StatBar label="โชคลาภ" score={result.stats.luck} icon={Clover} />
                                <StatBar label="เสน่ห์/ความรัก" score={result.stats.love} icon={Heart} />
                                <StatBar label="สุขภาพ" score={result.stats.health} icon={Activity} />
                                <StatBar label="สติปัญญา" score={result.stats.intellect} icon={Brain} />
                                <StatBar label="เซนส์" score={result.stats.sense} icon={Eye} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Pairs Breakdown List */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2 px-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">ความหมายคู่เลขของคุณ</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.pairs.map((pair, idx) => (
                        <div key={idx} className={`
                            relative overflow-hidden group rounded-xl border bg-[#1e293b] transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200
                            ${pair.level === 1
                                ? 'border-emerald-500/20 hover:border-emerald-500/40 shadow-emerald-900/5'
                                : pair.level === 2
                                    ? 'border-rose-500/20 hover:border-rose-500/40 shadow-rose-900/5'
                                    : 'border-amber-500/20 hover:border-amber-500/40 shadow-amber-900/5'}
                        `}>
                            {/* Background Glow */}
                            <div className={`
                                absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity
                                ${pair.level === 1 ? 'bg-emerald-500' : pair.level === 2 ? 'bg-rose-500' : 'bg-amber-500'}
                            `} />

                            <div className="flex h-full">
                                {/* Header Section (Number) */}
                                <div className={`
                                    w-24 shrink-0 flex flex-col items-center justify-center gap-1 border-r border-white/5 p-3
                                    ${pair.level === 1 ? 'bg-emerald-500/5' : pair.level === 2 ? 'bg-rose-500/5' : 'bg-amber-500/5'}
                                `}>
                                    <div className={`
                                        text-3xl font-black drop-shadow-sm
                                        ${pair.level === 1 ? 'text-emerald-400' : pair.level === 2 ? 'text-rose-400' : 'text-amber-400'}
                                    `}>
                                        {pair.pair}
                                    </div>
                                    <div className={`
                                        px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide border mt-1
                                        ${pair.level === 1 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                                            pair.level === 2 ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' :
                                                'bg-amber-500/10 border-amber-500/20 text-amber-300'}
                                    `}>
                                        {pair.level === 1 ? 'มงคล' : pair.level === 2 ? 'ระวัง' : 'ทั่วไป'}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4 flex-1 relative z-10 flex flex-col justify-center">
                                    <h4 className={`text-sm font-bold mb-1.5 ${pair.level === 1 ? 'text-emerald-300' : pair.level === 2 ? 'text-rose-300' : 'text-amber-300'
                                        }`}>
                                        {pair.title}
                                    </h4>
                                    <p className="text-slate-300 text-xs leading-5 font-normal mb-3 line-clamp-3">
                                        {pair.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {pair.tags?.slice(0, 3).map((tag, t) => (
                                            <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-black/20 border border-white/5 text-slate-500 transition-colors group-hover:border-white/10 group-hover:text-slate-400">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Share Section with Hero Banner */}
            <div className="pt-8 space-y-4">
                <div className="flex items-center gap-2 px-2 mb-2">
                    <Share2 className="w-5 h-5 text-amber-400" />
                    <h3 className="text-lg font-bold text-white">แชร์ผลวิเคราะห์ของคุณ</h3>
                </div>

                <HeroShareBanner />

                <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-700/50 flex flex-col md:flex-row gap-4 items-center">
                    {/* URL Input */}
                    <div className="flex-1 w-full bg-[#0f172a] rounded-lg border border-slate-700 flex items-center pl-4 pr-1 py-1 relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <LinkIcon size={14} className="text-slate-500" />
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={typeof window !== 'undefined' ? window.location.href : ''}
                            className="bg-transparent text-slate-400 text-sm w-full pl-6 pr-2 py-2.5 outline-none font-mono"
                        />
                        <button
                            onClick={() => handleShare('copy')}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-md font-bold text-xs transition-all
                                ${isCopied
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-slate-700 text-white hover:bg-slate-600'}
                            `}
                        >
                            {isCopied ? <Check size={14} /> : <Copy size={14} />}
                            {isCopied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                        </button>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex gap-2 shrink-0 w-full md:w-auto">
                        <button
                            onClick={() => handleShare('facebook')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#1877F2]/20"
                        >
                            <Facebook size={18} />
                            <span className="md:hidden">Facebook</span>
                        </button>
                        <button
                            onClick={() => handleShare('line')}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#06C755]/20"
                        >
                            <LineIcon size={18} />
                            <span className="md:hidden">Line</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={() => window.location.href = '/phone-analysis'}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm transition-all border border-slate-700 hover:border-slate-500"
                >
                    <Search size={16} />
                    ค้นหาเบอร์อื่น
                </button>
            </div>

        </div>
    );
};
