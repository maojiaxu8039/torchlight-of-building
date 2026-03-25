const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, 'merged-all-translations.json'), 'utf8')
);

// 添加缺失的翻译
const missingTranslations = {
  // Barrage Skills
  '% Barrage Skills': '% 轰炸技能',
  '+% Barrage Skills': '+% 轰炸技能',
  'Barrage Skills': '轰炸技能',
  'damage increase per wave': '每波次伤害增加',
  '% damage increase per wave': '% 每波次伤害增加',

  // Melee Skill
  '% Gains a stack of': '% 获得一层',
  'Gains a stack of': '获得一层',
  'when using a Melee Skill': '使用近战技能时',
  'using a Melee Skill': '使用近战技能',
  'Melee Skill': '近战技能',

  // Profane (邪祟)
  '% Profane': '% 邪祟',
  '+% Profane': '+% 邪祟',
  'Profane': '邪祟',
  'has Profane': '拥有邪祟',
  'Minions have Profane': '召唤物拥有邪祟',
  'has Profane;': '拥有邪祟；',
  'Minions have Profane;': '召唤物拥有邪祟；',

  // Erosion Damage
  '% Erosion Damage': '% 腐蚀伤害',
  '+% Erosion Damage': '+% 腐蚀伤害',
  'Erosion Damage': '腐蚀伤害',
  'Minion Erosion Damage': '召唤物腐蚀伤害',

  // Affliction Chance
  '% Affliction Chance': '% 加剧几率',
  '+% Affliction Chance': '+% 加剧几率',
  'Affliction Chance': '加剧几率',

  // Rigidity (强硬)
  '% Rigidity': '% 强硬',
  '+% Rigidity': '+% 强硬',
  'Rigidity': '强硬',
  'stack of Rigidity': '层强硬',

  // generic
  'stack of': '层',
  'per wave': '每波次',
  'damage increase': '伤害增加',
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} missing translations`);

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
