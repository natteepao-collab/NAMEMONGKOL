// Shadow Power (Phalang Ngao) Values
// Based on Planetary Power (Kamlang Dao)

export const SHADOW_CHAR_SCORES: Record<string, number> = {
    // Sun (6): Aor and Vowels (except Mai Han-Akat, Karan)
    'อ': 6, 'ะ': 6, 'า': 6, 'ิ': 6, 'ี': 6, 'ึ': 6, 'ื': 6, 'ุ': 6, 'ู': 6,
    'เ': 6, 'แ': 6, 'โ': 6, 'ใ': 6, 'ไ': 6, 'ำ': 6, 'ฤ': 6, 'ฤๅ': 6, 'ฦ': 6, 'ฦๅ': 6,

    // Moon (15)
    'ก': 15, 'ข': 15, 'ค': 15, 'ฆ': 15, 'ง': 15,

    // Mars (8)
    'จ': 8, 'ฉ': 8, 'ช': 8, 'ซ': 8, 'ฌ': 8, 'ญ': 8,

    // Mercury (17)
    'ฎ': 17, 'ฏ': 17, 'ฐ': 17, 'ฑ': 17, 'ฒ': 17, 'ณ': 17,

    // Jupiter (19)
    'บ': 19, 'ป': 19, 'ผ': 19, 'ฝ': 19, 'พ': 19, 'ฟ': 19, 'ภ': 19, 'ม': 19,

    // Venus (21)
    'ศ': 21, 'ษ': 21, 'ส': 21, 'ห': 21, 'ฬ': 21, 'ฮ': 21,

    // Saturn (10)
    'ด': 10, 'ต': 10, 'ถ': 10, 'ท': 10, 'ธ': 10, 'น': 10,

    // Rahu (12)
    'ย': 12, 'ร': 12, 'ล': 12, 'ว': 12
};

export const calculateShadowPower = (text: string): number => {
    if (!text) return 0;
    let score = 0;
    for (const char of text) {
        // Characters not in map (Tone marks, Mai Han-Akat, Karan) default to 0
        if (SHADOW_CHAR_SCORES[char]) {
            score += SHADOW_CHAR_SCORES[char];
        }
    }
    return score;
};

export const calculateAyatana6 = (shadowScore: number): number => {
    let rem = shadowScore % 9;
    if (rem === 0) rem = 9;
    return rem;
};
