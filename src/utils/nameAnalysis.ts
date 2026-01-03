/**
 * ฐานข้อมูลคะแนนตัวอักษรไทย (ปรับปรุงตามตำราภาพล่าสุด)
 * ยืนยันผลลัพธ์: 
 * - ณวิธ: ณ(5)+ว(6)+ิ(4)+ธ(4) = 19
 * - กลิ่นหอม: ก(1)+ล(6)+ิ(4)+่(1)+น(5)+ห(5)+อ(6)+ม(5) = 33
 */
export const CHAR_SCORES: Record<string, number> = {
    // กลุ่ม 1: ก ด ท ถ ภ า ำ ุ ่ ฤ ฤๅ
    'ก': 1, 'ด': 1, 'ท': 1, 'ถ': 1, 'ภ': 1, 'า': 1, 'ำ': 1, 'ุ': 1, '่': 1, 'ฤ': 1, 'ฤๅ': 1,
    // กลุ่ม 2: ข ช ง บ ป เ แ ู ้
    'ข': 2, 'ช': 2, 'ง': 2, 'บ': 2, 'ป': 2, 'เ': 2, 'แ': 2, 'ู': 2, '้': 2,
    // กลุ่ม 3: ต ฒ ฑ ฆ ๋
    'ต': 3, 'ฒ': 3, 'ฑ': 3, 'ฆ': 3, '๋': 3,
    // กลุ่ม 4: ค ธ ญ ร ษ โ ะ ั ิ
    'ค': 4, 'ธ': 4, 'ญ': 4, 'ร': 4, 'ษ': 4, 'โ': 4, 'ะ': 4, 'ั': 4, 'ิ': 4,
    // กลุ่ม 5: ฉ ฌ น ม ห ฎ ฬ ฮ ๊ ณ
    'ฉ': 5, 'ฌ': 5, 'น': 5, 'ม': 5, 'ห': 5, 'ฎ': 5, 'ฬ': 5, 'ฮ': 5, '๊': 5, 'ณ': 5,
    // กลุ่ม 6: จ ล ว อ ใ
    'จ': 6, 'ล': 6, 'ว': 6, 'อ': 6, 'ใ': 6,
    // กลุ่ม 7: ซ ศ ส ี ื
    'ซ': 7, 'ศ': 7, 'ส': 7, 'ี': 7, 'ื': 7,
    // กลุ่ม 8: ผ ฝ พ ฟ ย ็
    'ผ': 8, 'ฝ': 8, 'พ': 8, 'ฟ': 8, 'ย': 8, '็': 8,
    // กลุ่ม 9: ฏ ฐ ไ ์ ฦ ฦๅ
    'ฏ': 9, 'ฐ': 9, 'ไ': 9, '์': 9, 'ฦ': 9, 'ฦๅ': 9
};

export const KALAKINI_RULES: Record<string, string> = {
    "อาทิตย์": "ศษสฬฮห",
    "จันทร์": "อเแโใไะาิีึืุูำฤฦั",
    "อังคาร": "กขคฆง",
    "พุธ(กลางวัน)": "จฉชซฌญ",
    "เสาร์": "ดตถทธน",
    "พฤหัสบดี": "ฎฏฐฑฒณ",
    "พุธ(กลางคืน)": "บปผฝพฟภม",
    "ศุกร์": "ยรลว"
};

export const PAIR_MEANINGS = {
    "GREEN": [
        "14", "15", "16", "19", "22", "23", "24", "26", "28", "29", "32", "35", "36", "39",
        "41", "42", "44", "45", "46", "49", "51", "53", "54", "55", "56", "59", "61", "62",
        "63", "64", "65", "66", "69", "78", "79", "82", "87", "89", "90", "91", "92", "93",
        "94", "95", "96", "97", "98", "99"
    ],
    "ORANGE": ["33", "47", "74"]
};

export interface NameAnalysisResult {
    sum: number;
    pairs: { pair: string; type: string }[];
    goodDays: string[];
    grade: 'A+' | 'A' | 'B' | 'C';
}

export const analyzeName = (name: string): NameAnalysisResult | null => {
    if (!name) return null;

    // จัดระเบียบอักขระพิเศษ
    let normalized = name.replace(/ฤๅ/g, 'A').replace(/ฦๅ/g, 'B');
    const specialMap: Record<string, { val: number }> = { 'A': { val: 1 }, 'B': { val: 9 } };

    let sequence: number[] = [];

    for (let char of normalized) {
        let score = 0;
        if (specialMap[char]) {
            score = specialMap[char].val;
        } else {
            score = CHAR_SCORES[char] || 0;
        }
        sequence.push(score);
    }

    const sum = sequence.reduce((a, b) => a + b, 0);

    // จับคู่เลขแบบเรียงลำดับอักขระจริง (ไม่ข้ามวรรณยุกต์)
    const pairs: { pair: string; type: string }[] = [];
    for (let i = 0; i < sequence.length - 1; i++) {
        const pair = `${sequence[i]}${sequence[i + 1]}`;
        let type = "RED";
        if (PAIR_MEANINGS.GREEN.includes(pair)) type = "GREEN";
        else if (PAIR_MEANINGS.ORANGE.includes(pair)) type = "ORANGE";
        pairs.push({ pair, type });
    }

    // วันเกิดที่ใช้ได้ (กาลกิณี)
    const goodDays: string[] = [];
    for (const [day, badChars] of Object.entries(KALAKINI_RULES)) {
        let isBad = false;
        for (const char of name) {
            if (badChars.includes(char)) {
                isBad = true;
                break;
            }
        }
        if (!isBad) goodDays.push(day);
    }

    // Grading Logic
    // ผลรวมมงคล (อ้างอิงจาก Premium Analysis)
    const AUSPICIOUS_SUMS = [
        9, 14, 15, 19, 24, 36, 40, 41, 42, 44, 45, 46, 50, 51, 54, 55, 56, 59, 60, 63, 64, 65,
        90, 91, 92, 95, 99, 100, 104, 105
    ];

    const isGoodSum = AUSPICIOUS_SUMS.includes(sum);
    const hasRed = pairs.some(p => p.type === "RED");
    const hasOrange = pairs.some(p => p.type === "ORANGE");

    let grade: 'A+' | 'A' | 'B' | 'C' = 'C';

    if (hasRed) {
        grade = 'C';
    } else if (!isGoodSum) {
        grade = 'B';
    } else {
        // No Red, Good Sum
        if (hasOrange) {
            grade = 'A';
        } else {
            grade = 'A+';
        }
    }

    return { sum, pairs, goodDays, grade };
};
