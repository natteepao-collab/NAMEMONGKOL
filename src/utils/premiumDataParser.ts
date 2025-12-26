export interface PremiumNameData {
    name: string;
    totalScore: number;
    suitableDays: string[];
    scoreBreakdown: string[];
}

export const parsePremiumNames = (rawData: string): PremiumNameData[] => {
    const lines = rawData.trim().split('\n');
    const results: PremiumNameData[] = [];
    const seenNames = new Set<string>();

    for (const line of lines) {
        if (!line.trim()) continue;

        // Split by tab first, as that's the most likely separator for spreadsheet data
        let parts = line.split('\t').map(p => p.trim()).filter(p => p !== '');

        // If tabs didn't work (length < 4), try splitting by multiple spaces
        if (parts.length < 4) {
            // Use regex to split by 2 or more spaces, but be careful about the days part which might have spaces
            // Logic:
            // 1. Name is first part
            // 2. Score is number
            // 3. Days is string
            // 4. Breakdown contains numbers and 🟢

            // Let's try a strict column extraction regex
            // Name (space) Score (space) Days (space) Breakdown
            const match = line.match(/^(\S+)\s+(\d+)\s+(.+?)\s+([\d🟢\s\-]+)$/);
            if (match) {
                parts = [match[1], match[2], match[3], match[4]];
            }
        }

        if (parts.length >= 4) {
            const name = parts[0];
            const totalScore = parseInt(parts[1], 10);
            const daysStr = parts[2];
            const breakdownStr = parts[3];

            // Clean up days
            const suitableDays = daysStr.split(',').map(d => d.trim());

            // Clean up breakdown
            // Format: "16🟢 - 66🟢 - ..."
            const scoreBreakdown = breakdownStr.split('-').map(s => s.trim());

            // Deduplication check
            if (!seenNames.has(name)) {
                seenNames.add(name);
                results.push({
                    name,
                    totalScore,
                    suitableDays,
                    scoreBreakdown
                });
            }
        }
    }

    return results;
};
