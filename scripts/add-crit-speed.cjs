const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "500 Critical Strike Rating\n 1.2 Attack Speed\n Adds 32 - 32 Cold Damage to Spells":
    "500 暴击值\n 1.2 攻击速度\n 为法术附加 32 - 32 点冰冷伤害",
  "500 Critical Strike Rating\n 1.2 Attack Speed\n Adds 30 - 30 Erosion Damage to Spells":
    "500 暴击值\n 1.2 攻击速度\n 为法术附加 30 - 30 点腐蚀伤害",
  "500 Critical Strike Rating\n 1.2 Attack Speed\n Adds 28 - 28 Lightning Damage to Spells":
    "500 暴击值\n 1.2 攻击速度\n 为法术附加 28 - 28 点闪电伤害",
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
