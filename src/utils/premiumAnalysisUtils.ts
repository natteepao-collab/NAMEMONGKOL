import { thaksaConfig, DayKey } from '../data/thaksa';
import { calculateScore } from './numerologyUtils'; // Ensure this calculates sum of chars
import { premiumNamesRaw } from '../data/premiumNamesRaw';
import { parsePremiumNames, PremiumNameData } from './premiumDataParser';

// Cache parsed names
let cachedParsedNames: PremiumNameData[] | null = null;

const getParsedNames = () => {
    if (!cachedParsedNames) {
        cachedParsedNames = parsePremiumNames(premiumNamesRaw);
    }
    return cachedParsedNames;
};

// Focus Topics
export type FocusTopic = 'WEALTH' | 'JOB' | 'HEALTH' | 'LOVE' | 'PATRON';

export const FOCUS_TOPIC_LABELS: Record<FocusTopic, string> = {
    WEALTH: '💰 โชคลาภและการเงิน (Wealth)',
    JOB: '💼 การงานและอำนาจ (Job & Power)',
    HEALTH: '💪 สุขภาพ (Health)',
    LOVE: '❤️ ความรักและเสน่ห์ (Love)',
    PATRON: '🦁 คนอุปถัมภ์ (Patron)'
};

// Mapping Focus to Preferred Thaksa Categories
export const FOCUS_MAPPING: Record<FocusTopic, Array<keyof typeof thaksaConfig.sunday>> = {
    WEALTH: ['si', 'mula'],      // ศรี, มูละ
    JOB: ['dech', 'ussaha'],     // เดช, อุตสาหะ
    HEALTH: ['ayu'],             // อายุ
    LOVE: ['si', 'borivan'],     // ศรี, บริวาร
    PATRON: ['montri']           // มนตรี
};

// Helper: Get Day Key from Date + Time
export const getAstrologicalDay = (date: Date, timeStr: string): DayKey => {
    // timeStr format "HH:mm"
    const [hours] = timeStr.split(':').map(Number);

    // Create a date object for the birth time to handle day shift logic easily? 
    // Actually, we just need the day of week and the hour.

    let dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday...

    // Solar Calendar Logic: New day starts at 06:00.
    // If time is between 00:00 and 05:59, it counts as the PREVIOUS day.
    if (hours < 6) {
        dayOfWeek = (dayOfWeek - 1 + 7) % 7;
    }

    // Map to DayKey
    // Special Case: Wednesday (3). 
    // If it is Wednesday (after adjustment):
    //   06:00 - 17:59 -> Wednesday Day
    //   18:00 - 05:59 (Next day) -> But wait, if we are in the "Previous Day" logic above, 
    //   Let's trace:
    //   Born Wed 04:00 -> hours < 6 -> dayOfWeek becomes Tuesday. -> Returns 'tuesday'. Correct.
    //   Born Wed 20:00 -> hours >= 6 -> dayOfWeek is Wed. -> Check Night.

    if (dayOfWeek === 3) {
        // It is Wednesday (astrologically).
        // Check if Night: 18:00 - 05:59 (next day).
        // Since we already handled the "before 6am" shift, we only need to check if it's AFTER 18:00 on the actual Wednesday.
        // Wait, if born Thu 04:00 -> Adjusted to Wed. This IS Wednesday Night.
        // So we need to know if the *original* time was night relative to Wednesday.

        // Let's refine logic.
        // If adjusted day is WEDNESDAY:
        // Case A: Real time was Wed 06:00 - 17:59 -> Wed Day.
        // Case B: Real time was Wed 18:00 - 23:59 -> Wed Night.
        // Case C: Real time was Thu 00:00 - 05:59 -> Adjusted to Wed -> Wed Night.

        // So simply: Is it Night?
        // Night is 18:00 onwards (until 05:59 next day).
        // If adjusted day is Wed, check if "Night conditions" apply.
        // Only need distinct check if adjusted day is 3.

        const isNight = hours >= 18 || hours < 6;
        if (isNight) return 'wednesday_night';
        return 'wednesday';
    }

    const map: Record<number, DayKey> = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday', // Should be handled above but for safety
        4: 'thursday',
        5: 'friday',
        6: 'saturday'
    };

    return map[dayOfWeek];
};

export interface PremiumResult {
    name: string;
    meaning: string;
    totalScore: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'F';
    notes: string[];
}

export const analyzePremiumName = (
    name: string,
    surname: string,
    dayKey: DayKey,
    focus: FocusTopic
): PremiumResult => {
    const dayConfig = thaksaConfig[dayKey];

    // 1. Check Kali (Galkinee) - Must NOT contain any Kali letter
    const kaliChars = dayConfig.kali;
    for (const char of name) {
        if (kaliChars.includes(char)) {
            return {
                name,
                meaning: 'Contain Kali characters',
                totalScore: 0,
                grade: 'F',
                notes: ['มีอักษรกาลกิณี (ไม่มงคล)']
            };
        }
    }

    // 2. Check Leading Character
    const firstChar = name[0];
    const preferredCategories = FOCUS_MAPPING[focus];
    let isPreferredLead = false;


    // Check if first char is in any preferred category
    for (const cat of preferredCategories) {

        if (dayConfig[cat] && dayConfig[cat].includes(firstChar)) {
            isPreferredLead = true;
            // Map category key to Thai name if needed
            break;
        }
    }

    // If not preferred, check if it's at least "Good" (any non-Kali, non-Borivan maybe? No, Borivan is neutral/good).
    // Actually all non-Kali are "Good". But "Preferred" gets higher score.

    // 3. Numerology
    const nameScore = calculateScore(name);
    const surnameScore = calculateScore(surname);
    const totalScore = nameScore + surnameScore;

    // Define "Good" sums (This list should be extensive, using a small sample for now or imported)
    // Common auspicious numbers: 14, 15, 24, 36, 41, 42, 45, 50, 51, 54, 55, 56, 59, 63, 65...
    const auspiciousSums = [
        9, 14, 15, 19, 24, 36, 40, 41, 42, 44, 45, 46, 50, 51, 54, 55, 56, 59, 60, 63, 64, 65
    ];
    // Note: This needs to be robust. 
    // Filter 2 says: "Get good total sum".

    const isGoodSum = auspiciousSums.includes(totalScore);

    // Grading
    let grade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'B';
    const notes: string[] = [];

    if (isPreferredLead) {
        notes.push(`ทักษานำหน้าส่งเสริม: ${focus}`);
    }

    if (isGoodSum) {
        notes.push(`เลขศาสตร์ผลรวมมงคล: ${totalScore}`);
    } else {
        notes.push(`เลขศาสตร์ผลรวม: ${totalScore} (ปานกลาง)`);
    }

    if (isPreferredLead && isGoodSum) {
        grade = 'A+';
    } else if (isPreferredLead || isGoodSum) {
        grade = 'A';
    } else {
        grade = 'B'; // No Kali, but neither preferred lead nor top-tier sum (but maybe acceptable name sum?).
    }

    // Refinement: If name sum itself is bad? 
    // User Filter 2: "Bring names passing Filter 1 to calc sum... get good sum".
    // This implies we ONLY return names with GOOD sums.
    // If the tool is generating names, we filter.
    // If the tool is ANALYZING a specific input name, we grade it.
    // The prompt implies "Search/Analysis". "Input: Birth... -> Calculate". 
    // And "Final Score: Cut Grade". 
    // This sounds like an Analysis of a GIVEN name? OR Generating?
    // "Help improve... Premium Analysis... Input: Birth... -> Output Score".
    // The UI in screenshot shows "Analyze Auspicious Name".
    // Usually this generates a list. "Number of names 10".
    // User request: "Input: Receive Birth... -> Filter 1 -> Filter 2 -> Final Score".
    // This implies a Generation Pipeline.

    return {
        name,
        meaning: 'ความหมายดี', // Placeholder, requires dict
        totalScore,
        grade,
        notes
    };
};

export const generatePremiumNames = (
    surname: string,
    dayKey: DayKey,
    focus: FocusTopic,
    limit: number = 20,
    excludedNames: string[] = []
): PremiumResult[] => {
    const allNames = getParsedNames();
    const dayConfig = thaksaConfig[dayKey];
    const surnameScore = calculateScore(surname);

    // Thai Day Name for matching with raw data "suitableDays"
    const dayNameMap: Record<DayKey, string> = {
        sunday: 'อาทิตย์',
        monday: 'จันทร์',
        tuesday: 'อังคาร',
        wednesday: 'พุธ(กลางวัน)',
        wednesday_night: 'พุธ(กลางคืน)',
        thursday: 'พฤหัสบดี',
        friday: 'ศุกร์',
        saturday: 'เสาร์'
    };

    const targetDayStr = dayNameMap[dayKey];

    // Good Total Sums (Name + Surname)
    const auspiciousSums = new Set([
        9, 14, 15, 19, 24, 36, 40, 41, 42, 44, 45, 46, 50, 51, 54, 55, 56, 59, 60, 63, 64, 65,
        90, 91, 92, 95, 99, 100, 104, 105
    ]);

    const results: PremiumResult[] = [];

    const excludedSet = new Set(excludedNames);

    for (const data of allNames) {
        // 0. Check Exclusion
        if (excludedSet.has(data.name)) {
            continue;
        }

        // 1. Check Suitable Day
        if (!data.suitableDays.includes(targetDayStr)) {
            continue;
        }

        // 2. Check Total Sum (Name + Surname)
        const totalSum = data.totalScore + surnameScore;
        if (!auspiciousSums.has(totalSum)) {
            continue;
        }

        // 3. Check Leading Character (Thaksa Focus)
        const firstChar = data.name[0];
        const preferredCategories = FOCUS_MAPPING[focus];
        let isPreferredLead = false;

        for (const cat of preferredCategories) {

            if (dayConfig[cat] && dayConfig[cat].includes(firstChar)) {
                isPreferredLead = true;
                break;
            }
        }

        let grade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'B';
        const notes: string[] = [];

        if (isPreferredLead) {
            grade = 'A+';
            notes.push(`ทักษานำหน้าส่งเสริม: ${FOCUS_TOPIC_LABELS[focus]}`);
        } else {
            grade = 'A';
        }

        notes.push(`ผลรวมชื่อสกุล: ${totalSum} (มงคล)`);

        results.push({
            name: data.name,
            meaning: data.scoreBreakdown.join(' '),
            totalScore: totalSum,
            grade,
            notes
        });
    }

    // Sort by Grade (A+ -> A -> B) then by Total Score (desc)
    results.sort((a, b) => {
        const gradeOrder = { 'A+': 3, 'A': 2, 'B': 1, 'C': 0, 'F': -1 };
        if (gradeOrder[a.grade] !== gradeOrder[b.grade]) {
            return gradeOrder[b.grade] - gradeOrder[a.grade];
        }
        return b.totalScore - a.totalScore;
    });

    return results.slice(0, limit);
};
