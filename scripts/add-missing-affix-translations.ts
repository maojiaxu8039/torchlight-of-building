import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../src/data/translated-affixes');

const missingTranslations: Record<string, string> = {
  'All Resistance': '所有抗性',
  'All Resistances': '所有抗性',
  'All Attributes': '全属性',
  'On Hit': '击中',
  'When Hit': '被击中',
  'On Kill': '击杀时',
  'When Defeated': '击败时',
  'Chance to': '几率',
  'to explode': '爆炸',
  'chance to explode': '几率爆炸',
  'additional': '额外',
  'dealing': '造成',
  'to nearby enemies': '对附近敌人',
  'within a': '范围内',
  'radius': '半径',
  'of their': '的',
  'true damage': '真实伤害',
  'equal to': '等于',
  'physical damage': '物理伤害',
  'elemental damage': '元素伤害',
  'cold damage': '冰冷伤害',
  'fire damage': '火焰伤害',
  'lightning damage': '闪电伤害',
  'when defeated': '击败时',
  'enemies have a': '敌人有',
  'to all allies': '对所有友军',
  'increased by': '增加',
  'per stack': '每层',
  'stacks': '层',
  'on defeat': '击败时',
  'every': '每',
  'nearby': '附近',
  'enemies': '敌人',
  'allies': '友军',
  'allied': '友军',
};

const existingContent = fs.readFileSync(
  path.join(outputDir, 'complete-affix-translations.ts'),
  'utf-8'
);

let existingTranslations: Record<string, string> = {};
const startIndex = existingContent.indexOf('export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {');
const endIndex = existingContent.indexOf('};', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const translationBlock = existingContent.substring(startIndex, endIndex + 2);
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

Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!existingTranslations[en]) {
    existingTranslations[en] = cn;
  }
});

const sortedKeys = Object.keys(existingTranslations).sort((a, b) => {
  if (a === b) return 0;
  if (a.includes(b)) return -1;
  if (b.includes(a)) return 1;
  return b.length - a.length;
});

const sortedTranslations: Record<string, string> = {};
sortedKeys.forEach(key => {
  sortedTranslations[key] = existingTranslations[key];
});

function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}');
}

const lines: string[] = [];
lines.push('// Auto-generated file - Do not edit manually');
lines.push('// Generated from tlidb.com EN/CN translations');
lines.push('// Complete affix translations (Core + Craft + Basic Stats)');
lines.push('');
lines.push('export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {');

Object.entries(sortedTranslations).forEach(([en, cn]) => {
  const escapedEn = escapeString(en);
  const escapedCn = escapeString(cn);
  lines.push(`  '${escapedEn}': '${escapedCn}',`);
});

lines.push('};');
lines.push('');
lines.push('export const getAffixNameTranslation = (enName: string): string => {');
lines.push("  const lower = enName.toLowerCase();");
lines.push('  return AFFIX_NAME_TRANSLATIONS[lower] ?? enName;');
lines.push('};');
lines.push('');
lines.push('export const COMMON_STAT_NAMES = [');

Object.keys(sortedTranslations).slice(0, 30).forEach(en => {
  const escapedEn = escapeString(en);
  lines.push(`  '${escapedEn}',`);
});

lines.push('];');

fs.writeFileSync(
  path.join(outputDir, 'complete-affix-translations.ts'),
  lines.join('\n'),
  'utf-8'
);

console.log('=== Added Missing Translations ===');
console.log(`Missing translations added: ${Object.keys(missingTranslations).length}`);
console.log(`Total translations: ${Object.keys(sortedTranslations).length}`);
console.log('\nNew translations:');
Object.entries(missingTranslations).forEach(([en, cn]) => {
  console.log(`  ${en.padEnd(30)} → ${cn}`);
});
