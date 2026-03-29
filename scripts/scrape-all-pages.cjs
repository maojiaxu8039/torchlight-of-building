const https = require("https");
const fs = require("fs");
const path = require("path");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function scrapePage(enUrl, cnUrl, pageName) {
  console.log(`\n=== Scraping ${pageName} ===`);

  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(enUrl),
      fetchUrl(cnUrl),
    ]);

    console.log(`EN: ${enHtml.length} chars, CN: ${cnHtml.length} chars`);

    const enById = {};
    const cnById = {};

    // Pattern: data-modifier-id="ID">...text...</span>
    const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
    let match;

    while ((match = pattern.exec(enHtml)) !== null) {
      const id = match[1];
      const text = match[2]
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "–")
        .replace(/\s+/g, " ")
        .trim();
      if (text && text.length > 2) {
        enById[id] = text;
      }
    }

    while ((match = pattern.exec(cnHtml)) !== null) {
      const id = match[1];
      const text = match[2]
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "–")
        .replace(/\s+/g, " ")
        .trim();
      if (text && text.length > 2) {
        cnById[id] = text;
      }
    }

    console.log(
      `EN modifiers: ${Object.keys(enById).length}, CN modifiers: ${Object.keys(cnById).length}`,
    );

    // Match by ID
    const translations = {};
    Object.entries(enById).forEach(([id, enText]) => {
      if (cnById[id] && enText !== cnById[id]) {
        const enLen = enText.replace(/[\d.\-–()%]/g, "").length;
        const cnLen = cnById[id].replace(/[\d\u4e00-\u9fa5]/g, "").length;
        if (enLen > 2 && cnLen > 0) {
          translations[enText] = cnById[id];
        }
      }
    });

    console.log(`Matched: ${Object.keys(translations).length}`);
    return translations;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return {};
  }
}

async function main() {
  console.log("=== Scraping all pages for complete translations ===\n");

  // Define pages to scrape with their Type categories
  const pages = [
    // Belt - Base Affixes
    {
      en: "https://tlidb.com/en/Belt",
      cn: "https://tlidb.com/cn/Belt",
      type: "Base Affix",
    },
    {
      en: "https://tlidb.com/en/STR_Helmet",
      cn: "https://tlidb.com/cn/STR_Helmet",
      type: "Base Affix",
    },
    {
      en: "https://tlidb.com/en/DEX_Helmet",
      cn: "https://tlidb.com/cn/DEX_Helmet",
      type: "Base Affix",
    },
    {
      en: "https://tlidb.com/en/INT_Helmet",
      cn: "https://tlidb.com/cn/INT_Helmet",
      type: "Base Affix",
    },
    {
      en: "https://tlidb.com/en/STR_Gloves",
      cn: "https://tlidb.com/cn/STR_Gloves",
      type: "Base Affix",
    },
    {
      en: "https://tlidb.com/en/DEX_Gloves",
      cn: "https://tlidb.com/cn/DEX_Gloves",
      type: "Base Affix",
    },
    {
      en: "https://tlidb.com/en/INT_Gloves",
      cn: "https://tlidb.com/cn/INT_Gloves",
      type: "Base Affix",
    },
    {
      en: "https://tlidb.com/en/STR_Boots",
      cn: "https://tlidb.com/cn/STR_Boots",
      type: "Base Affix",
    },
    {
      en: "https://tlidb.com/en/DEX_Boots",
      cn: "https://tlidb.com/cn/DEX_Boots",
      type: "Base Affix",
    },
    {
      en: "https://tlidb.com/en/INT_Boots",
      cn: "https://tlidb.com/cn/INT_Boots",
      type: "Base Affix",
    },
  ];

  // Scrape all pages
  const allTranslations = {};

  for (const page of pages) {
    const translations = await scrapePage(
      page.en,
      page.cn,
      `${page.type} - ${page.en.split("/").pop()}`,
    );
    Object.assign(allTranslations, translations);
  }

  console.log(
    `\n=== Total translations collected: ${Object.keys(allTranslations).length} ===\n`,
  );

  // Save
  const outDir = path.join(__dirname, "../src/data/translated-affixes");

  // Load existing and merge
  const existingPath = path.join(outDir, "merged-all-translations.json");
  const existing = fs.existsSync(existingPath)
    ? JSON.parse(fs.readFileSync(existingPath, "utf8"))
    : {};

  const merged = { ...existing, ...allTranslations };

  // Sort by length (longest first for matching priority)
  const sorted = Object.entries(merged).sort(
    (a, b) => b[0].length - a[0].length,
  );
  const sortedTranslations = {};
  sorted.forEach(([en, cn]) => {
    sortedTranslations[en] = cn;
  });

  // Save
  fs.writeFileSync(
    existingPath,
    JSON.stringify(sortedTranslations, null, 2),
    "utf-8",
  );

  console.log(`✅ Saved to merged-all-translations.json`);
  console.log(`Total: ${Object.keys(sortedTranslations).length}`);

  // Save new translations
  fs.writeFileSync(
    path.join(outDir, "scraped-translations.json"),
    JSON.stringify(allTranslations, null, 2),
    "utf-8",
  );

  console.log(`✅ Saved new translations to scraped-translations.json`);

  // Show sample
  console.log("\n=== Sample translations ===\n");
  let count = 0;
  Object.entries(allTranslations)
    .slice(0, 10)
    .forEach(([en, cn]) => {
      console.log(`${count + 1}. ${en}`);
      console.log(`   → ${cn}`);
      count++;
    });
}

main();
