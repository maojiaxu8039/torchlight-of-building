const fs = require("fs");

const content = fs.readFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  "utf8",
);
const translations = JSON.parse(content);

// 要删除的不完整翻译
const incompleteKeys = [
  "% Resistance",
  "% Elemental Resistance",
  "% Lightning Resistance",
  "% Fire Resistance",
  "% Cold Resistance",
  "chance to avoid",
  "avoid Ailment",
  "avoid",
  "avoid damage",
  "Elemental Resistance",
  "Erosion Resistance",
  "Physical Resistance",
  "+% Resistance",
];

// 只删除单独存在的翻译（不是完整词组的一部分）
const toDelete = [];
Object.keys(translations).forEach((key) => {
  // 如果 key 太短（只有几个词），可能是单独翻译
  const wordCount = key.split(/\s+/).length;
  if (
    wordCount <= 3 &&
    incompleteKeys.some((incomplete) => key.includes(incomplete))
  ) {
    toDelete.push(key);
  }
});

console.log("要删除的不完整翻译:");
toDelete.forEach((key) => {
  console.log(`  "${key}" -> "${translations[key]}"`);
});

toDelete.forEach((key) => {
  delete translations[key];
});

// 重新排序
const sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
const result = {};
sorted.forEach(([en, cn]) => {
  result[en] = cn;
});

fs.writeFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  JSON.stringify(result, null, 2),
);
console.log("\n删除了 " + toDelete.length + " 个不完整翻译");
