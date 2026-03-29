const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加缺失的 Movement Speed 翻译
const missingTranslations = {
  // Movement Speed variants
  "+9% Movement Speed": "+9% 移动速度",
  "+8% Movement Speed": "+8% 移动速度",
  "+10% Movement Speed": "+10% 移动速度",
  "+12% Movement Speed": "+12% 移动速度",
  "+15% Movement Speed": "+15% 移动速度",
  "+18% Movement Speed": "+18% 移动速度",
  "+20% Movement Speed": "+20% 移动速度",
  "+25% Movement Speed": "+25% 移动速度",
  "+30% Movement Speed": "+30% 移动速度",

  // Generic
  "% Movement Speed": "% 移动速度",
  "Movement Speed": "移动速度",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} missing Movement Speed translations`);

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

console.log(`✅ Total translations: ${Object.keys(sortedTranslations).length}`);

// 验证
console.log("\n=== Movement Speed Translations ===\n");
Object.entries(missingTranslations).forEach(([en, cn]) => {
  const found = sortedTranslations[en];
  console.log(`${found ? "✅" : "❌"} ${en} → ${found || "NOT FOUND"}`);
});
