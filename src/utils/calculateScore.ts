import { charValues } from '@/data/charValues';

export const calculateScore = (text: string): number => {
    if (!text) return 0;
    let score = 0;
    for (const char of text) {
        if (charValues[char]) {
            score += charValues[char];
        }
    }
    return score;
};
