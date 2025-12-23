import { pairDefinitions } from '../data/numerology';
import { ayatanaMeanings, AyatanaDefinition } from '../data/ayatana';

export interface PredictionResult {
    level: string;
    color: string;
    bgGradient: string;
    desc: string;
    stars: number;
}

export const getPrediction = (number: number): PredictionResult => {
    // Convert number to 2-digit string key if < 100 for lookup
    let key = number.toString();
    if (number < 10 && number >= 0) key = '0' + key;
    // If number > 99, taking last 2 digits is a common simplified approach for this logic 
    // if not strictly specified otherwise, or it might fall back to general meaning.
    // The original code: if (number >= 100) key = key.substring(key.length - 2);
    if (number >= 100) key = key.substring(key.length - 2);

    const def = pairDefinitions[key];

    // Default fallback
    let level = 'ปานกลาง';
    let color = 'text-amber-400';
    let bgGradient = 'from-amber-300 to-orange-300';
    let stars = 3;
    let desc = 'ความหมายกลางๆ';

    if (def) {
        desc = def.desc;
        if (def.level === 1) { // Good
            level = 'ดีมาก';
            color = 'text-emerald-400';
            bgGradient = 'from-emerald-300 to-green-300';
            stars = 5;
        } else if (def.level === 2) { // Bad
            level = 'ควรระวัง';
            color = 'text-rose-400';
            bgGradient = 'from-rose-300 to-red-300';
            stars = 1;
        } else { // Neutral (0)
            level = 'ปานกลาง';
            color = 'text-amber-400';
            bgGradient = 'from-amber-300 to-orange-300';
            stars = 3;
        }
    }

    return { level, color, bgGradient, desc, stars };
};

export type AyatanaResult = AyatanaDefinition & { score: number };

export const calculateAyatana = (totalScore: number): AyatanaResult => {
    let rem = totalScore % 9;
    if (rem === 0) rem = 9;
    return { score: rem, ...ayatanaMeanings[rem] };
};
