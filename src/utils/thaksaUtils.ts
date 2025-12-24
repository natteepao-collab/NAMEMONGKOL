import { thaksaConfig, DayKey } from '../data/thaksa';

export interface ThaksaAnalysisResult {
    analysis: Record<string, string[]>;
    hasKali: boolean;
    kaliChars: string[];
}

export const analyzeThaksa = (name: string, dayKey: DayKey): ThaksaAnalysisResult | null => {
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
                if (analysis[key] && !analysis[key].includes(char)) {
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

export const getDayFromName = (name: string): string => {
    if (!name) return '';

    const firstChar = name.charAt(0);

    // Iterate through all days to find which one has this character as Borivan
    for (const dayKey of Object.keys(thaksaConfig) as DayKey[]) {
        const dayConfig = thaksaConfig[dayKey];
        if (dayConfig.borivan.includes(firstChar)) {
            // Check if the name contains any Kali characters for this day
            const hasKali = name.split('').some(char => dayConfig.kali.includes(char));
            if (hasKali) {
                return '-';
            }
            return dayConfig.name;
        }
    }

    return 'ไม่ระบุ';
};

export interface SuitabilityResult {
    suitable: string[];
    unsuitable: string[];
}

export const analyzeNameSuitability = (name: string): SuitabilityResult => {
    if (!name) return { suitable: [], unsuitable: [] };

    const suitable: string[] = [];
    const unsuitable: string[] = [];
    const nameChars = name.split('');

    for (const dayKey of Object.keys(thaksaConfig) as DayKey[]) {
        const dayConfig = thaksaConfig[dayKey];
        const hasKali = nameChars.some(char => dayConfig.kali.includes(char));

        if (hasKali) {
            unsuitable.push(dayConfig.name);
        } else {
            suitable.push(dayConfig.name);
        }
    }

    return { suitable, unsuitable };
};
