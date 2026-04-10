
const fs = require('fs');
const tsContent = fs.readFileSync('src/data/sampleArticles.ts', 'utf8');

// Use a more aggressive approach to extract the array
const arrayMatch = tsContent.match(/export const sampleArticles: Article\[\] = (\[[\s\S]*?\]);/);
if (!arrayMatch) {
  console.error("Could not find the articles array");
  process.exit(1);
}

let arrayStr = arrayMatch[1];
// Remove trailing commas that JSON.parse hates
arrayStr = arrayStr.replace(/,\s*\]/g, ']');
// Quote the keys
arrayStr = arrayStr.replace(/([{,]\s*)(\w+):/g, '$1"$2":');
// Handle single quotes to double quotes (roughly)
arrayStr = arrayStr.replace(/'/g, '"');

try {
  const articles = JSON.parse(arrayStr);
  fs.writeFileSync('scratch/articles.json', JSON.stringify(articles, null, 2));
  console.log(`Success! Extracted ${articles.length} articles.`);
} catch (e) {
  console.error("JSON parsing failed, writing raw string for debug.");
  fs.writeFileSync('scratch/debug_array.txt', arrayStr);
  console.error(e.message);
  process.exit(1);
}
