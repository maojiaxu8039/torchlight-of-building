const https = require("https");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      let data = "";
      res.on("data", function(chunk) { data += chunk; });
      res.on("end", function() { resolve(data); });
      res.on("error", reject);
    }).on("error", reject);
  });
}

// 正确的装备 URL 格式
const equipmentList = [
  // 头部
  { slug: "STR_Helmet", type: "力量头部" },
  { slug: "DEX_Helmet", type: "敏捷头部" },
  { slug: "INT_Helmet", type: "智慧头部" },
  // 胸甲
  { slug: "STR_Chest_Armor", type: "力量胸甲" },
  { slug: "DEX_Chest_Armor", type: "敏捷胸甲" },
  { slug: "INT_Chest_Armor", type: "智慧胸甲" },
  // 手套
  { slug: "STR_Gloves", type: "力量手套" },
  { slug: "DEX_Gloves", type: "敏捷手套" },
  { slug: "INT_Gloves", type: "智慧手套" },
  // 鞋子
  { slug: "STR_Boots", type: "力量鞋子" },
  { slug: "DEX_Boots", type: "敏捷鞋子" },
  { slug: "INT_Boots", type: "智慧鞋子" },
  // 武器
  { slug: "Claw", type: "爪" },
  { slug: "Dagger", type: "匕首" },
  { slug: "One_Handed_Sword", type: "单手剑" },
  { slug: "One_Handed_Hammer", type: "单手锤" },
  { slug: "One_Handed_Axe", type: "单手斧" },
  { slug: "Rod", type: "灵杖" },
  { slug: "Wand", type: "法杖" },
  { slug: "Scepter", type: "权杖" },
  { slug: "Cane", type: "手杖" },
  { slug: "Pistol", type: "手枪" },
  { slug: "Two_Handed_Sword", type: "双手剑" },
  { slug: "Two_Handed_Hammer", type: "双手锤" },
  { slug: "Two_Handed_Axe", type: "双手斧" },
  { slug: "Tin_Staff", type: "锡杖" },
  { slug: "Cudgel", type: "棍棒" },
  { slug: "Bow", type: "弓" },
  { slug: "Crossbow", type: "弩" },
  { slug: "Musket", type: "火枪" },
  { slug: "Fire_Cannon", type: "火炮" },
  // 护盾
  { slug: "STR_Shield", type: "力量护盾" },
  { slug: "DEX_Shield", type: "敏捷护盾" },
  { slug: "INT_Shield", type: "智慧护盾" },
  // 饰品
  { slug: "Necklace", type: "项链" },
  { slug: "Ring", type: "戒指" },
  { slug: "Spirit_Ring", type: "灵戒" },
  { slug: "Belt", type: "腰带" },
  // 其他
  { slug: "Memory", type: "英雄追忆" },
  { slug: "Destiny", type: "命运" },
];

async function scrapePage(slug) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl("https://tlidb.com/en/" + slug),
      fetchUrl("https://tlidb.com/cn/" + slug),
    ]);
    
    if (enHtml.length < 1000 || cnHtml.length < 1000) {
      return {};
    }
    
    const enById = {};
    const cnById = {};
    
    const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
    let match;
    
    while ((match = pattern.exec(enHtml)) !== null) {
      const id = match[1];
      let text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "-").replace(/\s+/g, " ").trim();
      if (text && text.length > 2) {
        enById[id] = text;
      }
    }
    
    while ((match = pattern.exec(cnHtml)) !== null) {
      const id = match[1];
      let text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "-").replace(/\s+/g, " ").trim();
      if (text && text.length > 2) {
        cnById[id] = text;
      }
    }
    
    const translations = {};
    Object.entries(enById).forEach(function(entry) {
      const id = entry[0];
      const enText = entry[1];
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
  console.log("=== 全面抓取所有装备词缀 (正确 URL) ===\n");
  
  const allTranslations = {};
  let total = 0;
  
  for (const item of equipmentList) {
    process.stdout.write(item.type + "... ");
    const translations = await scrapePage(item.slug);
    total += Object.keys(translations).length;
    Object.assign(allTranslations, translations);
    console.log(Object.keys(translations).length + " 条");
    await new Promise(function(r) { setTimeout(r, 100); });
  }
  
  console.log("\n总计: " + total + " 条翻译");
  
  // 读取现有翻译并合并
  const existing = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));
  const merged = Object.assign({}, existing, allTranslations);
  
  // 重新排序
  const sorted = Object.entries(merged).sort(function(a, b) { return b[0].length - a[0].length; });
  const result = {};
  sorted.forEach(function(entry) { result[entry[0]] = entry[1]; });
  
  fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));
  console.log("保存到 merged-all-translations.json");
}

main();
