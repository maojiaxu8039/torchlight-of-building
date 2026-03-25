const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, 'merged-all-translations.json'), 'utf8')
);

// 添加缺失的翻译
const missingTranslations = {
  // 完整的强硬/近战词条
  '% Gains a stack of Rigidity when using a Melee Skill (-)% additional damage taken': '% 使用近战技能时获得一层强硬 (-)% 额外受到的伤害',
  '+% Gains a stack of Rigidity when using a Melee Skill (-)% additional damage taken': '+% 使用近战技能时获得一层强硬 (-)% 额外受到的伤害',
  '% Gains a stack of Rigidity when using a Melee Skill. (-)% additional damage taken': '% 使用近战技能时获得一层强硬。 (-)% 额外受到的伤害',
  '+% Gains a stack of Rigidity when using a Melee Skill. (-)% additional damage taken': '+% 使用近战技能时获得一层强硬。 (-)% 额外受到的伤害',

  // Rigidity variations
  'Gains a stack of Rigidity when using a Melee Skill': '使用近战技能时获得一层强硬',
  'Gains a stack of Rigidity': '获得一层强硬',

  // Rigidity
  'Rigidity when using a Melee Skill': '使用近战技能时强硬',
  'when using a Melee Skill (-)%': '使用近战技能时 (-)%',

  // simpler versions
  'Rigidity when using a Melee Skill': '使用近战技能时强硬',
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} Rigidity/Melee translations`);

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
