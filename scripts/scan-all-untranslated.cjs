const fs = require("fs");
const path = require("path");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 扫描所有 TypeScript 文件中的英文词条
const dirs = ["src/data", "src/lib", "src/components"];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      !entry.name.startsWith(".") &&
      entry.name !== "node_modules"
    ) {
      results.push(...scanDir(fullPath));
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
    ) {
      const content = fs.readFileSync(fullPath, "utf8");
      const matches = content.match(
        /"[A-Za-z][A-Za-z0-9%+\-()\s]+(?:Damage|Resistance|Speed|Duration|Rating|Chance|Life|Mana|Shield|Crit|Block|Aura|Effect|Enhancement)"[^"]/g,
      );
      if (matches) {
        matches.forEach((m) => {
          const cleanMatch = m.replace(/^"/, "").replace(/[^"]*$/, "");
          if (
            cleanMatch.length > 5 &&
            !translations[cleanMatch] &&
            /[A-Z]/.test(cleanMatch) &&
            /\d/.test(cleanMatch)
          ) {
            results.push({ file: fullPath, text: cleanMatch });
          }
        });
      }
    }
  }
  return results;
}

const allResults = [];
dirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    allResults.push(...scanDir(dir));
  }
});

// 去重
const unique = [...new Set(allResults.map((r) => r.text))];
console.log("发现未翻译的词条数量:", unique.length);
console.log("\n未翻译词条列表:");
unique.forEach((text, i) => {
  console.log(i + 1 + ". " + text);
});
