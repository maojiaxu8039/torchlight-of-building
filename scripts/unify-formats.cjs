const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 统一格式：移除 % 前面的空格
const unified = {};
let fixed = 0;

Object.entries(translations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  // 移除 % 前面的空格，但保留 % 后面的空格
  const fixedEn = en
    .replace(/\s*%\s*/g, "%")
    .replace(/\s+/g, " ")
    .trim();

  if (fixedEn !== en) {
    fixed++;
  }

  unified[fixedEn] = cn;
});

console.log("Fixed " + fixed + " entries");

// 重新排序
const sorted = Object.entries(unified).sort(
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
