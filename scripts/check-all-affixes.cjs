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

// 从所有 gear-affix 文件中提取 craftableAffix
function extractFromGearAffix() {
  const affixes = new Set();
  const gearAffixDir = path.join(__dirname, '../src/data/gear-affix');

  const files = fs.readdirSync(gearAffixDir).filter(f => f.endsWith('.ts'));

  files.forEach(file => {
    const content = fs.readFileSync(path.join(gearAffixDir, file), 'utf8');
    const matches = content.match(/craftableAffix:\s*"([^"]+)"/g);

    if (matches) {
      matches.forEach(match => {
        const affix = match.match(/craftableAffix:\s*"([^"]+)"/)[1];
        affixes.add(affix);
      });
    }
  });

  return affixes;
}

// 从 all-affixes.ts 提取
function extractFromAllAffixes() {
  const affixes = new Set();
  const file = path.join(__dirname, '../src/data/gear-affix/all-affixes.ts');

  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/craftableAffix:\s*"([^"]+)"/g);

    if (matches) {
      matches.forEach(match => {
        const affix = match.match(/craftableAffix:\s*"([^"]+)"/)[1];
        affixes.add(affix);
      });
    }
  }

  return affixes;
}

// 从 base-gear 文件提取 stats
function extractFromBaseGear() {
  const affixes = new Set();
  const baseGearFile = path.join(__dirname, '../src/data/gear-base/all-base-gear.ts');

  if (fs.existsSync(baseGearFile)) {
    const content = fs.readFileSync(baseGearFile, 'utf8');
    const matches = content.match(/stats:\s*"([^"]+)"/g);

    if (matches) {
      matches.forEach(match => {
        const stat = match.match(/stats:\s*"([^"]+)"/)[1];
        if (stat) {
          stat.split('\n').forEach(s => {
            const cleaned = s.trim();
            if (cleaned && cleaned.length > 1) {
              affixes.add(cleaned);
            }
          });
        }
      });
    }
  }

  return affixes;
}

// 从网站抓取所有词条
async function scrapeFromWebsite() {
  const translations = {};

  console.log('\n📄 Scraping from tlidb.com...\n');

  const pages = [
    'Craft',
    'Belt', 'Necklace', 'Ring',
    'One-Handed_Sword', 'Two-Handed_Sword',
    'One-Handed_Axe', 'Two-Handed_Axe',
    'One-Handed_Hammer', 'Two-Handed_Hammer',
    'Dagger', 'Wand', 'Tin_Staff',
    'Bow', 'Crossbow', 'Pistol', 'Musket',
    'Cane', 'Shield', 'Claw', 'Rod', 'Scepter',
    'Fire_Cannon', 'Spirit_Ring',
    'DEX_Boots', 'INT_Boots', 'STR_Boots',
    'DEX_Gloves', 'INT_Gloves', 'STR_Gloves',
    'DEX_Helmet', 'INT_Helmet', 'STR_Helmet',
    'DEX_Shield', 'INT_Shield', 'STR_Shield',
    'Legendary_Gear',
    'Active_Skill', 'Support_Skill', 'Passive_Skill',
    'Activation_Medium_Skill',
    'Noble_Support_Skill', 'Magnificent_Support_Skill',
    'Pactspirit',
    'Ethereal_Prism',
    'Destiny',
    'Corrosion',
    'Dream_Talking',
    'Blending_Rituals',
    'TOWER_Sequence',
    'Graft',
  ];

  for (const page of pages) {
    try {
      console.log(`  Scraping ${page}...`);

      const [enHtml, cnHtml] = await Promise.all([
        fetchUrl(`https://tlidb.com/en/${page}`),
        fetchUrl(`https://tlidb.com/cn/${page}`),
      ]);

      if (!enHtml || !cnHtml || enHtml.length < 1000) continue;

      // 提取所有带有 data-modifier-id 的行
      const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let trMatch;

      const enById = {};
      const cnById = {};

      while ((trMatch = trPattern.exec(enHtml)) !== null) {
        const idMatch = trMatch[1].match(/data-modifier-id=["']([^"']+)["']/);
        if (idMatch) {
          const tdMatch = trMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
          if (tdMatch) {
            const lastTd = tdMatch[tdMatch.length - 1];
            const text = lastTd.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            if (text && text.length > 2) {
              enById[idMatch[1]] = text;
            }
          }
        }
      }

      while ((trMatch = trPattern.exec(cnHtml)) !== null) {
        const idMatch = trMatch[1].match(/data-modifier-id=["']([^"']+)["']/);
        if (idMatch) {
          const tdMatch = trMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
          if (tdMatch) {
            const lastTd = tdMatch[tdMatch.length - 1];
            const text = lastTd.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            if (text && text.length > 2) {
              cnById[idMatch[1]] = text;
            }
          }
        }
      }

      // 匹配
      let matched = 0;
      Object.entries(enById).forEach(([id, enText]) => {
        if (cnById[id] && enText !== cnById[id]) {
          if (!translations[enText]) {
            translations[enText] = cnById[id];
            matched++;
          }
        }
      });

      console.log(`    ✅ ${matched} new translations`);

    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }

  return translations;
}

async function main() {
  console.log('🚀 Starting complete affix check and matching...\n');

  // 1. 提取项目中的所有词条
  console.log('📦 Extracting affixes from project...\n');

  const gearAffixes = extractFromGearAffix();
  const allAffixes = extractFromAllAffixes();
  const baseGearStats = extractFromBaseGear();

  const allProjectAffixes = new Set([
    ...gearAffixes,
    ...allAffixes,
    ...baseGearStats
  ]);

  console.log(`  Gear affixes: ${gearAffixes.size}`);
  console.log(`  All affixes: ${allAffixes.size}`);
  console.log(`  Base gear stats: ${baseGearStats.size}`);
  console.log(`  Total unique: ${allProjectAffixes.size}\n`);

  // 2. 加载现有的翻译
  const outDir = path.join(__dirname, '../src/data/translated-affixes');
  const existingFile = path.join(outDir, 'merged-all-translations.json');

  const existingTranslations = fs.existsSync(existingFile)
    ? JSON.parse(fs.readFileSync(existingFile, 'utf8'))
    : {};

  console.log(`📚 Existing translations: ${Object.keys(existingTranslations).length}\n`);

  // 3. 检查缺失的翻译
  const missing = [];
  const found = [];

  allProjectAffixes.forEach(affix => {
    if (existingTranslations[affix]) {
      found.push(affix);
    } else {
      missing.push(affix);
    }
  });

  console.log(`✅ Found translations: ${found.length}`);
  console.log(`⚠️  Missing translations: ${missing.length}\n`);

  // 显示一些缺失的例子
  if (missing.length > 0 && missing.length <= 50) {
    console.log('Sample missing affixes:');
    missing.slice(0, 20).forEach(affix => {
      console.log(`  - ${affix}`);
    });
    console.log('');
  }

  // 4. 从网站下载翻译
  console.log('🌐 Downloading translations from website...\n');

  const websiteTranslations = await scrapeFromWebsite();
  console.log(`\n✅ Total website translations: ${Object.keys(websiteTranslations).length}\n`);

  // 5. 合并并更新
  const mergedTranslations = { ...existingTranslations, ...websiteTranslations };

  // 保存更新
  fs.writeFileSync(
    path.join(outDir, 'merged-all-translations.json'),
    JSON.stringify(mergedTranslations, null, 2),
    'utf-8'
  );

  // 6. 更新 complete-affix-translations.ts
  let tsContent = `// Auto-generated file - Do not edit manually
// Generated from tlidb.com EN/CN translations
// Complete affix translations (all sources)

export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = {
`;

  Object.entries(mergedTranslations).forEach(([en, cn]) => {
    const escapedEn = en.replace(/'/g, "\\'");
    const escapedCn = cn.replace(/'/g, "\\'");
    tsContent += `  '${escapedEn}': '${escapedCn}',\n`;
  });

  tsContent += `};

export const getAffixNameTranslation = (enName: string): string => {
  const lower = enName.toLowerCase();
  return AFFIX_NAME_TRANSLATIONS[lower] ?? enName;
};

export const COMMON_STAT_NAMES = [
${Object.keys(mergedTranslations).slice(0, 30).map(en => `  '${en.replace(/'/g, "\\'")}',`).join('\n')}
];
`;

  fs.writeFileSync(
    path.join(outDir, 'complete-affix-translations.ts'),
    tsContent,
    'utf-8'
  );

  console.log('📊 Final Summary:');
  console.log(`  Existing translations: ${Object.keys(existingTranslations).length}`);
  console.log(`  New from website: ${Object.keys(websiteTranslations).length}`);
  console.log(`  Total merged: ${Object.keys(mergedTranslations).length}\n`);

  console.log('✅ Updated complete-affix-translations.ts');
  console.log('✅ All done!');
}

main().catch(console.error);
