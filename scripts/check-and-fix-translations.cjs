const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = {};
const files = fs.readdirSync(outDir).filter(f => f.endsWith('-translations.json') && !f.startsWith('complete'));

files.forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(outDir, file), 'utf8'));

    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.enText && item.cnText) {
          translations[item.enText] = item.cnText;
        }
      });
    } else {
      Object.entries(data).forEach(([en, cn]) => {
        if (typeof cn === 'string') {
          translations[en] = cn;
        }
      });
    }
  } catch (e) {
    // ignore
  }
});

console.log(`✅ Total translations loaded: ${Object.keys(translations).length}\n`);

// 测试词条
const testCases = [
  '140 Max Energy Shield',
  '+140 Max Energy Shield',
  '140 Max Energy Shield',
  '+140 Max Energy Shield',
  '+140 Max Energy Shield',
  'Elder Sage Girdle',
  'Elder Sage Girdle - +140 Max Energy Shield',
  '+(50–70) Max Energy Shield',
  '+(87–117) Max Energy Shield',
  '+(140–160) Max Energy Shield',
  'Max Energy Shield',
];

console.log('=== Testing Translations ===\n');

testCases.forEach(test => {
  const found = translations[test];
  console.log(`${found ? '✅' : '⚠️'} "${test}"`);
  if (found) {
    console.log(`   → "${found}"`);
  } else {
    // 尝试模糊匹配
    const keys = Object.keys(translations);
    const partial = keys.find(k => k.includes(test) || test.includes(k));
    if (partial) {
      console.log(`   → Partial match: "${partial}" → "${translations[partial]}"`);
    }
  }
  console.log('');
});

// 检查缺失的 Max Energy Shield 相关翻译
console.log('\n=== Max Energy Shield related translations ===');
Object.entries(translations)
  .filter(([en]) => en.includes('Max Energy Shield'))
  .slice(0, 20)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 50).padEnd(50)} → ${cn}`);
  });
