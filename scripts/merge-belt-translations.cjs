const fs = require("fs");

console.log("=== 合并 Belt 翻译 ===\n");

const beltTranslations = JSON.parse(
  fs.readFileSync("scripts/belt-item-translations.json", "utf8"),
);
const existing = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

console.log("Belt 翻译:", Object.keys(beltTranslations).length);
console.log("现有翻译:", Object.keys(existing).length);

let added = 0;
Object.entries(beltTranslations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  // 只添加没有被截断的翻译（EN 和 CN 都应该完整）
  if (
    !existing[en] &&
    en.length > 5 &&
    cn.length > 2 &&
    !en.match(/^\d+$/) &&
    !cn.match(/^\d+$/)
  ) {
    existing[en] = cn;
    added++;
  }
});

console.log("新增翻译:", added);

// 保存
const sorted = Object.entries(existing).sort(
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

console.log("总计:", Object.keys(result).length);
