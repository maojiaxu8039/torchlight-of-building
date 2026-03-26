const fs = require("fs");

const content = fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8");
const translations = JSON.parse(content);

// 删除不完整的翻译
const incompleteKeys = [
  "avoid",
  "Avoid",
  "% Elemental Resistance",
  "% Resistance",
];

let removed = 0;
Object.keys(translations).forEach(function(key) {
  // 删除单独的词或短翻译
  if (incompleteKeys.some(function(incomplete) { return key === incomplete; })) {
    delete translations[key];
    removed++;
  }
});

console.log("Removed " + removed + " incomplete translations");

// 重新排序
const sorted = Object.entries(translations).sort(function(a, b) { return b[0].length - a[0].length; });
const result = {};
sorted.forEach(function(entry) { result[entry[0]] = entry[1]; });

fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));
console.log("Done!");
