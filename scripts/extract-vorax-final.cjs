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

async function extractVorax() {
  console.log("=== Extracting Vorax Limb translations ===\n");

  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl("https://tlidb.com/en/Vorax_Limb%3A_Hands"),
      fetchUrl("https://tlidb.com/cn/Vorax_Limb%3A_Hands"),
    ]);

    console.log(`EN size: ${enHtml.length}, CN size: ${cnHtml.length}`);

    // Extract data-modifier-id with their text
    const enByModifier = {};
    const cnByModifier = {};

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
        enByModifier[id] = text;
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
        cnByModifier[id] = text;
      }
    }

    console.log(`EN modifiers: ${Object.keys(enByModifier).length}`);
    console.log(`CN modifiers: ${Object.keys(cnByModifier).length}`);

    // Match
    const translations = {};
    let matched = 0;

    Object.entries(enByModifier).forEach(([id, enText]) => {
      if (cnByModifier[id] && enText !== cnByModifier[id]) {
        translations[enText] = cnByModifier[id];
        matched++;
      }
    });

    console.log(`Matched: ${matched}`);

    // Save
    const outDir = path.join(__dirname, "../src/data/translated-affixes");

    // Add to existing translations
    const existing = JSON.parse(
      fs.readFileSync(
        path.join(outDir, "merged-all-translations.json"),
        "utf8",
      ),
    );
    const merged = { ...existing, ...translations };

    fs.writeFileSync(
      path.join(outDir, "merged-all-translations.json"),
      JSON.stringify(merged, null, 2),
      "utf-8",
    );

    console.log(
      `\n✅ Added ${matched} translations to merged-all-translations.json`,
    );
    console.log(`Total: ${Object.keys(merged).length}`);

    // Show sample
    console.log("\nSample:");
    let count = 0;
    Object.entries(translations)
      .slice(0, 5)
      .forEach(([en, cn]) => {
        console.log(`  ${en.substring(0, 50)}`);
        console.log(`    → ${cn.substring(0, 50)}`);
        count++;
      });
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

extractVorax();
