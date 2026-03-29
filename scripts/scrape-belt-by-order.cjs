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
  console.log("=== 抓取 Belt Base Affix (按顺序) ===\n");

  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/Belt#Item"),
    fetchUrl("https://tlidb.com/cn/Belt#Item"),
  ]);

  const enTexts = [];
  const cnTexts = [];

  // 找到 Base Affix 部分
  const enStart = enHtml.indexOf('id="BeltBaseAffix"');
  const enEnd = enHtml.indexOf('id="BeltCorrosionBase"');
  const cnStart = cnHtml.indexOf('id="BeltBaseAffix"');
  const cnEnd = cnHtml.indexOf('id="BeltCorrosionBase"');

  // 提取 text-mod 内容
  if (enStart !== -1 && enEnd !== -1) {
    const enSection = enHtml.substring(enStart, enEnd);
    const textModRegex = /<span class="text-mod">([\s\S]*?)<\/span>/gi;
    let match;
    while ((match = textModRegex.exec(enSection)) !== null) {
      const text = match[1]
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text && text.length > 1) {
        enTexts.push(text);
      }
    }
  }

  if (cnStart !== -1 && cnEnd !== -1) {
    const cnSection = cnHtml.substring(cnStart, cnEnd);
    const textModRegex = /<span class="text-mod">([\s\S]*?)<\/span>/gi;
    let match;
    while ((match = textModRegex.exec(cnSection)) !== null) {
      const text = match[1]
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text && text.length > 1) {
        cnTexts.push(text);
      }
    }
  }

  console.log("EN Base Affix:", enTexts.length);
  console.log("CN Base Affix:", cnTexts.length);

  // 显示前10个对比
  console.log("\n对比:");
  const minLen = Math.min(enTexts.length, cnTexts.length, 15);
  for (let i = 0; i < minLen; i++) {
    console.log("EN:", enTexts[i]);
    console.log("CN:", cnTexts[i]);
    console.log("");
  }

  // 生成翻译
  const translations = {};
  for (let i = 0; i < Math.min(enTexts.length, cnTexts.length); i++) {
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
