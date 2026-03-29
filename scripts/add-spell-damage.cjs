const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "Adds 88 - 107 Physical Damage to Spells": "为法术附加 88 - 107 点物理伤害",
  "Adds 88 - 107 Erosion Damage to Spells": "为法术附加 88 - 107 点腐蚀伤害",
  "Adds 10 - 185 Lightning Damage to Spells": "为法术附加 10 - 185 点闪电伤害",
  "Adds 84 - 111 Cold Damage to Spells": "为法术附加 84 - 111 点冰冷伤害",
  "Adds 83 - 110 Fire Damage to Spells": "为法术附加 83 - 110 点火焰伤害",
  "+208 Max Mana": "+208 最大魔力",
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
