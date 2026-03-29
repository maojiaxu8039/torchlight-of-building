const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 检查现有的 Restoration Skills 翻译
console.log("=== Existing Restoration Skills translations ===\n");
Object.entries(translations)
  .filter(
    ([en]) => en.includes("Restoration") || en.includes("Charging Progress"),
  )
  .slice(0, 10)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 60).padEnd(60)} → ${cn}`);
  });

// 添加缺失的翻译
const missingTranslations = {
  // Restoration Skills gain X Charging Progress every second
  "Restoration Skills gain 1. Charging Progress every second":
    "回复技能每秒获得 1 充能进度",
  "Restoration Skills gain 2. Charging Progress every second":
    "回复技能每秒获得 2 充能进度",
  "Restoration Skills gain 3. Charging Progress every second":
    "回复技能每秒获得 3 充能进度",
  "Restoration Skills gain 4. Charging Progress every second":
    "回复技能每秒获得 4 充能进度",
  "Restoration Skills gain 5. Charging Progress every second":
    "回复技能每秒获得 5 充能进度",
  "Restoration Skills gain 1.5 Charging Progress every second":
    "回复技能每秒获得 1.5 充能进度",
  "Restoration Skills gain . Charging Progress every second":
    "回复技能每秒获得 充能进度",
  "Restoration Skills gain Charging Progress every second":
    "回复技能每秒获得充能进度",

  // generic
  "Charging Progress": "充能进度",
  "Charging Progress every second": "充能进度每秒",
  "every second": "每秒",
  "Restoration Skill": "回复技能",
  "Restoration Skills": "回复技能",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`\n✅ Added ${added} missing Restoration Skills translations`);

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
  console.log(`${found ? "✅" : "❌"} ${en.substring(0, 60)}`);
  console.log(`   → ${found || "NOT FOUND"}`);
});
