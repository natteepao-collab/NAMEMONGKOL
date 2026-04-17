const fs = require('fs');

// Read both files
const mainContent = fs.readFileSync('src/data/articles.ts', 'utf8');
const girlNamesContent = fs.readFileSync('src/data/article-girl-names-2569.ts', 'utf8');
const combined = mainContent + '\n' + girlNamesContent;

// Find all metaTitle values with their line context
const lines = combined.split('\n');
let currentSlug = '';
let currentId = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Track current article
  const idMatch = line.match(/id:\s*'(\d+)'/);
  if (idMatch) currentId = idMatch[1];
  
  const slugMatch = line.match(/slug:\s*'([^']+)'/);
  if (slugMatch) currentSlug = slugMatch[1];
  
  const metaTitleMatch = line.match(/metaTitle:\s*'([^']+)'/);
  if (metaTitleMatch) {
    const title = metaTitleMatch[1];
    const len = title.length;
    const status = len > 65 ? '🔴 TOO LONG' : len > 60 ? '🟡 CLOSE' : '✅ OK';
    console.log(`[ID:${currentId}] ${currentSlug}`);
    console.log(`  ${status} (${len} chars): ${title}`);
    console.log('');
  }
}
