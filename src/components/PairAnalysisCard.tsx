import React from 'react';
import { Activity } from 'lucide-react';
import { PairAnalysis } from '@/types';

interface PairAnalysisCardProps {
    namePairs: PairAnalysis[];
    surnamePairs: PairAnalysis[];
}

export const PairAnalysisCard: React.FC<PairAnalysisCardProps> = ({ namePairs, surnamePairs }) => {

    const renderPairs = (pairs: PairAnalysis[]) => (
        <div className="flex flex-wrap gap-2 mt-2">
            {pairs.map((p, idx) => (
                <div key={idx} className={`
          relative flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-help transition-transform hover:scale-110
          ${p.level === 1 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' :
                        p.level === 2 ? 'bg-rose-500/20 border-rose-500 text-rose-300' :
                            'bg-amber-500/20 border-amber-500 text-amber-300'}
        `} title={p.desc}>
                    <span className="font-bold text-lg">{p.pair}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="glass-card rounded-2xl p-6">
            <h4 className="flex items-center gap-2 text-pink-400 font-semibold mb-4">
                <Activity className="w-5 h-5" /> วิเคราะห์คู่ตัวเลข (00-99)
            </h4>

            <div className="space-y-6">
                <div>
                    <p className="text-slate-400 text-sm mb-2">คู่ตัวเลขในชื่อ:</p>
                    {namePairs.length > 0 ? renderPairs(namePairs) : <span className="text-slate-600 text-sm">ไม่มีคู่ตัวเลข (ชื่อสั้นเกินไป)</span>}
                </div>
                {surnamePairs.length > 0 && (
                    <div>
                        <p className="text-slate-400 text-sm mb-2">คู่ตัวเลขในนามสกุล:</p>
                        {renderPairs(surnamePairs)}
                    </div>
                )}
                <div className="flex gap-4 text-xs text-slate-500 mt-2 p-3 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-300"></span> ดี/ส่งเสริม</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-300"></span> ปานกลาง/ทั่วไป</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-300"></span> ควรระวัง/อุปสรรค</div>
                </div>
            </div>
        </div>
    );
};
