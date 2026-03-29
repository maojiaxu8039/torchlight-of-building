const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let added = 0;

// Multistrike chance
for (let i = 50; i <= 200; i++) {
  const en = "+" + i + "% chance to Multistrike";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 多重打击几率";
    added++;
  }
}

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

console.log("新增 Multistrike 翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
