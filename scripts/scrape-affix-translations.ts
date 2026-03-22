import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EQUIPMENT_TYPES = [
  'Belt',
  'Boots',
  'Helmet',
  'Gloves',
  'Chest',
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
  'Bow',
  'Crossbow',
  'Pistol',
  'Musket',
  'Cane',
  'Shield',
  'Claw',
  'Rod',
  'Scepter',
  'Fire_Cannon',
];

interface AffixTranslation {
  modifierId: string;
  enText: string;
  cnText: string;
}

interface EquipmentAffixTranslations {
  equipmentType: string;
  affixes: AffixTranslation[];
}

async function fetchPage(url: string): Promise<string> {
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function extractAffixes(html: string): Map<string, string> {
  const $ = cheerio.load(html);
  const affixes = new Map<string, string>();

  $('[data-modifier-id]').each((_, elem) => {
    const modifierId = $(elem).attr('data-modifier-id');
    if (modifierId) {
      const text = $(elem).text()
        .replace(/\s+/g, ' ')
        .trim();
      if (!affixes.has(modifierId)) {
        affixes.set(modifierId, text);
      }
    }
  });

  return affixes;
}

async function scrapeEquipmentType(
  equipmentType: string,
  outputDir: string
): Promise<EquipmentAffixTranslations> {
  const enUrl = `https://tlidb.com/en/${equipmentType}`;
  const cnUrl = `https://tlidb.com/cn/${equipmentType}`;

  const [enHtml, cnHtml] = await Promise.all([
    fetchPage(enUrl),
    fetchPage(cnUrl),
  ]);

  const enAffixes = extractAffixes(enHtml);
  const cnAffixes = extractAffixes(cnHtml);

  const affixes: AffixTranslation[] = [];

  enAffixes.forEach((enText, modifierId) => {
    const cnText = cnAffixes.get(modifierId);
    if (cnText) {
      affixes.push({
        modifierId,
        enText,
        cnText,
      });
    }
  });

  const result: EquipmentAffixTranslations = {
    equipmentType,
    affixes,
  };

  const outputFile = path.join(outputDir, `${equipmentType.toLowerCase()}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Saved: ${outputFile} (${affixes.length} affixes)`);

  return result;
}

async function scrapeAllAffixes(): Promise<void> {
  const outputDir = path.join(__dirname, '../src/data/translated-affixes');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting to scrape affix translations...\n');

  const allTranslations: EquipmentAffixTranslations[] = [];

  for (const equipmentType of EQUIPMENT_TYPES) {
    try {
      const result = await scrapeEquipmentType(equipmentType, outputDir);
      allTranslations.push(result);
    } catch (error) {
      console.error(`Error scraping ${equipmentType}:`, error);
    }
  }

  const combinedOutputFile = path.join(outputDir, 'all-affix-translations.json');
  fs.writeFileSync(combinedOutputFile, JSON.stringify(allTranslations, null, 2), 'utf-8');
  console.log(`\nSaved combined file: ${combinedOutputFile}`);

  const uniqueTranslations = new Map<string, { en: string; cn: string }>();
  allTranslations.forEach(equipment => {
    equipment.affixes.forEach(affix => {
      if (!uniqueTranslations.has(affix.modifierId)) {
        uniqueTranslations.set(affix.modifierId, {
          en: affix.enText,
          cn: affix.cnText,
        });
      }
    });
  });

  const uniqueOutputFile = path.join(outputDir, 'unique-translations.json');
  fs.writeFileSync(
    uniqueOutputFile,
    JSON.stringify(Object.fromEntries(uniqueTranslations), null, 2),
    'utf-8'
  );
  console.log(`Saved unique translations: ${uniqueOutputFile} (${uniqueTranslations.size} unique)`);

  console.log('\n=== Summary ===');
  console.log(`Total equipment types: ${allTranslations.length}`);
  console.log(`Total affixes (with duplicates): ${allTranslations.reduce((sum, e) => sum + e.affixes.length, 0)}`);
  console.log(`Unique affixes: ${uniqueTranslations.size}`);
}

scrapeAllAffixes().catch(console.error);
