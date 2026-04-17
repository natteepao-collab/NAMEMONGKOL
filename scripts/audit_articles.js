const fs = require('fs');
const content = fs.readFileSync('src/data/articles.ts', 'utf8');

// Find all article blocks by id: pattern
const idRegex = /id: '(\d+)'/g;
const slugRegex = /slug: '([^']+)'/g;
const titleRegex = /title: '([^']+)'/g;
const metaTitleRegex = /metaTitle: '([^']+)'/g;
const metaDescRegex = /metaDescription: '([^']+)'/g;
const coverAltRegex = /coverImageAlt: '([^']+)'/g;
const faqRegex = /faqItems:/g;
const tocRegex = /\btoc:/g;
const relatedSlugsRegex = /relatedSlugs:/g;
const dateModifiedRegex = /dateModified:/g;

function extractAll(re) {
  const results = [];
  let m;
  while ((m = re.exec(content)) !== null) results.push(m[1]);
  return results;
}

const ids = extractAll(idRegex);
const slugs = extractAll(slugRegex);
const titles = extractAll(titleRegex);
const metaTitles = extractAll(metaTitleRegex);
const metaDescs = extractAll(metaDescRegex);
const coverAlts = extractAll(coverAltRegex);

const faqCount = (content.match(/faqItems:/g) || []).length;
const tocCount = (content.match(/\btoc:/g) || []).length;
const relatedCount = (content.match(/relatedSlugs:/g) || []).length;
const dateModifiedCount = (content.match(/dateModified:/g) || []).length;

console.log('=== ARTICLE SEO AUDIT ===');
console.log('Total article IDs found:', ids.length);
console.log('Total slugs found:', slugs.length);
console.log('Total titles found:', titles.length);
console.log('Total metaTitles:', metaTitles.length);
console.log('Total metaDescriptions:', metaDescs.length);
console.log('Total coverImageAlt:', coverAlts.length);
console.log('Total with faqItems:', faqCount);
console.log('Total with toc:', tocCount);
console.log('Total with relatedSlugs:', relatedCount);
console.log('Total with dateModified:', dateModifiedCount);
console.log('');

console.log('=== ARTICLE LIST ===');
ids.forEach((id, i) => {
  const slug = slugs[i] || 'N/A';
  const title = titles[i] || 'N/A';
  const metaTitle = metaTitles[i] || 'MISSING';
  const metaDesc = metaDescs[i] || 'MISSING';
  const coverAlt = coverAlts[i] || 'MISSING';
  
  const metaTitleLen = metaTitle === 'MISSING' ? 0 : metaTitle.length;
  const metaDescLen = metaDesc === 'MISSING' ? 0 : metaDesc.length;
  
  const issues = [];
  if (metaTitle === 'MISSING') issues.push('NO_META_TITLE');
  else if (metaTitleLen > 65) issues.push(`META_TITLE_TOO_LONG(${metaTitleLen})`);
  else if (metaTitleLen < 40) issues.push(`META_TITLE_SHORT(${metaTitleLen})`);
  
  if (metaDesc === 'MISSING') issues.push('NO_META_DESC');
  else if (metaDescLen > 165) issues.push(`META_DESC_TOO_LONG(${metaDescLen})`);
  else if (metaDescLen < 120) issues.push(`META_DESC_SHORT(${metaDescLen})`);
  
  if (coverAlt === 'MISSING') issues.push('NO_COVER_ALT');

  console.log(`[ID:${id}] ${slug}`);
  console.log(`  Title: ${title.substring(0,70)}`);
  console.log(`  MetaTitle(${metaTitleLen}): ${metaTitle.substring(0,60)}...`);
  console.log(`  MetaDesc(${metaDescLen}): ${metaDesc.substring(0,80)}...`);
  console.log(`  Issues: ${issues.length ? issues.join(', ') : '✅ OK'}`);
  console.log('');
});
