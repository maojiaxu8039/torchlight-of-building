import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "../src/data/translated-affixes");

const oldData = JSON.parse(
  fs.readFileSync(
    path.join(outputDir, "unique-base-gear-translations.json"),
    "utf-8",
  ),
);

const newData = JSON.parse(
  fs.readFileSync(
    path.join(outputDir, "correct-unique-base-gear-translations.json"),
    "utf-8",
  ),
);

const merged: Record<string, string> = { ...oldData, ...newData };

Object.entries(newData).forEach(([en, cn]) => {
  merged[en] = cn;
});

const fixedMerged: Record<string, string> = {};
Object.entries(merged).forEach(([en, cn]) => {
  const fixedEn = en.replace(/%27/g, "'");
  fixedMerged[fixedEn] = cn;
});

const sortedEntries = Object.entries(fixedMerged).sort((a, b) =>
  a[0].localeCompare(b[0]),
);

const tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com CN translations
// Merged base gear name translations (all equipment types)

export const BASE_GEAR_NAME_TRANSLATIONS: Record<string, string> = {
${sortedEntries
  .map(([en, cn]) => {
    const escapedEn = en.replace(/'/g, "\\'");
    const escapedCn = cn.replace(/'/g, "\\'");
    return `  '${escapedEn}': '${escapedCn}',`;
  })
  .join("\n")}
};

export const getBaseGearNameTranslation = (enName: string | undefined): string => {
  if (!enName) return enName ?? '';
  return BASE_GEAR_NAME_TRANSLATIONS[enName] ?? enName;
};
`;

const outputFile = path.join(outputDir, "base-gear-name-translations.ts");
fs.writeFileSync(outputFile, tsContent, "utf-8");

console.log("=== Merged Translation Summary ===");
console.log(`Old translations: ${Object.keys(oldData).length}`);
console.log(`New translations: ${Object.keys(newData).length}`);
console.log(`Merged translations: ${Object.keys(fixedMerged).length}`);

const bootsCalamity = fixedMerged["Boots of Calamity"];
if (bootsCalamity) {
  console.log(`\n✅ Boots of Calamity → ${bootsCalamity}`);
} else {
  console.log(`\n⚠️  Boots of Calamity NOT found`);
}

const elderSage = fixedMerged["Elder Sage Girdle"];
if (elderSage) {
  console.log(`✅ Elder Sage Girdle → ${elderSage}`);
} else {
  console.log(`⚠️  Elder Sage Girdle NOT found`);
}

console.log(`\nGenerated: ${outputFile}`);
