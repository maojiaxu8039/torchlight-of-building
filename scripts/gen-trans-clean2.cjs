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
  
  // 提取所有 data-modifier-id 和其对应的文本
  const idRegex = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)(?=<i\s|data-modifier-id="|$)/gi;
  let idMatch;
  
  while ((idMatch = idRegex.exec(html)) !== null) {
    const modifierId = idMatch[1];
    let text = idMatch[2];
    
    // 移除所有包含 tooltip 相关的 HTML 元素
    text = text
      .replace(/data-bs-title="[^"]*"/g, '')  // 移除 tooltip 属性
      .replace(/data-bs-html="[^"]*"/g, '')
      .replace(/data-bs-toggle="[^"]*"/g, '')
      .replace(/data-hover="[^"]*"/g, '')
      .replace(/data-tip="[^"]*"/g, '')
      .replace(/data-section="[^"]*"/g, '')
      .replace(/data-tier="[^"]*"/g, '')
      .replace(/<div[^>]*>/g, '')  // 移除 div 标签（包含 tooltip 内容）
      .replace(/<\/div>/g, '')
      .replace(/<br\s*\/?>/gi, ' ')  // 将 <br/> 替换为空格
      .replace(/<i[^>]*>.*?<\/i>/gi, '')  // 移除 <i>...</i>（tooltip 触发器）
      .replace(/<e[^>]*>([^<]*)<\/e>/gi, '$1')  // 保留 <e> 内的文本
      .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')  // 保留 <a> 内的文本
      .replace(/<span[^>]*>/gi, '')  // 移除 span 开始标签
      .replace(/<\/span>/gi, '')  // 移除 span 结束标签
      .replace(/<[^>]+>/g, '')  // 移除其他所有标签
      .replace(/&nbsp;/g, ' ')
      .replace(/&ndash;/g, '-')
      .replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/\s+/g, ' ')
      .trim();
    
    // 移除末尾可能残留的标签碎片和数字
    text = text.replace(/<[^>]*$/, '').trim();
    // 移除末尾的数字序列（可能是 tooltip 内容）
    text = text.replace(/\d+\s*(初阶|进阶|高阶|词缀|加工|阶序列)[^"]*$/, '').trim();
    
    if (text && modifierId) {
      if (!affixes[modifierId]) {
        affixes[modifierId] = text;
      }
    }
  }
  
  return affixes;
}

async function main() {
  console.log("🚀 Generating translations from local EN + online CN\n");
  
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
  
  // 显示示例
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
