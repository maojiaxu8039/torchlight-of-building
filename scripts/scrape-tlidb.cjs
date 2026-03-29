const https = require("https");
const http = require("http");

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

async function scrapePage(url) {
  console.log("Fetching:", url);
  const html = await fetchUrl(url);

  const modifierMap = {};

  const regex =
    /data-modifier-id="(\d+)"[^>]*>.*?<span class="text-mod">([^<]*)<\/span>\s*([^(</]+)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = match[1];
    const value = match[2].replace(/&ndash;/g, "-").replace(/&amp;/g, "&");
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    modifierMap[id] = value + text;
  }

  return modifierMap;
}

async function main() {
  const enPage = await scrapePage("https://tlidb.com/en/DEX_Boots");
  const cnPage = await scrapePage("https://tlidb.com/cn/DEX_Boots");

  console.log("\n英文词缀数量:", Object.keys(enPage).length);
  console.log("中文词缀数量:", Object.keys(cnPage).length);

  let matched = 0;
  const translations = {};

  Object.keys(enPage).forEach((id) => {
    if (cnPage[id]) {
      translations[enPage[id]] = cnPage[id];
      matched++;
    }
  });

  console.log("匹配数量:", matched);

  const fs = require("fs");
  fs.writeFileSync(
    "scripts/tlidb-scraped-translations.json",
    JSON.stringify(translations, null, 2),
  );
  console.log("已保存到 scripts/tlidb-scraped-translations.json");
}

main().catch(console.error);
