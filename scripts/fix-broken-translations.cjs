const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 检查并修复损坏的翻译
const brokenTranslations = {};

// 找出所有包含空占位符或损坏的翻译
Object.entries(translations).forEach(([en, cn]) => {
  // 检查是否有空的 "inflicting" 部分
  if (en.includes("inflicting .") || en.includes("inflicting.")) {
    brokenTranslations[en] = cn;
  }
  // 检查中文是否为空或不完整
  if (cn === "" || cn === " " || cn.length < 2) {
    brokenTranslations[en] = cn;
  }
});

console.log("⚠️  Found broken translations:\n");
Object.entries(brokenTranslations)
  .slice(0, 10)
  .forEach(([en, cn]) => {
    console.log(`  "${en}"`);
    console.log(`  → "${cn}"`);
    console.log("");
  });

// 删除损坏的翻译
let deleted = 0;
Object.keys(brokenTranslations).forEach((en) => {
  delete translations[en];
  deleted++;
});

console.log(`\n✅ Deleted ${deleted} broken translations`);

// 添加修复后的完整翻译
const fixedTranslations = {
  "Reaps 0.12 s of Damage Over Time when inflicting . The effect has a 1 s Recovery Time against the same target":
    "造成时，收割 0.12 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.09 s of Damage Over Time when inflicting . The effect has a 1 s Recovery Time against the same target":
    "造成时，收割 0.09 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.06 s of Damage Over Time when inflicting . The effect has a 1 s Recovery Time against the same target":
    "造成时，收割 0.06 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.04 s of Damage Over Time when inflicting . The effect has a 1 s Recovery Time against the same target":
    "造成时，收割 0.04 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.16 s of Damage Over Time when inflicting . The effect has a 1 s Recovery Time against the same target":
    "造成时，收割 0.16 秒持续伤害，该效果对同一目标有 1 秒回复时间",
};

Object.entries(fixedTranslations).forEach(([en, cn]) => {
  translations[en] = cn;
});

console.log(
  `✅ Added ${Object.keys(fixedTranslations).length} fixed translations`,
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
