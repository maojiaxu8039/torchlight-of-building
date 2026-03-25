const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// 中英文对照表（根据用户提供）
const EN_TO_CN = {
  // 头部
  'STR_Helmet': '力量头部',
  'DEX_Helmet': '敏捷头部',
  'INT_Helmet': '智慧头部',
  
  // 胸甲
  'STR_Breastplate': '力量胸甲',
  'DEX_Breastplate': '敏捷胸甲',
  'INT_Breastplate': '智慧胸甲',
  
  // 手套
  'STR_Gloves': '力量手套',
  'DEX_Gloves': '敏捷手套',
  'INT_Gloves': '智慧手套',
  
  // 鞋子
  'STR_Boots': '力量鞋子',
  'DEX_Boots': '敏捷鞋子',
  'INT_Boots': '智慧鞋子',
  
  // 单手武器
  'Claw': '爪',
  'Dagger': '匕首',
  'One_Handed_Sword': '单手剑',
  'One_Handed_Hammer': '单手锤',
  'One_Handed_Axe': '单手斧',
  'Staff': '法杖',
  'Rod': '灵杖',
  'Wand': '魔杖',
  'Cane': '手杖',
  'Pistol': '手枪',
  
  // 双手武器
  'Two_Handed_Sword': '双手剑',
  'Two_Handed_Hammer': '双手锤',
  'Two_Handed_Axe': '双手斧',
  'Tin_Staff': '锡杖',
  'War_Staff': '武杖',
  'Bow': '弓',
  'Crossbow': '弩',
  'Musket': '火枪',
  'Cannon': '火炮',
  
  // 盾牌
  'STR_Shield': '力量盾牌',
  'DEX_Shield': '敏捷盾牌',
  'INT_Shield': '智慧盾牌',
  
  // 饰品
  'Necklace': '项链',
  'Ring': '戒指',
  'Belt': '腰带',
  'Spirit_Ring': '灵戒',
  
  // 英雄
  'Memory': '英雄追忆',
  'Divinity_Slate': '神格石板',
  'Destiny': '命运',
  'Prism': '异度棱镜',
  
  // 渴瘾症
  'Vorax_Limb:_Head': '渴瘾肢体：脑部',
  'Vorax_Limb:_Chest': '渴瘾肢体：胸部',
  'Vorax_Limb:_Hands': '渴瘾肢体：手部',
  'Vorax_Limb:_Legs': '渴瘾肢体：腿部',
  'Vorax_Aberrant_Limb:_Legs': '渴瘾异肢：腿部',
  'Vorax_Limb:_Neck': '渴瘾肢体：颈部',
  'Vorax_Limb:_Digits': '渴瘾肢体：指部',
  'Vorax_Aberrant_Limb:_Digits': '渴瘾异肢：指部',
  'Vorax_Limb:_Waist': '渴瘾肢体：腰部',
  'Vorax_Aberrant_Limb:_Waist': '渴瘾异肢：腰部',
};

async function scrapePage(enSlug, cnSlug) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(`https://tlidb.com/en/${enSlug}`),
      fetchUrl(`https://tlidb.com/cn/${cnSlug}`),
    ]);
    
    const enById = {};
    const cnById = {};
    
    // Pattern: data-modifier-id="ID">...text...</span>
    const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
    let match;
    
    while ((match = pattern.exec(enHtml)) !== null) {
      const id = match[1];
      let text = match[2].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&ndash;/g, '–').replace(/\s+/g, ' ').trim();
      if (text && text.length > 2) {
        enById[id] = text;
      }
    }
    
    while ((match = pattern.exec(cnHtml)) !== null) {
      const id = match[1];
      let text = match[2].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&ndash;/g, '–').replace(/\s+/g, ' ').trim();
      if (text && text.length > 2) {
        cnById[id] = text;
      }
    }
    
    // Match
    const translations = {};
    Object.entries(enById).forEach(([id, enText]) => {
      if (cnById[id] && enText !== cnById[id]) {
        const enLen = enText.replace(/[\d\.\-\–\(\)\%]/g, '').length;
        const cnLen = cnById[id].replace(/[\d\u4e00-\u9fa5]/g, '').length;
        if (enLen > 2 && cnLen > 0) {
          translations[enText] = cnById[id];
        }
      }
    });
    
    return translations;
    
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return {};
  }
}

async function main() {
  console.log('=== Scraping all equipment pages ===\n');
  
  const allTranslations = {};
  
  for (const [enSlug, cnName] of Object.entries(EN_TO_CN)) {
    process.stdout.write(`${cnName} (${enSlug})... `);
    
    const translations = await scrapePage(enSlug, enSlug);
    
    if (Object.keys(translations).length > 0) {
      Object.assign(allTranslations, translations);
      console.log(`✅ ${Object.keys(translations).length}`);
    } else {
      console.log(`❌ (no data)`);
    }
    
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Total new translations: ${Object.keys(allTranslations).length}`);
  
  // Save
  const outDir = path.join(__dirname, '../src/data/translated-affixes');
  
  const existingPath = path.join(outDir, 'merged-all-translations.json');
  const existing = fs.existsSync(existingPath)
    ? JSON.parse(fs.readFileSync(existingPath, 'utf8'))
    : {};
  
  const merged = { ...existing, ...allTranslations };
  
  const sorted = Object.entries(merged).sort((a, b) => b[0].length - a[0].length);
  const sortedTranslations = {};
  sorted.forEach(([en, cn]) => {
    sortedTranslations[en] = cn;
  });
  
  fs.writeFileSync(existingPath, JSON.stringify(sortedTranslations, null, 2), 'utf-8');
  
  console.log(`Existing: ${Object.keys(existing).length}`);
  console.log(`Total now: ${Object.keys(sortedTranslations).length}`);
  console.log(`\n✅ Done!`);
}

main();
