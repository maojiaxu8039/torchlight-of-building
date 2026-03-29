const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+254 Max Life": "+254 最大生命",
  "+139 Max Mana": "+139 最大魔力",
  "+403 Max Energy Shield": "+403 最大护盾",
  "+84% damage": "+84% 伤害",
  "+27% chance for Attacks to inflict Taunt on enemies on hit":
    "+27% 攻击击中敌人时施加嘲讽的几率",
  "+80% Minion Damage": "+80% 召唤物伤害",
  "+18% Attack and Spell Block Chance": "+18% 攻击和法术格挡几率",
  "+70 Strength": "+70 力量",
  "+70 Dexterity": "+70 敏捷",
};

Object.entries(newTranslations).forEach((entry) => {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
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

console.log("已添加 " + Object.keys(newTranslations).length + " 个翻译");
