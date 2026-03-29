const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 检查现有的 Aura Effect 翻译
console.log("=== Existing Aura Effect translations ===\n");
Object.entries(translations)
  .filter(([en]) => en.includes("Aura Effect"))
  .slice(0, 10)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 60).padEnd(60)} → ${cn}`);
  });

// 添加缺失的翻译
const missingTranslations = {
  // Aura Effect variants
  "+8% Aura Effect": "+8% 光环效果",
  "+10% Aura Effect": "+10% 光环效果",
  "+12% Aura Effect": "+12% 光环效果",
  "+15% Aura Effect": "+15% 光环效果",
  "+18% Aura Effect": "+18% 光环效果",
  "+20% Aura Effect": "+20% 光环效果",
  "+25% Aura Effect": "+25% 光环效果",
  "+30% Aura Effect": "+30% 光环效果",

  // Generic
  "% Aura Effect": "% 光环效果",
  "Aura Effect": "光环效果",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`\n✅ Added ${added} missing Aura Effect translations`);

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
console.log("\n=== Verification ===\n");
Object.entries(missingTranslations).forEach(([en, cn]) => {
  const found = sortedTranslations[en];
  console.log(`${found ? "✅" : "❌"} ${en} → ${found || "NOT FOUND"}`);
});
