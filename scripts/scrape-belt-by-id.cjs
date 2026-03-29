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

async function main() {
  console.log("=== 抓取 Belt Base Affix (通过ID) ===\n");

  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/Belt#Item"),
    fetchUrl("https://tlidb.com/cn/Belt#Item"),
  ]);

  // 提取 Base Affix 部分的 ID 和文本
  const enById = {};
  const cnById = {};

  // 找到 Base Affix 部分
  const enStart = enHtml.indexOf('id="BeltBaseAffix"');
  const enEnd = enHtml.indexOf('id="BeltCorrosionBase"');

  const cnStart = cnHtml.indexOf('id="BeltBaseAffix"');
  const cnEnd = cnHtml.indexOf('id="BeltCorrosionBase"');

  if (enStart !== -1 && enEnd !== -1) {
    const enSection = enHtml.substring(enStart, enEnd);
    const idRegex =
      /id="(\d+)"[^>]*>([\s\S]*?)<span class="text-mod">([\s\S]*?)<\/span>/gi;
    let match;
    while ((match = idRegex.exec(enSection)) !== null) {
      const id = match[1];
      const text = match[3]
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text) enById[id] = text;
    }
  }

  if (cnStart !== -1 && cnEnd !== -1) {
    const cnSection = cnHtml.substring(cnStart, cnEnd);
    const idRegex =
      /id="(\d+)"[^>]*>([\s\S]*?)<span class="text-mod">([\s\S]*?)<\/span>/gi;
    let match;
    while ((match = idRegex.exec(cnSection)) !== null) {
      const id = match[1];
      const text = match[3]
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text) cnById[id] = text;
    }
  }

  console.log("EN Base Affix:", Object.keys(enById).length);
  console.log("CN Base Affix:", Object.keys(cnById).length);

  // 显示示例
  console.log("\nEN 示例:");
  let count = 0;
  Object.entries(enById).forEach((entry) => {
    if (count < 5) {
      console.log("  ID:", entry[0], "-", entry[1]);
      count++;
    }
  });

  console.log("\nCN 示例:");
  count = 0;
  Object.entries(cnById).forEach((entry) => {
    if (count < 5) {
      console.log("  ID:", entry[0], "-", entry[1]);
      count++;
    }
  });

  // 生成翻译
  const translations = {};
  Object.entries(enById).forEach((entry) => {
    const id = entry[0];
    const en = entry[1];
    const cn = cnById[id];
    if (cn && en !== cn) {
      translations[en] = cn;
    }
  });

  console.log("\n生成的翻译:", Object.keys(translations).length);

  // 保存
  fs.writeFileSync(
    "scripts/belt-base-affix-translations.json",
    JSON.stringify(translations, null, 2),
  );
  console.log("已保存到 scripts/belt-base-affix-translations.json");
}

main();
