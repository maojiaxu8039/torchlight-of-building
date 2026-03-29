const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+208 Intelligence": "+208 智慧",
  "+208 Dexterity": "+208 敏捷",
  "+208 Strength": "+208 力量",
  "+93% Gear Physical Damage": "+93% 该装备物理伤害",
  "+53% Attack and Spell Block Chance": "+53% 攻击和法术格挡几率",
  "Reaps 0.42 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.42 秒点燃伤害，该效果对同一目标有 1 秒回复时间",
  "+249% Melee Damage": "+249% 近战伤害",
  "Adds 215 - 253 Erosion Damage to the gear":
    "为该装备附加 215 - 253 点腐蚀伤害",
  "Adds 23 - 445 Lightning Damage to the gear":
    "为该装备附加 23 - 445 点闪电伤害",
  "Adds 201 - 267 Cold Damage to the gear": "为该装备附加 201 - 267 点冰冷伤害",
  "Adds 199 - 263 Fire Damage to the gear": "为该装备附加 199 - 263 点火焰伤害",
  "Adds 94 - 114 Physical Damage to the gear":
    "为该装备附加 94 - 114 点物理伤害",
};

let added = 0;
Object.entries(newTranslations).forEach((entry) => {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
    added++;
  }
});

const sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
const result = {};
sorted.forEach((e) => {
  result[e[0]] = e[1];
});
fs.writeFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  JSON.stringify(result, null, 2),
);

console.log("已添加 " + added + " 个翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
