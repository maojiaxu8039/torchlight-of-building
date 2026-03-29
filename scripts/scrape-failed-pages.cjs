const https = require("https");
const fs = require("fs");
const path = require("path");

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

// 从不同格式提取翻译
function extractTranslationsFromHtml(html) {
  const translations = {};

  // 尝试多种模式

  // 模式1: data-modifier-id
  const pattern1 = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  let match;
  while ((match = pattern1.exec(html)) !== null) {
    const id = match[1];
    const text = match[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "–")
      .replace(/\s+/g, " ")
      .trim();
    if (text && text.length > 2) {
      translations[id + "_span"] = text;
    }
  }

  // 模式2: 从表格中提取
  const tablePattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  while ((match = tablePattern.exec(html)) !== null) {
    const row = match[1];
    // 提取所有td内容
    const tds = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    if (tds.length >= 2) {
      // 获取最后两列作为 EN/CN 对
      const texts = tds.map((td) =>
        td
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&ndash;/g, "–")
          .replace(/\s+/g, " ")
          .trim(),
      );
      const lastText = texts[texts.length - 1];
      const secondLastText = texts[texts.length - 2];
      if (lastText && secondLastText && lastText !== secondLastText) {
        translations["table_" + Object.keys(translations).length] = {
          en: secondLastText,
          cn: lastText,
        };
      }
    }
  }

  // 模式3: 从 dd/dt 标签提取
  const dlPattern = /<(?:dt|dd)[^>]*>([\s\S]*?)<\/(?:dt|dd)>/gi;
  while ((match = dlPattern.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text && text.length > 2) {
      translations["dl_" + Object.keys(translations).length] = text;
    }
  }

  return translations;
}

// 抓取单个页面
async function scrapePage(enUrl, cnUrl, pageName) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(enUrl),
      fetchUrl(cnUrl),
    ]);

    if (!enHtml || !cnHtml || enHtml.length < 100) {
      return { pageName, count: 0, status: "no-data" };
    }

    const enTranslations = extractTranslationsFromHtml(enHtml);
    const cnTranslations = extractTranslationsFromHtml(cnHtml);

    // 匹配翻译
    const matchedTranslations = {};
    let count = 0;

    // 对于表格翻译，使用位置匹配
    Object.entries(enTranslations).forEach(([key, enData]) => {
      if (typeof enData === "object" && enData.en && cnTranslations[key]) {
        const cnData = cnTranslations[key];
        if (enData.cn !== cnData.cn) {
          const enLen = enData.en.replace(/[\d.\-–()%]/g, "").length;
          const cnLen = cnData.cn.replace(/[\d\u4e00-\u9fa5]/g, "").length;
          if (enLen > 2 && cnLen > 0) {
            matchedTranslations[enData.en] = cnData.cn;
            count++;
          }
        }
      }
    });

    return {
      pageName,
      count,
      status: "success",
      translations: matchedTranslations,
    };
  } catch (error) {
    return { pageName, count: 0, status: "error", error: error.message };
  }
}

async function main() {
  console.log("=== Scraping failed pages with alternative methods ===\n");

  // 有 data-modifier-id 的页面
  const pagesWithModifier = ["Confusion_Card_Library", "Void_Chart", "Compass"];

  // 可能需要特殊处理的页面
  const specialPages = [
    "Talent",
    "Active_Skill",
    "Support_Skill",
    "Passive_Skill",
    "Pactspirit",
  ];

  const allTranslations = {};

  // 抓取有 data-modifier-id 的页面
  console.log("1. Pages with data-modifier-id:");
  for (const page of pagesWithModifier) {
    const result = await scrapePage(
      `https://tlidb.com/en/${page}`,
      `https://tlidb.com/cn/${page}`,
      page,
    );

    if (result.status === "success" && result.count > 0) {
      Object.assign(allTranslations, result.translations);
      console.log(`   ${page}: ✅ ${result.count}`);
    } else {
      console.log(`   ${page}: ❌ ${result.status}`);
    }
  }

  console.log(
    `\n2. Total translations found: ${Object.keys(allTranslations).length}`,
  );

  if (Object.keys(allTranslations).length > 0) {
    // 保存
    const outDir = path.join(__dirname, "../src/data/translated-affixes");

    const existingPath = path.join(outDir, "merged-all-translations.json");
    const existing = fs.existsSync(existingPath)
      ? JSON.parse(fs.readFileSync(existingPath, "utf8"))
      : {};

    const merged = { ...existing, ...allTranslations };

    // Sort
    const sorted = Object.entries(merged).sort(
      (a, b) => b[0].length - a[0].length,
    );
    const sortedTranslations = {};
    sorted.forEach(([en, cn]) => {
      sortedTranslations[en] = cn;
    });

    fs.writeFileSync(
      existingPath,
      JSON.stringify(sortedTranslations, null, 2),
      "utf-8",
    );

    console.log(`   Saved to merged-all-translations.json`);
    console.log(`   Total now: ${Object.keys(sortedTranslations).length}`);
  }

  console.log("\n✅ Done!");
}

main();
