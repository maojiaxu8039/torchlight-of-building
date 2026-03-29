const fs = require("fs");
const https = require("https");
const http = require("http");

const BASE_URL = "https://tlidb.com/cn";
const GEAR_TYPE_DIR = ".garbage/tlidb/gear";
const OUTPUT_FILE = "src/data/translated-affixes/complete-affix-translations.ts";

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    });
    request.on("error", reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

const CN_URL_MAP = {
  belt: "Belt",
  bow: "Bow",
  cane: "Cane",
  claw: "Claw",
  crossbow: "Crossbow",
  cudgel: "Cudgel",
  dagger: "Dagger",
  dex_boots: "DEX_Boots",
  dex_chest_armor: "DEX_Chest_Armor",
  dex_gloves: "DEX_Gloves",
  dex_helmet: "DEX_Helmet",
  dex_shield: "DEX_Shield",
  fire_cannon: "Fire_Cannon",
  int_boots: "INT_Boots",
  int_chest_armor: "INT_Chest_Armor",
  int_gloves: "INT_Gloves",
  int_helmet: "INT_Helmet",
  int_shield: "INT_Shield",
  musket: "Musket",
  necklace: "Necklace",
  one_handed_axe: "One-Handed_Axe",
  one_handed_hammer: "One-Handed_Hammer",
  one_handed_sword: "One-Handed_Sword",
  pistol: "Pistol",
  ring: "Ring",
  rod: "Rod",
  scepter: "Scepter",
  spirit_ring: "Spirit_Ring",
  str_boots: "STR_Boots",
  str_chest_armor: "STR_Chest_Armor",
  str_gloves: "STR_Gloves",
  str_helmet: "STR_Helmet",
  str_shield: "STR_Shield",
  tin_staff: "Tin_Staff",
  two_handed_axe: "Two-Handed_Axe",
  two_handed_hammer: "Two-Handed_Hammer",
  two_handed_sword: "Two-Handed_Sword",
  wand: "Wand",
};

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseAffixes(html) {
  const affixes = {};
  
  // 匹配 <td>...</td> 块，包含 data-modifier-id
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let tdMatch;
  
  while ((tdMatch = tdRegex.exec(html)) !== null) {
    const tdContent = tdMatch[1];
    
    // 检查是否包含 data-modifier-id
    const idMatch = tdContent.match(/data-modifier-id="(\d+)"/);
    if (!idMatch) continue;
    
    const modifierId = idMatch[1];
    
    // 提取从 data-modifier-id 到第一个 </span> 之前的内容
    let text = tdContent;
    
    // 提取 text-mod span 的内容
    const textModMatches = text.match(/<span[^>]*class="text-mod"[^>]*>([\s\S]*?)<\/span>/gi) || [];
    const textModParts = textModMatches.map(m => {
      const inner = m.match(/<span[^>]*>([\s\S]*?)<\/span>/i);
      return inner ? inner[1] : '';
    });
    
    // 提取所有文本节点（不在 HTML 标签内的文本）
    const plainTexts = [];
    let current = text;
    const parts = current.split(/<[^>]+>/);
    parts.forEach(part => {
      part = part.trim();
      if (part) plainTexts.push(part);
    });
    
    // 合并 text-mod 和普通文本
    let combined = '';
    let textModIndex = 0;
    parts.forEach(part => {
      part = part.trim();
      if (!part) return;
      if (current.indexOf(`<span class="text-mod">${textModParts[textModIndex] || ''}</span>`) !== -1 || 
          current.includes(`class="text-mod">${textModParts[textModIndex] || ''}</span>`)) {
        combined += textModParts[textModIndex] || '';
        textModIndex++;
      }
      combined += ' ' + part;
    });
    
    text = combined.trim();
    
    // 清理文本
    text = text
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<e[^>]*>([^<]*)<\/e>/gi, '$1')
      .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
      .replace(/<i[^>]*>.*?<\/i>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&ndash;/g, '-')
      .replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (text && modifierId) {
      if (!affixes[modifierId]) {
        affixes[modifierId] = text;
      }
    }
  }
  
  return affixes;
}

async function main() {
  console.log("🚀 Generating translations\n");
  
  const files = fs.readdirSync(GEAR_TYPE_DIR).filter(f => f.endsWith(".html"));
  console.log(`Found ${files.length} HTML files\n`);
  
  const translations = {};
  let totalEn = 0;
  let totalCn = 0;
  let matched = 0;
  
  for (const file of files) {
    const enPath = `${GEAR_TYPE_DIR}/${file}`;
    const enHtml = fs.readFileSync(enPath, "utf-8");
    const enAffixes = parseAffixes(enHtml);
    
    const cnUrl = `${BASE_URL}/${encodeURIComponent(CN_URL_MAP[file.replace('.html', '')] || file.replace('.html', ''))}`;
    
    try {
      console.log(`Processing: ${file} (EN: ${Object.keys(enAffixes).length})`);
      const cnHtml = await fetchUrl(cnUrl);
      const cnAffixes = parseAffixes(cnHtml);
      
      totalEn += Object.keys(enAffixes).length;
      totalCn += Object.keys(cnAffixes).length;
      
      Object.keys(enAffixes).forEach(id => {
        if (cnAffixes[id]) {
          translations[id] = cnAffixes[id];
          matched++;
        }
      });
      
      console.log(`  CN: ${Object.keys(cnAffixes).length}, Matched: ${matched}`);
    } catch (error) {
      console.error(`  Error: ${error.message}`);
    }
    
    await delay(300);
  }
  
  console.log("\n" + "=".repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Total EN: ${totalEn}`);
  console.log(`   Total CN: ${totalCn}`);
  console.log(`   Matched: ${matched}`);
  console.log(`   Unique translations: ${Object.keys(translations).length}`);
  
  console.log("\n📋 Sample translations:");
  Object.values(translations).slice(0, 5).forEach(t => {
    console.log(`  ${t}`);
  });
  
  const now = new Date().toISOString();
  const tsContent = `// This file is auto-generated
// Do not modify manually
// Last updated: ${now}

// Translation table: modifierId -> CN craftableAffix
export const AFFIX_TRANSLATIONS: Record<string, string> = ${JSON.stringify(translations, null, 2)} as const;

// Alias for backwards compatibility
export const AFFIX_NAME_TRANSLATIONS = AFFIX_TRANSLATIONS;
`;
  
  fs.writeFileSync(OUTPUT_FILE, tsContent);
  console.log(`\n✅ Generated ${OUTPUT_FILE}`);
}

main().catch(console.error);
