const fs = require("fs");
const path = require("path");

console.log("=== 检查新抓取的 Prefix/Suffix 文件 ===\n");

const dir = "src/data/gear-affix-prefix-suffix";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts"));

let totalNew = 0;
const byType = { Prefix: 0, Suffix: 0 };

files.forEach((file) => {
  const content = fs.readFileSync(path.join(dir, file), "utf8");
  const matches = content.match(/craftableAffix:/g);
  const count = matches ? matches.length : 0;
  totalNew += count;

  if (file.includes("prefix")) byType.Prefix += count;
  if (file.includes("suffix")) byType.Suffix += count;
});

console.log("新抓取的 Prefix/Suffix 总数:", totalNew);
console.log("  - Prefix:", byType.Prefix);
console.log("  - Suffix:", byType.Suffix);

console.log("\n=== 对比旧文件 ===");

// 读取旧文件
const oldDir = "src/data/gear-affix";
const oldFiles = fs.readdirSync(oldDir).filter((f) => f.endsWith(".ts"));

const totalOld = { Prefix: 0, Suffix: 0 };

oldFiles.forEach((file) => {
  const content = fs.readFileSync(path.join(oldDir, file), "utf8");
  const matches = content.match(/craftableAffix:/g);
  const count = matches ? matches.length : 0;

  if (file.includes("-prefix")) totalOld.Prefix += count;
  if (file.includes("-suffix")) totalOld.Suffix += count;
});

console.log("旧 Prefix:", totalOld.Prefix);
console.log("旧 Suffix:", totalOld.Suffix);

console.log("\n=== 结论 ===");
console.log(
  "网页数据比游戏数据少:",
  totalOld.Prefix - byType.Prefix + totalOld.Suffix - byType.Suffix,
  "条",
);
console.log("建议: 合并新旧数据，优先使用游戏数据，翻译使用网页数据");
