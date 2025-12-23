import React from 'react';
import { User } from 'lucide-react';
import { AyatanaResult } from '@/types';

interface AyatanaCardProps {
    ayatana: AyatanaResult;
}

export const AyatanaCard: React.FC<AyatanaCardProps> = ({ ayatana }) => {
    return (
        <div className="glass-card rounded-2xl p-6">
            <h4 className="flex items-center gap-2 text-amber-400 font-semibold mb-4">
                <User className="w-5 h-5" /> อายตนะ 6
            </h4>
            <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-3xl font-bold text-white mb-1">{ayatana.score}</div>
                <div className="text-amber-300 font-medium mb-2">"{ayatana.title}"</div>
                <p className="text-sm text-slate-400">{ayatana.desc}</p>
            </div>
        </div>
    );
};
