const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, 'merged-all-translations.json'), 'utf8')
);

// 添加 Belt 页面的凋零翻译（替换现有的萎陷翻译）
const wiltTranslations = {
  // Belt 页面格式 - 凋零
  'Reaps 0.16 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target': '造成凋零时，收割 0.16 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.12 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target': '造成凋零时，收割 0.12 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.09 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target': '造成凋零时，收割 0.09 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.06 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target': '造成凋零时，收割 0.06 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.04 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target': '造成凋零时，收割 0.04 秒持续伤害，该效果对同一目标有 1 秒回复时间',

  // Ignite - 点燃
  'Reaps 0.16 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target': '造成点燃时，收割 0.16 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.12 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target': '造成点燃时，收割 0.12 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.09 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target': '造成点燃时，收割 0.09 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.06 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target': '造成点燃时，收割 0.06 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.04 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target': '造成点燃时，收割 0.04 秒持续伤害，该效果对同一目标有 1 秒回复时间',

  // Trauma - 创伤
  'Reaps 0.16 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target': '造成创伤时，收割 0.16 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.12 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target': '造成创伤时，收割 0.12 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.09 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target': '造成创伤时，收割 0.09 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.06 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target': '造成创伤时，收割 0.06 秒持续伤害，该效果对同一目标有 1 秒回复时间',
  'Reaps 0.04 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target': '造成创伤时，收割 0.04 秒持续伤害，该效果对同一目标有 1 秒回复时间',
};

// 添加/更新翻译
Object.entries(wiltTranslations).forEach(([en, cn]) => {
  translations[en] = cn;
});

console.log(`✅ Added/updated ${Object.keys(wiltTranslations).length} Belt page translations`);

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
