import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../src/data/translated-affixes');

const existingCoreData = JSON.parse(
  fs.readFileSync(path.join(outputDir, 'unique-translations.json'), 'utf-8')
);

const craftData = JSON.parse(
  fs.readFileSync(path.join(outputDir, 'craft-unique-affix-translations.json'), 'utf-8')
);

const merged: Record<string, string> = {};

Object.entries(existingCoreData).forEach(([modifierId, translation]) => {
  const t = translation as { en: string; cn: string };
  merged[t.en] = t.cn;
});

Object.entries(craftData).forEach(([en, data]) => {
  const cn = (data as { cn: string }).cn;
  merged[en] = cn;
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

const sortedKeys = Object.keys(merged).sort((a, b) => {
  if (a === b) return 0;
  if (a.includes(b)) return -1;
  if (b.includes(a)) return 1;
  return b.length - a.length;
});

const sortedTranslations: Record<string, string> = {};
sortedKeys.forEach(key => {
  sortedTranslations[key] = merged[key];
});

const lines: string[] = [];
lines.push('// Auto-generated file - Do not edit manually');
lines.push('// Generated from tlidb.com EN/CN translations');
lines.push('// Complete affix translations (Core + Craft)');
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

const outputFile = path.join(outputDir, 'complete-affix-translations.ts');
fs.writeFileSync(outputFile, lines.join('\n'), 'utf-8');

console.log('=== Fixed Complete Translations ===');
console.log(`Total translations: ${Object.keys(sortedTranslations).length}`);
console.log(`Generated: ${outputFile}`);
