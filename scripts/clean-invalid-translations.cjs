const fs = require("fs");

console.log("=== 清理无效翻译 ===\n");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const cleaned = {};
let removed = 0;

// 清理和过滤
Object.entries(translations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  // 跳过无效的中文翻译
  if (!cn || cn.length < 2) {
    removed++;
    return;
  }

  // 跳过纯数字或单个字符的中文
  if (cn.match(/^[0-9]+$/) || cn.length === 1) {
    removed++;
    return;
  }

  // 跳过太短的英文
  if (en.length < 5) {
    removed++;
    return;
  }

  // 跳过以数字开头的英文
  if (en.match(/^\d/)) {
    removed++;
    return;
  }

  cleaned[en] = cn;
});

console.log("清理结果:");
console.log("  保留: " + Object.keys(cleaned).length);
console.log("  删除: " + removed);

// 重新排序
const sorted = Object.entries(cleaned).sort(
  (a, b) => b[0].length - a[0].length,
);
const result = {};
sorted.forEach((entry) => {
  result[entry[0]] = entry[1];
});

fs.writeFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  JSON.stringify(result, null, 2),
);

console.log("\n清理完成！");
console.log("总计: " + Object.keys(result).length + " 条翻译");
