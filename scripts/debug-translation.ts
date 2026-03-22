import { AFFIX_NAME_TRANSLATIONS } from '../src/data/translated-affixes/complete-affix-translations.ts';

const testText = '+64 Max Life';

console.log('=== Debugging Translation ===\n');
console.log(`Input: ${testText}\n`);

const exactMatch = AFFIX_NAME_TRANSLATIONS[testText];
console.log(`Exact match: ${exactMatch ? 'FOUND' : 'NOT FOUND'}`);
if (exactMatch) console.log(`  → ${exactMatch}`);

console.log('\nChecking for patterns containing "Max Life":');
const maxLifePatterns = Object.keys(AFFIX_NAME_TRANSLATIONS)
  .filter(key => key.includes('Max Life'))
  .sort((a, b) => b.length - a.length)
  .slice(0, 10);

maxLifePatterns.forEach(pattern => {
  const translation = AFFIX_NAME_TRANSLATIONS[pattern];
  const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const matches = testText.match(regex);
  console.log(`  ${matches ? '✓' : '✗'} Pattern: "${pattern.substring(0, 80)}..."`);
  console.log(`    Translation: "${translation.substring(0, 80)}..."`);
});

console.log('\nCurrent translation function result:');
import { getTranslatedAffixText } from '../src/lib/affix-translator.ts';
const result = getTranslatedAffixText(testText);
console.log(`Result: ${result}`);
console.log(`Changed: ${result !== testText}`);
