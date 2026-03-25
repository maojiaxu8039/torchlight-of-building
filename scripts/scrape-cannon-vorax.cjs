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

// 使用用户提供的 URL
const pages = [
  // 火炮
  { en: 'Fire_Cannon', cn: 'Fire_Cannon', name: '火炮' },
  // 其他武器
  { en: 'Cudgel', cn: 'Cudgel', name: '钉头锤' },
  // 渴瘾肢体 - 注意 URL 编码
  { en: 'Vorax_Limb:_Head', cn: 'Vorax_Limb:_Head', name: '渴瘾肢体：脑部' },
  { en: 'Vorax_Limb:_Chest', cn: 'Vorax_Limb:_Chest', name: '渴瘾肢体：胸部' },
  { en: 'Vorax_Limb:_Hands', cn: 'Vorax_Limb:_Hands', name: '渴瘾肢体：手部' },
  { en: 'Vorax_Limb:_Legs', cn: 'Vorax_Limb:_Legs', name: '渴瘾肢体：腿部' },
  { en: 'Vorax_Limb:_Neck', cn: 'Vorax_Limb:_Neck', name: '渴瘾肢体：颈部' },
  { en: 'Vorax_Limb:_Digits', cn: 'Vorax_Limb:_Digits', name: '渴瘾肢体：指部' },
  { en: 'Vorax_Limb:_Waist', cn: 'Vorax_Limb:_Waist', name: '渴瘾肢体：腰部' },
];

async function scrapePage(page) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(`https://tlidb.com/en/${page.en}`),
      fetchUrl(`https://tlidb.com/cn/${page.cn}`),
    ]);
    
    const enById = {};
    const cnById = {};
    
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
  console.log('=== Scraping Fire Cannon, Cudgel & Vorax Limb ===\n');
  
  const allTranslations = {};
  
  for (const page of pages) {
    process.stdout.write(`${page.name} (${page.en})... `);
    
    const translations = await scrapePage(page);
    
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
