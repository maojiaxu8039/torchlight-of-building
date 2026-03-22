import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, '../src/data/translated-affixes/unique-base-gear-translations.json');
const outputFile = path.join(__dirname, '../src/data/translated-affixes/base-gear-name-translations.ts');

const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

const fixedData: Record<string, string> = {};
Object.entries(data).forEach(([en, cn]) => {
  const fixedEn = en.replace(/%27/g, "'");
  fixedData[fixedEn] = cn as string;
});

const sortedEntries = Object.entries(fixedData).sort((a, b) => a[0].localeCompare(b[0]));

const tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com CN translations

export const BASE_GEAR_NAME_TRANSLATIONS: Record<string, string> = {
${sortedEntries.map(([en, cn]) => {
    const escapedEn = en.replace(/'/g, "\\'");
    const escapedCn = cn.replace(/'/g, "\\'");
    return `  '${escapedEn}': '${escapedCn}',`;
  }).join('\n')}
};

export const getBaseGearNameTranslation = (enName: string | undefined): string => {
  if (!enName) return enName ?? '';
  return BASE_GEAR_NAME_TRANSLATIONS[enName] ?? enName;
};
`;

fs.writeFileSync(outputFile, tsContent, 'utf-8');
console.log(`Fixed and generated: ${outputFile}`);
console.log(`Total translations: ${sortedEntries.length}`);
