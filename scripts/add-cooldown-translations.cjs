const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, 'merged-all-translations.json'), 'utf8')
);

// 检查现有的 Cooldown Recovery Speed 翻译
console.log('=== Existing Cooldown Recovery Speed translations ===\n');
Object.entries(translations)
  .filter(([en]) => en.includes('Cooldown Recovery Speed'))
  .slice(0, 15)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 60).padEnd(60)} → ${cn}`);
  });

// 添加缺失的翻译
const missingTranslations = {
  // Cooldown Recovery Speed variants
  '+23% Cooldown Recovery Speed': '+23% 冷却回复速度',
  '+20% Cooldown Recovery Speed': '+20% 冷却回复速度',
  '+25% Cooldown Recovery Speed': '+25% 冷却回复速度',
  '+30% Cooldown Recovery Speed': '+30% 冷却回复速度',
  '+35% Cooldown Recovery Speed': '+35% 冷却回复速度',
  '+40% Cooldown Recovery Speed': '+40% 冷却回复速度',
  '+45% Cooldown Recovery Speed': '+45% 冷却回复速度',
  '+50% Cooldown Recovery Speed': '+50% 冷却回复速度',

  // Generic
  '% Cooldown Recovery Speed': '% 冷却回复速度',
  'Cooldown Recovery Speed': '冷却回复速度',
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`\n✅ Added ${added} missing Cooldown Recovery Speed translations`);

// 排序（优先匹配长的）
const sorted = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
const sortedTranslations = {};
sorted.forEach(([en, cn]) => {
  sortedTranslations[en] = cn;
});

// 保存
fs.writeFileSync(
  path.join(outDir, 'merged-all-translations.json'),
  JSON.stringify(sortedTranslations, null, 2),
  'utf-8'
);

console.log(`✅ Total translations: ${Object.keys(sortedTranslations).length}`);

// 验证
console.log('\n=== Verification ===\n');
Object.entries(missingTranslations).forEach(([en, cn]) => {
  const found = sortedTranslations[en];
  console.log(`${found ? '✅' : '❌'} ${en} → ${found || 'NOT FOUND'}`);
});
