import { ayatanaMeanings } from '@/data/ayatanaMeanings';
import { AyatanaResult } from '@/types';

export const calculateAyatana = (totalScore: number): AyatanaResult => {
    let rem = totalScore % 9;
    if (rem === 0) rem = 9;

    // Fallback if not found (should be found logic-wise)
    const meaning = ayatanaMeanings[rem] || { title: 'ไม่ทราบ', desc: '-' };

    return { score: rem, ...meaning };
};
