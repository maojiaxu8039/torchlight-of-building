const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加项目代码中实际使用的格式的翻译
const reapsTranslations = {
  // Trauma Damage
  "Reaps (0.37-0.48) s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 (0.37-0.48) 秒创伤伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps (0.25-0.36) s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 (0.25-0.36) 秒创伤伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps (0.18-0.24) s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 (0.18-0.24) 秒创伤伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.16 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.16 秒创伤伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.14 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.14 秒创伤伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.12 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.12 秒创伤伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.10 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.10 秒创伤伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.08 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.08 秒创伤伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.07 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.07 秒创伤伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",

  // Ignite Damage
  "Reaps (0.37-0.48) s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 (0.37-0.48) 秒点燃伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps (0.25-0.36) s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 (0.25-0.36) 秒点燃伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps (0.18-0.24) s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 (0.18-0.24) 秒点燃伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.16 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.16 秒点燃伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.14 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.14 秒点燃伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.12 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.12 秒点燃伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.10 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.10 秒点燃伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.08 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.08 秒点燃伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.07 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.07 秒点燃伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",

  // Wilt Damage
  "Reaps (0.37-0.48) s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 (0.37-0.48) 秒萎陷伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps (0.25-0.36) s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 (0.25-0.36) 秒萎陷伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps (0.18-0.24) s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 (0.18-0.24) 秒萎陷伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.16 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.16 秒萎陷伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.14 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.14 秒萎陷伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.12 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.12 秒萎陷伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.10 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.10 秒萎陷伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.08 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.08 秒萎陷伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.07 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "收割 0.07 秒萎陷伤害造成持续伤害，该效果对同一目标有 1 秒回复时间",

  // generic
  "Trauma Damage": "创伤伤害",
  "Ignite Damage": "点燃伤害",
  "Wilt Damage": "萎陷伤害",
  Damage: "伤害",
  "when dealing": "造成",
  Reaps: "收割",
};

// 添加缺失的翻译
let added = 0;
Object.entries(reapsTranslations).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`✅ Added ${added} Reaps translations`);

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
