const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, 'merged-all-translations.json'), 'utf8')
);

console.log(`✅ Loaded ${Object.keys(translations).length} translations\n`);

// 测试词条
const testCases = [
  '+8% Cold Resistance',
  '+5% Cold Resistance',
  '+10% Cold Resistance',
  '+15% Cold Resistance',
  '+20% Cold Resistance',
  '% Cold Resistance',
  'Cold Resistance',
  '+8% Fire Resistance',
  '+8% Lightning Resistance',
  '+8% Erosion Resistance',
  '% Fire Resistance',
  '% Lightning Resistance',
  '% Erosion Resistance',
  'Fire Resistance',
  'Lightning Resistance',
  'Erosion Resistance',
];

console.log('=== Testing Resistance Translations ===\n');

testCases.forEach(test => {
  const found = translations[test];
  if (found) {
    console.log(`✅ "${test}"`);
    console.log(`   → "${found}"`);
  } else {
    // 尝试模糊匹配
    const keys = Object.keys(translations);
    const partial = keys.find(k => k.includes(test) || test.includes(k));
    if (partial) {
      console.log(`⚠️  "${test}" (partial match)`);
      console.log(`   → "${partial}" → "${translations[partial]}"`);
    } else {
      console.log(`❌ "${test}" - NOT FOUND`);
    }
  }
  console.log('');
});

// 检查现有的 Cold Resistance 相关翻译
console.log('\n=== Existing Cold Resistance translations ===');
Object.entries(translations)
  .filter(([en]) => en.includes('Cold Resistance'))
  .slice(0, 15)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 50).padEnd(50)} → ${cn}`);
  });
