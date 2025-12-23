export const VOWELS = [
    'ะ', 'า', 'ิ', 'ี', 'ึ', 'ื', 'ุ', 'ู', 'โ', 'เ', 'แ', 'ไ', 'ใ', 'ำ', // Standard Vowels
    'ฤ', 'ฤา', 'ฦ', 'ฦา', // Ru/Lu
    'ั', '็', '์', // Mai Han-Akat, Mai Taikhu, Garan
    '่', '้', '๊', '๋', // Tone marks
    'อ' // Or Ang
];

export interface ThaksaDayConfig {
    name: string;
    borivan: string[];
    ayu: string[];
    dech: string[];
    si: string[];
    mula: string[];
    ussaha: string[];
    montri: string[];
    kali: string[];
}

export type DayKey = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'wednesday_night' | 'thursday' | 'friday' | 'saturday';

export const thaksaConfig: Record<DayKey, ThaksaDayConfig> = {
    sunday: {
        name: 'วันอาทิตย์',
        borivan: VOWELS,
        ayu: ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง'],
        dech: ['จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'],
        si: ['ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ'],
        mula: ['ด', 'ต', 'ถ', 'ท', 'ธ', 'น'],
        ussaha: ['บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม'],
        montri: ['ย', 'ร', 'ล', 'ว'],
        kali: ['ศ', 'ษ', 'ส', 'ห', 'ฬ', 'ฮ']
    },
    monday: {
        name: 'วันจันทร์',
        borivan: ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง'],
        ayu: ['จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'],
        dech: ['ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ'],
        si: ['ด', 'ต', 'ถ', 'ท', 'ธ', 'น'],
        mula: ['บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม'],
        ussaha: ['ย', 'ร', 'ล', 'ว'],
        montri: ['ศ', 'ษ', 'ส', 'ห', 'ฬ', 'ฮ'],
        kali: VOWELS
    },
    tuesday: {
        name: 'วันอังคาร',
        borivan: ['จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'],
        ayu: ['ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ'],
        dech: ['ด', 'ต', 'ถ', 'ท', 'ธ', 'น'],
        si: ['บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม'],
        mula: ['ย', 'ร', 'ล', 'ว'],
        ussaha: ['ศ', 'ษ', 'ส', 'ห', 'ฬ', 'ฮ'],
        montri: VOWELS,
        kali: ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง']
    },
    wednesday: {
        name: 'วันพุธ (กลางวัน)',
        borivan: ['ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ'],
        ayu: ['ด', 'ต', 'ถ', 'ท', 'ธ', 'น'],
        dech: ['บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม'],
        si: ['ย', 'ร', 'ล', 'ว'],
        mula: ['ศ', 'ษ', 'ส', 'ห', 'ฬ', 'ฮ'],
        ussaha: VOWELS,
        montri: ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง'],
        kali: ['จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ']
    },
    wednesday_night: {
        name: 'วันพุธ (กลางคืน/ราหู)',
        borivan: ['ย', 'ร', 'ล', 'ว'],
        ayu: ['ศ', 'ษ', 'ส', 'ห', 'ฬ', 'ฮ'],
        dech: VOWELS,
        si: ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง'],
        mula: ['จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'],
        ussaha: ['ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ'],
        montri: ['ด', 'ต', 'ถ', 'ท', 'ธ', 'น'],
        kali: ['บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม']
    },
    thursday: {
        name: 'วันพฤหัสบดี',
        borivan: ['บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม'],
        ayu: ['ย', 'ร', 'ล', 'ว'],
        dech: ['ศ', 'ษ', 'ส', 'ห', 'ฬ', 'ฮ'],
        si: VOWELS,
        mula: ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง'],
        ussaha: ['จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'],
        montri: ['ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ'],
        kali: ['ด', 'ต', 'ถ', 'ท', 'ธ', 'น']
    },
    friday: {
        name: 'วันศุกร์',
        borivan: ['ศ', 'ษ', 'ส', 'ห', 'ฬ', 'ฮ'],
        ayu: VOWELS,
        dech: ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง'],
        si: ['จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'],
        mula: ['ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ'],
        ussaha: ['ด', 'ต', 'ถ', 'ท', 'ธ', 'น'],
        montri: ['บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม'],
        kali: ['ย', 'ร', 'ล', 'ว']
    },
    saturday: {
        name: 'วันเสาร์',
        borivan: ['ด', 'ต', 'ถ', 'ท', 'ธ', 'น'],
        ayu: ['บ', 'ป', 'ผ', 'ฝ', 'พ', 'ฟ', 'ภ', 'ม'],
        dech: ['ย', 'ร', 'ล', 'ว'],
        si: ['ศ', 'ษ', 'ส', 'ห', 'ฬ', 'ฮ'],
        mula: VOWELS,
        ussaha: ['ก', 'ข', 'ฃ', 'ค', 'ฅ', 'ฆ', 'ง'],
        montri: ['จ', 'ฉ', 'ช', 'ซ', 'ฌ', 'ญ'],
        kali: ['ฎ', 'ฏ', 'ฐ', 'ฑ', 'ฒ', 'ณ']
    }
};

export const thaksaMeanings: Record<string, { label: string; desc: string; color: string }> = {
    borivan: { label: 'บริวาร', desc: 'คนรอบข้าง, ครอบครัว, บุตร, ลูกน้อง', color: 'text-slate-200' },
    ayu: { label: 'อายุ', desc: 'สุขภาพ, ความเป็นอยู่, การดำเนินชีวิต', color: 'text-blue-200' },
    dech: { label: 'เดช', desc: 'อำนาจ, วาสนา, เกียรติยศ, ชื่อเสียง', color: 'text-amber-200' },
    si: { label: 'ศรี', desc: 'โชคลาภ, เงินทอง, เสน่ห์, ความสำเร็จ', color: 'text-emerald-200' },
    mula: { label: 'มูละ', desc: 'หลักทรัพย์, มรดก, ที่อยู่อาศัย', color: 'text-indigo-200' },
    ussaha: { label: 'อุตสาหะ', desc: 'ความขยัน, หน้าที่การงาน, ความพยายาม', color: 'text-purple-200' },
    montri: { label: 'มนตรี', desc: 'ผู้ใหญ่, ที่พึ่ง, ผู้อุปถัมภ์, ช่วยเหลือ', color: 'text-sky-200' },
    kali: { label: 'กาลกิณี', desc: 'อุปสรรค, ศัตรู, ความยุ่งยาก, เคราะห์ร้าย', color: 'text-rose-200' },
};
