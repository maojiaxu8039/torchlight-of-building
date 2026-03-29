import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CraftAffixTranslation {
  modifierId: string;
  equipmentType: string;
  affixType: string;
  enText: string;
  cnText: string;
}

async function fetchPage(url: string): Promise<string> {
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function extractCraftAffixes(
  html: string,
): Map<string, { text: string; equipmentType: string; affixType: string }> {
  const $ = cheerio.load(html);
  const affixes = new Map<
    string,
    { text: string; equipmentType: string; affixType: string }
  >();

  $("tr").each((_, tr) => {
    const $tr = $(tr);
    const $modifierSpan = $tr.find("[data-modifier-id]");
    const $equipmentTd = $tr.find("td").eq(1);
    const $affixTypeTd = $tr.find("td").eq(2);

    if ($modifierSpan.length > 0) {
      const modifierId = $modifierSpan.attr("data-modifier-id");
      if (modifierId) {
        const text = $modifierSpan
          .clone()
          .find(".Hyperlink")
          .remove()
          .end()
          .text()
          .replace(/\s+/g, " ")
          .trim();

        const equipmentType = $equipmentTd.text().trim();
        const affixType = $affixTypeTd.text().trim();

        if (!affixes.has(modifierId)) {
          affixes.set(modifierId, { text, equipmentType, affixType });
        }
      }
    }
  });

  return affixes;
}

async function scrapeCraftAffixes(): Promise<void> {
  const outputDir = path.join(__dirname, "../src/data/translated-affixes");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Starting to scrape Craft affix translations...\n");

  const [enHtml, cnHtml] = await Promise.all([
    fetchPage("https://tlidb.com/en/Craft"),
    fetchPage("https://tlidb.com/cn/Craft"),
  ]);

  const enAffixes = extractCraftAffixes(enHtml);
  const cnAffixes = extractCraftAffixes(cnHtml);

  console.log(`Found ${enAffixes.size} EN affixes`);
  console.log(`Found ${cnAffixes.size} CN affixes\n`);

  const translations: CraftAffixTranslation[] = [];

  enAffixes.forEach((enData, modifierId) => {
    const cnData = cnAffixes.get(modifierId);
    if (cnData) {
      translations.push({
        modifierId,
        equipmentType: enData.equipmentType,
        affixType: enData.affixType,
        enText: enData.text,
        cnText: cnData.text,
      });
    }
  });

  console.log(`Matched ${translations.length} translations`);

  const outputFile = path.join(outputDir, "craft-affix-translations.json");
  fs.writeFileSync(outputFile, JSON.stringify(translations, null, 2), "utf-8");
  console.log(`\nSaved: ${outputFile}`);

  const uniqueTranslations = new Map<string, { en: string; cn: string }>();
  translations.forEach((trans) => {
    if (!uniqueTranslations.has(trans.enText)) {
      uniqueTranslations.set(trans.enText, {
        en: trans.enText,
        cn: trans.cnText,
      });
    }
  });

  const uniqueOutputFile = path.join(
    outputDir,
    "craft-unique-affix-translations.json",
  );
  fs.writeFileSync(
    uniqueOutputFile,
    JSON.stringify(Object.fromEntries(uniqueTranslations), null, 2),
    "utf-8",
  );
  console.log(
    `Saved unique translations: ${uniqueOutputFile} (${uniqueTranslations.size} unique)`,
  );

  const fixedData: Record<string, string> = {};
  uniqueTranslations.forEach((data, en) => {
    const fixedEn = en.replace(/%27/g, "'");
    fixedData[fixedEn] = data.cn;
  });

  const sortedEntries = Object.entries(fixedData).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  const tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN Craft page translations
// Complete craft affix translations

export const CRAFT_AFFIX_TRANSLATIONS: Record<string, string> = {
${sortedEntries
  .map(([en, cn]) => {
    const escapedEn = en.replace(/'/g, "\\'");
    const escapedCn = cn.replace(/'/g, "\\'");
    return `  '${escapedEn}': '${escapedCn}',`;
  })
  .join("\n")}
};

export const getCraftAffixTranslation = (enText: string): string => {
  return CRAFT_AFFIX_TRANSLATIONS[enText] ?? enText;
};
`;

  const tsOutputFile = path.join(outputDir, "craft-affix-translations.ts");
  fs.writeFileSync(tsOutputFile, tsContent, "utf-8");
  console.log(`Generated TypeScript file: ${tsOutputFile}`);

  console.log("\n=== Sample Translations ===");
  let count = 0;
  sortedEntries.forEach(([en, cn]) => {
    if (count < 15) {
      console.log(
        `  ${en.substring(0, 50).padEnd(50)} → ${cn.substring(0, 50)}`,
      );
      count++;
    }
  });

  console.log("\n=== Summary ===");
  console.log(`Total Craft affixes: ${translations.length}`);
  console.log(`Unique Craft affixes: ${uniqueTranslations.size}`);
  console.log(
    `Affix types: ${Array.from(new Set(translations.map((t) => t.affixType))).join(", ")}`,
  );
}

scrapeCraftAffixes().catch(console.error);
