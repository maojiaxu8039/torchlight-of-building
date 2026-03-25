// Test script to verify translation
const fs = require('fs');
const path = require('path');

// Load translations
const translations = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../src/data/translated-affixes/merged-all-translations.json'),
    'utf8'
  )
);

console.log('=== Testing Translation ===\n');

// Test cases
const testCases = [
  '+15 Strength',
  '+15 Dexterity',
  '+15 Intelligence',
  '+8% Fire Resistance',
  '+8% Cold Resistance',
  '+(15-20) Strength',
  '+10 Strength',
];

testCases.forEach(text => {
  // Simulate getTranslatedAffixText function
  if (translations[text]) {
    console.log(`✅ "${text}"`);
    console.log(`   → "${translations[text]}"`);
  } else {
    // Try with normalized format
    const normalized = text.replace(/-/g, '–').replace(/&ndash;/g, '–');
    if (translations[normalized]) {
      console.log(`⚠️  "${text}" (normalized)`);
      console.log(`   → "${translations[normalized]}"`);
    } else {
      console.log(`❌ "${text}" - NOT FOUND`);
      console.log(`   normalized: "${normalized}"`);
    }
  }
});

console.log('\n=== Checking if data files have these ===\n');

// Check gear-affix data
const gearAffixDir = path.join(__dirname, '../src/data/gear-affix');
const files = fs.readdirSync(gearAffixDir).filter(f => f.endsWith('.ts'));

testCases.forEach(text => {
  let found = false;
  files.forEach(file => {
    const content = fs.readFileSync(path.join(gearAffixDir, file), 'utf8');
    if (content.includes(text)) {
      found = true;
    }
  });
  console.log(`${found ? '✅' : '❌'} Data contains "${text}": ${found}`);
});
