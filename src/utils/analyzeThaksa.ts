import { thaksaConfig } from '@/data/thaksaConfig';
import { ThaksaAnalysisResult } from '@/types';

export const analyzeThaksa = (name: string, dayKey: string): ThaksaAnalysisResult | null => {
    if (!dayKey || !thaksaConfig[dayKey]) return null;
    const config = thaksaConfig[dayKey];
    const nameChars = name.split('');

    const analysis: Record<string, string[]> = {
        borivan: [], ayu: [], dech: [], si: [],
        mula: [], ussaha: [], montri: [], kali: []
    };

    nameChars.forEach(char => {
        for (const [key, chars] of Object.entries(config)) {
            if (key === 'name') continue;
            if (Array.isArray(chars) && chars.includes(char)) {
                if (!analysis[key].includes(char)) {
                    analysis[key].push(char);
                }
            }
        }
    });

    return {
        analysis,
        hasKali: analysis.kali.length > 0,
        kaliChars: analysis.kali
    };
};
