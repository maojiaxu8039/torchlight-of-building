const https = require("https");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

// 装备列表
const equipmentList = [
  "Belt",
  "STR_Helmet", "DEX_Helmet", "INT_Helmet",
  "STR_Chest_Armor", "DEX_Chest_Armor", "INT_Chest_Armor",
  "STR_Gloves", "DEX_Gloves", "INT_Gloves",
  "STR_Boots", "DEX_Boots", "INT_Boots",
  "Claw", "Dagger", "One-Handed_Sword", "One-Handed_Hammer", "One-Handed_Axe",
  "Rod", "Wand", "Scepter", "Cane", "Pistol",
  "Two-Handed_Sword", "Two-Handed_Hammer", "Two-Handed_Axe",
  "Tin_Staff", "Cudgel", "Bow", "Crossbow", "Musket", "Fire_Cannon",
  "STR_Shield", "DEX_Shield", "INT_Shield",
  "Necklace", "Ring", "Spirit_Ring",
  "Memory", "Divinity_Slate", "Destiny", "Ethereal_Prism",
];

// 锚点类型映射
const anchorTypes = [
  "", // 默认 Base Affix
  "#Item", // Base Stats
  "#BlendingRituals", // Blending
  "#Blending", // Blending
  "#Pre-fix", // Pre-fix (all types)
  "#Suffix", // Suffix (all types)
  "#SweetDream", // Sweet Dream
  "#Corruption", // Corruption
];

function extractAffixesByType(html, type) {
  const affixes = {};
  
  // 提取 Base Affixes
  const basePattern = /Base Affix<\/h[23]>([\s\S]*?)(?:<h[23][^>]*>|$)/gi;
  let match;
  
  // 提取词缀项
  const itemPattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  let itemMatch;
  
  while ((itemMatch = itemPattern.exec(html)) !== null) {
    const id = itemMatch[1];
    let text = itemMatch[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "–")
      .replace(/\s+/g, " ")
      .trim();
    
    if (text && text.length > 2) {
      affixes[id] = { text, type: type || "Base Affix" };
    }
  }
  
  return affixes;
}

async function scrapeEquipment(enSlug) {
  try {
    const enHtml = await fetchUrl(`https://tlidb.com/en/${enSlug}`);
    const cnHtml = await fetchUrl(`https://tlidb.com/cn/${enSlug}`);
    
    if (enHtml.length < 1000 || cnHtml.length < 1000) {
      return {};
    }
    
    // 提取英文词缀
    const enAffixes = extractAffixesByType(enHtml, "en");
    const cnAffixes = extractAffixesByType(cnHtml, "cn");
    
    // 通过 ID 匹配
    const translations = {};
    Object.entries(enAffixes).forEach(([id, enData]) => {
      if (cnAffixes[id] && enData.text !== cnAffixes[id].text) {
        translations[enData.text] = cnAffixes[id].text;
      }
    });
    
    return translations;
    
  } catch (error) {
    return {};
  }
}

async function main() {
  console.log("=== Scraping equipment by type ===\n");
  
  const allTranslations = {};
  
  for (const equipment of equipmentList) {
    process.stdout.write(`${equipment}... `);
    const translations = await scrapeEquipment(equipment);
    Object.assign(allTranslations, translations);
    console.log(`✅ ${Object.keys(translations).length}`);
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\nTotal: ${Object.keys(allTranslations).length}`);
  
  // 保存
  fs.writeFileSync(
    "src/data/translated-affixes/by-type-translations.json",
    JSON.stringify(allTranslations, null, 2)
  );
  console.log("Saved to by-type-translations.json");
}

main();
