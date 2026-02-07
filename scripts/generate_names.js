const fs = require('fs');

// --- Data: Thai Numerology (เลขศาสตร์) ---
const charValues = {
    'ก': 1, 'ด': 1, 'ถ': 1, 'ท': 1, 'ภ': 1, 'ฤ': 1, 'ฤา': 1, 'ฤๅ': 1,
    'า': 1, 'ำ': 1, 'ุ': 1, '่': 1,
    'ข': 2, 'ช': 2, 'ง': 2, 'บ': 2, 'ป': 2,
    'เ': 2, 'แ': 2, 'ู': 2, '้': 2,
    'ฆ': 3, 'ฑ': 3, 'ฒ': 3, 'ต': 3, 'ฅ': 3, 'ฃ': 3,
    '๋': 3,
    'ค': 4, 'ธ': 4, 'ร': 4, 'ญ': 4, 'ษ': 4,
    'โ': 4, 'ะ': 4, 'ั': 4, 'ิ': 4,
    'ฉ': 5, 'ฌ': 5, 'ฎ': 5, 'ณ': 5, 'น': 5, 'ม': 5, 'ห': 5, 'ฮ': 5, 'ฬ': 5,
    'ึ': 5,
    'จ': 6, 'ล': 6, 'ว': 6, 'อ': 6,
    'ใ': 6,
    'ซ': 7, 'ศ': 7, 'ส': 7,
    'ี': 7, 'ื': 7, '๊': 7,
    'ผ': 8, 'ฝ': 8, 'พ': 8, 'ฟ': 8, 'ย': 8,
    '็': 8,
    'ฏ': 9, 'ฐ': 9,
    'ไ': 9, '์': 9, 'ฦ': 9, 'ฦๅ': 9,
};

// --- Pair Definitions (Partial - focused on levels) ---
// I will just implement the logic to check levels based on the file content I saw earlier.
// Actually, I need the full map to be accurate. I'll include the ones I saw in view_file.
// To save space/time, I will only include the "bad" pairs (level 2) and assume others are good/neutral if I want to be strict,
// OR I can try to copy the whole thing. Given the size, I'll copy the critical structure and relevant level 2 checks.
// Actually, I'll read the pairDefinitions.ts file and parse it.

const calculateSum = (name) => {
    let sum = 0;
    for (const char of name) {
        if (charValues[char]) {
            sum += charValues[char];
        }
    }
    return sum;
};

const getPairs = (name) => {
    // Basic pair extraction (same as in standard logic usually)
    // Actually, normally pairs are calculated from the numeric values of adjacent characters.
    // e.g. "กา" -> ก=1, า=1 -> pair 11.
    // Let's verify standard Thai numerology pair logic.
    // Usually it's mapping each char to number, then taking adjacent numbers.

    let nums = [];
    for (const char of name) {
        if (charValues[char]) {
            nums.push(charValues[char]);
        }
    }

    const pairs = [];
    for (let i = 0; i < nums.length - 1; i++) {
        pairs.push('' + nums[i] + nums[i + 1]);
    }
    return pairs;
};

async function main() {
    // 1. Read pairDefinitions.ts and parse it
    const pairDefContent = fs.readFileSync('c:/Users/ณวิธบุญยะรัตน์/Desktop/Next.js/6.NAMEMONGKOL/src/data/pairDefinitions.ts', 'utf8');
    const pairDefRegex = /'(\d{2})':\s*{\s*level:\s*(\d)/g;
    let match;
    const pairLevels = {};
    while ((match = pairDefRegex.exec(pairDefContent)) !== null) {
        pairLevels[match[1]] = parseInt(match[2]);
    }

    // 2. Read premiumNamesRaw.ts
    const rawNamesContent = fs.readFileSync('c:/Users/ณวิธบุญยะรัตน์/Desktop/Next.js/6.NAMEMONGKOL/src/data/premiumNamesRaw.ts', 'utf8');
    // Extract text between backticks
    const backtickMatch = rawNamesContent.match(/`([\s\S]*)`/);
    if (!backtickMatch) {
        console.error("Could not find names in backticks");
        return;
    }
    const names = backtickMatch[1].split('\n').map(n => n.trim()).filter(n => n);

    // 3. Filter
    const targetSums = [41, 42, 45, 46, 54, 55, 59, 63];
    const results = [];

    for (const name of names) {
        const sum = calculateSum(name);
        if (!targetSums.includes(sum)) continue;

        const pairs = getPairs(name);
        if (pairs.length === 0) continue;

        let isGradeA = true;
        for (const pair of pairs) {
            // If pair level is 2 (Bad), reject.
            // If pair not found, maybe skip or assume neutral? strict=checked against map.
            if (pairLevels[pair] === 2) {
                isGradeA = false;
                break;
            }
        }

        if (isGradeA) {
            results.push({ name, sum, pairs });
        }
    }

    // Limit results per letter to ensure we see all groups
    const kNames = results.filter(r => r.name.startsWith('ก')).slice(0, 10);
    const jNames = results.filter(r => r.name.startsWith('จ')).slice(0, 10);
    const chNames = results.filter(r => r.name.startsWith('ช')).slice(0, 10);

    // Also some others for variety if needed
    const otherNames = results.filter(r => !['ก', 'จ', 'ช'].includes(r.name[0])).slice(0, 5);

    console.log(JSON.stringify([...kNames, ...jNames, ...chNames, ...otherNames], null, 2));
}

main();
