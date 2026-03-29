const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+120% Ailment Damage Enhancement": "+120% 异常状态伤害加深",
  "+120% Combo Damage Enhancement if the Combo Finisher cast recently consumes at least 8 Combo Point(s)":
    "如果最近释放的连携终结技消耗至少 8 个连携点，+120% 连携伤害加深",
  "+288% Demolisher Charge Restoration Speed": "+288% 爆破充能回复速度",
  "+108% Focus Damage Enhancement": "+108% 贯注伤害加深",
  "+60% Steep Strike chance. +56% additional Steep Strike Damage":
    "+60% 斩击几率 +56% 额外斩击伤害",
  "70% additional damage applied to Life": "70% 额外伤害作用于生命",
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
