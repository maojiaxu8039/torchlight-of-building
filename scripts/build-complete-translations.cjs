const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../src/data/translated-affixes');
const mergedFile = path.join(outDir, 'merged-all-translations.json');
const tsFile = path.join(outDir, 'complete-affix-translations.ts');

// 加载合并的翻译
const translations = JSON.parse(fs.readFileSync(mergedFile, 'utf8'));

console.log(`✅ Loaded ${Object.keys(translations).length} translations`);

// 生成 TS 文件
let tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN translations
// Complete affix translations (merged from all sources)

export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
`;

Object.entries(translations).forEach(([en, cn]) => {
  const escapedEn = en.replace(/'/g, "\\'");
  const escapedCn = cn.replace(/'/g, "\\'");
  tsContent += `  '${escapedEn}': '${escapedCn}',\n`;
});

tsContent += `};

export const getAffixNameTranslation = (enName: string): string => {
  const lower = enName.toLowerCase();
  return AFFIX_NAME_TRANSLATIONS[lower] ?? enName;
};

export const COMMON_STAT_NAMES = [
${Object.keys(translations).slice(0, 30).map(en => `  '${en.replace(/'/g, "\\'")}',`).join('\n')}
];
`;

// 写入文件
fs.writeFileSync(tsFile, tsContent, 'utf-8');

console.log(`✅ Updated complete-affix-translations.ts`);
