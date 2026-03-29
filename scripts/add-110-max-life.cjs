const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 添加通用翻译
translations["+110 Max Life"] = "+110 最大生命";
translations["+120 Max Life"] = "+120 最大生命";
translations["+140 Max Life"] = "+140 最大生命";
translations["+110 Max Mana"] = "+110 最大魔力";
translations["+120 Max Mana"] = "+120 最大魔力";
translations["+140 Max Mana"] = "+140 最大魔力";

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

console.log("已添加 +110 Max Life, +120 Max Life, +140 Max Life 等翻译");
