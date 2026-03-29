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

    // Find all table rows
    const enRows = enHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    const cnRows = cnHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];

    console.log(`EN rows: ${enRows.length}, CN rows: ${cnRows.length}`);

    const enByModifier = {};
    const cnByModifier = {};

    enRows.forEach((row) => {
      const modifierMatch = row.match(/data-modifier-id="([^"]+)"/);
      if (modifierMatch) {
        const id = modifierMatch[1];
        // Get last td
        const tds = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
        if (tds.length > 0) {
          const lastTd = tds[tds.length - 1];
          const text = lastTd
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (text && text.length > 5) {
            enByModifier[id] = text;
          }
        }
      }
    });

    cnRows.forEach((row) => {
      const modifierMatch = row.match(/data-modifier-id="([^"]+)"/);
      if (modifierMatch) {
        const id = modifierMatch[1];
        const tds = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
        if (tds.length > 0) {
          const lastTd = tds[tds.length - 1];
          const text = lastTd
            .replace(/<[^>]+>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (text && text.length > 5) {
            cnByModifier[id] = text;
          }
        }
      }
    });

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
    fs.writeFileSync(
      path.join(outDir, "vorax-limb-translations.json"),
      JSON.stringify(translations, null, 2),
      "utf-8",
    );

    console.log(`\n✅ Saved ${Object.keys(translations).length} translations`);

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
