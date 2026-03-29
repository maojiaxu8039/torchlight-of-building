const fs = require("fs");
const path = require("path");
const https = require("https");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载现有的翻译
const existingTranslations = {};
const translationFiles = fs
  .readdirSync(outDir)
  .filter((f) => f.endsWith("-translations.json"));

translationFiles.forEach((file) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(outDir, file), "utf8"));
    Object.assign(existingTranslations, data);
  } catch (e) {
    // ignore
  }
});

console.log(
  `✅ Existing translations: ${Object.keys(existingTranslations).length}\n`,
);

// 从所有 gear-affix 文件中提取 craftableAffix
const allAffixes = new Set();
const gearAffixDir = path.join(__dirname, "../src/data/gear-affix");

const files = fs.readdirSync(gearAffixDir).filter((f) => f.endsWith(".ts"));

files.forEach((file) => {
  const content = fs.readFileSync(path.join(gearAffixDir, file), "utf8");
  const matches = content.match(/craftableAffix:\s*"([^"]+)"/g);

  if (matches) {
    matches.forEach((match) => {
      const affix = match.match(/craftableAffix:\s*"([^"]+)"/)[1];
      allAffixes.add(affix);
    });
  }
});

console.log(`📦 Total affixes in project: ${allAffixes.size}\n`);

// 检查缺失的翻译
const missing = [];
const found = [];

allAffixes.forEach((affix) => {
  if (existingTranslations[affix]) {
    found.push(affix);
  } else {
    missing.push(affix);
  }
});

console.log(`✅ Found translations: ${found.length}`);
console.log(`⚠️  Missing translations: ${missing.length}\n`);

if (missing.length > 0 && missing.length <= 50) {
  console.log("Missing affixes:");
  missing.slice(0, 30).forEach((affix) => {
    console.log(`  - ${affix}`);
  });
}

// 从 all-affixes.ts 中也提取
const allAffixesFile = path.join(gearAffixDir, "all-affixes.ts");
if (fs.existsSync(allAffixesFile)) {
  const content = fs.readFileSync(allAffixesFile, "utf8");
  const matches = content.match(/craftableAffix:\s*"([^"]+)"/g);

  if (matches) {
    console.log("\n📦 Additional affixes from all-affixes.ts:");
    matches.forEach((match) => {
      const affix = match.match(/craftableAffix:\s*"([^"]+)"/)[1];
      if (!allAffixes.has(affix)) {
        allAffixes.add(affix);
        if (!existingTranslations[affix]) {
          missing.push(affix);
        }
      }
    });
  }
}

console.log(`\n📊 Final count:`);
console.log(`  Total affixes: ${allAffixes.size}`);
console.log(`  Found: ${found.length}`);
console.log(`  Missing: ${missing.length}`);

// 保存缺失列表
if (missing.length > 0) {
  fs.writeFileSync(
    path.join(outDir, "missing-affixes.json"),
    JSON.stringify(missing, null, 2),
    "utf-8",
  );
  console.log(`\n✅ Saved missing affixes to missing-affixes.json`);
}
