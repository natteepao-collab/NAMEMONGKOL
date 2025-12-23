import { thaksaConfig } from '@/data/thaksaConfig';
import { ThaksaAnalysisResult, ThaksaDayConfig } from '@/types';

const analyzeText = (text: string, config: ThaksaDayConfig): Record<string, string[]> => {
    const analysis: Record<string, string[]> = {
        borivan: [], ayu: [], dech: [], si: [],
        mula: [], ussaha: [], montri: [], kali: []
    };

    const chars = text.split('');
    chars.forEach(char => {
        for (const [key, allowedChars] of Object.entries(config)) {
            if (key === 'name') continue;
            if (Array.isArray(allowedChars) && allowedChars.includes(char)) {
                if (!analysis[key].includes(char)) {
                    analysis[key].push(char);
                }
            }
        }
    });

    return analysis;
};

export const analyzeThaksa = (name: string, dayKey: string, surname?: string): ThaksaAnalysisResult | null => {
    if (!dayKey || !thaksaConfig[dayKey]) return null;
    const config = thaksaConfig[dayKey];

    const nameAnalysis = analyzeText(name, config);
    const surnameAnalysis = surname ? analyzeText(surname, config) : undefined;

    return {
        analysis: nameAnalysis,
        surnameAnalysis,
        hasKali: nameAnalysis.kali.length > 0,
        kaliChars: nameAnalysis.kali,
        surnameHasKali: surname ? (surnameAnalysis?.kali.length || 0) > 0 : false,
        surnameKaliChars: surnameAnalysis?.kali || []
    };
};
