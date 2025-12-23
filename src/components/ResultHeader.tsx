import React from 'react';
import { Star, User } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface ResultHeaderProps {
    result: AnalysisResult;
}

export const ResultHeader: React.FC<ResultHeaderProps> = ({ result }) => {
    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-2xl text-center relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${result.namePrediction.bgGradient}`}></div>
                    <span className="text-slate-400 text-sm font-medium">ผลรวมชื่อ</span>
                    <div className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${result.namePrediction.bgGradient} mt-2 mb-1`}>
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
                    <div className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${result.surnamePrediction.bgGradient} mt-2 mb-1`}>
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
                <h3 className="text-lg text-slate-400 mb-1">ผลรวมชื่อ-สกุล</h3>
                <div className={`text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${result.prediction.bgGradient} mb-4`}>
                    {result.totalScore}
                </div>
                <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < result.prediction.stars ? result.prediction.color.replace('text-', 'text-') + ' fill-current' : 'text-slate-700'}`} />
                    ))}
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-800 ${result.prediction.color}`}>
                    {result.prediction.level}
                </span>
            </div>
        </>
    );
};
