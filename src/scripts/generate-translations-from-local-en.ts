import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import * as cheerio from "cheerio";

interface ParsedAffix {
  modifierId: string;
  equipmentSlot: string;
  equipmentType: string;
  affixType: string;
  craftingPool: string;
  tier: string;
  craftableAffix: string;
}

const BASE_URL = "https://tlidb.com/cn";
const GEAR_TYPE_DIR = join(process.cwd(), ".garbage", "tlidb", "gear");
const OUTPUT_FILE = join(process.cwd(), "src", "data", "translated-affixes", "complete-affix-translations.ts");

const EQUIPMENT_TYPE_PAGES: Record<string, string> = {
  Belt: "Belt",
  DEX_Boots: "dex_boots",
  INT_Boots: "int_boots",
  STR_Boots: "str_boots",
  Bow: "bow",
  Cane: "cane",
  DEX_Chest_Armor: "dex_chest_armor",
  INT_Chest_Armor: "int_chest_armor",
  STR_Chest_Armor: "str_chest_armor",
  Claw: "claw",
  Crossbow: "crossbow",
  Cudgel: "cudgel",
  Dagger: "dagger",
  Fire_Cannon: "fire_cannon",
  DEX_Gloves: "dex_gloves",
  INT_Gloves: "int_gloves",
  STR_Gloves: "str_gloves",
  DEX_Helmet: "dex_helmet",
  INT_Helmet: "int_helmet",
  STR_Helmet: "str_helmet",
  Musket: "musket",
  Necklace: "necklace",
  One_Handed_Axe: "one_handed_axe",
  One_Handed_Hammer: "one_handed_hammer",
  One_Handed_Sword: "one_handed_sword",
  Pistol: "pistol",
  Ring: "ring",
  Rod: "rod",
  Scepter: "scepter",
  DEX_Shield: "dex_shield",
  INT_Shield: "int_shield",
  STR_Shield: "str_shield",
  Spirit_Ring: "spirit_ring",
  Tin_Staff: "tin_staff",
  Two_Handed_Axe: "two_handed_axe",
  Two_Handed_Hammer: "two_handed_hammer",
  Two_Handed_Sword: "two_handed_sword",
  Wand: "wand",
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function getEquipmentType(filename: string): string {
  const name = filename.replace(".html", "");
  
  const typeMap: Record<string, string> = {
    scepter: "Scepter",
    wand: "Wand",
    cane: "Cane",
    rod: "Rod",
    cudgel: "Cudgel",
    dagger: "Dagger",
    claw: "Claw",
    one_handed_axe: "One-Handed Axe",
    one_handed_sword: "One-Handed Sword",
    one_handed_hammer: "One-Handed Hammer",
    pistol: "Pistol",
    two_handed_axe: "Two-Handed Axe",
    two_handed_sword: "Two-Handed Sword",
    two_handed_hammer: "Two-Handed Hammer",
    tin_staff: "Tin Staff",
    bow: "Bow",
    crossbow: "Crossbow",
    musket: "Musket",
    fire_cannon: "Fire Cannon",
    str_chest_armor: "Chest Armor (STR)",
    dex_chest_armor: "Chest Armor (DEX)",
    int_chest_armor: "Chest Armor (INT)",
    str_boots: "Boots (STR)",
    dex_boots: "Boots (DEX)",
    int_boots: "Boots (INT)",
    str_gloves: "Gloves (STR)",
    dex_gloves: "Gloves (DEX)",
    int_gloves: "Gloves (INT)",
    str_helmet: "Helmet (STR)",
    dex_helmet: "Helmet (DEX)",
    int_helmet: "Helmet (INT)",
    str_shield: "Shield (STR)",
    dex_shield: "Shield (DEX)",
    int_shield: "Shield (INT)",
    belt: "Belt",
    necklace: "Necklace",
    ring: "Ring",
    spirit_ring: "Spirit Ring",
  };

  return typeMap[name] || name;
}

function getEquipmentSlot(filename: string): string {
  const name = filename.toLowerCase();
  if (name.includes("belt") || name.includes("necklace") || name.includes("ring")) {
    return "Trinket";
  }
  if (name.includes("boots")) return "Boots";
  if (name.includes("gloves")) return "Gloves";
  if (name.includes("helmet")) return "Helmet";
  if (name.includes("chest") || name.includes("armor")) return "Body";
  if (name.includes("shield")) return "Off Hand";
  return "Main Hand";
}

function getCnUrl(filename: string): string {
  const name = filename.replace(".html", "");
  const pageName = EQUIPMENT_TYPE_PAGES[name] || EQUIPMENT_TYPE_PAGES[name.charAt(0).toUpperCase() + name.slice(1)] || name;
  return `${BASE_URL}/${encodeURIComponent(pageName)}`;
}

function parseAffixesFromHtml(
  html: string,
  equipmentType: string,
  equipmentSlot: string,
): Map<string, ParsedAffix> {
  const $ = cheerio.load(html);
  const affixes = new Map<string, ParsedAffix>();

  $("[data-modifier-id]").each((_, elem) => {
    const modifierId = $(elem).attr("data-modifier-id");
    if (!modifierId) return;

    const parent = $(elem).parent("td");
    const tierEl = parent.find('[data-bs-title*="Tier:"]');
    let tier = "";
    if (tierEl.length) {
      const title = tierEl.attr("data-bs-title") || "";
      const match = title.match(/Tier:\s*(\d+)/);
      if (match) tier = match[1];
    }

    let text = "";
    $(elem).find("span.text-mod").each((_, span) => {
      text += $(span).text();
    });

    const nextText = $(elem).contents().filter((_, el) => el.type === "text").map((_, el) => $(el).text()).get().join("");
    text += nextText;

    text = text.replace(/\s+/g, " ").trim();
    text = text.replace(/\u2013/g, "-");
    text = text.replace(/\u2014/g, "-");
    text = text.replace(/&ndash;/g, "-");

    if (text && modifierId) {
      affixes.set(modifierId, {
        modifierId,
        equipmentSlot,
        equipmentType,
        affixType: "Unknown",
        craftingPool: "",
        tier,
        craftableAffix: text,
      });
    }
  });

  return affixes;
}

async function main() {
  console.log("🚀 Generating translations from local EN HTML + online CN\n");

  await mkdir(".garbage/tlidb/gear", { recursive: true });

  const files = await readdir(GEAR_TYPE_DIR);
  const htmlFiles = files.filter((f) => f.endsWith(".html"));

  console.log(`Found ${htmlFiles.length} HTML files\n`);

  const translations: Record<string, { en: ParsedAffix; cn: ParsedAffix }> = {};
  let totalEn = 0;
  let totalCn = 0;
  let matched = 0;

  for (const file of htmlFiles) {
    const filepath = join(GEAR_TYPE_DIR, file);
    const enHtml = await readFile(filepath, "utf-8");
    const equipmentType = getEquipmentType(file);
    const equipmentSlot = getEquipmentSlot(file);

    const enAffixes = parseAffixesFromHtml(enHtml, equipmentType, equipmentSlot);

    const cnUrl = getCnUrl(file);
    try {
      console.log(`Processing: ${file} (EN: ${enAffixes.size})`);
      const cnHtml = await fetchPage(cnUrl);
      const cnAffixes = parseAffixesFromHtml(cnHtml, equipmentType, equipmentSlot);

      totalEn += enAffixes.size;
      totalCn += cnAffixes.size;

      enAffixes.forEach((enAffix, modifierId) => {
        if (cnAffixes.has(modifierId)) {
          translations[modifierId] = {
            en: enAffix,
            cn: cnAffixes.get(modifierId)!,
          };
          matched++;
        }
      });

      console.log(`  CN: ${cnAffixes.size}, Matched: ${matched}`);
    } catch (error) {
      console.error(`  Error fetching CN page: ${error}`);
    }

    await delay(300);
  }

  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Total EN: ${totalEn}`);
  console.log(`   Total CN: ${totalCn}`);
  console.log(`   Matched: ${matched}`);
  console.log(`   Unique translations: ${Object.keys(translations).length}`);

  const now = new Date().toISOString();
  const translationsData = Object.fromEntries(
    Object.entries(translations).map(([id, { cn }]) => [id, cn]),
  );

  const tsContent = `// This file is auto-generated
// Do not modify manually
// Last updated: ${now}

// Translation table: modifierId -> CN craftableAffix
export const AFFIX_TRANSLATIONS: Record<string, {
  modifierId: string;
  equipmentSlot: string;
  equipmentType: string;
  affixType: string;
  craftingPool: string;
  tier: string;
  craftableAffix: string;
}> = ${JSON.stringify(translationsData, null, 2)} as const;

// Alias for backwards compatibility
export const AFFIX_NAME_TRANSLATIONS = AFFIX_TRANSLATIONS;
`;

  await writeFile(OUTPUT_FILE, tsContent);
  console.log(`\n✅ Generated ${OUTPUT_FILE}`);
}

main().catch(console.error);
