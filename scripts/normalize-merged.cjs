const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let fixed = 0;
const newTranslations = {};

// 标准化所有翻译
Object.entries(translations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  // 标准化英文：统一 en dash 为连字符，移除多余空格
  const fixedEn = en
    .replace(/–/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^\s+|\s+$/g, "");

  newTranslations[fixedEn] = cn;
  if (fixedEn !== en) fixed++;
});

console.log("Fixed " + fixed + " entries");

// 重新排序（优先匹配长的）
const sorted = Object.entries(newTranslations).sort(
  (a, b) => b[0].length - a[0].length,
);
const result = {};
sorted.forEach((entry) => {
  result[entry[0]] = entry[1];
});

fs.writeFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  JSON.stringify(result, null, 2),
);
console.log("Done!");
