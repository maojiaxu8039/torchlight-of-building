const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "Lucky Critical Strike -45% Critical Strike Rating": "暴击幸运 -45% 暴击值",
  "Adds 66 - 82 Physical Damage to the gear": "为该装备附加 66 - 82 点物理伤害",
  "+56% Gear Physical Damage": "+56% 该装备物理伤害",
  "+14% Elemental and Erosion Resistance Penetration":
    "+14% 元素和腐蚀抗性穿透",
  "Multistrikes deal 30% increasing damage": "多重打击伤害递增 30%",
  "+62% chance to Multistrike": "+62% 多重打击几率",
  "+14% Attack Speed": "+14% 攻击速度",
  "+44% Melee Damage": "+44% 近战伤害",
  "+44% Erosion Damage": "+44% 腐蚀伤害",
  "+44% Elemental Damage": "+44% 元素伤害",
  "+44% Physical Damage": "+44% 物理伤害",
  "Adds 29 - 35 Erosion Damage to Attacks": "为攻击附加 29 - 35 点腐蚀伤害",
  "Adds 2 - 63 Lightning Damage to Attacks": "为攻击附加 2 - 63 点闪电伤害",
  "Adds 27 - 37 Cold Damage to Attacks": "为攻击附加 27 - 37 点冰冷伤害",
  "Adds 27 - 37 Fire Damage to Attacks": "为攻击附加 27 - 37 点火焰伤害",
  "Adds 28 - 36 Physical Damage to Attacks": "为攻击附加 28 - 36 点物理伤害",
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
