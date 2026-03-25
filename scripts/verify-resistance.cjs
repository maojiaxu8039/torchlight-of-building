const fs = require('fs');
const path = require('path');

const translations = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../src/data/translated-affixes/merged-all-translations.json'),
    'utf8'
  )
);

const testCases = [
  '+8% Cold Resistance',
  '+5% Cold Resistance',
  '+10% Cold Resistance',
  '+15% Cold Resistance',
  '+20% Cold Resistance',
  '+8% Fire Resistance',
  '+8% Lightning Resistance',
  '+8% Erosion Resistance',
  '+10% All Resistance',
  'Cold Resistance',
  'Fire Resistance',
  'Lightning Resistance',
  'Erosion Resistance',
  'All Resistance',
];

console.log('=== Resistance Translation Verification ===\n');

let allPassed = true;

testCases.forEach(test => {
  const found = translations[test];
  if (found) {
    console.log(`✅ ${test}`);
    console.log(`   → ${found}`);
  } else {
    console.log(`❌ ${test}`);
    console.log(`   → NOT FOUND`);
    allPassed = false;
  }
});

console.log('');
if (allPassed) {
  console.log('🎉 All resistance translations verified successfully!');
} else {
  console.log('⚠️  Some translations are missing');
}
