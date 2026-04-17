const fs = require('fs');
const content = fs.readFileSync('src/data/articles.ts', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('lucky-cat')) {
        console.log(`Line ${i}: ${lines[i]}`);
    }
}
