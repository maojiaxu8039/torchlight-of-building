const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+7% Cast Speed": "+7% 施法速度",
  "+22% Spell Damage": "+22% 法术伤害",
  "+22% Erosion Damage": "+22% 腐蚀伤害",
  "+22% Elemental Damage": "+22% 元素伤害",
  "+22% Physical Damage": "+22% 物理伤害",
  "Adds 12 - 17 Erosion Damage to Spells": "为法术附加 12 - 17 点腐蚀伤害",
  "Adds 2 - 30 Lightning Damage to Spells": "为法术附加 2 - 30 点闪电伤害",
  "Adds 12 - 17 Cold Damage to Spells": "为法术附加 12 - 17 点冰冷伤害",
  "Adds 12 - 18 Fire Damage to Spells": "为法术附加 12 - 18 点火焰伤害",
  "Adds 12 - 17 Physical Damage to Spells": "为法术附加 12 - 17 点物理伤害",
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
