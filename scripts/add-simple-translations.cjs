const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 添加缺失的翻译
const newTranslations = {
  "+95 Max Life": "+95 最大生命",
  "+35 Max Life": "+35 最大生命",
  "+18 Max Energy Shield": "+18 最大护盾",
  "+15 Max Life": "+15 最大生命",
  "+12 Max Energy Shield": "+12 最大护盾",
  "+10 Max Life": "+10 最大生命",
  "+95 Max Mana": "+95 最大魔力",
  "+35 Max Mana": "+35 最大魔力",
  "+18 Max Mana": "+18 最大魔力",
  "+15 Max Mana": "+15 最大魔力",
  "+12 Max Mana": "+12 最大魔力",
  "+10 Max Mana": "+10 最大魔力",
};

let added = 0;
Object.entries(newTranslations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log("添加了 " + added + " 个翻译");

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

console.log("总计: " + Object.keys(result).length + " 条翻译");
