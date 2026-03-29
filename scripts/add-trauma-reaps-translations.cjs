const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加缺失的 Trauma 相关翻译
const missingTranslations = {
  // Trauma Reaps
  "Reaps 0.16 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target":
    "造成创伤时，收割 0.16 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.12 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target":
    "造成创伤时，收割 0.12 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.09 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target":
    "造成创伤时，收割 0.09 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.06 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target":
    "造成创伤时，收割 0.06 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.04 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target":
    "造成创伤时，收割 0.04 秒持续伤害，该效果对同一目标有 1 秒回复时间",

  // Ignite Reaps
  "Reaps 0.16 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target":
    "造成点燃时，收割 0.16 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.12 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target":
    "造成点燃时，收割 0.12 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.09 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target":
    "造成点燃时，收割 0.09 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.06 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target":
    "造成点燃时，收割 0.06 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.04 s of Damage Over Time when inflicting Ignite. The effect has a 1 s Recovery Time against the same target":
    "造成点燃时，收割 0.04 秒持续伤害，该效果对同一目标有 1 秒回复时间",

  // Wilt Reaps
  "Reaps 0.16 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target":
    "造成萎陷时，收割 0.16 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.12 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target":
    "造成萎陷时，收割 0.12 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.09 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target":
    "造成萎陷时，收割 0.09 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.06 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target":
    "造成萎陷时，收割 0.06 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.04 s of Damage Over Time when inflicting Wilt. The effect has a 1 s Recovery Time against the same target":
    "造成萎陷时，收割 0.04 秒持续伤害，该效果对同一目标有 1 秒回复时间",

  // generic
  "when inflicting Trauma": "造成创伤时",
  "when inflicting Ignite": "造成点燃时",
  "when inflicting Wilt": "造成萎陷时",
  "inflicting Trauma": "造成创伤",
  "inflicting Ignite": "造成点燃",
  "inflicting Wilt": "造成萎陷",
  "The effect has a": "该效果有",
  "a 1 s Recovery Time": "1 秒回复时间",
  "Recovery Time against the same target": "对同一目标有回复时间",
  "Recovery Time": "回复时间",
  "against the same target": "对同一目标",
  Trauma: "创伤",
  Ignite: "点燃",
  Wilt: "萎陷",
  inflicting: "造成",
  Reaps: "收割",
  "Damage Over Time": "持续伤害",
};

// 添加缺失的翻译
let added = 0;
Object.entries(missingTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} missing Trauma/Reaps translations`);

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
console.log(
  "✅ Reaps 0.16 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target",
);
console.log(
  `   → ${sortedTranslations["Reaps 0.16 s of Damage Over Time when inflicting Trauma. The effect has a 1 s Recovery Time against the same target"] || "NOT FOUND"}`,
);
