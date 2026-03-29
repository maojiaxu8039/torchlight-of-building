const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加缺失的翻译
const missingTranslations = {
  // 完整词条
  "% additional damage taken at (-15–-12)": "% 额外受到的伤害 在 (-15–-12)",
  "+% additional damage taken at (-15–-12)": "+% 额外受到的伤害 在 (-15–-12)",
  "+(%) additional damage taken at (-15–-12)":
    "+() 额外受到的伤害 在 (-15–-12)",

  // variations
  "% additional damage taken at": "% 额外受到的伤害 在",
  "+% additional damage taken at": "+% 额外受到的伤害 在",
  "additional damage taken at": "额外受到的伤害 在",

  // generic
  at: "在",
  "additional damage taken": "额外受到的伤害",
  "damage taken": "受到的伤害",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} missing translations`);

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
