import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(
  __dirname,
  "../src/data/translated-affixes/unique-translations.json",
);
const OUTPUT_DIR = path.join(__dirname, "../src/data/translated-affixes");

interface TranslationEntry {
  en: string;
  cn: string;
}

interface UniqueTranslations {
  [modifierId: string]: TranslationEntry;
}

const CORE_STAT_TRANSLATIONS: Record<string, string> = {
  "max energy shield": "最大护盾",
  "max life": "最大生命",
  "max mana": "最大魔力",
  armor: "护甲",
  evasion: "闪避",
  "critical strike rating": "暴击率",
  "critical strike damage": "暴击伤害",
  "attack speed": "攻击速度",
  "cast speed": "施法速度",
  "movement speed": "移动速度",
  "fire resistance": "火焰抗性",
  "cold resistance": "冰冷抗性",
  "lightning resistance": "闪电抗性",
  "physical damage": "物理伤害",
  "cold damage": "冰冷伤害",
  "fire damage": "火焰伤害",
  "lightning damage": "闪电伤害",
  "elemental damage": "元素伤害",
  "spell damage": "法术伤害",
  "attack damage": "攻击伤害",
  "minion damage": "召唤物伤害",
  "life regeneration": "生命回复",
  "mana regeneration": "魔力回复",
  "energy shield regeneration": "护盾回复",
  "block chance": "格挡几率",
  strength: "力量",
  dexterity: "敏捷",
  intelligence: "智慧",
  "all stats": "全属性",
  "minion attack and cast speed": "召唤物攻击与施法速度",
  "cooldown recovery speed": "冷却回复速度",
  damage: "伤害",
  "projectile speed": "投射物速度",
  "skill cost": "技能消耗",
  "skill area": "技能范围",
  "skill level": "技能等级",
  "skill effect duration": "技能效果持续时间",
  "ailment duration": "异常状态持续时间",
  "curse effect": "诅咒效果",
  "curse duration": "诅咒持续时间",
  health: "生命",
  "life on hit": "击中生命",
  "mana on hit": "击中魔力",
  "energy shield on hit": "击中护盾",
  "movement speed while": "移动速度",
  "attack speed while": "攻击速度",
  "cast speed while": "施法速度",
  "physical skill": "物理技能",
  "spell skill": "法术技能",
  "elemental skill": "元素技能",
  "erosion resistance": "侵蚀抗性",
  "erosion damage": "侵蚀伤害",
  corruption: "腐蚀",
  affliction: "痛苦",
  trauma: "创伤",
  wilt: "凋零",
  ignite: "点燃",
  freeze: "冰冻",
  paralysis: "麻痹",
  blinding: "致盲",
  frail: "脆弱",
  numbed: "迟缓",
  barrier: "屏障",
  tenacity: "坚韧",
  agility: "灵动",
  focus: "贯注",
  demolisher: "破城",
  transcendence: "超凡",
  restoration: "回复",
  beams: "射线",
  projectiles: "投射物",
  "area damage": "范围伤害",
  "additional damage": "额外伤害",
  additional: "额外",
};

function extractPureStatNames(
  translations: UniqueTranslations,
): Map<string, string> {
  const results = new Map<string, string>();

  const statPatterns = [
    { en: /max energy shield/gi, cn: /最大护盾/g },
    { en: /max life/gi, cn: /最大生命/g },
    { en: /max mana/gi, cn: /最大魔力/g },
    { en: /critical strike rating/gi, cn: /暴击值|暴击率/g },
    { en: /critical strike damage/gi, cn: /暴击伤害/g },
    { en: /attack speed/gi, cn: /攻击速度/g },
    { en: /cast speed/gi, cn: /施法速度/g },
    { en: /movement speed/gi, cn: /移动速度/g },
    { en: /fire resistance/gi, cn: /火焰抗性/g },
    { en: /cold resistance/gi, cn: /冰冷抗性/g },
    { en: /lightning resistance/gi, cn: /闪电抗性/g },
    { en: /physical damage/gi, cn: /物理伤害/g },
    { en: /cold damage/gi, cn: /冰冷伤害/g },
    { en: /fire damage/gi, cn: /火焰伤害/g },
    { en: /lightning damage/gi, cn: /闪电伤害/g },
    { en: /elemental damage/gi, cn: /元素伤害/g },
    { en: /spell damage/gi, cn: /法术伤害/g },
    { en: /attack damage/gi, cn: /攻击伤害/g },
    { en: /minion damage/gi, cn: /召唤物伤害/g },
    { en: /armor/gi, cn: /护甲/g },
    { en: /evasion/gi, cn: /闪避/g },
    { en: /life regeneration/gi, cn: /生命回复/g },
    { en: /mana regeneration/gi, cn: /魔力回复/g },
    { en: /energy shield regeneration/gi, cn: /护盾回复/g },
    { en: /block chance/gi, cn: /格挡几率/g },
    { en: /strength/gi, cn: /力量/g },
    { en: /dexterity/gi, cn: /敏捷/g },
    { en: /intelligence/gi, cn: /智慧/g },
    { en: /all stats/gi, cn: /全属性/g },
    { en: /minion attack and cast speed/gi, cn: /召唤物攻击与施法速度/g },
    { en: /cooldown recovery speed/gi, cn: /冷却回复速度/g },
    { en: /projectile speed/gi, cn: /投射物速度/g },
    { en: /skill cost/gi, cn: /技能消耗/g },
    { en: /skill level/gi, cn: /技能等级/g },
    { en: /ailment duration/gi, cn: /异常状态持续时间/g },
    { en: /curse effect/gi, cn: /诅咒效果/g },
    { en: /curse duration/gi, cn: /诅咒持续时间/g },
    { en: /life on hit/gi, cn: /击中生命/g },
    { en: /mana on hit/gi, cn: /击中魔力/g },
    { en: /barrier/gi, cn: /屏障/g },
    { en: /beams/gi, cn: /射线/g },
    { en: /projectiles/gi, cn: /投射物/g },
    { en: /area damage/gi, cn: /范围伤害/g },
    { en: /additional damage/gi, cn: /额外伤害/g },
  ];

  statPatterns.forEach(({ en, cn }) => {
    Object.values(translations).forEach(({ en: enText, cn: cnText }) => {
      if (en.test(enText) && cn.test(cnText)) {
        const enMatch = enText.match(en);
        const cnMatch = cnText.match(cn);
        if (enMatch && cnMatch && !results.has(enMatch[0].toLowerCase())) {
          results.set(enMatch[0].toLowerCase(), cnMatch[0]);
        }
      }
    });
  });

  return results;
}

function generateTypeScriptFile(): void {
  const translations: UniqueTranslations = JSON.parse(
    fs.readFileSync(INPUT_FILE, "utf-8"),
  );

  console.log("Extracting core stat name translations...\n");

  const extractedTranslations = extractPureStatNames(translations);
  console.log(`Found ${extractedTranslations.size} extracted translations`);

  const allTranslations = new Map<string, string>();

  Object.entries(CORE_STAT_TRANSLATIONS).forEach(([en, cn]) => {
    allTranslations.set(en.toLowerCase(), cn);
  });

  extractedTranslations.forEach((cn, en) => {
    if (!allTranslations.has(en.toLowerCase())) {
      allTranslations.set(en.toLowerCase(), cn);
    }
  });

  const sortedEntries = Array.from(allTranslations.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  const tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN translations
// Core stat name translations for display in Chinese

export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
${sortedEntries
  .map(([en, cn]) => {
    const escapedEn = en.replace(/'/g, "\\'");
    const escapedCn = cn.replace(/'/g, "\\'");
    return `  '${escapedEn}': '${escapedCn}',`;
  })
  .join("\n")}
};

export const getAffixNameTranslation = (enName: string): string => {
  const lower = enName.toLowerCase();
  return AFFIX_NAME_TRANSLATIONS[lower] ?? enName;
};

export const COMMON_STAT_NAMES = [
${sortedEntries
  .slice(0, 30)
  .map(([en]) => `  '${en.replace(/'/g, "\\'")}',`)
  .join("\n")}
];
`;

  const outputFile = path.join(OUTPUT_DIR, "core-stat-translations.ts");
  fs.writeFileSync(outputFile, tsContent, "utf-8");
  console.log(`\nGenerated TypeScript file: ${outputFile}`);
  console.log(`Total translations: ${sortedEntries.length}\n`);

  console.log("=== Core Stat Translations ===");
  const keyStats = [
    "max energy shield",
    "max life",
    "max mana",
    "critical strike rating",
    "critical strike damage",
    "attack speed",
    "cast speed",
    "movement speed",
    "fire resistance",
    "cold resistance",
    "lightning resistance",
    "physical damage",
    "cold damage",
    "fire damage",
    "lightning damage",
    "elemental damage",
    "spell damage",
    "attack damage",
    "minion damage",
    "armor",
    "evasion",
    "strength",
    "dexterity",
    "intelligence",
    "all stats",
  ];

  keyStats.forEach((stat) => {
    const translation = allTranslations.get(stat);
    if (translation) {
      console.log(`  ${stat.padEnd(30)} → ${translation}`);
    }
  });

  console.log(
    `\n... and ${sortedEntries.length - keyStats.length} more translations`,
  );
}

generateTypeScriptFile();
