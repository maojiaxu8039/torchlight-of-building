const fs = require("fs");
const path = require("path");

// 读取翻译数据
const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 词缀类型
const affixTypes = [
  "prefix",
  "suffix",
  "base-affix",
  "sweet-dream-affix",
  "tower-sequence",
  "corrosion-base",
];

// 统计结果
const stats = { total: 0, matched: 0, unmatched: [], byType: {} };

affixTypes.forEach((type) => {
  stats.byType[type] = { total: 0, matched: 0, unmatched: [] };
});

// 读取所有词缀文件
const gearAffixDir = "src/data/gear-affix";
const files = fs.readdirSync(gearAffixDir).filter((f) => f.endsWith(".ts"));

files.forEach((file) => {
  const content = fs.readFileSync(path.join(gearAffixDir, file), "utf8");

  // 提取词缀类型
  let affixType = null;
  affixTypes.forEach((type) => {
    if (file.includes(`-${type}.ts`)) {
      affixType = type;
    }
  });

  if (!affixType) return;

  // 提取 craftableAffix
  const craftableAffixRegex = /craftableAffix:\s*"([^"]+)"/g;
  let match;

  while ((match = craftableAffixRegex.exec(content)) !== null) {
    const craftableAffix = match[1].replace(/\\n/g, " ").replace(/–/g, "-");
    stats.total++;
    stats.byType[affixType].total++;

    // 检查是否有翻译
    if (translations[craftableAffix]) {
      stats.matched++;
      stats.byType[affixType].matched++;
    } else {
      stats.unmatched.push({ file, affix: craftableAffix });
      stats.byType[affixType].unmatched.push(craftableAffix);
    }
  }
});

// 输出结果
console.log("=== 翻译匹配统计 ===\n");
console.log(
  `总计: ${stats.matched}/${stats.total} (${((stats.matched / stats.total) * 100).toFixed(1)}%)\n`,
);

console.log("=== 按词缀类型 ===");
affixTypes.forEach((type) => {
  const { total, matched, unmatched } = stats.byType[type];
  if (total > 0) {
    const percent = ((matched / total) * 100).toFixed(1);
    console.log(`${type}: ${matched}/${total} (${percent}%)`);
  }
});

console.log("\n=== 未匹配的词缀示例 (最多20个) ===");
stats.unmatched.slice(0, 20).forEach((item) => {
  console.log(`[${item.file}] ${item.affix.substring(0, 80)}`);
});

console.log(`\n总共 ${stats.unmatched.length} 个未匹配`);
