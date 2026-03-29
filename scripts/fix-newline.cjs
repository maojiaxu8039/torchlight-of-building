const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 删除有换行符的错误翻译
delete translations[
  "500 Critical Strike Rating\n 1.2 Attack Speed\n Adds 32 - 32 Cold Damage to Spells"
];
delete translations[
  "500 Critical Strike Rating\n 1.2 Attack Speed\n Adds 30 - 30 Erosion Damage to Spells"
];
delete translations[
  "500 Critical Strike Rating\n 1.2 Attack Speed\n Adds 28 - 28 Lightning Damage to Spells"
];

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

console.log("已删除错误的翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
