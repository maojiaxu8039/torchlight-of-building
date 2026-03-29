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
  console.log("=== 抓取 Belt 完整词条 ===\n");

  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/Belt#Item"),
    fetchUrl("https://tlidb.com/cn/Belt#Item"),
  ]);

  const enById = {};
  const cnById = {};

  // 提取 EN 词条 (id + text-mod)
  const enIdRegex =
    /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<span class="text-mod">([\s\S]*?)<\/span>([\s\S]*?)<\/td>/gi;
  let match;
  while ((match = enIdRegex.exec(enHtml)) !== null) {
    const id = match[1];
    const before = match[2].replace(/<[^>]+>/g, "").trim();
    const textMod = match[3]
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "-")
      .replace(/&amp;/g, "&")
      .trim();
    const after = match[4].replace(/<[^>]+>/g, "").trim();
    const fullText = (before + textMod + after).replace(/\s+/g, " ").trim();
    if (fullText) enById[id] = fullText;
  }

  // 提取 CN 词条 (id + text-mod)
  const cnIdRegex =
    /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<span class="text-mod">([\s\S]*?)<\/span>([\s\S]*?)<\/td>/gi;
  while ((match = cnIdRegex.exec(cnHtml)) !== null) {
    const id = match[1];
    const before = match[2]
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "-")
      .replace(/&amp;/g, "&")
      .replace(/<[^>]+>/g, "")
      .trim();
    const textMod = match[3]
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "-")
      .replace(/&amp;/g, "&")
      .trim();
    const after = match[4]
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "-")
      .replace(/&amp;/g, "&")
      .replace(/<[^>]+>/g, "")
      .trim();
    const fullText = (before + textMod + after).replace(/\s+/g, " ").trim();
    if (fullText) cnById[id] = fullText;
  }

  console.log("EN 词条:", Object.keys(enById).length);
  console.log("CN 词条:", Object.keys(cnById).length);

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
