import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PageTranslation {
  url: string;
  name: string;
  translations: Map<string, string>;
}

const PAGES_TO_SCRAPE = [
  { url: 'Craft', name: 'Craft词缀' },
  { url: 'Legendary_Gear', name: '传奇装备' },
  { url: 'Talent', name: '神格石板/天赋' },
  { url: 'Active_Skill', name: '主动技能' },
  { url: 'Support_Skill', name: '辅助技能' },
  { url: 'Passive_Skill', name: '被动技能' },
  { url: 'Activation_Medium_Skill', name: '触媒技能' },
  { url: 'Noble_Support_Skill', name: '崇高辅助技能' },
  { url: 'Magnificent_Support_Skill', name: '华贵辅助技能' },
  { url: 'Hero', name: '英雄' },
  { url: 'Pactspirit', name: '契约之灵' },
  { url: 'Ethereal_Prism', name: '异度棱镜' },
  { url: 'Destiny', name: '命运' },
  { url: 'Corrosion', name: '侵蚀' },
  { url: 'Dream_Talking', name: '梦语' },
  { url: 'Blending_Rituals', name: '调香秘仪' },
  { url: 'TOWER_Sequence', name: '高塔序列' },
  { url: 'Graft', name: '缝合' },
];

async function fetchPage(url: string): Promise<string> {
  console.log(`  Fetching: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`  ⚠️  Page not found: ${response.status}`);
      return '';
    }
    return response.text();
  } catch (error) {
    console.log(`  ❌ Error: ${error}`);
    return '';
  }
}

function extractTranslations(html: string, pageName: string): Map<string, string> {
  const translations = new Map<string, string>();

  if (!html) return translations;

  const $ = cheerio.load(html);

  // Method 1: Extract from Craft table (data-modifier-id)
  $('tr').each((_, tr) => {
    const $tr = $(tr);
    const $modifierSpan = $tr.find('[data-modifier-id]');

    if ($modifierSpan.length > 0) {
      const modifierId = $modifierSpan.attr('data-modifier-id');
      if (modifierId) {
        const text = $modifierSpan.clone().find('.Hyperlink').remove().end().text()
          .replace(/\s+/g, ' ')
          .trim();

        if (text && text.length > 1) {
          translations.set(text, text);
        }
      }
    }
  });

  // Method 2: Extract from links with data-hover
  $('a[data-hover]').each((_, elem) => {
    const $elem = $(elem);
    const href = $elem.attr('href');
    const text = $elem.text().trim();

    if (href && text && href !== '#' && href.length > 1) {
      const enName = href.replace(/_/g, ' ');
      if (enName && text !== enName && text.length > 1) {
        translations.set(enName, text);
      }
    }
  });

  // Method 3: Extract from skill tables
  $('table').each((_, table) => {
    const $table = $(table);
    $table.find('td').each((_, td) => {
      const text = $(td).text().trim();
      if (text && text.length > 2 && text.length < 200) {
        translations.set(text, text);
      }
    });
  });

  return translations;
}

async function scrapeAllPages(): Promise<void> {
  const outputDir = path.join(__dirname, '../src/data/translated-affixes');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('=== Starting to scrape all tlidb.com pages ===\n');
  console.log(`Total pages to scrape: ${PAGES_TO_SCRAPE.length}\n`);

  const allTranslations = new Map<string, string>();
  let totalTranslations = 0;

  for (const page of PAGES_TO_SCRAPE) {
    console.log(`\n📄 Scraping: ${page.name} (${page.url})`);

    try {
      const [enHtml, cnHtml] = await Promise.all([
        fetchPage(`https://tlidb.com/en/${page.url}`),
        fetchPage(`https://tlidb.com/cn/${page.url}`),
      ]);

      const enTranslations = extractTranslations(enHtml, page.name);
      const cnTranslations = extractTranslations(cnHtml, page.name);

      console.log(`  EN translations: ${enTranslations.size}`);
      console.log(`  CN translations: ${cnTranslations.size}`);

      // Match EN with CN
      let matched = 0;
      enTranslations.forEach((enText, enKey) => {
        if (cnTranslations.has(enKey)) {
          const cnText = cnTranslations.get(enKey);
          if (cnText && !allTranslations.has(enText)) {
            allTranslations.set(enText, cnText);
            matched++;
          }
        }
      });

      console.log(`  Matched: ${matched}`);

      // Also try matching by modifier ID if available
      const $ = cheerio.load(cnHtml);
      $('tr').each((_, tr) => {
        const $tr = $(tr);
        const $modifierSpan = $tr.find('[data-modifier-id]');
        const $td = $tr.find('td').last();
        const modifierId = $modifierSpan.attr('data-modifier-id');
        const cnText = $td.text().trim();

        if (modifierId && cnText && cnText.length > 1) {
          // Find matching EN text
          const $en = cheerio.load(enHtml);
          $en('tr').each((_, enTr) => {
            const $enTr = $en(enTr);
            const $enSpan = $enTr.find('[data-modifier-id]');
            const $enTd = $enTr.find('td').last();
            const enModifierId = $enSpan.attr('data-modifier-id');
            const enText = $enTd.text().trim();

            if (enModifierId === modifierId && enText && !allTranslations.has(enText)) {
              allTranslations.set(enText, cnText);
              matched++;
            }
          });
        }
      });

      totalTranslations += matched;
      console.log(`  Total matched so far: ${allTranslations.size}`);

      // Save individual page results
      const pageResults: Record<string, string> = {};
      enTranslations.forEach((enText) => {
        if (cnTranslations.has(enText)) {
          const cnText = cnTranslations.get(enText);
          if (cnText) {
            pageResults[enText] = cnText;
          }
        }
      });

      const pageFile = path.join(outputDir, `${page.url.toLowerCase()}-translations.json`);
      fs.writeFileSync(pageFile, JSON.stringify(pageResults, null, 2), 'utf-8');
      console.log(`  ✅ Saved to: ${pageFile}`);

    } catch (error) {
      console.log(`  ❌ Error scraping ${page.name}: ${error}`);
    }
  }

  console.log('\n=================================================');
  console.log('              SCRAPING SUMMARY');
  console.log('=================================================');
  console.log(`Pages scraped: ${PAGES_TO_SCRAPE.length}`);
  console.log(`Total unique translations: ${allTranslations.size}`);
  console.log('=================================================\n');

  // Save combined results
  const combinedFile = path.join(outputDir, 'all-tlidb-translations.json');
  const combinedData: Record<string, string> = {};
  allTranslations.forEach((cn, en) => {
    combinedData[en] = cn;
  });
  fs.writeFileSync(combinedFile, JSON.stringify(combinedData, null, 2), 'utf-8');
  console.log(`✅ Saved combined: ${combinedFile}`);

  console.log('\n=== Sample Translations ===');
  let count = 0;
  allTranslations.forEach((cn, en) => {
    if (count < 20 && en.length > 10 && en.length < 100) {
      console.log(`  ${en.substring(0, 50).padEnd(50)} → ${cn.substring(0, 50)}`);
      count++;
    }
  });
}

scrapeAllPages().catch(console.error);
