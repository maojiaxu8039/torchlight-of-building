const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加缺失的翻译
const missingTranslations = {
  // max channeled stacks
  "1 max Channeled Stacks": "1 层引导蓄能点数上限",
  "2 max Channeled Stacks": "2 层引导蓄能点数上限",
  "3 max Channeled Stacks": "3 层引导蓄能点数上限",
  "4 max Channeled Stacks": "4 层引导蓄能点数上限",
  "5 max Channeled Stacks": "5 层引导蓄能点数上限",

  // max stacks variations
  "1 max stacks": "1 层上限",
  "2 max stacks": "2 层上限",
  "3 max stacks": "3 层上限",
  "4 max stacks": "4 层上限",
  "5 max stacks": "5 层上限",

  // min channeled stacks
  "1 Min Channeled Stacks": "1 层引导蓄能点数下限",
  "2 Min Channeled Stacks": "2 层引导蓄能点数下限",
  "3 Min Channeled Stacks": "3 层引导蓄能点数下限",

  // min stacks variations
  "1 min stacks": "1 层下限",
  "2 min stacks": "2 层下限",
  "3 min stacks": "3 层下限",

  // simpler variations
  "max Channeled Stacks": "引导蓄能点数上限",
  "max stacks": "上限",
  "Min Channeled Stacks": "引导蓄能点数下限",
  "min stacks": "下限",
  max: "上限",
  min: "下限",
};

// 添加缺失的翻译
let added = 0;
Object.keys(missingTranslations).forEach((en) => {
  if (!translations[en]) {
    translations[en] = missingTranslations[en];
    added++;
  }
});

console.log(
  "✅ Added " + added + " missing max/min channeled stacks translations",
);

// 排序（优先匹配长的）
const sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
const sortedTranslations = {};
sorted.forEach(([en, cn]) => {
  sortedTranslations[en] = cn;
});

// 保存
fs.writeFileSync(
  path.join(outDir, "merged-all-translations.json"),
  JSON.stringify(sortedTranslations, null, 2),
  "utf-8",
);

console.log("✅ Total translations: " + Object.keys(sortedTranslations).length);
