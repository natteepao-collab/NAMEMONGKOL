const fs = require('fs');
const content = fs.readFileSync('src/data/articles.ts', 'utf8');

// Find all articles in articles.ts
const blocks = content.split(/id:\s*['"][0-9]+['"]/);
let count = 0;
let missing = 0;
console.log("Analyzing articles in articles.ts...");

blocks.slice(1).forEach(block => {
    const titleMatch = block.match(/title:\s*['"](.*?)['"]/);
    const imgMatch = block.match(/coverImage:\s*['"](.*?)['"]/);
    const altMatch = block.match(/coverImageAlt:\s*['"](.*?)['"]/);
    
    if(titleMatch && imgMatch) {
        count++;
        if(!altMatch) {
            missing++;
            console.log(`Missing alt for: ${titleMatch[1]}`);
        } else {
            console.log(`OK: [${altMatch[1]}] for ${titleMatch[1]}`);
        }
    }
});

console.log(`Total articles: ${count}`);
console.log(`Missing alt: ${missing}`);

// Also check the inline HTML <img> tags in the content
console.log("\nChecking inline <img> tags in all files...");
const fileNames = [
    'src/data/articles.ts',
    'src/data/article-boy-names-2569.ts',
    'src/data/article-girl-names-2569.ts',
    'src/data/article-monday-girl-names-2569.ts'
];

let imgCount = 0;
let imgMissingAlt = 0;

fileNames.forEach(file => {
    if (!fs.existsSync(file)) return;
    const data = fs.readFileSync(file, 'utf8');
    const imgRegex = /<img[^>]+>/g;
    let match;
    while ((match = imgRegex.exec(data)) !== null) {
        imgCount++;
        const tag = match[0];
        const altMatch = tag.match(/alt=["'](.*?)["']/);
        if (!altMatch) {
            imgMissingAlt++;
            console.log(`Inline img missing alt in ${file}: ${tag}`);
        } else {
            console.log(`Inline img OK: [${altMatch[1]}] in ${file}`);
        }
    }
});
console.log(`Total inline images: ${imgCount}`);
console.log(`Missing alt: ${imgMissingAlt}`);
