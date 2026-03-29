import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EQUIPMENT_TYPES = [
  "Belt",
  "Boots",
  "Helmet",
  "Gloves",
  "Chest",
  "Necklace",
  "Ring",
  "One-Handed_Sword",
  "Two-Handed_Sword",
  "One-Handed_Axe",
  "Two-Handed_Axe",
  "One-Handed_Hammer",
  "Two-Handed_Hammer",
  "Dagger",
  "Wand",
  "Staff",
  "Bow",
  "Crossbow",
  "Pistol",
  "Musket",
  "Cane",
  "Shield",
  "Claw",
  "Rod",
  "Scepter",
  "Fire_Cannon",
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
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function extractBaseGearNames(
  html: string,
  equipmentType: string,
): BaseGearTranslation[] {
  const $ = cheerio.load(html);
  const translations: BaseGearTranslation[] = [];

  $("a[data-hover]").each((_, elem) => {
    const $elem = $(elem);
    const href = $elem.attr("href");
    const text = $elem.text().trim();

    if (href && text && href !== "#") {
      const enName = href.replace(/_/g, " ");
      if (enName && text !== enName) {
        translations.push({ enName, cnName: text });
      }
    }
  });

  return translations;
}

async function scrapeAllBaseGearNames(): Promise<void> {
  const outputDir = path.join(__dirname, "../src/data/translated-affixes");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Starting to scrape base gear name translations...\n");

  const allTranslations: EquipmentBaseGearTranslations[] = [];

  for (const equipmentType of EQUIPMENT_TYPES) {
    try {
      const cnUrl = `https://tlidb.com/cn/${equipmentType}`;
      const cnHtml = await fetchPage(cnUrl);

      const baseGears = extractBaseGearNames(cnHtml, equipmentType);

      const result: EquipmentBaseGearTranslations = {
        equipmentType,
        baseGears,
      };

      const outputFile = path.join(
        outputDir,
        `base-gear-${equipmentType.toLowerCase()}.json`,
      );
      fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), "utf-8");
      console.log(`Saved: ${outputFile} (${baseGears.length} base gears)`);

      allTranslations.push(result);
    } catch (error) {
      console.error(`Error scraping ${equipmentType}:`, error);
    }
  }

  const combinedOutputFile = path.join(
    outputDir,
    "all-base-gear-translations.json",
  );
  fs.writeFileSync(
    combinedOutputFile,
    JSON.stringify(allTranslations, null, 2),
    "utf-8",
  );
  console.log(`\nSaved combined file: ${combinedOutputFile}`);

  const uniqueTranslations = new Map<string, string>();
  allTranslations.forEach((equipment) => {
    equipment.baseGears.forEach((baseGear) => {
      if (!uniqueTranslations.has(baseGear.enName)) {
        uniqueTranslations.set(baseGear.enName, baseGear.cnName);
      }
    });
  });

  const uniqueOutputFile = path.join(
    outputDir,
    "unique-base-gear-translations.json",
  );
  fs.writeFileSync(
    uniqueOutputFile,
    JSON.stringify(Object.fromEntries(uniqueTranslations), null, 2),
    "utf-8",
  );
  console.log(
    `Saved unique translations: ${uniqueOutputFile} (${uniqueTranslations.size} unique)`,
  );

  const tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com CN translations

export const BASE_GEAR_NAME_TRANSLATIONS: Record<string, string> = {
${Array.from(uniqueTranslations.entries())
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(
    ([en, cn]) =>
      `  '${en.replace(/'/g, "\\'")}': '${cn.replace(/'/g, "\\'")}',`,
  )
  .join("\n")}
};

export const getBaseGearNameTranslation = (enName: string): string => {
  return BASE_GEAR_NAME_TRANSLATIONS[enName] ?? enName;
};
`;

  const tsOutputFile = path.join(outputDir, "base-gear-name-translations.ts");
  fs.writeFileSync(tsOutputFile, tsContent, "utf-8");
  console.log(`Generated TypeScript file: ${tsOutputFile}`);

  console.log("\n=== Summary ===");
  console.log(`Total equipment types: ${allTranslations.length}`);
  console.log(
    `Total base gears: ${allTranslations.reduce((sum, e) => sum + e.baseGears.length, 0)}`,
  );
  console.log(`Unique base gears: ${uniqueTranslations.size}`);

  console.log("\n=== Sample Translations ===");
  let count = 0;
  uniqueTranslations.forEach((cn, en) => {
    if (count < 10) {
      console.log(`  ${en} → ${cn}`);
      count++;
    }
  });
}

scrapeAllBaseGearNames().catch(console.error);
