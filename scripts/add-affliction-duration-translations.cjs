const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, 'merged-all-translations.json'), 'utf8')
);

// 添加缺失的 Affliction Duration 翻译
const missingTranslations = {
  // Affliction Duration
  '% additional Affliction Duration': '% 额外 加剧 持续时间',
  '+(%) additional Affliction Duration': '+() 额外 加剧 持续时间',
  '+% additional Affliction Duration': '+% 额外 加剧 持续时间',
  'additional Affliction Duration': '额外 加剧 持续时间',
  '% Affliction Duration': '% 加剧 持续时间',
  '+(%) Affliction Duration': '+() 加剧 持续时间',
  '+% Affliction Duration': '+% 加剧 持续时间',
  'Affliction Duration': '加剧 持续时间',

  // 数值变体
  '+38% additional Affliction Duration': '+38% 额外 加剧 持续时间',
  '+30% additional Affliction Duration': '+30% 额外 加剧 持续时间',
  '+35% additional Affliction Duration': '+35% 额外 加剧 持续时间',
  '+40% additional Affliction Duration': '+40% 额外 加剧 持续时间',
  '+25% additional Affliction Duration': '+25% 额外 加剧 持续时间',
  '+20% additional Affliction Duration': '+20% 额外 加剧 持续时间',
  '+15% additional Affliction Duration': '+15% 额外 加剧 持续时间',
  '+10% additional Affliction Duration': '+10% 额外 加剧 持续时间',

  // generic terms
  'Affliction': '加剧',
  'additional': '额外',
  'Duration': '持续时间',
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} missing Affliction Duration translations`);

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
console.log('✅ +38% additional Affliction Duration');
console.log(`   → ${sortedTranslations['+38% additional Affliction Duration'] || 'NOT FOUND'}`);
