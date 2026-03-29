const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "Adds 12 - 17 Physical Damage to Attacks": "为攻击附加 12 - 17 点物理伤害",
  "Adds 12 - 18 Fire Damage to Attacks": "为攻击附加 12 - 18 点火焰伤害",
  "Adds 12 - 17 Cold Damage to Attacks": "为攻击附加 12 - 17 点冰冷伤害",
  "Adds 2 - 30 Lightning Damage to Attacks": "为攻击附加 2 - 30 点闪电伤害",
  "Adds 12 - 17 Erosion Damage to Attacks": "为攻击附加 12 - 17 点腐蚀伤害",
  "Lucky Critical Strike -65% Critical Strike Rating": "暴击幸运 -65% 暴击值",
  "Adds 33 - 41 Physical Damage to the gear": "为该装备附加 33 - 41 点物理伤害",
  "+28% Gear Physical Damage": "+28% 该装备物理伤害",
  "+7% Elemental and Erosion Resistance Penetration": "+7% 元素和腐蚀抗性穿透",
  "Multistrikes deal 15% increasing damage": "多重打击伤害递增 15%",
  "+31% chance to Multistrike": "+31% 多重打击几率",
  "+7% Attack Speed": "+7% 攻击速度",
  "+22% Melee Damage": "+22% 近战伤害",
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
