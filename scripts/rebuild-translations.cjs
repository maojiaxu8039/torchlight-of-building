const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");
const tsFile = path.join(outDir, "complete-affix-translations.ts");

// 加载所有翻译文件
const allTranslations = {};
const files = fs
  .readdirSync(outDir)
  .filter(
    (f) =>
      f.endsWith("-translations.json") &&
      !f.startsWith("complete-") &&
      !f.startsWith("all-"),
  );

files.forEach((file) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(outDir, file), "utf8"));
    Object.entries(data).forEach(([en, cn]) => {
      if (typeof cn === "string" && cn.length > 0) {
        allTranslations[en] = cn;
      }
    });
  } catch (e) {
    // 忽略错误
  }
});

console.log(
  `✅ Total valid translations: ${Object.keys(allTranslations).length}`,
);

// 生成完整的 TS 文件内容
let tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN translations
// Complete affix translations (all pages)

export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
`;

Object.entries(allTranslations).forEach(([en, cn]) => {
  const escapedEn = en.replace(/'/g, "\\'");
  const escapedCn = cn.replace(/'/g, "\\'");
  tsContent += `  '${escapedEn}': '${escapedCn}',\n`;
});

tsContent += `};

export const getAffixNameTranslation = (enName: string): string => {
  const lower = enName.toLowerCase();
  return AFFIX_NAME_TRANSLATIONS[lower] ?? enName;
};

export const COMMON_STAT_NAMES = [
${Object.keys(allTranslations)
  .slice(0, 30)
  .map((en) => `  '${en.replace(/'/g, "\\'")}',`)
  .join("\n")}
];
`;

// 写入文件
fs.writeFileSync(tsFile, tsContent, "utf-8");

console.log(`✅ Rebuilt complete-affix-translations.ts`);
