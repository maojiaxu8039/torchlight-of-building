const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "../src/data/translated-affixes");

const files = [
  "craft-translations.json",
  "legendary-translations.json",
  "prism-translations.json",
  "destiny-translations.json",
  "corrosion-translations.json",
  "dream-translations.json",
  "blending-translations.json",
  "tower-translations.json",
];

const merged = {};

files.forEach((file) => {
  const filePath = path.join(outputDir, file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    Object.assign(merged, data);
    console.log(`✅ ${file}: ${Object.keys(data).length} translations`);
  }
});

console.log(`\n✅ Total merged: ${Object.keys(merged).length} translations`);

// Save merged
fs.writeFileSync(
  path.join(outputDir, "all-new-translations.json"),
  JSON.stringify(merged, null, 2),
  "utf-8",
);

// Now add to complete-affix-translations.ts
const tsFile = path.join(outputDir, "complete-affix-translations.ts");
let tsContent = fs.readFileSync(tsFile, "utf8");

const [before, after] = tsContent.split("};");
let newEntries = "";

Object.entries(merged).forEach(([en, cn]) => {
  if (!tsContent.includes(`'${en.replace(/'/g, "\\'")}':`)) {
    newEntries += `\n  '${en.replace(/'/g, "\\'")}': '${cn.replace(/'/g, "\\'")}',`;
  }
});

tsContent = before + "};" + newEntries + after;

fs.writeFileSync(tsFile, tsContent, "utf-8");
console.log(
  `\n✅ Updated complete-affix-translations.ts with ${Object.keys(merged).length} new translations`,
);
