import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TranslationEntry {
  en: string;
  cn: string;
}

interface UniqueTranslations {
  [modifierId: string]: TranslationEntry;
}

const INPUT_FILE = path.join(__dirname, '../src/data/translated-affixes/unique-translations.json');
const OUTPUT_DIR = path.join(__dirname, '../src/data/translated-affixes');

function extractStatNames(enText: string, cnText: string): Array<{ en: string; cn: string }> {
  const results: Array<{ en: string; cn: string }> = [];

  const enClean = enText.replace(/[+-]?\d+(\.\d+)?/g, '#').replace(/\s+/g, ' ').trim();
  const cnClean = cnText.replace(/[+-]?\d+(\.\d+)?/g, '#').replace(/\s+/g, ' ').trim();

  const enParts = enClean.split('#').filter(p => p.trim().length > 0);
  const cnParts = cnClean.split('#').filter(p => p.trim().length > 0);

  if (enParts.length === 0 || cnParts.length === 0) {
    return results;
  }

  if (enParts.length === cnParts.length) {
    for (let i = 0; i < enParts.length; i++) {
      const enName = enParts[i].trim();
      const cnName = cnParts[i].trim();
      if (enName !== cnName && enName.length > 1 && cnName.length > 1) {
        results.push({ en: enName, cn: cnName });
      }
    }
  } else {
    const enName = enClean.trim();
    const cnName = cnClean.trim();
    if (enName !== cnName && enName.length > 1 && cnName.length > 1) {
      results.push({ en: enName, cn: cnName });
    }
  }

  return results;
}

function extractCommonAffixNames(translations: UniqueTranslations): Map<string, string> {
  const affixNameTranslations = new Map<string, string>();

  Object.values(translations).forEach(({ en, cn }) => {
    const results = extractStatNames(en, cn);
    results.forEach(({ en: enName, cn: cnName }) => {
      const key = enName.toLowerCase();
      if (!affixNameTranslations.has(key)) {
        affixNameTranslations.set(key, cnName);
      }
    });
  });

  return affixNameTranslations;
}

const COMMON_STAT_NAMES = [
  'Max Energy Shield',
  'Max Life',
  'Max Mana',
  'Armor',
  'Evasion',
  'Critical Strike Rating',
  'Critical Strike Damage',
  'Attack Speed',
  'Cast Speed',
  'Movement Speed',
  'Fire Resistance',
  'Cold Resistance',
  'Lightning Resistance',
  'Physical Damage',
  'Cold Damage',
  'Fire Damage',
  'Lightning Damage',
  'Elemental Damage',
  'Spell Damage',
  'Attack Damage',
  'Minion Damage',
  'Health Regeneration',
  'Mana Regeneration',
  'Energy Shield Regeneration',
  'Block Chance',
  'Dodge',
  'Life',
  'Mana',
  'Energy Shield',
  'Strength',
  'Dexterity',
  'Intelligence',
  'All Stats',
];

function extractSpecificStatNames(translations: UniqueTranslations): Map<string, string> {
  const results = new Map<string, string>();

  const commonPatterns: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
    [/max energy shield/i, () => '最大护盾'],
    [/max life/i, () => '最大生命'],
    [/max mana/i, () => '最大魔力'],
    [/critical strike rating/i, () => '暴击率'],
    [/critical strike damage/i, () => '暴击伤害'],
    [/attack speed/i, () => '攻击速度'],
    [/cast speed/i, () => '施法速度'],
    [/movement speed/i, () => '移动速度'],
    [/fire resistance/i, () => '火焰抗性'],
    [/cold resistance/i, () => '冰冷抗性'],
    [/lightning resistance/i, () => '闪电抗性'],
    [/physical damage/i, () => '物理伤害'],
    [/cold damage/i, () => '冰冷伤害'],
    [/fire damage/i, () => '火焰伤害'],
    [/lightning damage/i, () => '闪电伤害'],
    [/elemental damage/i, () => '元素伤害'],
    [/spell damage/i, () => '法术伤害'],
    [/attack damage/i, () => '攻击伤害'],
    [/minion damage/i, () => '召唤物伤害'],
    [/armor/i, () => '护甲'],
    [/evasion/i, () => '闪避'],
  ];

  COMMON_STAT_NAMES.forEach(statName => {
    const pattern = new RegExp(statName, 'i');
    Object.values(translations).forEach(({ en, cn }) => {
      if (pattern.test(en)) {
        const match = en.match(pattern);
        if (match && !results.has(statName.toLowerCase())) {
          const cnPattern = new RegExp(cn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          const cnMatch = cn.match(cnPattern);
          if (cnMatch) {
            results.set(statName.toLowerCase(), cnMatch[0]);
          }
        }
      }
    });
  });

  return results;
}

function generateManualTranslations(): void {
  const translations: UniqueTranslations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

  console.log('Generating manual translations based on common patterns...\n');

  const manualTranslations: Record<string, string> = {
    'max energy shield': '最大护盾',
    'max life': '最大生命',
    'max mana': '最大魔力',
    'armor': '护甲',
    'evasion': '闪避',
    'critical strike rating': '暴击率',
    'critical strike damage': '暴击伤害',
    'attack speed': '攻击速度',
    'cast speed': '施法速度',
    'movement speed': '移动速度',
    'fire resistance': '火焰抗性',
    'cold resistance': '冰冷抗性',
    'lightning resistance': '闪电抗性',
    'physical damage': '物理伤害',
    'cold damage': '冰冷伤害',
    'fire damage': '火焰伤害',
    'lightning damage': '闪电伤害',
    'elemental damage': '元素伤害',
    'spell damage': '法术伤害',
    'attack damage': '攻击伤害',
    'minion damage': '召唤物伤害',
    'life regeneration': '生命回复',
    'mana regeneration': '魔力回复',
    'energy shield regeneration': '护盾回复',
    'block chance': '格挡几率',
    'strength': '力量',
    'dexterity': '敏捷',
    'intelligence': '智慧',
    'all stats': '全属性',
    'minion attack and cast speed': '召唤物攻击与施法速度',
    'cooldown recovery speed': '冷却回复速度',
    'damage': '伤害',
    'additional damage': '额外伤害',
    'additional': '额外',
    'skill cost': '技能消耗',
    'skill area': '技能范围',
    'skill level': '技能等级',
    'skill effect duration': '技能效果持续时间',
    'ailment duration': '异常状态持续时间',
    'curse effect': '诅咒效果',
    'curse duration': '诅咒持续时间',
    'projectile speed': '投射物速度',
    'projectile quantity': '投射物数量',
    'cast speed when': '施法速度当',
    'attack speed when': '攻击速度当',
    'movement speed when': '移动速度当',
    'while': '当',
    'when': '当',
    'energy shield charge speed': '护盾充能速度',
    'life per second': '生命每秒',
    'mana per second': '魔力每秒',
    'energy shield per second': '护盾每秒',
    'health': '生命',
    'physical skill': '物理技能',
    'spell skill': '法术技能',
    'erosion resistance': '侵蚀抗性',
    'erosion damage': '侵蚀伤害',
    'affliction': '痛苦',
    'trauma': '创伤',
    'wilt': '枯萎',
    'ignite': '点燃',
    'freeze': '冰冻',
    'paralysis': '麻痹',
    'blinding': '致盲',
    'frail': '脆弱',
    'numbed': '迟缓',
  };

  const affixNames = extractCommonAffixNames(translations);
  console.log(`Found ${affixNames.size} common affix names from data\n`);

  const allTranslations = new Map<string, string>();

  Object.entries(manualTranslations).forEach(([en, cn]) => {
    allTranslations.set(en.toLowerCase(), cn);
  });

  affixNames.forEach((cn, en) => {
    if (!allTranslations.has(en.toLowerCase())) {
      allTranslations.set(en.toLowerCase(), cn);
    }
  });

  const sortedEntries = Array.from(allTranslations.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  const tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN translations

export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
${sortedEntries.map(([en, cn]) => `  '${en.replace(/'/g, "\\'")}': '${cn.replace(/'/g, "\\'")}',`).join('\n')}
};

export const getAffixNameTranslation = (enName: string): string => {
  const lower = enName.toLowerCase();
  return AFFIX_NAME_TRANSLATIONS[lower] ?? enName;
};
`;

  const outputFile = path.join(OUTPUT_DIR, 'affix-name-translations.ts');
  fs.writeFileSync(outputFile, tsContent, 'utf-8');
  console.log(`Generated TypeScript file: ${outputFile}`);
  console.log(`Total translations: ${sortedEntries.length}\n`);

  console.log('=== Sample Key Translations ===');
  const keyTranslations = [
    'max energy shield',
    'max life',
    'max mana',
    'critical strike rating',
    'critical strike damage',
    'attack speed',
    'cast speed',
    'movement speed',
  ];
  keyTranslations.forEach(key => {
    const translation = allTranslations.get(key);
    if (translation) {
      console.log(`  ${key} → ${translation}`);
    }
  });
}

generateManualTranslations();
