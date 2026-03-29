const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+65% Focus Speed": "+65% 贯注速度",
  "+208% Critical Strike Rating": "+208% 暴击值",
  "+104% Spell Critical Strike Damage": "+104% 法术暴击伤害",
  "+145 Spell Critical Strike Rating": "+145 暴击值",
  "+53% Max Mana": "+53% 最大魔力",
  "+104% Mana Regeneration Speed": "+104% 魔力回复速度",
  "+57% Spell Burst Charge Speed": "+57% 法术迸发充能速度",
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
