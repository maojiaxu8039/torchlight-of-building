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

async function main() {
  console.log("Fetching pages...");
  const enHtml = await fetchUrl("https://tlidb.com/en/DEX_Boots");
  const cnHtml = await fetchUrl("https://tlidb.com/cn/DEX_Boots");

  const enModifiers = extractModifiers(enHtml);
  const cnModifiers = extractModifiers(cnHtml);

  console.log("英文词缀:", Object.keys(enModifiers).length);
  console.log("中文词缀:", Object.keys(cnModifiers).length);

  let matched = 0;
  const translations = {};

  Object.keys(enModifiers).forEach((id) => {
    if (cnModifiers[id]) {
      translations[enModifiers[id]] = cnModifiers[id];
      matched++;
    }
  });

  console.log("匹配数量:", matched);

  fs.writeFileSync(
    "scripts/tlidb-dex-boots.json",
    JSON.stringify(translations, null, 2),
  );
  console.log("已保存到 scripts/tlidb-dex-boots.json");
}

main().catch(console.error);
