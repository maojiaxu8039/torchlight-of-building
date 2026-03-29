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

async function extractTranslations() {
  console.log("=== Extracting Vorax Limb translations ===\n");

  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl("https://tlidb.com/en/Vorax_Limb%3A_Hands"),
      fetchUrl("https://tlidb.com/cn/Vorax_Limb%3A_Hands"),
    ]);

    console.log(`EN HTML size: ${enHtml.length}`);
    console.log(`CN HTML size: ${cnHtml.length}\n`);

    // Extract all data-modifier-id with their values
    const enModifiers = {};
    const cnModifiers = {};

    // Pattern to match: data-modifier-id="ID" ... last <td>text</td>
    const pattern =
      /data-modifier-id="([^"]+)"[^]*?<td[^>]*>([\s\S]*?)<\/td>(?=[^]*?<\/tr>)/gi;

    let match;
    while ((match = pattern.exec(enHtml)) !== null) {
      const id = match[1];
      const tdContent = match[2];
      const text = tdContent
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (text && text.length > 2) {
        enModifiers[id] = text;
      }
    }

    while ((match = pattern.exec(cnHtml)) !== null) {
      const id = match[1];
      const tdContent = match[2];
      const text = tdContent
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (text && text.length > 2) {
        cnModifiers[id] = text;
      }
    }

    console.log(`EN modifiers extracted: ${Object.keys(enModifiers).length}`);
    console.log(`CN modifiers extracted: ${Object.keys(cnModifiers).length}\n`);

    // Match by ID
    const translations = {};
    let matched = 0;

    Object.entries(enModifiers).forEach(([id, enText]) => {
      if (cnModifiers[id] && enText !== cnModifiers[id]) {
        translations[enText] = cnModifiers[id];
        matched++;
      }
    });

    console.log(`Matched translations: ${matched}\n`);

    // Save to file
    const outDir = path.join(__dirname, "../src/data/translated-affixes");
    fs.writeFileSync(
      path.join(outDir, "vorax-limb-translations.json"),
      JSON.stringify(translations, null, 2),
      "utf-8",
    );

    console.log(`✅ Saved to vorax-limb-translations.json`);

    // Show sample
    console.log("\nSample translations:");
    let count = 0;
    Object.entries(translations)
      .slice(0, 10)
      .forEach(([en, cn]) => {
        console.log(`  ${en.substring(0, 60)}`);
        console.log(`    → ${cn.substring(0, 60)}`);
        count++;
      });
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

extractTranslations();
