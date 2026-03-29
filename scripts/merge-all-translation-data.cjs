const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

console.log("🔄 Merging all translation data...\n");

// 收集所有翻译
const allTranslations = {};

// 1. 从 craft-affix-translations.json 提取（数组格式）
const craftFile = path.join(outDir, "craft-affix-translations.json");
if (fs.existsSync(craftFile)) {
  const data = JSON.parse(fs.readFileSync(craftFile, "utf8"));
  let count = 0;
  data.forEach((item) => {
    if (item.enText && item.cnText) {
      allTranslations[item.enText] = item.cnText;
      count++;
    }
  });
  console.log(`✅ craft-affix-translations.json: ${count} translations`);
}

// 2. 从其他 JSON 文件提取（对象格式）
const files = fs
  .readdirSync(outDir)
  .filter(
    (f) =>
      f.endsWith("-translations.json") &&
      !f.startsWith("complete-") &&
      !f.startsWith("all-") &&
      f !== "craft-affix-translations.json",
  );

files.forEach((file) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(outDir, file), "utf8"));
    let count = 0;

    // 检查是数组格式还是对象格式
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item.enText && item.cnText) {
          if (!allTranslations[item.enText]) {
            allTranslations[item.enText] = item.cnText;
            count++;
          }
        }
      });
    } else {
      Object.entries(data).forEach(([en, cn]) => {
        if (typeof cn === "string" && cn.length > 0) {
          if (!allTranslations[en]) {
            allTranslations[en] = cn;
            count++;
          }
        }
      });
    }

    if (count > 0) {
      console.log(`✅ ${file}: ${count} translations`);
    }
  } catch (e) {
    // ignore
  }
});

console.log(
  `\n📊 Total unique translations: ${Object.keys(allTranslations).length}\n`,
);

// 保存合并结果
fs.writeFileSync(
  path.join(outDir, "merged-all-translations.json"),
  JSON.stringify(allTranslations, null, 2),
  "utf-8",
);

console.log("✅ Saved to merged-all-translations.json");

// 显示样本
console.log("\nSample translations:");
let count = 0;
Object.entries(allTranslations)
  .slice(0, 20)
  .forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 50).padEnd(50)} → ${cn.substring(0, 30)}`);
    count++;
  });
