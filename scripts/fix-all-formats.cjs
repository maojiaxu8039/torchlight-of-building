const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let fixed = 0;

// 修复空格问题
Object.entries(translations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  // 移除多余的空格
  const fixedEn = en.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
  const fixedCn = cn.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");

  if (fixedEn !== en || fixedCn !== cn) {
    delete translations[en];
    translations[fixedEn] = fixedCn;
    fixed++;
  }
});

// 排序（优先匹配长的
const sorted = Object.entries(translations).sort(
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
console.log("Fixed " + fixed + " translations");
