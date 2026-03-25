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

async function scrapeBelt() {
  console.log('=== Scraping Belt pages from tlidb.com ===\n');

  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl('https://tlidb.com/en/Belt'),
      fetchUrl('https://tlidb.com/cn/Belt'),
    ]);

    console.log(`EN HTML size: ${enHtml.length}`);
    console.log(`CN HTML size: ${cnHtml.length}\n`);

    // Extract data-modifier-id with their text from <span> tags
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

    console.log(`EN modifiers extracted: ${Object.keys(enById).length}`);
    console.log(`CN modifiers extracted: ${Object.keys(cnById).length}\n`);

    // Match by ID
    const translations = {};
    let matched = 0;
    let skipped = 0;

    Object.entries(enById).forEach(([id, enText]) => {
      if (cnById[id] && enText !== cnById[id]) {
        // Validate: ensure it's not just numbers or very short
        const enLen = enText.replace(/[\d\.\-\–\(\)\%]/g, '').length;
        const cnLen = cnById[id].replace(/[\d\u4e00-\u9fa5]/g, '').length;

        if (enLen > 2 && cnLen > 0) {
          translations[enText] = cnById[id];
          matched++;
        } else {
          skipped++;
        }
      }
    });

    console.log(`Matched translations: ${matched}`);
    console.log(`Skipped (invalid): ${skipped}\n`);

    // Save to file
    const outDir = path.join(__dirname, '../src/data/translated-affixes');

    // Backup existing translations
    const existingPath = path.join(outDir, 'merged-all-translations.json');
    const backupPath = path.join(outDir, 'backup-translations.json');

    if (fs.existsSync(existingPath)) {
      fs.copyFileSync(existingPath, backupPath);
      console.log(`✅ Backed up existing translations to backup-translations.json`);
    }

    // Load existing and merge
    const existing = fs.existsSync(existingPath)
      ? JSON.parse(fs.readFileSync(existingPath, 'utf8'))
      : {};

    const merged = { ...existing, ...translations };

    // Sort by length (longest first for matching priority)
    const sorted = Object.entries(merged).sort((a, b) => b[0].length - a[0].length);
    const sortedTranslations = {};
    sorted.forEach(([en, cn]) => {
      sortedTranslations[en] = cn;
    });

    // Save
    fs.writeFileSync(
      existingPath,
      JSON.stringify(sortedTranslations, null, 2),
      'utf-8'
    );

    console.log(`✅ Saved to merged-all-translations.json`);
    console.log(`Total translations: ${Object.keys(sortedTranslations).length}`);
    console.log(`New translations from Belt: ${Object.keys(translations).length}`);

    // Show sample
    console.log('\n=== Sample translations from Belt ===\n');
    let count = 0;
    Object.entries(translations).slice(0, 20).forEach(([en, cn]) => {
      console.log(`${count + 1}. ${en}`);
      console.log(`   → ${cn}`);
      count++;
    });

    // Save Belt-specific translations
    fs.writeFileSync(
      path.join(outDir, 'belt-translations.json'),
      JSON.stringify(translations, null, 2),
      'utf-8'
    );

    console.log('\n✅ Saved Belt-specific translations to belt-translations.json');

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

scrapeBelt();
