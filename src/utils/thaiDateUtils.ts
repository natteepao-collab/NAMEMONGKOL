export interface ThaiDateResult {
    solarDate: string; // e.g., "10 มิถุนายน พ.ศ. 2533"
    lunarDate: string; // e.g., "วันอาทิตย์ แรม ๓ ค่ำ เดือนเจ็ด(๗) ปีมะเมีย"
    zodiacYear: string; // e.g., "ปีมะเมีย"
    dayOfWeek: string; // e.g., "อาทิตย์"
    fullSolarDateWithType: string; // e.g., "10 มิถุนายน พ.ศ. 2533 (ตรงกับปี ค.ศ. 1990)"
}

const THAI_MONTHS = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const THAI_DAYS = [
    "อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"
];

const THAI_ZODIACS = [
    "ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง",
    "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"
];

const THAI_NUMBERS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

function toThaiNumber(num: number): string {
    return num.toString().split('').map(c => THAI_NUMBERS[parseInt(c)] || c).join('');
}

export function getThaiSolarDate(date: Date): { dayStr: string, montStr: string, yearBE: number, fullStr: string } {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const yearAD = date.getFullYear();
    const yearBE = yearAD + 543;

    const dayStr = day.toString();
    const montStr = THAI_MONTHS[monthIndex];
    const fullStr = `${day} ${montStr} พ.ศ. ${yearBE}`;

    return { dayStr, montStr, yearBE, fullStr };
}

export function getThaiDayOfWeek(date: Date): string {
    return THAI_DAYS[date.getDay()];
}

export function getThaiZodiac(yearAD: number): string {
    // 1990 (Horse - Mamia) -> (1990 - 4) % 12 = 6 -> Index 6 is Mamia
    // Standard formula: Rat=0, Ox=1...
    // 1924 was Rat. (1924 - 4) % 12 = 0.
    // So (year - 4) % 12
    const zodiacIndex = (yearAD - 4) % 12;
    // Handle negative modulo if needed (though yearAD is usually positive)
    const normalizedIndex = zodiacIndex < 0 ? zodiacIndex + 12 : zodiacIndex;
    return THAI_ZODIACS[normalizedIndex];
}

/**
 * Approximate Thai Lunar Date Calculation
 * This is a simplified astronomical calculation.
 * Actual Thai Calendar has complex intercalation rules (Adhikamasa/Adhikavara).
 * This function estimates the lunar phase and month.
 */
export function getThaiLunarDate(date: Date): string {
    // 1. Calculate approximate lunar age (days since new moon)
    // Synodic month is approx 29.53059 days
    // Base date: New Moon on Jan 1, 1900? No, let's pick a closer reference or standard algo.
    // Known New Moon: Jan 6, 2000.
    const knownNewMoon = new Date(2000, 0, 6, 12, 0, 0).getTime(); // Jan 6 2000
    const targetTime = date.getTime();
    const diffDays = (targetTime - knownNewMoon) / (1000 * 60 * 60 * 24);
    const synodicMonth = 29.53059;
    
    // Lunar age (0 to 29.53)
    let lunarAge = diffDays % synodicMonth;
    if (lunarAge < 0) lunarAge += synodicMonth;

    // 2. Determine Waxing (Khuen) or Waning (Raem)
    // Waxing: Day 0 to 14.76 (approx 15 days) -> Khuen 1-15
    // Waning: Day 14.76 to 29.53 -> Raem 1-15
    
    let phase = ""; // ขึ้น or แรม
    let phaseDay = 0; // 1-15

    // Rounding logic for integer days is tricky.
    // Let's treat standard 15 waxing, 14/15 waning.
    // Standard approx: New Moon = Day 1 Waxing? No, New Moon is Day 1 Waxing (Khuen 1 Kham) in Thai?
    // Actually Khuen 1 Kham is the day AFTER Conjunction? Or simply the new moon day?
    // Usually Khuen 1 is the first sliver. New moon is "Day 0" or end of previous month (Raem 14/15).
    // Let's map 0-14.5 -> Waxing (Khuen), 14.5-29.5 -> Waning (Raem)
    
    const lunarDayIndex = Math.floor(lunarAge) + 1; // 1 to 30 approx

    if (lunarDayIndex <= 15) {
        phase = "ขึ้น";
        phaseDay = lunarDayIndex;
    } else {
        phase = "แรม";
        phaseDay = lunarDayIndex - 15;
    }

    // 3. Estimate Thai Lunar Month
    // Thai Lunar Month 1 (Duean Ai) usually is around Dec.
    // Month 12 is around Nov (Loy Krathong).
    // Simple shift from Solar Month?
    // Rough Rule: Thai Month = (Solar Month Index + 1) -> but offset?
    // December (Month 11) -> Month 1 (Ai)
    // November (Month 10) -> Month 12
    // So usually Thai Month = Solar Month + 1 (Dec=1, Jan=2...) ? No.
    // Loy Krathong (Full Moon Month 12) is in November.
    // So Nov = Month 12.
    // Dec = Month 1.
    // Jan = Month 2.
    // Feb = Month 3.
    // Month 'm' (1-12).
    // (Solar Month + 1) ?
    // Jan (0) -> +2 = 2 (Yee) ?
    // Nov (10) -> +2 = 12 ?
    // Dec (11) -> +2 = 13 (so 1) ?
    // Let's try Offset +2.
    
    // However, the "Month Change" happens on New Moon (Khuen 1).
    // So if it's early in the month (before new moon) it might be previous month.
    // This is getting complex for exact calc.
    // Let's stick to the simple mapping: The month containing the core part.
    // Nov is Month 12.
    // So: Jan=2, Feb=3, Mar=4, Apr=5, May=6, Jun=7, Jul=8, Aug=9, Sep=10, Oct=11, Nov=12, Dec=1
    
    // We also need to check "Waxing/Waning" relative to the month.
    // If we rely on lunar age, we are tracking cycle.
    // Let's refine month based on the moon cycle count from a reference Month 12.
    // Reference: Full Moon Nov 1990 ?
    // Let's just use the (Month + 1) approx logic + phase check?
    // Actually, "Deuan" changes at New Moon.
    // If Phase is Waxing (Khuen), it's the start of month.
    // If Phase is Waning (Raem), it's the end of month.
    
    // Simplified Mapping for Display (User accepts approx):
    // Thai Month = ((Solar Month Index + 1) % 12) + 1 ?
    // Index 0 (Jan) -> (0+1)%12 + 1 = 2. Correct (Duean Yee).
    // Index 5 (Jun) -> (5+1)%12 + 1 = 7 (Duean Jed). Correct (User example: Jun 10 -> Month 7).
    // Index 10 (Nov) -> (10+1)%12 + 1 = 12. Correct.
    // Index 11 (Dec) -> (11+1)%12 + 1 = 1. Correct (Duean Ai).
    
    // Adjust if date is very late in month and New Moon happened?
    // Or very early?
    // Usually corresponding Thai month covers most of the solar month.
    // Let's use this Main Stream mapping: `((date.getMonth() + 1) % 12) + 1` is usually wrong?
    // Wait. Jan is Month 2.  (Index 0)
    // Formula: (Index + ?)
    // 0 -> 2
    // 5 -> 7
    // 10 -> 12
    // 11 -> 1
    // Formula: (Index + 2). If >12, subtract 12.
    
    let thaiMonth = date.getMonth() + 2; // Jan(0)+2 = 2.
    if (thaiMonth > 12) thaiMonth -= 12;

    // Check if we need to adjust for the specific lunar cycle overlap.
    // E.g. Late Nov might start Month 1 (Dec)?
    // For "Premium Analysis" presentation, this standard mapping is usually "Close Enough" or standard ASTRO mapping.
    // BUT User Example: June 10, 1990 -> Month 7.
    // Solar June (Index 5). Formula: 5+2 = 7. Matches!
    
    const thaiMonthThaiMap = [
        "", "อ้าย(๑)", "ยี่(๒)", "สาม(๓)", "สี่(๔)", "ห้า(๕)", "หก(๖)",
        "เจ็ด(๗)", "แปด(๘)", "เก้า(๙)", "สิบ(๑๐)", "สิบเอ็ด(๑๑)", "สิบสอง(๑๒)"
    ];
    
    const zodiac = getThaiZodiac(date.getFullYear());
    const dayOfWeek = THAI_DAYS[date.getDay()];

    const phaseThaiNum = toThaiNumber(phaseDay);

    return `วัน${dayOfWeek} ${phase} ${phaseThaiNum} ค่ำ เดือน${thaiMonthThaiMap[thaiMonth]} ปี${zodiac}`;
}


export function formatThaiBirthDate(dateStr: string): ThaiDateResult | null {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    const { fullStr } = getThaiSolarDate(date);
    const dayOfWeek = getThaiDayOfWeek(date);
    const zodiacYear = getThaiZodiac(date.getFullYear());
    const lunarDate = getThaiLunarDate(date);
    const yearAD = date.getFullYear();

    return {
        solarDate: fullStr,
        fullSolarDateWithType: `${fullStr} (ตรงกับปี ค.ศ. ${yearAD})`,
        lunarDate,
        zodiacYear: `ปี${zodiacYear}`,
        dayOfWeek
    };
}
