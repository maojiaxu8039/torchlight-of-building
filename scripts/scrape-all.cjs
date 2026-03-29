const https = require("https");
const http = require("http");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function extractModifiers(html) {
  const modifiers = {};
  const tableRows = html.match(/<tr>.*?<\/tr>/gs) || [];

  tableRows.forEach((row) => {
    const idMatch = row.match(/data-modifier-id="(\d+)"/);
    if (idMatch) {
      const id = idMatch[1];
      let text = row
        .replace(/<[^>]+>/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
      text = text.replace(/^\d+\s+/, "");
      if (text.length > 3) {
        modifiers[id] = text;
      }
    }
  });

  return modifiers;
}

function cleanText(en, cn) {
  en = en.replace(/\s+\d+\s+\d+$/g, "").trim();
  en = en.replace(/\s+[A-Z][a-zA-Z]+(\s+[A-Z][a-zA-Z]+)*$/g, "").trim();
  cn = cn.replace(/\s+\d+\s+\d+$/g, "").trim();
  cn = cn.replace(/\s+[A-Z][a-zA-Z]+\s+[^】]+/g, "").trim();
  return { en, cn };
}

const pages = [
  "DEX_Boots",
  "STR_Boots",
  "INT_Boots",
  "STR_Weapon",
  "DEX_Weapon",
  "INT_Weapon",
  "STR_Armor",
  "DEX_Armor",
  "INT_Armor",
  "Ring",
  "Amulet",
  "Belt",
];

async function main() {
  const existingTranslations = JSON.parse(
    fs.readFileSync(
      "src/data/translated-affixes/merged-all-translations.json",
      "utf8",
    ),
  );
  let totalAdded = 0;

  for (const page of pages) {
    try {
      console.log(`Fetching ${page}...`);
      const enHtml = await fetchUrl(`https://tlidb.com/en/${page}`);
      const cnHtml = await fetchUrl(`https://tlidb.com/cn/${page}`);

      const enModifiers = extractModifiers(enHtml);
      const cnModifiers = extractModifiers(cnHtml);

      let added = 0;
      Object.keys(enModifiers).forEach((id) => {
        if (cnModifiers[id]) {
          const { en, cn } = cleanText(enModifiers[id], cnModifiers[id]);
          if (en.length > 3 && cn.length > 3 && !existingTranslations[en]) {
            existingTranslations[en] = cn;
            added++;
            totalAdded++;
          }
        }
      });

      console.log(`  ${page}: +${added} translations`);
    } catch (e) {
      console.log(`  ${page}: Error - ${e.message}`);
    }
  }

  const sorted = Object.entries(existingTranslations).sort(
    (a, b) => b[0].length - a[0].length,
  );
  const result = {};
  sorted.forEach((e) => {
    result[e[0]] = e[1];
  });
  fs.writeFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    JSON.stringify(result, null, 2),
  );

  console.log(`\nTotal added: ${totalAdded}`);
  console.log(`Total translations: ${Object.keys(result).length}`);
}

main().catch(console.error);
