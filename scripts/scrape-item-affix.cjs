const https = require("https");
const fs = require("fs");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

function cleanText(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  console.log("=== 抓取 Belt#Item 词缀 ===\n");

  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/Belt#Item"),
    fetchUrl("https://tlidb.com/cn/Belt#Item"),
  ]);

  const enById = {};
  const cnById = {};

  // 提取 EN 词缀
  const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  let match;

  while ((match = pattern.exec(enHtml)) !== null) {
    const id = match[1];
    const text = cleanText(match[2]);
    if (text && text.length > 2) {
      enById[id] = text;
    }
  }

  // 提取 CN 词缀
  const pattern2 = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  while ((match = pattern2.exec(cnHtml)) !== null) {
    const id = match[1];
    const text = cleanText(match[2]);
    if (text && text.length > 2) {
      cnById[id] = text;
    }
  }

  console.log("EN 词缀数:", Object.keys(enById).length);
  console.log("CN 词缀数:", Object.keys(cnById).length);

  // 生成翻译
  const translations = {};
  let matched = 0;

  Object.entries(enById).forEach((entry) => {
    const id = entry[0];
    const en = entry[1];
    const cn = cnById[id];

    if (cn && en !== cn) {
      translations[en] = cn;
      matched++;
    }
  });

  console.log("匹配翻译:", matched);

  // 显示所有翻译
  console.log("\n=== 翻译列表 ===\n");
  Object.entries(translations).forEach((entry) => {
    console.log("EN:", entry[0]);
    console.log("CN:", entry[1]);
    console.log("");
  });

  // 保存到文件
  fs.writeFileSync(
    "scripts/belt-item-translations.json",
    JSON.stringify(translations, null, 2),
  );
  console.log("\n翻译已保存到 scripts/belt-item-translations.json");
}

main();
