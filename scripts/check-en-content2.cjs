const https = require("https");

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
  console.log("=== 检查网页内容 ===\n");
  
  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/Belt"),
    fetchUrl("https://tlidb.com/cn/Belt"),
  ]);
  
  // 提取所有词条
  const enById = {};
  const cnById = {};
  
  const enPattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  const cnPattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  
  let match;
  while ((match = enPattern.exec(enHtml)) !== null) {
    const id = match[1];
    const text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/\s+/g, " ").trim();
    if (text && text.length > 2) {
      enById[id] = text;
    }
  }
  
  while ((match = cnPattern.exec(cnHtml)) !== null) {
    const id = match[1];
    const text = match[2].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&ndash;/g, "–").replace(/\s+/g, " ").trim();
    if (text && text.length > 2) {
      cnById[id] = text;
    }
  }
  
  console.log(`EN: ${Object.keys(enById).length}, CN: ${Object.keys(cnById).length}`);
  
  // 查找 Elemental Resistance 词条
  console.log("\nEN Elemental Resistance 词条:");
  Object.entries(enById).forEach(([id, text]) => {
    if (text.includes("Elemental Resistance")) {
      console.log(`  ID: ${id}`);
      console.log(`  EN: ${text}`);
      console.log(`  CN: ${cnById[id] || "(未匹配)"`);
    }
  });
  
  console.log("\nEN avoid Elemental 词条:");
  Object.entries(enById).forEach(([id, text]) => {
    if (text.includes("avoid Elemental")) {
      console.log(`  ID: ${id}`);
      console.log(`  EN: ${text}`);
      console.log(`  CN: ${cnById[id] || "(未匹配)"`);
    }
  });
}

main();
