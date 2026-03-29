const fs = require("fs");
const path = require("path");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const files = fs
  .readdirSync("src/data/gear-affix")
  .filter((f) => f.endsWith(".ts"));

const unmatched = [];

files.forEach((file) => {
  const content = fs.readFileSync(
    path.join("src/data/gear-affix", file),
    "utf8",
  );
  const affixMatches = content.match(/craftableAffix:\s*"([^"]+)"/g);

  if (affixMatches) {
    affixMatches.forEach((m) => {
      const affix = m.match(/craftableAffix:\s*"([^"]+)"/)[1];
      if (!translations[affix]) {
        unmatched.push(affix);
      }
    });
  }
});

console.log("未匹配词缀数量:", unmatched.length);
console.log("\n=== 所有未匹配词缀 ===\n");

unmatched.forEach((affix, i) => {
  console.log(i + 1 + ". " + affix);
});

// 保存到文件
fs.writeFileSync("scripts/unmatched-affixes.txt", unmatched.join("\n"));
console.log("\n已保存到 scripts/unmatched-affixes.txt");
