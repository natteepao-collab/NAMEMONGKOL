import Link from 'next/link';
import { Star, User, Sparkles } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface ResultHeaderProps {
    result: AnalysisResult;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({ result }) => {
    return (
        <>
            <div className="flex flex-col items-center mb-8 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
                        <User className="w-6 h-6 text-amber-400" />
                    </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 text-center break-words px-2 leading-tight">
                    {result.name} {result.surname}
                </h2>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-6"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="glass-card p-4 rounded-2xl text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.namePrediction.bgGradient}`}></div>
                    <span className="text-slate-400 text-sm font-medium">ผลรวมชื่อ</span>
                    <div className={`text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${result.namePrediction.bgGradient} mt-2 mb-1`}>
                        {result.nameScore}
                    </div>
                    <div className={`text-xs font-medium ${result.namePrediction.color} mb-1`}>
                        {result.namePrediction.level}
                    </div>
                    <div className="flex justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < result.namePrediction.stars ? result.namePrediction.color + ' fill-current' : 'text-slate-700'}`} />
                        ))}
                    </div>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.surnamePrediction.bgGradient}`}></div>
                    <span className="text-slate-400 text-sm font-medium">ผลรวมนามสกุล</span>
                    <div className={`text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${result.surnamePrediction.bgGradient} mt-2 mb-1`}>
                        {result.surnameScore}
                    </div>
                    <div className={`text-xs font-medium ${result.surnamePrediction.color} mb-1`}>
                        {result.surnamePrediction.level}
                    </div>
                    <div className="flex justify-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < result.surnamePrediction.stars ? result.surnamePrediction.color + ' fill-current' : 'text-slate-700'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6 text-center relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.prediction.bgGradient}`}></div>

                {/* Grade Badge */}
                <div className="absolute top-4 right-4">
                    <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl border shadow-lg backdrop-blur-md
                        ${result.grade === 'A+' ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30' :
                            result.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                result.grade === 'B' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    'bg-rose-500/20 text-rose-400 border-rose-500/30'}
                    `}>
                        {result.grade}
                    </div>
                </div>

                {/* Nirun Badge */}
                {result.isNirun && (
                    <div className="absolute top-4 left-4 animate-bounce-slow">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-200 to-yellow-400 shadow-lg shadow-amber-500/20 border border-white/40">
                            <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                            <span className="text-xs font-extrabold text-amber-900 tracking-wide">นิรันดร์ศาสตร์</span>
                        </div>
                    </div>
                )}

                <h3 className="text-lg text-slate-400 mb-1">ผลรวมชื่อ-สกุล</h3>
                <div className={`text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${result.prediction.bgGradient} mb-4`}>
                    {result.totalScore}
                </div>
                <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < result.prediction.stars ? result.prediction.color.replace('text-', 'text-') + ' fill-current' : 'text-slate-700'}`} />
                    ))}
                </div>

                <div className="text-slate-300 text-sm md:text-base font-medium leading-relaxed px-4 mb-3">
                    "{result.prediction.desc}"
                </div>
                <div className="flex flex-col items-center gap-3 mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-800 ${result.prediction.color}`}>
                        {result.prediction.level}
                    </span>

                    {/* Upsell for Orange/Red/Amber/Rose scores */}
                    {(result.prediction.color.includes('orange') ||
                        result.prediction.color.includes('red') ||
                        result.prediction.color.includes('rose') ||
                        result.prediction.color.includes('amber')) && (
                            <Link href="/premium-analysis">
                                <button className="flex items-center gap-2 px-6 py-2.5 mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:-translate-y-0.5 hover:shadow-amber-500/30 animate-pulse">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="font-bold text-sm">ออกแบบชื่อมงคลใหม่</span>
                                </button>
                            </Link>
                        )}
                </div>
            </div>
        </>
    );
};
