const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, 'merged-all-translations.json'), 'utf8')
);

// 检查现有的 Skill Effect Duration 翻译
console.log('=== Existing Skill Effect Duration translations ===\n');
Object.entries(translations)
  .filter(([en]) => en.includes('Skill Effect Duration'))
  .slice(0, 10)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 60).padEnd(60)} → ${cn}`);
  });

// 添加缺失的翻译
const missingTranslations = {
  // Skill Effect Duration variants
  '+23% Skill Effect Duration': '+23% 技能效果持续时间',
  '+20% Skill Effect Duration': '+20% 技能效果持续时间',
  '+25% Skill Effect Duration': '+25% 技能效果持续时间',
  '+30% Skill Effect Duration': '+30% 技能效果持续时间',
  '+35% Skill Effect Duration': '+35% 技能效果持续时间',
  '+40% Skill Effect Duration': '+40% 技能效果持续时间',
  '+45% Skill Effect Duration': '+45% 技能效果持续时间',
  '+50% Skill Effect Duration': '+50% 技能效果持续时间',

  // Generic
  '% Skill Effect Duration': '% 技能效果持续时间',
  'Skill Effect Duration': '技能效果持续时间',
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`\n✅ Added ${added} missing Skill Effect Duration translations`);

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
