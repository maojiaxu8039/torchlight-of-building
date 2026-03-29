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

interface ParsedAffix {
  equipmentSlot: string;
  equipmentType: string;
  affixType: string;
  craftingPool: string;
  tier: string;
  craftableAffix: string;
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function parseModifiers(html: string, lang: "en" | "cn"): Map<string, ParsedAffix> {
  const modifiers = new Map<string, ParsedAffix>();

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

    if (!fullText) continue;

    const beforeMatch = html.substring(Math.max(0, match.index - 500), match.index);
    const tierMatch = beforeMatch.match(/data-tier="(\d+)"/);
    const tier = tierMatch ? tierMatch[1] : "0";

    const rowMatch = beforeMatch.match(/data-section="([^"]+)"/);
    const section = rowMatch ? rowMatch[1] : "";

    let equipmentType = "";
    let equipmentSlot = "";
    let affixType = "";
    let craftingPool = "";

    if (section.includes("Base Affix") || section.includes("Corrosion")) {
      equipmentType = extractEquipmentType(html);
      equipmentSlot = getEquipmentSlot(equipmentType);
      affixType = section.includes("Corrosion") ? "Corrosion" : "Base Affix";
      craftingPool = "";
    } else if (section.includes("Prefix")) {
      equipmentType = extractEquipmentType(html);
      equipmentSlot = getEquipmentSlot(equipmentType);
      affixType = "Prefix";
      craftingPool = extractCraftingPool(section);
    } else if (section.includes("Suffix")) {
      equipmentType = extractEquipmentType(html);
      equipmentSlot = getEquipmentSlot(equipmentType);
      affixType = "Suffix";
      craftingPool = extractCraftingPool(section);
    } else if (section.includes("Sweet Dream")) {
      equipmentType = extractEquipmentType(html);
      equipmentSlot = getEquipmentSlot(equipmentType);
      affixType = "Sweet Dream";
      craftingPool = "";
    } else if (section.includes("Tower Sequence")) {
      equipmentType = extractEquipmentType(html);
      equipmentSlot = getEquipmentSlot(equipmentType);
      affixType = "Tower Sequence";
      craftingPool = "";
    } else {
      equipmentType = extractEquipmentType(html);
      equipmentSlot = getEquipmentSlot(equipmentType);
      affixType = section || "Unknown";
      craftingPool = "";
    }

    modifiers.set(modifierId, {
      equipmentSlot,
      equipmentType,
      affixType,
      craftingPool,
      tier,
      craftableAffix: fullText,
    });
  }

  return modifiers;
}

function extractEquipmentType(html: string): string {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1];
    const typeMatch = title.match(/([A-Za-z_]+)(?:_|-)(?:Boots|Gloves|Helmet|Chest|Armor|Shield|Bow|Crossbow|Musket|Pistol|Wand|Rod|Scepter|Dagger|Axe|Hammer|Sword|Cudgel|Claw|Cane|Staff|Cannon|Ring|Necklace|Belt)/);
    if (typeMatch) {
      return typeMatch[0].replace(/_/g, " ").replace(/-/g, " ");
    }
    if (title.includes("Belt")) return "Belt";
    if (title.includes("Boots")) return "Boots";
    if (title.includes("Chest")) return "Chest Armor";
    if (title.includes("Gloves")) return "Gloves";
    if (title.includes("Helmet")) return "Helmet";
    if (title.includes("Shield")) return "Shield";
    if (title.includes("Bow")) return "Bow";
    if (title.includes("Crossbow")) return "Crossbow";
    if (title.includes("Musket")) return "Musket";
    if (title.includes("Pistol")) return "Pistol";
    if (title.includes("Wand")) return "Wand";
    if (title.includes("Rod")) return "Rod";
    if (title.includes("Scepter")) return "Scepter";
    if (title.includes("Dagger")) return "Dagger";
    if (title.includes("Cudgel")) return "Cudgel";
    if (title.includes("Claw")) return "Claw";
    if (title.includes("Cane")) return "Cane";
    if (title.includes("Staff")) return "Tin Staff";
    if (title.includes("Cannon")) return "Fire Cannon";
    if (title.includes("Ring")) return "Ring";
    if (title.includes("Necklace")) return "Necklace";
  }
  return "Unknown";
}

function getEquipmentSlot(equipmentType: string): string {
  if (["Belt", "Ring", "Necklace", "Spirit Ring"].includes(equipmentType)) {
    return "Trinket";
  }
  if (equipmentType.includes("Boots")) return "Boots";
  if (equipmentType.includes("Gloves")) return "Gloves";
  if (equipmentType.includes("Helmet")) return "Helmet";
  if (equipmentType.includes("Chest") || equipmentType.includes("Armor")) return "Body";
  if (equipmentType.includes("Shield")) return "Off Hand";
  if (equipmentType.includes("Bow") || equipmentType.includes("Crossbow") || equipmentType.includes("Musket") || equipmentType.includes("Pistol") || equipmentType.includes("Wand") || equipmentType.includes("Rod") || equipmentType.includes("Scepter") || equipmentType.includes("Dagger") || equipmentType.includes("Cudgel") || equipmentType.includes("Claw") || equipmentType.includes("Cane") || equipmentType.includes("Staff") || equipmentType.includes("Cannon")) {
    return "Main Hand";
  }
  return "Unknown";
}

function extractCraftingPool(section: string): string {
  if (section.includes("Advanced")) return "Advanced";
  if (section.includes("Intermediate")) return "Intermediate";
  if (section.includes("Basic")) return "Basic";
  if (section.includes("Basic")) return "Basic";
  return "";
}

async function scrapeEquipmentType(type: string): Promise<{
  type: string;
  matched: number;
  enModifiers: Map<string, ParsedAffix>;
  cnModifiers: Map<string, ParsedAffix>;
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

  const enModifiers = parseModifiers(enHtml, "en");
  const cnModifiers = parseModifiers(cnHtml, "cn");

  let matched = 0;
  enModifiers.forEach((_, id) => {
    if (cnModifiers.has(id)) {
      matched++;
    }
  });

  console.log(`📦 ${type}: EN ${enModifiers.size}, CN ${cnModifiers.size}, Matched ${matched}`);

  return {
    type,
    matched,
    enModifiers,
    cnModifiers,
  };
}

async function main() {
  console.log("🚀 Starting full object translation scrape\n");
  console.log("=".repeat(60));

  const translations: Record<string, ParsedAffix> = {};
  const enOnly: { type: string; id: string; affix: ParsedAffix }[] = [];
  const cnOnly: { type: string; id: string; affix: ParsedAffix }[] = [];

  let totalMatched = 0;

  for (const type of EQUIPMENT_TYPES) {
    try {
      const result = await scrapeEquipmentType(type);

      result.enModifiers.forEach((enAffix, id) => {
        if (result.cnModifiers.has(id)) {
          const cnAffix = result.cnModifiers.get(id)!;
          const key = JSON.stringify(enAffix);
          translations[key] = cnAffix;
          totalMatched++;
        } else {
          enOnly.push({ type, id, affix: enAffix });
        }
      });

      result.cnModifiers.forEach((cnAffix, id) => {
        if (!result.enModifiers.has(id)) {
          cnOnly.push({ type, id, affix: cnAffix });
        }
      });
    } catch (error) {
      console.error(`Error processing ${type}:`, error);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Summary:");
  console.log(`   Total matched: ${totalMatched}`);
  console.log(`   Unique translations: ${Object.keys(translations).length}`);
  console.log(`   EN only: ${enOnly.length}`);
  console.log(`   CN only: ${cnOnly.length}`);

  const scriptsDir = join(process.cwd(), "scripts");

  const translationsFile = join(scriptsDir, "scraped-full-objects.json");
  writeFileSync(translationsFile, JSON.stringify(translations, null, 2), "utf-8");
  console.log(`\n✅ Saved translations to ${translationsFile}`);

  const enOnlyFile = join(scriptsDir, "en-only-full-objects.json");
  writeFileSync(enOnlyFile, JSON.stringify(enOnly, null, 2), "utf-8");
  console.log(`✅ Saved EN-only to ${enOnlyFile}`);

  const cnOnlyFile = join(scriptsDir, "cn-only-full-objects.json");
  writeFileSync(cnOnlyFile, JSON.stringify(cnOnly, null, 2), "utf-8");
  console.log(`✅ Saved CN-only to ${cnOnlyFile}`);

  if (enOnly.length > 0) {
    console.log("\n" + "=".repeat(60));
    console.log("\n⚠️  Sample EN-only (first 10):");
    enOnly.slice(0, 10).forEach((item) => {
      console.log(`   [${item.type}] ${item.affix.craftableAffix}`);
    });
  }

  console.log("\n✅ Scrape complete!");
}

main().catch(console.error);
