const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加缺失的翻译
const missingTranslations = {
  // Ultimate
  Ultimate: "终极",
  ultimate: "终极",

  // Damage taken
  "% additional damage taken": "% 额外受到的伤害",
  "+% additional damage taken": "+% 额外受到的伤害",
  "additional damage taken": "额外受到的伤害",
  "damage taken": "受到的伤害",

  // Channeled Stacks
  "+1 To Max Channeled Stacks": "+1 引导蓄能点数上限",
  "+2 To Max Channeled Stacks": "+2 引导蓄能点数上限",
  "+3 To Max Channeled Stacks": "+3 引导蓄能点数上限",
  "+4 To Max Channeled Stacks": "+4 引导蓄能点数上限",
  "+5 To Max Channeled Stacks": "+5 引导蓄能点数上限",
  "To Max Channeled Stacks": "引导蓄能点数上限",
  "Max Channeled Stacks": "引导蓄能点数上限",

  "+1 Min Channeled Stacks": "+1 引导蓄能点数下限",
  "+2 Min Channeled Stacks": "+2 引导蓄能点数下限",
  "+3 Min Channeled Stacks": "+3 引导蓄能点数下限",
  "Min Channeled Stacks": "引导蓄能点数下限",
  "Channeled Stacks": "引导蓄能点数",

  // Critical Strike Rating
  "% Critical Strike Rating": "% 暴击值",
  "+% Critical Strike Rating": "+% 暴击值",
  "Critical Strike Rating": "暴击值",

  // Hit Damage
  "% Hit Damage": "% 击中伤害",
  "+% Hit Damage": "+% 击中伤害",
  "Hit Damage": "击中伤害",
  "additional Hit Damage": "额外击中伤害",

  // Ignite Limit
  "% Ignite Limit": "% 点燃上限",
  "+% Ignite Limit": "+% 点燃上限",
  "+1 Ignite Limit": "+1 点燃上限",
  "+2 Ignite Limit": "+2 点燃上限",
  "+3 Ignite Limit": "+3 点燃上限",
  "Ignite Limit": "点燃上限",

  // Ignite Damage
  "% Ignite Damage": "% 点燃伤害",
  "+% Ignite Damage": "+% 点燃伤害",
  "additional Ignite Damage": "额外点燃伤害",
  "Ignite Damage": "点燃伤害",

  // Affliction Damage (恶化)
  "% Affliction Damage": "% 加剧伤害",
  "+% Affliction Damage": "+% 加剧伤害",
  "additional Affliction Damage": "额外加剧伤害",
  "Affliction Damage": "加剧伤害",

  // Affliction Limit
  "% Affliction Limit": "% 加剧上限",
  "+% Affliction Limit": "+% 加剧上限",
  "+1 Affliction Limit": "+1 加剧上限",
  "Affliction Limit": "加剧上限",

  // Against enemies
  "against enemies": "对敌人",
  against: "对",
  enemies: "敌人",

  // generic
  "%": "%",
  Max: "上限",
  Min: "下限",
  Limit: "上限",
  additional: "额外",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} missing game terms translations`);

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
