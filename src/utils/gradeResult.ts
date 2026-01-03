import { PairAnalysis } from '@/types';

export const AUSPICIOUS_SUMS = [
    9, 14, 15, 19, 24, 36, 40, 41, 42, 44, 45, 46, 50, 51, 54, 55, 56, 59, 60, 63, 64, 65,
    90, 91, 92, 95, 99, 100, 104, 105
];

export type Grade = 'A+' | 'A' | 'B' | 'C';

export const calculateGrade = (totalScore: number, pairs: PairAnalysis[]): Grade => {
    const isGoodSum = AUSPICIOUS_SUMS.includes(totalScore);
    const hasRed = pairs.some(p => p.grade === 'bad');
    const hasOrange = pairs.some(p => p.grade === 'neutral');

    if (hasRed) {
        return 'C';
    } else if (!isGoodSum) {
        return 'B';
    } else {
        // No Red, Good Sum
        if (hasOrange) {
            return 'A';
        } else {
            return 'A+';
        }
    }
};
