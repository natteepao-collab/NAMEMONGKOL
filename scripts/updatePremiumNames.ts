
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/premiumNamesRaw.ts');

const newNamesInput = `
วิไลวรรณ
ธัญลักษณ์
กัญญ์ณัฐ
ปัญญา
อภิสิทธิ์
วิไลลักษณ์
ธนวันต์
จิรภัทร
ปริญญา
ธนภัทร
ธนภณ
ณภัทร
สรรเพชญ์
สรวิชญ์
ศิริกร
ณัฐพงษ์
ธัญลักษณ์
ณัฐภณ
วรินญา
ธนโชค
ธนภณ
กัญญ์วารี
ณัฐศรี
กัญญ์วริน
อัครณัฐ
ณัฐธาริน
ชญานวล
ธัญศรา
กัญญ์อริน
กัญญ์นาริน
กัญญ์วรรณ
ณัฐนภ
ภัทรจิร
วรจิร
ณัฐศิริวรรณ
กัญญ์วรศิริ
ณัฐอริศรา
กัญญ์ศริน
กัญญ์ศิริ
ธัญวรศิริ
อดิสรณ์
ชญาวรศิริ
ชญานารี
กัญญ์วิภิน
กัญญ์วริน
ณัฐบูรณ์
วรินาวินา
ชญานิธิ
กวินธร
ลินิน
อภิริน
วรินธา
อรินธา
ธนวิน
นรวิณ
ธารวิน
คณวิน
นาวิธร
ธาวัทธร
อรินธา
วรินธา
นารินธา
อภิธิน
อคิน
วริน
อคิณ
นาริน
อัญญา
วริน
อริน
ณาริน
นาริณ
ธาริณา
นาธิน
ควิณ
นาราธร
นภิน
คณัท
ธนัท
ธาริก
ลาวา
ณัฐศิลป์
ธีรวินท์
ธีรวินิจ
ธัญศรา
คีริน
ธีร์
ธีริน
ธีธิน
นาวารี
คริศ
`;

try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Extract existing names from the backtick string
    const match = fileContent.match(/export const premiumNamesRaw = `([\s\S]*?)`;/);
    if (!match) {
        throw new Error('Could not parse premiumNamesRaw');
    }

    const existingNamesBlock = match[1];
    const existingNames = new Set(existingNamesBlock.split('\n').map(Line => Line.trim()).filter(Boolean));

    const newNamesList = newNamesInput.split('\n').map(n => n.trim()).filter(Boolean);
    let addedCount = 0;

    newNamesList.forEach(name => {
        if (!existingNames.has(name)) {
            existingNames.add(name);
            addedCount++;
        }
    });

    // Sort names Thai alphabetically for tidiness (optional but good)
    const sortedNames = Array.from(existingNames).sort((a, b) => a.localeCompare(b, 'th'));

    // Reconstruct file
    const newContent = `// IMPORTANT: This is a sample of the data. 
// Please replace the content inside the backticks with the full dataset provided in your request.
// Copy the lines starting from "กมลวัทน์..." to the end.

export const premiumNamesRaw = \`
${sortedNames.join('\n')}
\`;
`;

    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Successfully added ${addedCount} new names. Total names: ${existingNames.size}`);

} catch (error) {
    console.error('Error updating premium names:', error);
}
