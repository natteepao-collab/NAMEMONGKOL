import { charValues } from '@/data/charValues';
import { pairDefinitions } from '@/data/pairDefinitions';
import { PairAnalysis } from '@/types';

const getPairMeaning = (pair: string) => {
    return pairDefinitions[pair] || { level: 0, desc: 'ความหมายทั่วไป' };
};

export const analyzePairs = (text: string): PairAnalysis[] => {
    if (!text) return [];

    // 1. Convert text to array of values, filtering only valid chars
    const numbers: number[] = [];
    for (let char of text) {
        if (charValues[char]) {
            numbers.push(charValues[char]);
        }
    }

    // 2. Create pairs
    const pairs: PairAnalysis[] = [];
    for (let i = 0; i < numbers.length - 1; i++) {
        const pairStr = `${numbers[i]}${numbers[i + 1]}`;
        const info = getPairMeaning(pairStr);
        pairs.push({
            pair: pairStr,
            level: info.level as 0 | 1 | 2,
            desc: info.desc
        });
    }
    return pairs;
};
