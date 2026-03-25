const fs = require('fs');
const path = require('path');
const https = require('https');

const PAGES = [
  { url: 'Craft', name: 'Craft' },
  { url: 'Legendary_Gear', name: 'Legendary' },
  { url: 'Talent', name: 'Talent' },
  { url: 'Active_Skill', name: 'Active' },
  { url: 'Support_Skill', name: 'Support' },
  { url: 'Passive_Skill', name: 'Passive' },
  { url: 'Activation_Medium_Skill', name: 'Activation' },
  { url: 'Noble_Support_Skill', name: 'Noble' },
  { url: 'Magnificent_Support_Skill', name: 'Magnificent' },
  { url: 'Hero', name: 'Hero' },
  { url: 'Pactspirit', name: 'Pactspirit' },
  { url: 'Ethereal_Prism', name: 'Prism' },
  { url: 'Destiny', name: 'Destiny' },
  { url: 'Corrosion', name: 'Corrosion' },
  { url: 'Dream_Talking', name: 'Dream' },
  { url: 'Blending_Rituals', name: 'Blending' },
  { url: 'TOWER_Sequence', name: 'Tower' },
  { url: 'Graft', name: 'Graft' },
];

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

async function scrapePage(page) {
  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl(`https://tlidb.com/en/${page.url}`),
    fetchUrl(`https://tlidb.com/cn/${page.url}`),
  ]);

  const translations = {};

  // Extract from EN page
  const enById = {};
  const enMatches = enHtml.match(/data-modifier-id="([^"]+)"/g);
  if (enMatches) {
    enMatches.forEach(match => {
      const id = match.match(/data-modifier-id="([^"]+)"/)[1];
      const regex = new RegExp(`data-modifier-id="${id}"[^>]*>[^<]*<[^>]*>[^>]*>[^>]*>([^<]+)`, 'g');
      let m;
      while ((m = regex.exec(enHtml)) !== null) {
        enById[id] = m[1].trim();
      }
    });
  }

  // Extract from CN page
  const cnById = {};
  const cnMatches = cnHtml.match(/data-modifier-id="([^"]+)"/g);
  if (cnMatches) {
    cnMatches.forEach(match => {
      const id = match.match(/data-modifier-id="([^"]+)"/)[1];
      const regex = new RegExp(`data-modifier-id="${id}"[^>]*>[^<]*<[^>]*>[^>]*>[^>]*>([^<]+)`, 'g');
      let m;
      while ((m = regex.exec(cnHtml)) !== null) {
        cnById[id] = m[1].trim();
      }
    });
  }

  // Match
  Object.keys(enById).forEach(id => {
    if (cnById[id] && enById[id] && cnById[id]) {
      translations[enById[id]] = cnById[id];
    }
  });

  console.log(`✅ ${page.name}: ${Object.keys(translations).length} translations`);

  const outDir = path.join(__dirname, '../src/data/translated-affixes');
  fs.writeFileSync(
    path.join(outDir, `${page.name.toLowerCase()}-translations.json`),
    JSON.stringify(translations, null, 2),
    'utf-8'
  );
}

async function main() {
  console.log('🚀 Starting scrape...\n');

  const outDir = path.join(__dirname, '../src/data/translated-affixes');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const page of PAGES) {
    try {
      await scrapePage(page);
    } catch (e) {
      console.log(`❌ ${page.name}: Error - ${e.message}`);
    }
  }

  console.log('\n✅ All done!');
}

main().catch(console.error);
