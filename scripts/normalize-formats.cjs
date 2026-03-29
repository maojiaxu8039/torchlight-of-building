const fs = require("fs");

const translations = JSON.parse(
  fs
    .readFileSync(
      "src/data/translated-affixes/complete-affix-translations.ts",
      "utf8",
    )
    .replace(/^export const AFFIX_NAME_TRANSLATIONS[^=]*=\s*{/, "{")
    .replace(/};?\s*$/, "}"),
);

let fixed = 0;

// 标准化：统一使用连字符 - 和移除多余空格
Object.entries(translations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  // 标准化英文：移除空格，统一连字符
  const fixedEn = en.replace(/–/g, "-").replace(/\s+/g, " ").trim();

  if (fixedEn !== en) {
    delete translations[en];
    translations[fixedEn] = cn;
    fixed++;
  }
});

console.log("Fixed " + fixed + " entries");

// 重新排序
const sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
const result = {};
sorted.forEach((entry) => {
  result[entry[0]] = entry[1];
});

const content =
  "export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = " +
  JSON.stringify(result, null, 2) +
  ";";
fs.writeFileSync(
  "src/data/translated-affixes/complete-affix-translations.ts",
  content,
);
console.log("Done!");
