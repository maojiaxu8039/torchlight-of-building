const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加缺失的翻译
const missingTranslations = {
  // % Damage variations
  "% Damage": "% 伤害",
  "+(%) Damage": "+(%) 伤害",
  "additional damage": "额外伤害",
  "Spell Damage": "法术伤害",
  "Attack Damage": "攻击伤害",
  "Skill Damage": "技能伤害",
  "Minion Damage": "召唤物伤害",
  "Projectile Damage": "投射物伤害",
  "Area Damage": "范围伤害",
  "Physical Damage": "物理伤害",
  "Fire Damage": "火焰伤害",
  "Cold Damage": "冰冷伤害",
  "Lightning Damage": "闪电伤害",
  "Erosion Damage": "腐蚀伤害",
  "True Damage": "真实伤害",
  "Elemental Damage": "元素伤害",

  // % Chance for Attacks to inflict Taunt
  "Taunt on enemies on hit": "嘲讽",
  "% Chance for Attacks to inflict Taunt on enemies on hit":
    "% 攻击对敌人造成嘲讽的几率",
  "+% Chance for Attacks to inflict Taunt on enemies on hit":
    "+% 攻击对敌人造成嘲讽的几率",
  "Attacks to inflict": "攻击造成",
  "on enemies on hit": "击中敌人时",
  "inflict Taunt": "造成嘲讽",
  "enemies on hit": "击中状态下的敌人时",
  additional: "附加",
  Taunt: "嘲讽",

  // % Minion Damage
  "% Minion Damage": "% 召唤物伤害",
  "+(%) Minion Damage": "+(%) 召唤物伤害",
  "+% Minion Damage": "+% 召唤物伤害",

  // Advanced
  Advanced: "进阶",
  advanced: "进阶",

  // % Attack and Spell Block Chance
  "% Attack and Spell Block Chance": "% 攻击和法术格挡率",
  "+(%) Attack and Spell Block Chance": "+(%) 攻击和法术格挡率",
  "+% Attack and Spell Block Chance": "+% 攻击和法术格挡率",
  "Attack and Spell Block Chance": "攻击和法术格挡率",
  "Spell Block Chance": "法术格挡率",
  "Attack Block Chance": "攻击格挡率",
  "Block Chance": "格挡率",

  // Strength variations
  "+1 Strength": "+1 力量",
  "+5 Strength": "+5 力量",
  "+10 Strength": "+10 力量",
  "+15 Strength": "+15 力量",
  "+20 Strength": "+20 力量",
  "+25 Strength": "+25 力量",
  "+30 Strength": "+30 力量",
  "+35 Strength": "+35 力量",
  "+40 Strength": "+40 力量",
  "+45 Strength": "+45 力量",
  "+50 Strength": "+50 力量",
  "+(%) Strength": "+(%) 力量",
  Strength: "力量",

  // Dexterity variations
  "+1 Dexterity": "+1 敏捷",
  "+5 Dexterity": "+5 敏捷",
  "+10 Dexterity": "+10 敏捷",
  "+15 Dexterity": "+15 敏捷",
  "+20 Dexterity": "+20 敏捷",
  "+25 Dexterity": "+25 敏捷",
  "+30 Dexterity": "+30 敏捷",
  "+35 Dexterity": "+35 敏捷",
  "+40 Dexterity": "+40 敏捷",
  "+45 Dexterity": "+45 敏捷",
  "+50 Dexterity": "+50 敏捷",
  "+(%) Dexterity": "+(%) 敏捷",
  Dexterity: "敏捷",

  // Intelligence variations
  "+1 Intelligence": "+1 智慧",
  "+5 Intelligence": "+5 智慧",
  "+10 Intelligence": "+10 智慧",
  "+15 Intelligence": "+15 智慧",
  "+20 Intelligence": "+20 智慧",
  "+25 Intelligence": "+25 智慧",
  "+30 Intelligence": "+30 智慧",
  "+35 Intelligence": "+35 智慧",
  "+40 Intelligence": "+40 智慧",
  "+45 Intelligence": "+45 智慧",
  "+50 Intelligence": "+50 智慧",
  "+(%) Intelligence": "+(%) 智慧",
  Intelligence: "智慧",

  // % Chance
  "% Chance": "% 几率",
  "+% Chance": "+% 几率",
  "+(%) Chance": "+(%) 几率",
  Chance: "几率",
  chance: "几率",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} missing common affix translations`);

// 排序（优先匹配长的）
const sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
const sortedTranslations = {};
sorted.forEach(([en, cn]) => {
  sortedTranslations[en] = cn;
});

// 保存
fs.writeFileSync(
  path.join(outDir, "merged-all-translations.json"),
  JSON.stringify(sortedTranslations, null, 2),
  "utf-8",
);

console.log(`✅ Total translations: ${Object.keys(sortedTranslations).length}`);

// 验证
console.log("\n=== Verification ===\n");
Object.entries(missingTranslations)
  .slice(0, 20)
  .forEach(([en, cn]) => {
    const found = sortedTranslations[en];
    console.log(`${found ? "✅" : "❌"} ${en.substring(0, 50)} → ${cn}`);
  });
