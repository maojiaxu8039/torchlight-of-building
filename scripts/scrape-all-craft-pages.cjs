const fs = require('fs');
const path = require('path');
const https = require('https');

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

function extractAllText(html) {
  const texts = new Set();

  // 1. 提取所有 td 标签的文本
  const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let match;
  while ((match = tdPattern.exec(html)) !== null) {
    let text = match[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&ndash;/g, '–')
      .replace(/&mdash;/g, '—')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();

    if (text && text.length > 3 && text.length < 500) {
      texts.add(text);
    }
  }

  // 2. 提取 data-hover 链接文本
  const hoverPattern = /data-hover="([^"]+)"/g;
  while ((match = hoverPattern.exec(html)) !== null) {
    const text = match[1]
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();

    if (text && text.length > 3) {
      texts.add(text);
    }
  }

  return texts;
}

async function scrapeCraft() {
  console.log('🚀 Scraping Craft pages for all translations...\n');

  const outDir = path.join(__dirname, '../src/data/translated-affixes');

  // 抓取所有 Craft 相关页面
  const pages = [
    'Craft',
    'Belt', 'Boots', 'Gloves', 'Helmet', 'Chest',
    'Necklace', 'Ring',
    'One-Handed_Sword', 'Two-Handed_Sword',
    'One-Handed_Axe', 'Two-Handed_Axe',
    'One-Handed_Hammer', 'Two-Handed_Hammer',
    'Dagger', 'Wand', 'Staff', 'Tin_Staff',
    'Bow', 'Crossbow', 'Pistol', 'Musket',
    'Cane', 'Shield', 'Claw', 'Rod', 'Scepter',
    'Fire_Cannon', 'Spirit_Ring',
    'DEX_Boots', 'INT_Boots', 'STR_Boots',
    'Chest_Armor_(DEX)', 'Chest_Armor_(INT)', 'Chest_Armor_(STR)',
    'DEX_Gloves', 'INT_Gloves', 'STR_Gloves',
    'DEX_Helmet', 'INT_Helmet', 'STR_Helmet',
    'DEX_Shield', 'INT_Shield', 'STR_Shield',
    'Legendary_Gear',
    'Talent',
    'Active_Skill', 'Support_Skill', 'Passive_Skill',
    'Activation_Medium_Skill',
    'Noble_Support_Skill', 'Magnificent_Support_Skill',
    'Hero',
    'Pactspirit',
    'Ethereal_Prism',
    'Destiny',
    'Corrosion',
    'Dream_Talking',
    'Blending_Rituals',
    'TOWER_Sequence',
    'Graft',
  ];

  const allTranslations = {};
  let totalMatched = 0;

  for (const page of pages) {
    try {
      console.log(`📄 Scraping: ${page}`);

      const [enHtml, cnHtml] = await Promise.all([
        fetchUrl(`https://tlidb.com/en/${page}`),
        fetchUrl(`https://tlidb.com/cn/${page}`),
      ]);

      if (!enHtml || !cnHtml) {
        console.log(`  ⚠️  Page not found`);
        continue;
      }

      const enTexts = extractAllText(enHtml);
      const cnTexts = extractAllText(cnHtml);

      console.log(`  EN texts: ${enTexts.size}, CN texts: ${cnTexts.size}`);

      // 精确匹配
      let matched = 0;
      enTexts.forEach(enText => {
        // 尝试直接匹配
        if (cnTexts.has(enText)) {
          if (enText !== cnTexts.get(enText) && !allTranslations[enText]) {
            allTranslations[enText] = enText;
            matched++;
          }
        }

        // 尝试模糊匹配（处理数值差异）
        cnTexts.forEach(cnText => {
          if (cnText && enText && cnText !== enText) {
            // 标准化后比较
            const enNorm = enText.replace(/[\d\.\-\–\—]+/g, '#').replace(/\s+/g, ' ');
            const cnNorm = cnText.replace(/[\d\.\-\–\—]+/g, '#').replace(/\s+/g, ' ');

            if (enNorm === cnNorm && !allTranslations[enText]) {
              allTranslations[enText] = cnText;
              matched++;
            }
          }
        });
      });

      console.log(`  ✅ Matched: ${matched}`);
      totalMatched += matched;

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }

  console.log(`\n=================================================`);
  console.log(`✅ Total translations extracted: ${Object.keys(allTranslations).length}`);
  console.log(`=================================================\n`);

  // 保存
  fs.writeFileSync(
    path.join(outDir, 'all-website-texts.json'),
    JSON.stringify(allTranslations, null, 2),
    'utf-8'
  );

  console.log(`✅ Saved to all-website-texts.json`);

  // 显示样本
  console.log('\nSample translations:');
  let count = 0;
  Object.entries(allTranslations).slice(0, 20).forEach(([en, cn]) => {
    console.log(`  ${en.substring(0, 50).padEnd(50)} → ${cn.substring(0, 50)}`);
    count++;
  });
}

scrapeCraft().catch(console.error);
