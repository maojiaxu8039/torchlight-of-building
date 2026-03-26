const https = require("https");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({ status: res.statusCode, data }));
      res.on("error", reject);
    }).on("error", reject);
  });
}

const pages = [
  "STR_Helmet", "DEX_Helmet", "INT_Helmet",
  "STR_Chest_Armor", "DEX_Chest_Armor", "INT_Chest_Armor",
  "STR_Gloves", "DEX_Gloves", "INT_Gloves",
  "STR_Boots", "DEX_Boots", "INT_Boots",
  "Claw", "Dagger", "One-Handed_Sword", "One-Handed_Hammer", "One-Handed_Axe",
  "Rod", "Wand", "Scepter", "Cane", "Pistol",
  "Two-Handed_Sword", "Two-Handed_Hammer", "Two-Handed_Axe",
  "Tin_Staff", "Cudgel", "Bow", "Crossbow", "Musket", "Fire_Cannon",
  "STR_Shield", "DEX_Shield", "INT_Shield",
  "Necklace", "Ring", "Belt", "Spirit_Ring",
  "Memory", "Divinity_Slate", "Destiny", "Ethereal_Prism",
];

function encodeSlug(slug) {
  return slug.replace(/:/g, "%3A");
}

async function scrapePage(enSlug) {
  try {
    const encoded = encodeSlug(enSlug);
    const [enResult, cnResult] = await Promise.all([
      fetchUrl(`https://tlidb.com/en/${encoded}`),
      fetchUrl(`https://tlidb.com/cn/${encoded}`)
    ]);
    
    if (enResult.status !== 200 || cnResult.status !== 200) return {};
    
    const enById = {};
    const cnById = {};
    
    const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
    let match;
    
    while ((match = pattern.exec(enResult.data)) !== null) {
      const id = match[1];
      let text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/\s+/g, " ").trim();
      if (text && text.length > 2) enById[id] = text;
    }
    
    while ((match = pattern.exec(cnResult.data)) !== null) {
      const id = match[1];
      let text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/\s+/g, " ").trim();
      if (text && text.length > 2) cnById[id] = text;
    }
    
    const translations = {};
    Object.entries(enById).forEach(([id, enText]) => {
      if (cnById[id] && enText !== cnById[id]) {
        translations[enText] = cnById[id];
      }
    });
    
    return translations;
  } catch (e) {
    return {};
  }
}

async function main() {
  console.log("Scraping all pages...\n");
  
  const allTranslations = {};
  
  for (const page of pages) {
    process.stdout.write(`${page}... `);
    const translations = await scrapePage(page);
    Object.assign(allTranslations, translations);
    console.log(`✅ ${Object.keys(translations).length}`);
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\nTotal: ${Object.keys(allTranslations).length}`);
  
  // 合并
  const existing = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));
  const merged = { ...existing, ...allTranslations };
  
  const sorted = Object.entries(merged).sort((a, b) => b[0].length - a[0].length);
  const result = {};
  sorted.forEach(([en, cn]) => { result[en] = cn; });
  
  fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));
  console.log("Saved!");
}

main();
