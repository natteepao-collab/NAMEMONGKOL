
import { generatePremiumNames } from '../../utils/premiumAnalysisUtils';

const surname = "ใจดี";
const day = "sunday";
const focus = "WEALTH";

try {
    const results = generatePremiumNames(surname, day, focus, 20);
    console.log(`Generated ${results.length} names.`);
    if (results.length > 0) {
        console.log("Sample:", results[0]);
    } else {
        console.log("No names generated.");
    }
} catch (error) {
    console.error("Error generating names:", error);
}
