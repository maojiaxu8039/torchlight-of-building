const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const EQUIPMENT_TYPES = [
  { type: "DEX_Boots", url: "DEX_Boots" },
  { type: "INT_Boots", url: "INT_Boots" },
  { type: "STR_Boots", url: "STR_Boots" },
  { type: "DEX_Gloves", url: "DEX_Gloves" },
  { type: "INT_Gloves", url: "INT_Gloves" },
  { type: "STR_Gloves", url: "STR_Gloves" },
  { type: "DEX_Helmet", url: "DEX_Helmet" },
  { type: "INT_Helmet", url: "INT_Helmet" },
  { type: "STR_Helmet", url: "STR_Helmet" },
  { type: "DEX_Shield", url: "DEX_Shield" },
  { type: "INT_Shield", url: "INT_Shield" },
  { type: "STR_Shield", url: "STR_Shield" },
  { type: "DEX_Bow", url: "Bow" },
  { type: "DEX_Crossbow", url: "Crossbow" },
  { type: "DEX_Musket", url: "Musket" },
  { type: "DEX_Pistol", url: "Pistol" },
  { type: "INT_Wand", url: "Wand" },
  { type: "INT_Rod", url: "Rod" },
  { type: "INT_Scepter", url: "Scepter" },
  { type: "STR_Dagger", url: "Dagger" },
  { type: "STR_Cudgel", url: "Cudgel" },
  { type: "STR_Claw", url: "Claw" },
  { type: "INT_Cane", url: "Cane" },
  { type: "Tin_Staff", url: "Tin_Staff" },
  { type: "Fire_Cannon", url: "Fire_Cannon" },
  { type: "Spirit_Ring", url: "Spirit_Ring" },
  { type: "Necklace", url: "Necklace" },
  { type: "Ring", url: "Ring" },
  { type: "Belt", url: "Belt" },
  // 新确认的单手/双手武器
  { type: "STR_OneHandedSword", url: "One-Handed_Sword" },
  { type: "STR_OneHandedAxe", url: "One-Handed_Axe" },
  { type: "STR_OneHandedHammer", url: "One-Handed_Hammer" },
  { type: "STR_TwoHandedSword", url: "Two-Handed_Sword" },
  { type: "STR_TwoHandedAxe", url: "Two-Handed_Axe" },
  { type: "STR_TwoHandedHammer", url: "Two-Handed_Hammer" },
];

const MISSING_TYPES = [
  { type: "DEX_Chest", url: "???" },
  { type: "INT_Chest", url: "???" },
  { type: "STR_Chest", url: "???" },
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    request.on("error", reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

async function scrapePage(url) {
  try {
    const html = await fetchUrl(url);
    const modifierMap = {};
    const regex =
      /data-modifier-id="(\d+)"[^>]*>.*?<span class="text-mod">([^<]*)<\/span>\s*([^(</]+)/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      const id = match[1];
      const value = match[2].replace(/&ndash;/g, "-").replace(/&amp;/g, "&");
      const text = match[3].replace(/<[^>]+>/g, "").trim();
      modifierMap[id] = value + text;
    }
    return modifierMap;
  } catch (error) {
    console.log(`  ⚠️  Error fetching ${url}: ${error.message}`);
    return {};
  }
}

async function scrapeEquipmentType(config) {
  console.log(`📦 Scraping: ${config.type} (${config.url})`);

  const enUrl = `https://tlidb.com/en/${config.url}`;
  const cnUrl = `https://tlidb.com/cn/${config.url}`;

  const [enPage, cnPage] = await Promise.all([
    scrapePage(enUrl),
    scrapePage(cnUrl),
  ]);

  const enCount = Object.keys(enPage).length;
  const cnCount = Object.keys(cnPage).length;

  let matched = 0;
  const translations = {};
  const enOnly = [];
  const cnOnly = [];

  Object.keys(enPage).forEach((id) => {
    if (cnPage[id]) {
      translations[enPage[id]] = cnPage[id];
      matched++;
    } else {
      enOnly.push({ id, text: enPage[id] });
    }
  });

  Object.keys(cnPage).forEach((id) => {
    if (!enPage[id]) {
      cnOnly.push({ id, text: cnPage[id] });
    }
  });

  console.log(`   EN: ${enCount}, CN: ${cnCount}, Matched: ${matched}`);

  return {
    type: config.type,
    url: config.url,
    enCount,
    cnCount,
    matched,
    translations,
    enOnly,
    cnOnly,
  };
}

async function main() {
  console.log("🚀 Complete scrape of tlidb.com\n");
  console.log("=".repeat(60));

  const allTranslations = {};
  const allEnOnly = [];
  const allCnOnly = [];

  let totalEn = 0;
  let totalCn = 0;
  let totalMatched = 0;

  for (const config of EQUIPMENT_TYPES) {
    try {
      const result = await scrapeEquipmentType(config);
      totalEn += result.enCount;
      totalCn += result.cnCount;
      totalMatched += result.matched;
      allEnOnly.push(
        ...result.enOnly.map((item) => ({ ...item, type: result.type })),
      );
      allCnOnly.push(
        ...result.cnOnly.map((item) => ({ ...item, type: result.type })),
      );
      Object.assign(allTranslations, result.translations);
    } catch (error) {
      console.error(`Error processing ${config.type}:`, error);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Summary:");
  console.log(`   Total EN entries: ${totalEn}`);
  console.log(`   Total CN entries: ${totalCn}`);
  console.log(`   Total Matched: ${totalMatched}`);
  console.log(
    `   Match rate: ${totalEn > 0 ? ((totalMatched / totalEn) * 100).toFixed(1) : 0}%`,
  );

  const scriptsDir = __dirname;

  const scrapedFile = path.join(
    scriptsDir,
    "scraped-translations-complete.json",
  );
  fs.writeFileSync(
    scrapedFile,
    JSON.stringify(allTranslations, null, 2),
    "utf-8",
  );
  console.log(`\n✅ Saved translations to ${scrapedFile}`);
  console.log(`   Total translations: ${Object.keys(allTranslations).length}`);

  const enOnlyFile = path.join(scriptsDir, "en-only-entries-complete.json");
  fs.writeFileSync(enOnlyFile, JSON.stringify(allEnOnly, null, 2), "utf-8");
  console.log(`✅ Saved EN-only entries to ${enOnlyFile}`);
  console.log(`   Total: ${allEnOnly.length}`);

  const cnOnlyFile = path.join(scriptsDir, "cn-only-entries-complete.json");
  fs.writeFileSync(cnOnlyFile, JSON.stringify(allCnOnly, null, 2), "utf-8");
  console.log(`✅ Saved CN-only entries to ${cnOnlyFile}`);
  console.log(`   Total: ${allCnOnly.length}`);

  console.log("\n" + "=".repeat(60));
  console.log("\n⚠️  EN-only entries:");
  if (allEnOnly.length > 0) {
    allEnOnly.slice(0, 20).forEach((item) => {
      console.log(`   [${item.type}] [${item.id}] ${item.text}`);
    });
  } else {
    console.log("   None!");
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n❓ Missing URLs (need confirmation):");
  MISSING_TYPES.forEach((config) => {
    console.log(`   ${config.type}: "${config.url}"`);
  });
}

main().catch(console.error);
