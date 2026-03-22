import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, '../src/data/translated-affixes/core-stat-translations.ts');

const extraTranslations: Record<string, string> = {
  'of': '的',
  'the effect has a': '该效果有',
  'the effect has an': '该效果有',
  'effect has a': '效果有',
  'effect has an': '效果有',
  'that have': '拥有',
  'that has': '拥有',
  'have': '拥有',
  'has': '拥有',
  'm': '米',
  's of': '秒的',
  's recovery time': '秒回复时间',
  'after consuming max': '消耗最大',
  'terra charges': '大地充能',
  '1 s after consuming': '1秒后消耗',
  'cooldown:': '冷却时间:',
  'cooldown': '冷却时间',
  'm that': '米拥有',
  'm that have': '米拥有',
  'enemies within': '敌人在范围内',
  'enemies': '敌人',
  'full': '满层',
  'affliction': '痛苦',
  'after': '之后',
  'within': '范围内',
  'when': '当',
  'while': '当',
  'when': '当',
};

const content = fs.readFileSync(inputFile, 'utf-8');

let existingTranslations: Record<string, string> = {};
const startIndex = content.indexOf('export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {');
const endIndex = content.indexOf('};', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const translationBlock = content.substring(startIndex, endIndex + 2);
  const keyValuePairs = translationBlock.match(/'([^']+)':\s*'([^']+)'/g);

  if (keyValuePairs) {
    keyValuePairs.forEach(pair => {
      const match = pair.match(/'([^']+)':\s*'([^']+)'/);
      if (match) {
        existingTranslations[match[1]] = match[2];
      }
    });
  }
}

const mergedTranslations = { ...existingTranslations, ...extraTranslations };

const sortedKeys = Object.keys(mergedTranslations).sort((a, b) => {
  return b.length - a.length;
});

const sortedTranslations: Record<string, string> = {};
sortedKeys.forEach(key => {
  sortedTranslations[key] = mergedTranslations[key];
});

const newTsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN translations
// Core stat name translations for display in Chinese
// Extended with additional translations for complex affix text

export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
${Object.entries(sortedTranslations).map(([en, cn]) => `  '${en.replace(/'/g, "\\'")}': '${cn.replace(/'/g, "\\'")}',`).join('\n')}
};

export const getAffixNameTranslation = (enName: string): string => {
  const lower = enName.toLowerCase();
  return AFFIX_NAME_TRANSLATIONS[lower] ?? enName;
};

export const COMMON_STAT_NAMES = [
${Object.keys(sortedTranslations).slice(0, 30).map(en => `  '${en.replace(/'/g, "\\'")}',`).join('\n')}
];
`;

fs.writeFileSync(inputFile, newTsContent, 'utf-8');

console.log('=== Updated with More Translations ===');
console.log(`Total translations: ${Object.keys(sortedTranslations).length}`);
console.log(`\nGenerated: ${inputFile}`);

console.log('\n=== New Translations Added ===');
Object.entries(extraTranslations).forEach(([en, cn]) => {
  console.log(`  ${en.padEnd(30)} → ${cn}`);
});
