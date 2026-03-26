const fs = require("fs");

console.log("=== 清理 Tower Sequence 翻译 ===\n");

const translations = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));

const cleaned = {};
let removed = 0;
let modified = 0;

Object.entries(translations).forEach(function(entry) {
  const en = entry[0];
  const cn = entry[1];
  
  // 跳过无效翻译
  if (!cn || cn.match(/^[0-9]$/) || cn.length < 2) {
    removed++;
    return;
  }
  
  // 清理 EN 中的 Intermediate/Advanced/Ultimate Sequence 部分
  const cleanedEn = en
    .replace(/Intermediate Sequence \d+[\d|]*/g, "")
    .replace(/Advanced Sequence \d+[\d|]*/g, "")
    .replace(/Ultimate Sequence \d+[\d|]*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  
  // 清理 CN 中的对应部分
  const cleanedCn = cn
    .replace(/中阶序列 \d+[\d|]*/g, "")
    .replace(/高阶序列 \d+[\d|]*/g, "")
    .replace(/终阶序列 \d+[\d|]*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  
  // 如果清理后和原值相同，可能是 Tower Sequence 但没有 Sequence 部分
  if (cleanedEn && cleanedCn && cleanedCn.length > 2) {
    cleaned[cleanedEn] = cleanedCn;
    if (cleanedEn !== en) modified++;
  }
});

console.log("清理结果:");
console.log("  保留:", Object.keys(cleaned).length);
console.log("  修改:", modified);
console.log("  删除:", removed);

// 重新排序
const sorted = Object.entries(cleaned).sort(function(a, b) { return b[0].length - a[0].length; });
const result = {};
sorted.forEach(function(entry) { result[entry[0]] = entry[1]; });

fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));

console.log("\n翻译已保存，总计:", Object.keys(result).length);
