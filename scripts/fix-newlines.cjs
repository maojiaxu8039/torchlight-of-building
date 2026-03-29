const fs = require("fs");

const content = fs.readFileSync(
  "src/data/translated-affixes/complete-affix-translations.ts",
  "utf8",
);

// 查找所有包含换行符的行
const lines = content.split("\n");
const fixedLines = [];
let i = 0;

while (i < lines.length) {
  const line = lines[i];

  // 如果这一行没有以 ' 开头（可能是续行）
  if (!line.trim().startsWith("'") && fixedLines.length > 0) {
    // 检查是否是续行
    const lastLine = fixedLines[fixedLines.length - 1];
    if (lastLine && !lastLine.trim().endsWith(",")) {
      // 这是一个续行，删除它
      fixedLines.pop();
      i++;
      continue;
    }
  }

  // 如果行包含实际的换行符（不是 \n 字符串）
  if (line.includes("\n") || line.includes("\r")) {
    // 这行有实际的换行，删除它和可能的续行
    fixedLines.pop(); // 删除前一行（不完整的行）
    // 跳过后续续行
    while (i + 1 < lines.length && !lines[i + 1].trim().startsWith("'")) {
      i++;
    }
    i++;
    continue;
  }

  fixedLines.push(line);
  i++;
}

const fixed = fixedLines.join("\n");
fs.writeFileSync(
  "src/data/translated-affixes/complete-affix-translations.ts",
  fixed,
);

console.log("Fixed!");
