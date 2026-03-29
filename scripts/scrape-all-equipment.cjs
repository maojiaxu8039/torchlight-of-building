const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const EQUIPMENT_TYPES = [
  "DEX_Boots",
  "INT_Boots",
  "STR_Boots",
  "DEX_Gloves",
  "INT_Gloves",
  "STR_Gloves",
  "DEX_Helmet",
  "INT_Helmet",
  "STR_Helmet",
  "DEX_Chest",
  "INT_Chest",
  "STR_Chest",
  "DEX_Shield",
  "INT_Shield",
  "STR_Shield",
  "DEX_Bow",
  "DEX_Crossbow",
  "DEX_Musket",
  "DEX_Pistol",
  "INT_Wand",
  "INT_Rod",
  "INT_Scepter",
  "INT_TinStaff",
  "STR_Dagger",
  "STR_OneHandedAxe",
  "STR_OneHandedHammer",
  "STR_OneHandedSword",
  "STR_TwoHandedAxe",
  "STR_TwoHandedHammer",
  "STR_TwoHandedSword",
  "STR_Cudgel",
  "STR_Claw",
  "INT_Cane",
  "FireCannon",
  "Necklace",
  "Ring",
  "SpiritRing",
  "Belt",
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

async function scrapeEquipmentType(type) {
  console.log(`\n📦 Scraping: ${type}`);

  const enUrl = `https://tlidb.com/en/${type}`;
  const cnUrl = `https://tlidb.com/cn/${type}`;

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

  console.log(`  EN: ${enCount}, CN: ${cnCount}, Matched: ${matched}`);

  if (enOnly.length > 0) {
    console.log(`  ⚠️  EN only (${enOnly.length}):`);
    enOnly
      .slice(0, 5)
      .forEach((item) =>
        console.log(`     [${item.id}] ${item.text.substring(0, 60)}...`),
      );
    if (enOnly.length > 5)
      console.log(`     ... and ${enOnly.length - 5} more`);
  }

  if (cnOnly.length > 0) {
    console.log(`  ⚠️  CN only (${cnOnly.length}):`);
    cnOnly
      .slice(0, 5)
      .forEach((item) =>
        console.log(`     [${item.id}] ${item.text.substring(0, 60)}...`),
      );
    if (cnOnly.length > 5)
      console.log(`     ... and ${cnOnly.length - 5} more`);
  }

  return { type, enCount, cnCount, matched, translations, enOnly, cnOnly };
}

async function main() {
  console.log("🚀 Starting comprehensive scrape of tlidb.com\n");
  console.log("=".repeat(60));

  const allResults = [];
  const allTranslations = {};
  const allEnOnly = [];
  const allCnOnly = [];

  let totalEn = 0;
  let totalCn = 0;
  let totalMatched = 0;

  for (const type of EQUIPMENT_TYPES) {
    try {
      const result = await scrapeEquipmentType(type);
      allResults.push(result);
      totalEn += result.enCount;
      totalCn += result.cnCount;
      totalMatched += result.matched;
      allEnOnly.push(...result.enOnly.map((item) => ({ ...item, type })));
      allCnOnly.push(...result.cnOnly.map((item) => ({ ...item, type })));

      Object.assign(allTranslations, result.translations);
    } catch (error) {
      console.error(`Error processing ${type}:`, error);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 Summary:");
  console.log(`   Total EN entries: ${totalEn}`);
  console.log(`   Total CN entries: ${totalCn}`);
  console.log(`   Total Matched: ${totalMatched}`);
  console.log(`   Match rate: ${((totalMatched / totalEn) * 100).toFixed(1)}%`);

  const outputDir = path.join(__dirname, "../src/data/translated-affiffs");

  const scrapedFile = path.join(__dirname, "scraped-translations.json");
  fs.writeFileSync(
    scrapedFile,
    JSON.stringify(allTranslations, null, 2),
    "utf-8",
  );
  console.log(`\n✅ Saved scraped translations to ${scrapedFile}`);

  const enOnlyFile = path.join(__dirname, "en-only-entries.json");
  fs.writeFileSync(enOnlyFile, JSON.stringify(allEnOnly, null, 2), "utf-8");
  console.log(`✅ Saved EN-only entries to ${enOnlyFile}`);
  console.log(`   Total EN-only entries: ${allEnOnly.length}`);

  const cnOnlyFile = path.join(__dirname, "cn-only-entries.json");
  fs.writeFileSync(cnOnlyFile, JSON.stringify(allCnOnly, null, 2), "utf-8");
  console.log(`✅ Saved CN-only entries to ${cnOnlyFile}`);
  console.log(`   Total CN-only entries: ${allCnOnly.length}`);

  console.log("\n" + "=".repeat(60));
  console.log("\n⚠️  EN-only entries (need manual CN matching):");
  if (allEnOnly.length > 0) {
    allEnOnly.slice(0, 30).forEach((item) => {
      console.log(`   [${item.type}] [${item.id}] ${item.text}`);
    });
    if (allEnOnly.length > 30) {
      console.log(
        `   ... and ${allEnOnly.length - 30} more (see en-only-entries.json)`,
      );
    }
  } else {
    console.log("   None! All entries have CN matches.");
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n⚠️  CN-only entries (need manual EN matching):");
  if (allCnOnly.length > 0) {
    allCnOnly.slice(0, 30).forEach((item) => {
      console.log(`   [${item.type}] [${item.id}] ${item.text}`);
    });
    if (allCnOnly.length > 30) {
      console.log(
        `   ... and ${allCnOnly.length - 30} more (see cn-only-entries.json)`,
      );
    }
  } else {
    console.log("   None!");
  }
}

main().catch(console.error);
