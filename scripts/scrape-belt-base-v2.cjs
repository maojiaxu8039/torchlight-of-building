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
  console.log("=== 抓取 Belt Base Affix ===\n");

  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/Belt#Item"),
    fetchUrl("https://tlidb.com/cn/Belt#Item"),
  ]);

  // 提取 Base Affix 表格内容
  const enTexts = [];
  const cnTexts = [];

  // 提取所有 text-mod span 的内容
  const textModRegex = /<span class="text-mod">([\s\S]*?)<\/span>/gi;
  let match;

  // 找到 Base Affix 部分的起始和结束位置
  const enStart = enHtml.indexOf('id="BeltBaseAffix"');
  const enEnd = enHtml.indexOf('id="BeltPrefix"');

  const cnStart = cnHtml.indexOf('id="BeltBaseAffix"');
  const cnEnd = cnHtml.indexOf('id="BeltPrefix"');

  if (enStart !== -1 && enEnd !== -1) {
    const enSection = enHtml.substring(enStart, enEnd);
    while ((match = textModRegex.exec(enSection)) !== null) {
      const text = match[1]
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text) enTexts.push(text);
    }
  }

  if (cnStart !== -1 && cnEnd !== -1) {
    const cnSection = cnHtml.substring(cnStart, cnEnd);
    while ((match = textModRegex.exec(cnSection)) !== null) {
      const text = match[1]
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text) cnTexts.push(text);
    }
  }

  console.log("EN Base Affix 词条:", enTexts.length);
  console.log("CN Base Affix 词条:", cnTexts.length);

  // 显示前几个
  console.log("\nEN 前5个:");
  enTexts.slice(0, 5).forEach((t) => console.log("  " + t));

  console.log("\nCN 前5个:");
  cnTexts.slice(0, 5).forEach((t) => console.log("  " + t));

  // 生成翻译
  const translations = {};
  const minLen = Math.min(enTexts.length, cnTexts.length);

  for (let i = 0; i < minLen; i++) {
    const en = enTexts[i];
    const cn = cnTexts[i];
    if (en && cn && en !== cn && en.length > 2 && cn.length > 2) {
      translations[en] = cn;
    }
  }

  console.log("\n生成的翻译:", Object.keys(translations).length);

  // 保存
  fs.writeFileSync(
    "scripts/belt-base-affix-translations.json",
    JSON.stringify(translations, null, 2),
  );
  console.log("已保存到 scripts/belt-base-affix-translations.json");
}

main();
