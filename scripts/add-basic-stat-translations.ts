import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../src/data/translated-affixes');

const basicTranslations: Record<string, string> = {
  'Max Life': '最大生命',
  'Max Mana': '最大魔力',
  'Max Energy Shield': '最大护盾',
  'Energy Shield': '护盾',
  'Life': '生命',
  'Mana': '魔力',
  'Armor': '护甲',
  'Evasion': '闪避',
  'Critical Strike Rating': '暴击率',
  'Critical Strike Damage': '暴击伤害',
  'Attack Speed': '攻击速度',
  'Cast Speed': '施法速度',
  'Movement Speed': '移动速度',
  'Fire Resistance': '火焰抗性',
  'Cold Resistance': '冰冷抗性',
  'Lightning Resistance': '闪电抗性',
  'Physical Damage': '物理伤害',
  'Cold Damage': '冰冷伤害',
  'Fire Damage': '火焰伤害',
  'Lightning Damage': '闪电伤害',
  'Elemental Damage': '元素伤害',
  'Spell Damage': '法术伤害',
  'Attack Damage': '攻击伤害',
  'Minion Damage': '召唤物伤害',
  'Life Regeneration': '生命回复',
  'Mana Regeneration': '魔力回复',
  'Energy Shield Regeneration': '护盾回复',
  'Block Chance': '格挡几率',
  'Strength': '力量',
  'Dexterity': '敏捷',
  'Intelligence': '智慧',
  'All Stats': '全属性',
  'Damage': '伤害',
  'Erosion Damage': '侵蚀伤害',
  'Erosion Resistance': '侵蚀抗性',
  'True Damage': '真实伤害',
  'Damage Over Time': '持续伤害',
  'Damage Penetration': '伤害穿透',
  'Resistance Penetration': '抗性穿透',
  'Cooldown Recovery Speed': '冷却回复速度',
  'Skill Level': '技能等级',
  'Skill Area': '技能范围',
  'Skill Cost': '技能消耗',
  'Skill Effect Duration': '技能效果持续时间',
  'Ailment Duration': '异常状态持续时间',
  'Projectile Speed': '投射物速度',
  'Minion Attack and Cast Speed': '召唤物攻击与施法速度',
  'additional Attack Damage': '额外攻击伤害',
  'additional Spell Damage': '额外法术伤害',
  'additional damage': '额外伤害',
  'Melee Damage': '近战伤害',
  'Gear Damage': '装备伤害',
  'Gear Physical Damage': '装备物理伤害',
  'Gear Attack Speed': '装备攻击速度',
  'Gear Critical Strike Rating': '装备暴击率',
  'Gear Elemental Damage': '装备元素伤害',
};

const existingData = JSON.parse(
  fs.readFileSync(path.join(outputDir, 'unique-translations.json'), 'utf-8')
);

const merged: Record<string, string> = {};

Object.entries(existingData).forEach(([modifierId, translation]) => {
  const t = translation as { en: string; cn: string };
  if (!merged[t.en]) {
    merged[t.en] = t.cn;
  }
});

Object.entries(basicTranslations).forEach(([en, cn]) => {
  if (!merged[en]) {
    merged[en] = cn;
  }
});

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

const outputFile = path.join(outputDir, 'complete-affix-translations.ts');
fs.writeFileSync(outputFile, lines.join('\n'), 'utf-8');

console.log('=== Updated Complete Translations ===');
console.log(`Basic stat translations added: ${Object.keys(basicTranslations).length}`);
console.log(`Total translations: ${Object.keys(sortedTranslations).length}`);
console.log(`\nGenerated: ${outputFile}`);

console.log('\n=== Testing Basic Stats ===');
Object.entries(basicTranslations).forEach(([en, cn]) => {
  console.log(`  ${en.padEnd(30)} → ${cn}`);
});
