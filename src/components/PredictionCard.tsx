import React from 'react';
import { Moon } from 'lucide-react';
import { PredictionResult } from '@/types';

interface PredictionCardProps {
    prediction: PredictionResult;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
    return (
        <div className="glass-card rounded-2xl p-6">
            <h4 className="flex items-center gap-2 text-purple-400 font-semibold mb-4">
                <Moon className="w-5 h-5" /> คำทำนายเลขศาสตร์
            </h4>
            <p className="text-slate-300 leading-relaxed mb-4 text-sm">
                {prediction.desc}
            </p>
        </div>
    );
};
