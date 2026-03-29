const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+3 Erosion Skill Level": "+3 腐蚀技能等级",
  "+3 Fire Skill Level": "+3 火焰技能等级",
  "+3 Cold Skill Level": "+3 冰冷技能等级",
  "+3 Lightning Skill Level": "+3 闪电技能等级",
  "+3 Physical Skill Level": "+3 物理技能等级",
  "+104 Dexterity": "+104 敏捷",
  "+104 Strength": "+104 力量",
  "+104 Intelligence": "+104 智慧",
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
