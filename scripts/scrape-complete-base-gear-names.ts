import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EQUIPMENT_TYPES = [
  'Belt',
  'Boots',
  'Boots_(DEX)',
  'Boots_(INT)',
  'Boots_(STR)',
  'Chest',
  'Chest_Armor_(DEX)',
  'Chest_Armor_(INT)',
  'Chest_Armor_(STR)',
  'Gloves',
  'Gloves_(DEX)',
  'Gloves_(INT)',
  'Gloves_(STR)',
  'Helmet',
  'Helmet_(DEX)',
  'Helmet_(INT)',
  'Helmet_(STR)',
  'Necklace',
  'Ring',
  'One-Handed_Sword',
  'Two-Handed_Sword',
  'One-Handed_Axe',
  'Two-Handed_Axe',
  'One-Handed_Hammer',
  'Two-Handed_Hammer',
  'Dagger',
  'Wand',
  'Staff',
  'Tin_Staff',
  'Bow',
  'Crossbow',
  'Pistol',
  'Musket',
  'Cane',
  'Shield',
  'Shield_(DEX)',
  'Shield_(INT)',
  'Shield_(STR)',
  'Claw',
  'Rod',
  'Scepter',
  'Fire_Cannon',
  'Spirit_Ring',
];

interface BaseGearTranslation {
  enName: string;
  cnName: string;
}

interface EquipmentBaseGearTranslations {
  equipmentType: string;
  baseGears: BaseGearTranslation[];
}

async function fetchPage(url: string): Promise<string> {
  console.log(`Fetching: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`  ⚠️  Page not found: ${response.status}`);
      return '';
    }
    return response.text();
  } catch (error) {
    console.log(`  ❌ Error: ${error}`);
    return '';
  }
}

function extractBaseGearNames(html: string, equipmentType: string): BaseGearTranslation[] {
  if (!html) return [];

  const $ = cheerio.load(html);
  const translations: BaseGearTranslation[] = [];

  $('a[data-hover]').each((_, elem) => {
    const $elem = $(elem);
    const href = $elem.attr('href');
    const text = $elem.text().trim();

    if (href && text && href !== '#' && href.length > 1) {
      const enName = href.replace(/_/g, ' ');
      if (enName && text !== enName) {
        translations.push({
          enName,
          cnName: text,
        });
      }
    }
  });

  return translations;
}

async function scrapeAllBaseGearNames(): Promise<void> {
  const outputDir = path.join(__dirname, '../src/data/translated-affixes');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting to scrape ALL base gear name translations...\n');
  console.log(`Total equipment types to scrape: ${EQUIPMENT_TYPES.length}\n`);

  const allTranslations: EquipmentBaseGearTranslations[] = [];
  let totalBaseGears = 0;

  for (const equipmentType of EQUIPMENT_TYPES) {
    try {
      const cnUrl = `https://tlidb.com/cn/${equipmentType}`;
      const cnHtml = await fetchPage(cnUrl);

      const baseGears = extractBaseGearNames(cnHtml, equipmentType);

      if (baseGears.length > 0) {
        const result: EquipmentBaseGearTranslations = {
          equipmentType,
          baseGears,
        };

        const outputFile = path.join(outputDir, `complete-${equipmentType.toLowerCase().replace(/[()]/g, '')}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
        console.log(`  ✅ Saved: ${baseGears.length} base gears`);

        allTranslations.push(result);
        totalBaseGears += baseGears.length;
      } else {
        console.log(`  ⚠️  No data found`);
      }
    } catch (error) {
      console.log(`  ❌ Error scraping ${equipmentType}: ${error}`);
    }
  }

  const combinedOutputFile = path.join(outputDir, 'complete-all-base-gear-translations.json');
  fs.writeFileSync(combinedOutputFile, JSON.stringify(allTranslations, null, 2), 'utf-8');
  console.log(`\nSaved combined file: ${combinedOutputFile}`);

  const uniqueTranslations = new Map<string, string>();
  allTranslations.forEach(equipment => {
    equipment.baseGears.forEach(baseGear => {
      if (!uniqueTranslations.has(baseGear.enName)) {
        uniqueTranslations.set(baseGear.enName, baseGear.cnName);
      }
    });
  });

  const uniqueOutputFile = path.join(outputDir, 'complete-unique-base-gear-translations.json');
  fs.writeFileSync(
    uniqueOutputFile,
    JSON.stringify(Object.fromEntries(uniqueTranslations), null, 2),
    'utf-8'
  );

  const fixedData: Record<string, string> = {};
  Object.entries(Object.fromEntries(uniqueTranslations)).forEach(([en, cn]) => {
    const fixedEn = en.replace(/%27/g, "'");
    fixedData[fixedEn] = cn;
  });

  const sortedEntries = Object.entries(fixedData).sort((a, b) => a[0].localeCompare(b[0]));

  const tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com CN translations
// Complete base gear name translations

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

  const tsOutputFile = path.join(outputDir, 'complete-base-gear-name-translations.ts');
  fs.writeFileSync(tsOutputFile, tsContent, 'utf-8');
  console.log(`Generated TypeScript file: ${tsOutputFile}`);

  console.log('\n=================================================');
  console.log('                  SCRAPING SUMMARY');
  console.log('=================================================');
  console.log(`Total equipment types scraped: ${allTranslations.length}`);
  console.log(`Total base gears: ${totalBaseGears}`);
  console.log(`Unique base gears: ${uniqueTranslations.size}`);
  console.log('=================================================\n');

  console.log('=== Sample Translations ===');
  let count = 0;
  uniqueTranslations.forEach((cn, en) => {
    if (count < 20 && en.toLowerCase().includes('boots')) {
      console.log(`  ${en} → ${cn}`);
      count++;
    }
  });

  const bootsCalamity = uniqueTranslations.get('Boots of Calamity');
  if (bootsCalamity) {
    console.log(`\n✅ Boots of Calamity found: ${bootsCalamity}`);
  } else {
    console.log(`\n⚠️  Boots of Calamity NOT found in data`);
  }
}

scrapeAllBaseGearNames().catch(console.error);
