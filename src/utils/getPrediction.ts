import { pairDefinitions } from '@/data/pairDefinitions';
import { PredictionResult } from '@/types';

export const getPrediction = (number: number): PredictionResult => {
    // Convert number to 2-digit string key if < 100 for lookup
    let key = number.toString();
    if (number < 10 && number >= 0) key = '0' + key;
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
