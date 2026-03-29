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

async function scrapeBelt() {
  console.log("=== Scraping Belt pages from tlidb.com ===\n");

  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl("https://tlidb.com/en/Belt"),
      fetchUrl("https://tlidb.com/cn/Belt"),
    ]);

    console.log(`EN HTML size: ${enHtml.length}`);
    console.log(`CN HTML size: ${cnHtml.length}\n`);

    // Extract all data with their IDs
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

    console.log(`EN modifiers: ${Object.keys(enById).length}`);
    console.log(`CN modifiers: ${Object.keys(cnById).length}\n`);

    // Match by ID
    const translations = {};
    let matched = 0;

    Object.entries(enById).forEach(([id, enText]) => {
      if (cnById[id] && enText !== cnById[id]) {
        // Validate: ensure it's not just numbers or very short
        const enLen = enText.replace(/[\d.\-–()%]/g, "").length;
        const cnLen = cnById[id].replace(/[\d\u4e00-\u9fa5]/g, "").length;

        if (enLen > 2 && cnLen > 0) {
          translations[enText] = cnById[id];
          matched++;
        }
      }
    });

    console.log(`Matched translations: ${matched}\n`);

    // Find the specific translation user mentioned
    const targetTranslations = Object.entries(translations).filter(
      ([en]) => en.includes("Wilt") && en.includes("Damage Over Time"),
    );

    console.log("=== Target translations (Wilt Damage Over Time) ===\n");
    targetTranslations.forEach(([en, cn]) => {
      console.log(`EN: ${en}`);
      console.log(`CN: ${cn}`);
      console.log("");
    });

    // Save to file
    const outDir = path.join(__dirname, "../src/data/translated-affixes");

    // Update merged translations
    const existingPath = path.join(outDir, "merged-all-translations.json");
    const existing = fs.existsSync(existingPath)
      ? JSON.parse(fs.readFileSync(existingPath, "utf8"))
      : {};

    const merged = { ...existing, ...translations };

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
    console.log(
      `Total translations: ${Object.keys(sortedTranslations).length}`,
    );
    console.log(`New from Belt: ${Object.keys(translations).length}`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

scrapeBelt();
