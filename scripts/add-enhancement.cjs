const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+80% Tangle Damage Enhancement": "+80% 缠结伤害增强",
  "+60% Combo Damage Enhancement if the Combo Finisher cast recently consumes at least 8 Combo Point(s)":
    "如果最近释放的连携终结技消耗至少 8 个连携点，+60% 连携伤害增强",
  "+53% Focus Damage Enhancement": "+53% 聚能伤害增强",
  "-15% additional Cast Speed +62% additional Spell Damage":
    "-15% 额外施法速度 +62% 额外法术伤害",
  "+60% Combo Damage Enhancement": "+60% 连携伤害增强",
  "+53% Tangle Damage Enhancement": "+53% 缠结伤害增强",
  "+40% Combo Damage Enhancement": "+40% 连携伤害增强",
  "+40% Tangle Damage Enhancement": "+40% 缠结伤害增强",
  "+30% Combo Damage Enhancement": "+30% 连携伤害增强",
  "+30% Tangle Damage Enhancement": "+30% 缠结伤害增强",
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
