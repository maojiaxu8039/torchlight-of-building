// Test the actual translation flow
const fs = require('fs');
const path = require('path');

// Load translations
const translations = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../src/data/translated-affixes/merged-all-translations.json'),
    'utf8'
  )
);

// Simulate getTranslatedAffixText function
function getTranslatedAffixText(text) {
  if (!text) return text;

  if (translations[text]) {
    return translations[text];
  }

  // Normalize dashes
  let result = text.replace(/-/g, '–').replace(/&ndash;/g, '–');

  const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const normalizedKey = key.replace(/-/g, '–').replace(/&ndash;/g, '–');
    const regex = new RegExp(`(^|\\s)${normalizedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=\\s|$|,)`, 'gi');
    const replacement = `$1${translations[key]}`;
    result = result.replace(regex, replacement);
  }

  return result;
}

// Test cases
const testCases = [
  '+15 Strength',
  '+15 Dexterity',
  '+15 Intelligence',
  '+8% Fire Resistance',
  '+8% Cold Resistance',
  'Vorax Limb: Hands',
];

console.log('=== Testing Translation Flow ===\n');

testCases.forEach(text => {
  const result = getTranslatedAffixText(text);
  console.log(`Input: "${text}"`);
  console.log(`Output: "${result}"`);
  console.log(`Translated: ${result !== text ? '✅ YES' : '❌ NO'}`);
  console.log('');
});
