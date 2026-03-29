import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "../src/data/translated-affixes");

const craftData = JSON.parse(
  fs.readFileSync(
    path.join(outputDir, "craft-unique-affix-translations.json"),
    "utf-8",
  ),
);

const existingCoreData = JSON.parse(
  fs.readFileSync(path.join(outputDir, "unique-translations.json"), "utf-8"),
);

const merged: Record<string, string> = {};

Object.entries(existingCoreData).forEach(([modifierId, translation]) => {
  const t = translation as { en: string; cn: string };
  merged[t.en] = t.cn;
});

Object.entries(craftData).forEach(([en, data]) => {
  const cn = (data as { cn: string }).cn;
  merged[en] = cn;
});

const sortedKeys = Object.keys(merged).sort((a, b) => {
  if (a === b) return 0;
  if (a.includes(b)) return -1;
  if (b.includes(a)) return 1;
  return b.length - a.length;
});

const sortedTranslations: Record<string, string> = {};
sortedKeys.forEach((key) => {
  sortedTranslations[key] = merged[key];
});

const tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN translations
// Complete affix translations (Core + Craft)

export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
${Object.entries(sortedTranslations)
  .map(([en, cn]) => {
    const escapedEn = en.replace(/'/g, "\\'");
    const escapedCn = cn.replace(/'/g, "\\'");
    return `  '${escapedEn}': '${escapedCn}',`;
  })
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
};
`;

const outputFile = path.join(outputDir, "complete-affix-translations.ts");
fs.writeFileSync(outputFile, tsContent, "utf-8");

console.log("=== Merged Translation Summary ===");
console.log(`Core translations: ${Object.keys(existingCoreData).length}`);
console.log(`Craft translations: ${Object.keys(craftData).length}`);
console.log(`Merged translations: ${Object.keys(sortedTranslations).length}`);
console.log(`\nGenerated: ${outputFile}`);

console.log("\n=== Sample Complex Translations ===");
const complexSamples = [
  "Reaps 0.16 s of Damage Over Time when inflicting Trauma",
  "Damage Penetrates (5–8)% Elemental Resistance",
  "Adds (36–38) - (44–46) Physical Damage to the gear",
  "+1 to Max Agility Blessing Stacks",
  "+1 to Max Focus Blessing Stacks",
];

complexSamples.forEach((sample) => {
  const translated = sortedTranslations[sample];
  if (translated) {
    console.log(`\n✅ ${sample.substring(0, 60)}`);
    console.log(`   → ${translated}`);
  } else {
    console.log(`\n⚠️  ${sample.substring(0, 60)}`);
    console.log(`   → (未找到完整匹配)`);
  }
});
