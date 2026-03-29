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

  // 提取所有 text-mod
  const enTexts = [];
  const cnTexts = [];

  const textModRegex = /<span class="text-mod">([\s\S]*?)<\/span>/gi;
  let match;

  while ((match = textModRegex.exec(enHtml)) !== null) {
    const text = match[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "-")
      .replace(/&amp;/g, "&")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (text) enTexts.push(text);
  }

  while ((match = textModRegex.exec(cnHtml)) !== null) {
    const text = match[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "-")
      .replace(/&amp;/g, "&")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (text) cnTexts.push(text);
  }

  console.log("EN text-mod:", enTexts.length);
  console.log("CN text-mod:", cnTexts.length);

  // 假设 Base Affix 在固定位置（前 30 个）
  const baseAffixCount = 30;

  console.log("\n前", baseAffixCount, "个对比:");
  for (let i = 0; i < baseAffixCount; i++) {
    if (enTexts[i] && cnTexts[i]) {
      console.log("EN:", enTexts[i]);
      console.log("CN:", cnTexts[i]);
      console.log("");
    }
  }

  // 生成翻译
  const translations = {};
  for (
    let i = 0;
    i < baseAffixCount && i < enTexts.length && i < cnTexts.length;
    i++
  ) {
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
