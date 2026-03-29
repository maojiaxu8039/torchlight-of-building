const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加缺失的抗性翻译
const missingTranslations = {
  // Cold Resistance variants
  "+8% Cold Resistance": "+8% 冰冷抗性",
  "+5% Cold Resistance": "+5% 冰冷抗性",
  "+12% Cold Resistance": "+12% 冰冷抗性",
  "+15% Cold Resistance": "+15% 冰冷抗性",
  "+18% Cold Resistance": "+18% 冰冷抗性",
  "+20% Cold Resistance": "+20% 冰冷抗性",
  "+22% Cold Resistance": "+22% 冰冷抗性",
  "+25% Cold Resistance": "+25% 冰冷抗性",
  "+28% Cold Resistance": "+28% 冰冷抗性",
  "+30% Cold Resistance": "+30% 冰冷抗性",

  // Fire Resistance variants
  "+8% Fire Resistance": "+8% 火焰抗性",
  "+5% Fire Resistance": "+5% 火焰抗性",
  "+12% Fire Resistance": "+12% 火焰抗性",
  "+15% Fire Resistance": "+15% 火焰抗性",
  "+18% Fire Resistance": "+18% 火焰抗性",
  "+20% Fire Resistance": "+20% 火焰抗性",
  "+22% Fire Resistance": "+22% 火焰抗性",
  "+25% Fire Resistance": "+25% 火焰抗性",
  "+28% Fire Resistance": "+28% 火焰抗性",
  "+30% Fire Resistance": "+30% 火焰抗性",

  // Lightning Resistance variants
  "+8% Lightning Resistance": "+8% 闪电抗性",
  "+5% Lightning Resistance": "+5% 闪电抗性",
  "+12% Lightning Resistance": "+12% 闪电抗性",
  "+15% Lightning Resistance": "+15% 闪电抗性",
  "+18% Lightning Resistance": "+18% 闪电抗性",
  "+20% Lightning Resistance": "+20% 闪电抗性",
  "+22% Lightning Resistance": "+22% 闪电抗性",
  "+25% Lightning Resistance": "+25% 闪电抗性",
  "+28% Lightning Resistance": "+28% 闪电抗性",
  "+30% Lightning Resistance": "+30% 闪电抗性",

  // Erosion Resistance variants
  "+8% Erosion Resistance": "+8% 侵蚀抗性",
  "+5% Erosion Resistance": "+5% 侵蚀抗性",
  "+10% Erosion Resistance": "+10% 侵蚀抗性",
  "+12% Erosion Resistance": "+12% 侵蚀抗性",
  "+15% Erosion Resistance": "+15% 侵蚀抗性",
  "+18% Erosion Resistance": "+18% 侵蚀抗性",
  "+20% Erosion Resistance": "+20% 侵蚀抗性",

  // Generic resistance
  "Cold Resistance": "冰冷抗性",
  "Fire Resistance": "火焰抗性",
  "Lightning Resistance": "闪电抗性",
  "Erosion Resistance": "侵蚀抗性",
  "% Cold Resistance": "% 冰冷抗性",
  "% Fire Resistance": "% 火焰抗性",
  "% Lightning Resistance": "% 闪电抗性",
  "% Erosion Resistance": "% 侵蚀抗性",

  // All Resistance
  "+8% All Resistance": "+8% 所有抗性",
  "+10% All Resistance": "+10% 所有抗性",
  "+15% All Resistance": "+15% 所有抗性",
  "+20% All Resistance": "+20% 所有抗性",
  "+25% All Resistance": "+25% 所有抗性",
  "All Resistance": "所有抗性",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} missing resistance translations`);

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
