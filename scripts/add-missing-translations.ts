import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(
  __dirname,
  "../src/data/translated-affixes/core-stat-translations.ts",
);
const outputDir = path.join(__dirname, "../src/data/translated-affixes");

const extraTranslations: Record<string, string> = {
  "damage over time": "持续伤害",
  dot: "持续伤害",
  reaps: "收割",
  reap: "收割",
  "recovery time": "回复时间",
  recovery: "回复",
  inflicting: "施加",
  inflict: "施加",
  inflicted: "施加的",
  "when dealing": "造成",
  "over time": "持续伤害",
  "same target": "同一目标",
  "against the same target": "对同一目标",
  "from nearby enemies": "来自附近敌人",
  "nearby enemies": "附近敌人",
  nearby: "附近",
  full: "满层",
  "after consuming": "消耗后",
  max: "最大",
  "terra charges": "大地充能",
  cooldown: "冷却时间",
  within: "范围内",
  after: "之后",
  consuming: "消耗",
  "1 s": "1 秒",
  "1.5 s": "1.5 秒",
  "2 s": "2 秒",
  "0.5 s": "0.5 秒",
  "0.1 s": "0.1 秒",
  "0.05 s": "0.05 秒",
  "0.04 s": "0.04 秒",
  "0.06 s": "0.06 秒",
  "0.07 s": "0.07 秒",
  "0.08 s": "0.08 秒",
  "0.09 s": "0.09 秒",
  "0.1 s": "0.1 秒",
  "0.12 s": "0.12 秒",
  "0.13 s": "0.13 秒",
  "0.14 s": "0.14 秒",
  "0.16 s": "0.16 秒",
  "0.18 s": "0.18 秒",
  "0.19 s": "0.19 秒",
  "0.2 s": "0.2 秒",
  "0.24 s": "0.24 秒",
  "0.25 s": "0.25 秒",
  "0.3 s": "0.3 秒",
  "0.36 s": "0.36 秒",
  "0.37 s": "0.37 秒",
  "0.48 s": "0.48 秒",
  "0.5 s": "0.5 秒",
  "0.6 s": "0.6 秒",
};

const content = fs.readFileSync(inputFile, "utf-8");

const matches = content.match(
  /export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = \{[\s\S]*?\};/,
);

if (!matches) {
  console.error("Could not find AFFIX_NAME_TRANSLATIONS in file");
  process.exit(1);
}

const existingTranslations: Record<string, string> = {};
const startIndex = content.indexOf(
  "export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {",
);
const endIndex = content.indexOf("};", startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const translationBlock = content.substring(startIndex, endIndex + 2);
  const keyValuePairs = translationBlock.match(/'([^']+)':\s*'([^']+)'/g);

  if (keyValuePairs) {
    keyValuePairs.forEach((pair) => {
      const match = pair.match(/'([^']+)':\s*'([^']+)'/);
      if (match) {
        existingTranslations[match[1]] = match[2];
      }
    });
  }
}

const mergedTranslations = { ...existingTranslations, ...extraTranslations };

const sortedKeys = Object.keys(mergedTranslations).sort((a, b) => {
  return b.length - a.length;
});

const sortedTranslations: Record<string, string> = {};
sortedKeys.forEach((key) => {
  sortedTranslations[key] = mergedTranslations[key];
});

const newTsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN translations
// Core stat name translations for display in Chinese
// Extended with additional translations

export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
${Object.entries(sortedTranslations)
  .map(
    ([en, cn]) =>
      `  '${en.replace(/'/g, "\\'")}': '${cn.replace(/'/g, "\\'")}',`,
  )
  .join("\n")}
};

export const getAffixNameTranslation = (enName: string): string => {
  const lower = enName.toLowerCase();
  return AFFIX_NAME_TRANSLATIONS[lower] ?? enName;
};

export const COMMON_STAT_NAMES = [
${Object.keys(sortedTranslations)
  .slice(0, 30)
  .map((en) => `  '${en.replace(/'/g, "\\'")}',`)
  .join("\n")}
];
`;

fs.writeFileSync(inputFile, newTsContent, "utf-8");

console.log("=== Updated Translations ===");
console.log(
  `Original translations: ${Object.keys(existingTranslations).length}`,
);
console.log(`Added translations: ${Object.keys(extraTranslations).length}`);
console.log(`Total translations: ${Object.keys(sortedTranslations).length}`);
console.log(`\nGenerated: ${inputFile}`);

console.log("\n=== New Translations Added ===");
Object.entries(extraTranslations).forEach(([en, cn]) => {
  console.log(`  ${en.padEnd(30)} → ${cn}`);
});
