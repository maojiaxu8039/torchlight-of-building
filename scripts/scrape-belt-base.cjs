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

  // 提取 Base Affix 部分
  const enBaseAffix = [];
  const cnBaseAffix = [];

  // 找到 Base Affix 部分
  const enBaseMatch = enHtml.match(
    /Base Affix([\s\S]*?)(?=Pre-fix|Suffix|Tower|$)/i,
  );
  const cnBaseMatch = cnHtml.match(/基础词缀([\s\S]*?)(?=前缀|后缀|高塔|$)/i);

  if (enBaseMatch && enBaseMatch[1]) {
    // 提取所有词条
    const textModRegex = /<span class="text-mod">([\s\S]*?)<\/span>/gi;
    let match;
    while ((match = textModRegex.exec(enBaseMatch[1])) !== null) {
      const text = match[1]
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text) enBaseAffix.push(text);
    }
  }

  if (cnBaseMatch && cnBaseMatch[1]) {
    const textModRegex = /<span class="text-mod">([\s\S]*?)<\/span>/gi;
    let match;
    while ((match = textModRegex.exec(cnBaseMatch[1])) !== null) {
      const text = match[1]
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/<[^>]+>/g, "")
        .trim();
      if (text) cnBaseAffix.push(text);
    }
  }

  console.log("EN Base Affix:", enBaseAffix.length);
  console.log("CN Base Affix:", cnBaseAffix.length);

  // 生成翻译（按顺序匹配）
  const translations = {};
  const minLen = Math.min(enBaseAffix.length, cnBaseAffix.length);

  for (let i = 0; i < minLen; i++) {
    const en = enBaseAffix[i];
    const cn = cnBaseAffix[i];
    if (en && cn && en !== cn) {
      translations[en] = cn;
    }
  }

  console.log("\n生成的翻译:", Object.keys(translations).length);

  // 显示所有翻译
  console.log("\n翻译列表:");
  Object.entries(translations).forEach((entry) => {
    console.log("EN:", entry[0]);
    console.log("CN:", entry[1]);
    console.log("");
  });

  // 保存
  fs.writeFileSync(
    "scripts/belt-base-affix-translations.json",
    JSON.stringify(translations, null, 2),
  );
  console.log("已保存到 scripts/belt-base-affix-translations.json");
}

main();
