import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TranslationEntry {
  en: string;
  cn: string;
}

interface UniqueTranslations {
  [modifierId: string]: TranslationEntry;
}

const INPUT_FILE = path.join(__dirname, '../src/data/translated-affixes/unique-translations.json');
const OUTPUT_DIR = path.join(__dirname, '../src/data/translated-affixes');

const COMMON_PATTERNS = [
  /^[+-]?\d+(\.\d+)?%?\s*/,
  /^\(\d+(\.\d+)?–\d+(\.\d+)?\)\s*/,
  /^\d+(\.\d+)?–\d+(\.\d+)?\s*/,
  /^\+\(\d+(\.\d+)?–\d+(\.\d+)?\)\s*/,
  /^\+\d+(\.\d+)?\s*/,
  /^\(\+\d+(\.\d+)?–\+\d+(\.\d+)?\)\s*/,
];

function extractAffixName(enText: string, cnText: string): { en: string; cn: string } | null {
  let enName = enText.trim();
  let cnName = cnText.trim();

  for (const pattern of COMMON_PATTERNS) {
    enName = enName.replace(pattern, '');
    cnName = cnName.replace(pattern, '');
  }

  enName = enName.replace(/\s+/g, ' ').trim();
  cnName = cnName.replace(/\s+/g, ' ').trim();

  if (enName === cnName || enName.length === 0 || cnName.length === 0) {
    return null;
  }

  return { en: enName, cn: cnName };
}

function extractAllAffixNames(): Map<string, string> {
  const inputData: UniqueTranslations = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));

  const affixNameTranslations = new Map<string, string>();

  Object.entries(inputData).forEach(([modifierId, translation]) => {
    const result = extractAffixName(translation.en, translation.cn);
    if (result) {
      const key = result.en.toLowerCase();
      if (!affixNameTranslations.has(key)) {
        affixNameTranslations.set(key, result.cn);
      }
    }
  });

  return affixNameTranslations;
}

function generateTypeScriptFile(affixNames: Map<string, string>): void {
  const sortedEntries = Array.from(affixNames.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  const tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN translations

export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
${sortedEntries.map(([en, cn]) => `  '${en.replace(/'/g, "\\'")}': '${cn.replace(/'/g, "\\'")}',`).join('\n')}
};

export const getAffixNameTranslation = (enName: string): string => {
  const lower = enName.toLowerCase();
  return AFFIX_NAME_TRANSLATIONS[lower] ?? enName;
};
`;

  const outputFile = path.join(OUTPUT_DIR, 'affix-name-translations.ts');
  fs.writeFileSync(outputFile, tsContent, 'utf-8');
  console.log(`Generated TypeScript file: ${outputFile}`);
  console.log(`Total unique affix name translations: ${sortedEntries.length}`);
}

function generateStatWordTranslations(): void {
  const affixNames = extractAllAffixNames();

  const statWords: Array<{ en: string; cn: string }> = [];

  affixNames.forEach((cn, en) => {
    if (en.includes('max ') || en.includes('additional ') || en.includes('%')) {
      return;
    }

    statWords.push({ en, cn });
  });

  const sortedStatWords = statWords.sort((a, b) => a.en.localeCompare(b.en));

  const outputFile = path.join(OUTPUT_DIR, 'stat-word-translations.ts');
  fs.writeFileSync(
    outputFile,
    `// Auto-generated file - Do not edit manually
// Stat word translations for mod-parser enums

export const STAT_WORD_TRANSLATIONS: Array<{ en: string; cn: string }> = ${JSON.stringify(sortedStatWords, null, 2)};
`,
    'utf-8'
  );
  console.log(`Generated stat word translations: ${outputFile} (${sortedStatWords.length} entries)`);
}

console.log('Extracting affix name translations...\n');

const affixNames = extractAllAffixNames();
console.log(`Found ${affixNames.size} unique affix name translations`);

generateTypeScriptFile(affixNames);
generateStatWordTranslations();

console.log('\n=== Sample Translations ===');
let count = 0;
affixNames.forEach((cn, en) => {
  if (count < 20) {
    console.log(`  ${en} → ${cn}`);
    count++;
  }
});
