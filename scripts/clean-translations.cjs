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

const equipmentList = [
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

async function scrapeCN(enSlug) {
  try {
    const encoded = encodeSlug(enSlug);
    const { status, data } = await fetchUrl(`https://tlidb.com/cn/${encoded}`);
    if (status !== 200) return {};
    
    const enResult = await fetchUrl(`https://tlidb.com/en/${encoded}`);
    if (enResult.status !== 200) return {};
    
    const enById = {};
    const cnById = {};
    
    const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
    let match;
    
    while ((match = pattern.exec(enResult.data)) !== null) {
      const id = match[1];
      let text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/\s+/g, " ").trim();
      if (text && text.length > 2) enById[id] = text;
    }
    
    while ((match = pattern.exec(data)) !== null) {
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
  console.log("Scraping CN translations...\n");
  
  const cnTranslations = {};
  
  for (const item of equipmentList) {
    process.stdout.write(`${item}... `);
    const translations = await scrapeCN(item);
    Object.assign(cnTranslations, translations);
    console.log(`✅ ${Object.keys(translations).length}`);
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\nTotal CN translations: ${Object.keys(cnTranslations).length}`);
  
  // 保存中文网站翻译
  fs.writeFileSync("src/data/translated-affixes/cn-only-translations.json", JSON.stringify(cnTranslations, null, 2));
  console.log("Saved to cn-only-translations.json");
}

main();
