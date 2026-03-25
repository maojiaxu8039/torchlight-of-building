const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, 'merged-all-translations.json'), 'utf8')
);

// 检查现有的 Defense 翻译
console.log('=== Existing Defense translations ===\n');
Object.entries(translations)
  .filter(([en]) => en.includes('Defense') || en.includes('defense') || en.includes('Chest Armor'))
  .slice(0, 10)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 60).padEnd(60)} → ${cn}`);
  });

// 添加缺失的翻译
const missingTranslations = {
  // Defense gained from Chest Armor
  '+40% Defense gained from Chest Armor': '+40% 从胸甲获得的防御值',
  '+35% Defense gained from Chest Armor': '+35% 从胸甲获得的防御值',
  '+30% Defense gained from Chest Armor': '+30% 从胸甲获得的防御值',
  '+25% Defense gained from Chest Armor': '+25% 从胸甲获得的防御值',
  '+20% Defense gained from Chest Armor': '+20% 从胸甲获得的防御值',
  '+15% Defense gained from Chest Armor': '+15% 从胸甲获得的防御值',
  '+50% Defense gained from Chest Armor': '+50% 从胸甲获得的防御值',
  '+45% Defense gained from Chest Armor': '+45% 从胸甲获得的防御值',

  // generic
  'Defense gained from Chest Armor': '从胸甲获得的防御值',
  'Defense gained from': '从获得的防御值',
  'Defense gained': '防御值获得',
  'gained from Chest Armor': '从胸甲获得',
  'Chest Armor': '胸甲',

  // Defense variations
  'Defense': '防御值',
  '% Defense': '% 防御值',
  'defense': '防御值',
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`\n✅ Added ${added} missing Defense translations`);

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
  console.log(`${found ? '✅' : '❌'} ${en.substring(0, 50)}`);
  console.log(`   → ${found || 'NOT FOUND'}`);
});
