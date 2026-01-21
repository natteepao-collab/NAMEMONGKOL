import { pairDefinitions } from './pairDefinitions';

// Types
export interface Prediction {
    title: string;
    desc: string;
    level: 'GOOD' | 'BAD' | 'NEUTRAL' | 'VERY_GOOD' | 'VERY_BAD';
}

// 1. Generate Base 0-99 from pairDefinitions
const BASE_PREDICTIONS: Record<number, Prediction> = {};

Object.entries(pairDefinitions).forEach(([key, value]) => {
    const num = parseInt(key, 10);
    if (!isNaN(num)) {
        let level: Prediction['level'] = 'NEUTRAL';
        if (value.grade === 'good') level = 'GOOD';
        else if (value.grade === 'bad') level = 'BAD';
        // Check for "Very Good" / "Very Bad" keywords in title/desc if needed, or stick to basic mapping.
        // For now, mapping good->GOOD, bad->BAD, neutral->NEUTRAL.

        BASE_PREDICTIONS[num] = {
            title: value.title,
            desc: value.description,
            level
        };
    }
});

// 2. Specific Overrides & Additions (Ayatana 0-9 is separate, but we put it here for lookup convenience if needed)
// Note: Shadow Power Sums usually > 9. If Sum is 0-9, it uses these.
const SPECIFIC_PREDICTIONS: Record<number, Prediction> = {
    // Ayatana 6 Specifics (0-9) - These are distinct from Pairs 00-09 usually, but Shadow Power can be small?
    // Shadow Power sum is usually large. But if it falls 0-9, let's keep the planetary meanings as they are more specific to "Single Digit" power.
    0: { title: 'ดาวมฤตยู', desc: 'รักอิสระ มีโลกส่วนตัวสูง ชอบเดินทางไกล', level: 'NEUTRAL' },
    1: { title: 'ดาวอาทิตย์', desc: 'เป็นผู้นำ มีเกียรติยศ ชื่อเสียง มั่นคง', level: 'GOOD' },
    2: { title: 'ดาวจันทร์', desc: 'เจ้าชะตามีจิตใจเหมือนแม่ รักใคร่ดูแลห่วงใย เมตตากรุณาต่อคนรอบข้างเป็นอย่างดี', level: 'GOOD' },
    3: { title: 'ดาวอังคาร', desc: 'กล้าหาญ ขยันขันแข็ง นักสู้ ผู้ชนะ', level: 'GOOD' },
    4: { title: 'ดาวพุธ', desc: 'ฉลาด เจรจาเก่ง มีไหวพริบ ปรับตัวเก่ง', level: 'GOOD' },
    5: { title: 'ดาวพฤหัส', desc: 'มีปัญญา คุณธรรม ผู้ใหญ่เมตตา ประสบความสำเร็จ', level: 'VERY_GOOD' },
    6: { title: 'ดาวศุกร์', desc: 'มีเสน่ห์ รสนิยมดี การเงินคล่องตัว', level: 'VERY_GOOD' },
    7: { title: 'ดาวเสาร์', desc: 'อดทน แบกภาระ ต่อสู้ฟันฝ่า', level: 'NEUTRAL' },
    8: { title: 'ราหู', desc: 'ลุ่มหลง มัวเมา พลิกแพลง แต่ทันคน', level: 'BAD' },
    9: { title: 'ดาวเกตุ', desc: 'เจ้าชะตาเปรียบดั่งราชา จะมีอำนาจบารมีให้ความคุ้มครองแก่บุคคลทั่วไป', level: 'VERY_GOOD' },

    // Specific 100-199 Meanings found in research
    100: { title: 'พลังแห่งความสำเร็จ', desc: 'เป็นเลขแห่งความสุขความเจริญ คิดดีทำดีจะประสบความสำเร็จสูง มีเทวดาคุ้มครอง', level: 'VERY_GOOD' },
    101: { title: 'ปริศนาแห่งการเริ่มต้น', desc: 'ภายนอกดูอ่อนหวานแต่ภายในแข็งแกร่ง มีความเชื่อมั่นสูง ประสบความสำเร็จได้ด้วยตนเอง', level: 'GOOD' },
    102: { title: 'สองนารี', desc: 'มีไมตรีจิตดี แต่ลังเล อ่อนไหว เพื่อนฝูงรักใคร่ แต่อาจมีปัญหารักซ้อน', level: 'NEUTRAL' },
    103: { title: 'การเปลี่ยนแปลง', desc: 'ชีวิตพลิกผันบ่อย เดี๋ยวดีเดี๋ยวร้าย ระวังคำพูดและอารมณ์', level: 'BAD' },
    104: { title: 'วาจาสิทธิ์', desc: 'พูดจาเป็นเงินเป็นทอง ผู้ใหญ่เมตตา ประสบความสำเร็จจากการเจรจา', level: 'VERY_GOOD' },
    105: { title: 'ความสุขสมบูรณ์', desc: 'ชีวิตครอบครัวอบอุ่น มีผู้ใหญ่ให้การสนับสนุน มั่นคง', level: 'VERY_GOOD' },
    106: { title: 'คลังสมบัติ', desc: 'หาเงินเก่ง ฉลาดหลักแหลม มีกินมีใช้ไม่ขาดมือ', level: 'VERY_GOOD' },
    107: { title: 'นักจัดการเงิน', desc: 'เก่งเรื่องเงินทอง หมุนเงินดี แต่อาจมีความเครียดเรื่องงาน', level: 'GOOD' },
    108: { title: 'มงคลจักรวาล', desc: 'เป็นเลขมงคลสูงสุด มีสิ่งศักดิ์สิทธิ์คุ้มครอง ชีวิตรุ่งเรือง ประสบความสำเร็จดั่งใจหวัง', level: 'VERY_GOOD' },
    109: { title: 'จิตวิญญาณแกร่ง', desc: 'รับแรงกดดันได้ดี มีความเป็นผู้นำสูง ชีวิตก้าวหน้าอย่างมั่นคง', level: 'GOOD' },
    110: { title: 'ความร่มเย็น', desc: 'ครอบครัวเป็นสุข ได้รับการอุปถัมภ์ค้ำชู ชีวิตราบรื่น', level: 'GOOD' },
    111: { title: 'ชัยชนะแห่งผู้นำ', desc: 'ทะเยอทะยานสูง มักชนะการแข่งขัน ประสบความสำเร็จยิ่งใหญ่', level: 'VERY_GOOD' },
    // 112 -> 12 Good
    // 113 -> 13 Bad
    116: { title: 'อำนาจผู้นำ', desc: 'มีบารมี ปกครองคนเก่ง เป็นที่เกรงขาม', level: 'GOOD' },
    128: { title: 'ชีวิตพังทลาย', desc: 'อาภัพรัก เหนื่อยยาก ลำบากแต่ต้น', level: 'VERY_BAD' }, // Kept original harsh meaning
    139: { title: 'ครอบครัวเศรษฐี', desc: 'ครอบครัวมั่นคง ช่วยกันหาเงิน ร่ำรวย', level: 'VERY_GOOD' },
    140: { title: 'นักเดินทาง', desc: 'ชอบเดินทาง ไม่ชอบอยู่นิ่ง ชีวิตมีสีสัน', level: 'NEUTRAL' },
    148: { title: 'มหาเศรษฐี', desc: 'ก้าวหน้า มั่งคั่ง ร่ำรวย ประสบความสำเร็จด้านการเงินสูง', level: 'VERY_GOOD' },
    166: { title: 'สุขนิยม', desc: 'รักความสบาย หาเงินเก่ง ใช้เงินเก่ง ชีวิตมีความสุข', level: 'GOOD' },
    182: { title: 'ใจใหญ่นักเลง', desc: 'กล้าได้กล้าเสีย บริวารเยอะ', level: 'GOOD' },
    185: { title: 'บารมีแห่งชัยชนะ', desc: 'มีอำนาจบารมีสูงส่ง ชนะอุปสรรคทั้งปวง', level: 'VERY_GOOD' },
    196: { title: 'บุญนำพา', desc: 'ทำดีได้ดี มีสิ่งศักดิ์สิทธิ์คุ้มครอง แคล้วคลาด', level: 'VERY_GOOD' },
    199: { title: 'ความสำเร็จสูงสุด', desc: 'ทะเยอทะยานจนสำเร็จ ร่ำรวย มั่งคั่ง สมบูรณ์แบบ', level: 'VERY_GOOD' }
};

export const SUM_PREDICTIONS: Record<number, Prediction> = {
    ...BASE_PREDICTIONS,
    ...SPECIFIC_PREDICTIONS
};

export const getSumPrediction = (score: number) => {
    // 1. Exact Match
    if (SUM_PREDICTIONS[score]) return SUM_PREDICTIONS[score];

    // 2. Fallback for 100-199: Use Last 2 Digits
    // Example: 123 -> 23. 
    // This is a common numerology technique when specific triple digit meanings are absent.
    if (score >= 100 && score <= 199) {
        const lastTwo = score % 100;
        const fallback = BASE_PREDICTIONS[lastTwo];
        if (fallback) {
            return {
                ...fallback,
                title: `${fallback.title} (พลังแฝง)`, // Add suffix to indicate derived
                desc: fallback.desc
            };
        }
    }

    // 3. Fallback for > 199 or unknowns
    // Standard fail-safe
    return {
        title: `หมายเลข ${score}`,
        desc: 'คำทำนายอยู่ระหว่างการปรับปรุงข้อมูล',
        level: 'NEUTRAL'
    } as const;
};
