const fs = require("fs");
const path = require("path");

console.log("=== 分析未匹配的词缀 ===\n");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const files = fs
  .readdirSync("src/data/gear-affix")
  .filter((f) => f.endsWith(".ts"));

const unmatched = {
  "Base-Affix": [],
  Prefix: [],
  Suffix: [],
  "Sweet-Dream-Affix": [],
  "Tower-Sequence": [],
  "Corrosion-Base": [],
  Other: [],
};

files.forEach((file) => {
  const content = fs.readFileSync(
    path.join("src/data/gear-affix", file),
    "utf8",
  );

  // 确定类型
  let affixType = "Other";
  if (file.includes("-base-affix")) affixType = "Base-Affix";
  else if (file.includes("-prefix")) affixType = "Prefix";
  else if (file.includes("-suffix")) affixType = "Suffix";
  else if (file.includes("-sweet-dream")) affixType = "Sweet-Dream-Affix";
  else if (file.includes("-tower-sequence")) affixType = "Tower-Sequence";
  else if (file.includes("-corrosion-base")) affixType = "Corrosion-Base";

  // 提取词缀
  const affixMatches = content.match(/craftableAffix:\s*"([^"]+)"/g);

  if (affixMatches) {
    affixMatches.forEach((m) => {
      const affix = m.match(/craftableAffix:\s*"([^"]+)"/)[1];

      if (!translations[affix]) {
        if (!unmatched[affixType]) unmatched[affixType] = [];
        unmatched[affixType].push(affix);
      }
    });
  }
});

// 输出分析
Object.entries(unmatched).forEach((entry) => {
  const type = entry[0];
  const items = entry[1];

  console.log("\n=== " + type + " (" + items.length + " 条未匹配) ===");

  // 分析原因
  const reasons = { 格式不同: 0, 数值范围不同: 0, 缺少翻译: 0, 其他: 0 };

  // 显示示例
  items.slice(0, 5).forEach((item) => {
    console.log("  - " + item.substring(0, 70));
  });

  if (items.length > 5) {
    console.log("  ... 还有 " + (items.length - 5) + " 条");
  }
});

console.log("\n\n=== 总计 ===");
let total = 0;
Object.entries(unmatched).forEach((entry) => {
  total += entry[1].length;
});
console.log("未匹配总数:", total);
