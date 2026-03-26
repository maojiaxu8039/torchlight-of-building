const https = require("https");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function main() {
  console.log("=== Scraping Belt translations ===\n");
  
  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/Belt"),
    fetchUrl("https://tlidb.com/cn/Belt"),
  ]);
  
  const enById = {};
  const cnById = {};
  
  // 提取所有词条
  const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  let match;
  
  while ((match = pattern.exec(enHtml)) !== null) {
    const id = match[1];
    let text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/\s+/g, " ").trim();
    if (text && text.length > 2) {
      enById[id] = text;
    }
  }
  
  while ((match = pattern.exec(cnHtml)) !== null) {
    const id = match[1];
    let text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/\s+/g, " ").trim();
    if (text && text.length > 2) {
      cnById[id] = text;
    }
  }
  
  console.log(`EN: ${Object.keys(enById).length}, CN: ${Object.keys(cnById).length}`);
  
  const translations = {};
  
  Object.entries(enById).forEach(([id, enText]) => {
    if (cnById[id] && enText !== cnById[id]) {
      translations[enText] = cnById[id];
    }
  });
  
  console.log(`Matched: ${Object.keys(translations).length}`);
  
  // 保存
  fs.writeFileSync("src/data/translated-affixes/belt-translations.json", JSON.stringify(translations, null, 2));
  console.log("Saved to belt-translations.json");
}

main();
