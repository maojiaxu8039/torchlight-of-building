const https = require("https");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise(function(resolve, reject) {
    https.get(url, function(res) {
      let data = "";
      res.on("data", function(chunk) { data += chunk; });
      res.on("end", function() { resolve(data); });
      res.on("error", reject);
    }).on("error", reject);
  });
}

async function scrapePage(enSlug, cnSlug) {
  const html = await Promise.all([
    fetchUrl("https://tlidb.com/en/" + enSlug),
    fetchUrl("https://tlidb.com/cn/" + cnSlug)
  ]);
  
  const enHtml = html[0];
  const cnHtml = html[1];
  
  if (enHtml.length < 1000 || cnHtml.length < 1000) {
    return {};
  }
  
  const enById = {};
  const cnById = {};
  
  // 修复：匹配整个 td 单元格内容，包含嵌套的 span
  const pattern = /<td[^>]*><span data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span><\/td>/gi;
  let match;
  
  while ((match = pattern.exec(enHtml)) !== null) {
    const id = match[1];
    // 清理所有嵌套 span 和 HTML 标签
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
  
  const translations = {};
  Object.entries(enById).forEach(function(entry) {
    const id = entry[0];
    const enText = entry[1];
    if (cnById[id] && enText !== cnById[id]) {
      translations[enText] = cnById[id];
    }
  });
  
  return translations;
}

async function main() {
  console.log("=== 抓取 Belt (修复版) ===\n");
  
  const translations = await scrapePage("Belt", "Belt");
  
  console.log("抓取到 " + Object.keys(translations).length + " 条翻译\n");
  
  // 显示 Elemental Resistance 词条
  console.log("Elemental Resistance 词条:");
  Object.entries(translations).forEach(function(entry) {
    if (entry[0].includes("Elemental Resistance")) {
      console.log("EN: " + entry[0]);
      console.log("CN: " + entry[1]);
      console.log("");
    }
  });
  
  // 保存
  fs.writeFileSync("belt-fixed.json", JSON.stringify(translations, null, 2));
  console.log("保存到 belt-fixed.json");
}

main();
