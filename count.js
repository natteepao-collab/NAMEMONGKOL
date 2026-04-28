const fs = require('fs');
const content = fs.readFileSync('src/data/auspiciousNames.ts', 'utf8');
const match = content.match(/"[^"]+"/g);
console.log('auspiciousNames.ts:', match ? match.length : 0);

const content2 = fs.readFileSync('src/data/premiumNamesRaw.ts', 'utf8');
const match2 = content2.match(/"[^"]+"/g);
console.log('premiumNamesRaw.ts:', match2 ? match2.length : 0);
