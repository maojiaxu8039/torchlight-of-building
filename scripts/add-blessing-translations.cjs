const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, 'merged-all-translations.json'), 'utf8')
);

// 检查现有的 Blessings 翻译
console.log('=== Existing Blessings translations ===\n');
Object.entries(translations)
  .filter(([en]) => en.includes('Blessing') || en.includes('blessing'))
  .slice(0, 10)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 60).padEnd(60)} → ${cn}`);
  });

// 添加缺失的翻译
const missingTranslations = {
  // Gains stack(s) of all Blessings when casting a Restoration Skill
  'Gains 1 stack(s) of all Blessings when casting a Restoration Skill': '施放回复技能时，获得 1 层所有祝福',
  'Gains 2 stack(s) of all Blessings when casting a Restoration Skill': '施放回复技能时，获得 2 层所有祝福',
  'Gains 3 stack(s) of all Blessings when casting a Restoration Skill': '施放回复技能时，获得 3 层所有祝福',
  'Gains 4 stack(s) of all Blessings when casting a Restoration Skill': '施放回复技能时，获得 4 层所有祝福',
  'Gains 5 stack(s) of all Blessings when casting a Restoration Skill': '施放回复技能时，获得 5 层所有祝福',
  'Gains stack(s) of all Blessings when casting a Restoration Skill': '施放回复技能时，获得所有祝福层数',
  'Gains stack(s) of all Blessings when casting a Restoration Skill.': '施放回复技能时，获得所有祝福层数',

  // other Blessing variations
  'Gains 1 stack(s) of Tenacity Blessing when casting a Restoration Skill': '施放回复技能时，获得 1 层坚韧祝福',
  'Gains 2 stack(s) of Tenacity Blessing when casting a Restoration Skill': '施放回复技能时，获得 2 层坚韧祝福',
  'Gains 1 stack(s) of Agility Blessing when casting a Restoration Skill': '施放回复技能时，获得 1 层灵动祝福',
  'Gains 2 stack(s) of Agility Blessing when casting a Restoration Skill': '施放回复技能时，获得 2 层灵动祝福',
  'Gains 1 stack(s) of Focus Blessing when casting a Restoration Skill': '施放回复技能时，获得 1 层聚能祝福',
  'Gains 2 stack(s) of Focus Blessing when casting a Restoration Skill': '施放回复技能时，获得 2 层聚能祝福',

  // other patterns
  'all Blessings': '所有祝福',
  'stack(s) of all Blessings': '所有祝福层数',
  'Tenacity Blessing': '坚韧祝福',
  'Agility Blessing': '灵动祝福',
  'Focus Blessing': '聚能祝福',
  'stack(s)': '层',
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`\n✅ Added ${added} missing Blessings translations`);

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
  console.log(`${found ? '✅' : '❌'} ${en.substring(0, 60)}`);
  console.log(`   → ${found || 'NOT FOUND'}`);
});
