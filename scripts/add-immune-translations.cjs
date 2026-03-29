const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 检查现有的 Immune 翻译
console.log("=== Existing Immune translations ===\n");
Object.entries(translations)
  .filter(([en]) => en.includes("Immune") || en.includes("immune"))
  .slice(0, 10)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 60).padEnd(60)} → ${cn}`);
  });

// 添加缺失的翻译
const missingTranslations = {
  // Immune to Paralysis
  "Immune to Paralysis": "免疫瘫痪",
  "+Immune to Paralysis": "+免疫瘫痪",
  "Immune to ParalysisImmune to Blinding": "免疫瘫痪免疫致盲",
  "Immune to Paralysis Immune to Blinding": "免疫瘫痪免疫致盲",

  // Immune to Blinding
  "Immune to Blinding": "免疫致盲",
  "+Immune to Blinding": "+免疫致盲",
  "Immune to BlindingImmune to Paralysis": "免疫致盲免疫瘫痪",
  "Immune to Blinding Immune to Paralysis": "免疫致盲免疫瘫痪",

  // Immune to Slow
  "Immune to Slow": "免疫减速",
  "+Immune to Slow": "+免疫减速",
  "Immune to SlowImmune to Weaken": "免疫减速免疫虚弱",
  "Immune to Slow Immune to Weaken": "免疫减速免疫虚弱",

  // Immune to Weaken
  "Immune to Weaken": "免疫虚弱",
  "+Immune to Weaken": "+免疫虚弱",
  "Immune to WeakenImmune to Slow": "免疫虚弱免疫减速",
  "Immune to Weaken Immune to Slow": "免疫虚弱免疫减速",

  // generic
  "Immune to": "免疫",
  Immune: "免疫",
  Paralysis: "瘫痪",
  Blinding: "致盲",
  Slow: "减速",
  Weaken: "虚弱",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`\n✅ Added ${added} missing Immune translations`);

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
  console.log(`${found ? "✅" : "❌"} ${en.substring(0, 50)}`);
  console.log(`   → ${found || "NOT FOUND"}`);
});
