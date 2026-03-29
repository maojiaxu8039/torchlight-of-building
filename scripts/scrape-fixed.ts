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
  modifierId: string;
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

function parseModifiers(html: string, equipmentType: string): Map<string, ParsedAffix> {
  const modifiers = new Map<string, ParsedAffix>();

  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let tdMatch;
  let currentId: string | null = null;
  let currentTier: string | null = null;

  while ((tdMatch = tdRegex.exec(html)) !== null) {
    const tdContent = tdMatch[1];

    const idMatch = tdContent.match(/data-modifier-id="(\d+)"/);
    if (idMatch) {
      currentId = idMatch[1];

      const tierMatch = tdContent.match(/Tier:\s*(\d+)/);
      currentTier = tierMatch ? tierMatch[1] : "0";

      let text = tdContent;
      text = text.replace(/<[^>]+>/g, " ");
      text = text.replace(/&nbsp;/g, " ");
      text = text.replace(/&ndash;/g, "-");
      text = text.replace(/&amp;/g, "&");
      text = text.replace(/\s+/g, " ").trim();

      if (text && currentId) {
        modifiers.set(currentId, {
          modifierId: currentId,
          equipmentSlot: getEquipmentSlot(equipmentType),
          equipmentType: equipmentType.replace(/_/g, " "),
          affixType: "Unknown",
          craftingPool: "",
          tier: currentTier,
          craftableAffix: text,
        });
      }
    }

    const typeMatch = tdContent.match(/^(Base Affix|Prefix|Suffix|Sweet Dream|Tower Sequence|Blend)/);
    if (typeMatch && currentId) {
      const existing = modifiers.get(currentId);
      if (existing) {
        existing.affixType = typeMatch[1];
      }
    }
  }

  return modifiers;
}

function getEquipmentSlot(equipmentType: string): string {
  const type = equipmentType.replace(/_/g, " ");
  if (["Belt", "Ring", "Necklace", "Spirit Ring"].includes(type)) {
    return "Trinket";
  }
  if (type.includes("Boots")) return "Boots";
  if (type.includes("Gloves")) return "Gloves";
  if (type.includes("Helmet")) return "Helmet";
  if (type.includes("Chest") || type.includes("Armor")) return "Body";
  if (type.includes("Shield")) return "Off Hand";
  return "Main Hand";
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

  const enModifiers = parseModifiers(enHtml, type);
  const cnModifiers = parseModifiers(cnHtml, type);

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
  console.log("🚀 Starting fixed translation scrape\n");
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

  const translationsFile = join(scriptsDir, "scraped-translations-fixed.json");
  writeFileSync(translationsFile, JSON.stringify(translations, null, 2), "utf-8");
  console.log(`\n✅ Saved translations to ${translationsFile}`);

  console.log("\n✅ Scrape complete!");
}

main().catch(console.error);
