import { writeFileSync } from "node:fs";
import { join } from "node:path";

const EQUIPMENT_TYPES = [
  "Belt",
  "DEX_Boots",
  "INT_Boots",
  "STR_Boots",
  "Bow",
  "Cane",
  "DEX_Chest_Armor",
  "INT_Chest_Armor",
  "STR_Chest_Armor",
  "Claw",
  "Crossbow",
  "Cudgel",
  "Dagger",
  "Fire_Cannon",
  "DEX_Gloves",
  "INT_Gloves",
  "STR_Gloves",
  "DEX_Helmet",
  "INT_Helmet",
  "STR_Helmet",
  "Musket",
  "Necklace",
  "One-Handed_Axe",
  "One-Handed_Hammer",
  "One-Handed_Sword",
  "Pistol",
  "Ring",
  "Rod",
  "Scepter",
  "DEX_Shield",
  "INT_Shield",
  "STR_Shield",
  "Spirit_Ring",
  "Tin_Staff",
  "Two-Handed_Axe",
  "Two-Handed_Hammer",
  "Two-Handed_Sword",
  "Wand",
];

interface ModifierData {
  [modifierId: string]: { tier: string; text: string };
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function parseModifiers(html: string): ModifierData {
  const modifiers: ModifierData = {};

  const regex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>([^<]*)/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const modifierId = match[1];
    const textMod = match[2];
    const suffix = match[3];

    let valueText = textMod.replace(/<[^>]+>/g, "");
    valueText = valueText.replace(/&ndash;/g, "-");
    valueText = valueText.replace(/&amp;/g, "&");

    let fullText = valueText + suffix;
    fullText = fullText.replace(/\s+/g, " ").trim();
    fullText = fullText.replace(/&nbsp;/g, " ");
    fullText = fullText.replace(/\u2013/g, "-");
    fullText = fullText.replace(/\u2014/g, "-");

    const beforeMatch = html.substring(
      Math.max(0, match.index - 500),
      match.index,
    );
    const tierMatch = beforeMatch.match(/data-tier="(\d+)"/);
    const tier = tierMatch ? tierMatch[1] : "0";

    if (fullText) {
      modifiers[modifierId] = { tier, text: fullText };
    }
  }

  return modifiers;
}

async function scrapeEquipmentType(
  type: string,
): Promise<{
  type: string;
  enCount: number;
  cnCount: number;
  matched: number;
  enModifiers: ModifierData;
  cnModifiers: ModifierData;
}> {
  const enUrl = `https://tlidb.com/en/${type}`;
  const cnUrl = `https://tlidb.com/cn/${type}`;

  const [enHtml, cnHtml] = await Promise.all([
    fetchPage(enUrl).catch((e) => {
      console.log(`  ⚠️  EN error: ${e.message}`);
      return "";
    }),
    fetchPage(cnUrl).catch((e) => {
      console.log(`  ⚠️  CN error: ${e.message}`);
      return "";
    }),
  ]);

  const enModifiers = parseModifiers(enHtml);
  const cnModifiers = parseModifiers(cnHtml);

  let matched = 0;
  Object.keys(enModifiers).forEach((id) => {
    if (cnModifiers[id]) {
      matched++;
    }
  });

  console.log(
    `📦 ${type}: EN ${Object.keys(enModifiers).length}, CN ${Object.keys(cnModifiers).length}, Matched ${matched}`,
  );

  return {
    type,
    enCount: Object.keys(enModifiers).length,
    cnCount: Object.keys(cnModifiers).length,
    matched,
    enModifiers,
    cnModifiers,
  };
}

async function main() {
  console.log("🚀 Starting affix translation scrape with Tier\n");
  console.log("=".repeat(60));

  const translationsByTier: Record<string, Record<string, string>> = {};
  const translationsByText: Record<string, string> = {};
  const incompleteByTier: { type: string; tier: string; en: string }[] = [];
  const enOnly: { type: string; id: string; tier: string; text: string }[] = [];
  const cnOnly: { type: string; id: string; tier: string; text: string }[] = [];

  let totalEn = 0;
  let totalCn = 0;
  let totalMatched = 0;

  for (const type of EQUIPMENT_TYPES) {
    try {
      const result = await scrapeEquipmentType(type);
      totalEn += result.enCount;
      totalCn += result.cnCount;
      totalMatched += result.matched;

      Object.entries(result.enModifiers).forEach(([id, enData]) => {
        if (result.cnModifiers[id]) {
          const cnData = result.cnModifiers[id];

          const tierKey = `${type}|${enData.tier}|${enData.text}`;
          translationsByTier[tierKey] = cnData.text;

          if (!translationsByText[enData.text]) {
            translationsByText[enData.text] = cnData.text;
          }
        } else {
          enOnly.push({ type, id, tier: enData.tier, text: enData.text });
          incompleteByTier.push({ type, tier: enData.tier, en: enData.text });
        }
      });

      Object.entries(result.cnModifiers).forEach(([id, cnData]) => {
        if (!result.enModifiers[id]) {
          cnOnly.push({ type, id, tier: cnData.tier, text: cnData.text });
        }
      });
    } catch (error) {
      console.error(`Error processing ${type}:`, error);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Summary:");
  console.log(`   Total EN modifiers: ${totalEn}`);
  console.log(`   Total CN modifiers: ${totalCn}`);
  console.log(`   Matched: ${totalMatched}`);
  console.log(
    `   Unique translations (by text): ${Object.keys(translationsByText).length}`,
  );
  console.log(
    `   Unique translations (by tier+text): ${Object.keys(translationsByTier).length}`,
  );
  console.log(`   Incomplete (EN only): ${enOnly.length}`);

  const scriptsDir = join(process.cwd(), "scripts");

  const translationsByTextFile = join(
    scriptsDir,
    "scraped-translations-by-text.json",
  );
  writeFileSync(
    translationsByTextFile,
    JSON.stringify(translationsByText, null, 2),
    "utf-8",
  );
  console.log(`\n✅ Saved translations by text to ${translationsByTextFile}`);

  const translationsByTierFile = join(
    scriptsDir,
    "scraped-translations-by-tier.json",
  );
  writeFileSync(
    translationsByTierFile,
    JSON.stringify(translationsByTier, null, 2),
    "utf-8",
  );
  console.log(`✅ Saved translations by tier to ${translationsByTierFile}`);

  const incompleteFile = join(scriptsDir, "incomplete-by-tier.json");
  writeFileSync(
    incompleteFile,
    JSON.stringify(incompleteByTier, null, 2),
    "utf-8",
  );
  console.log(`✅ Saved incomplete to ${incompleteFile}`);

  const enOnlyFile = join(scriptsDir, "en-only-with-tier.json");
  writeFileSync(enOnlyFile, JSON.stringify(enOnly, null, 2), "utf-8");
  console.log(`✅ Saved EN-only to ${enOnlyFile}`);

  const cnOnlyFile = join(scriptsDir, "cn-only-with-tier.json");
  writeFileSync(cnOnlyFile, JSON.stringify(cnOnly, null, 2), "utf-8");
  console.log(`✅ Saved CN-only to ${cnOnlyFile}`);

  if (enOnly.length > 0) {
    console.log("\n" + "=".repeat(60));
    console.log("\n⚠️  Sample EN-only modifiers (first 20):");
    enOnly.slice(0, 20).forEach((item) => {
      console.log(`   [${item.type}] Tier ${item.tier}: ${item.text}`);
    });
  }

  console.log("\n✅ Scrape complete!");
}

main().catch(console.error);
