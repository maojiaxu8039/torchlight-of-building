const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 检查现有的 Sealed Mana Compensation 翻译
console.log("=== Existing Sealed Mana Compensation translations ===\n");
Object.entries(translations)
  .filter(
    ([en]) => en.includes("Sealed Mana Compensation") || en.includes("Sealed"),
  )
  .slice(0, 10)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 60).padEnd(60)} → ${cn}`);
  });

// 添加缺失的翻译
const missingTranslations = {
  // Sealed Mana Compensation variants
  "+7% Sealed Mana Compensation": "+7% 魔力封印补偿",
  "+6% Sealed Mana Compensation": "+6% 魔力封印补偿",
  "+8% Sealed Mana Compensation": "+8% 魔力封印补偿",
  "+10% Sealed Mana Compensation": "+10% 魔力封印补偿",
  "+12% Sealed Mana Compensation": "+12% 魔力封印补偿",
  "+15% Sealed Mana Compensation": "+15% 魔力封印补偿",

  // Generic
  "% Sealed Mana Compensation": "% 魔力封印补偿",
  "Sealed Mana Compensation": "魔力封印补偿",
  "Sealed Mana": "魔力封印",
  "Mana Compensation": "魔力封印补偿",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(
  `\n✅ Added ${added} missing Sealed Mana Compensation translations`,
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

console.log(`✅ Total translations: ${Object.keys(sortedTranslations).length}`);

// 验证
console.log("\n=== Verification ===\n");
Object.entries(missingTranslations).forEach(([en, cn]) => {
  const found = sortedTranslations[en];
  console.log(`${found ? "✅" : "❌"} ${en} → ${found || "NOT FOUND"}`);
});
