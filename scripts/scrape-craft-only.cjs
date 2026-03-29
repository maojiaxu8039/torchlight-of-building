const fs = require("fs");
const path = require("path");
const https = require("https");

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

// 从网站抓取 Craft 页面
async function scrapeCraft() {
  console.log("📄 Scraping Craft pages from tlidb.com...\n");

  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/Craft"),
    fetchUrl("https://tlidb.com/cn/Craft"),
  ]);

  console.log(`  EN HTML size: ${enHtml.length}`);
  console.log(`  CN HTML size: ${cnHtml.length}\n`);

  // 提取所有带有 data-modifier-id 的行
  const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;

  const enById = {};
  const cnById = {};

  // 提取 EN
  while ((trMatch = trPattern.exec(enHtml)) !== null) {
    const idMatch = trMatch[1].match(/data-modifier-id=["']([^"']+)["']/);
    if (idMatch) {
      const tdMatch = trMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
      if (tdMatch && tdMatch.length > 0) {
        const lastTd = tdMatch[tdMatch.length - 1];
        const text = lastTd
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (text && text.length > 2) {
          enById[idMatch[1]] = text;
        }
      }
    }
  }

  // 提取 CN
  while ((trMatch = trPattern.exec(cnHtml)) !== null) {
    const idMatch = trMatch[1].match(/data-modifier-id=["']([^"']+)["']/);
    if (idMatch) {
      const tdMatch = trMatch[1].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
      if (tdMatch && tdMatch.length > 0) {
        const lastTd = tdMatch[tdMatch.length - 1];
        const text = lastTd
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (text && text.length > 2) {
          cnById[idMatch[1]] = text;
        }
      }
    }
  }

  console.log(`  EN modifiers: ${Object.keys(enById).length}`);
  console.log(`  CN modifiers: ${Object.keys(cnById).length}\n`);

  // 匹配
  const translations = {};
  let matched = 0;
  const alreadyExists = 0;

  Object.entries(enById).forEach(([id, enText]) => {
    if (cnById[id] && enText !== cnById[id]) {
      // 验证是否为有效翻译
      const enLen = enText.replace(/[\d.\-–—()%]/g, "").length;
      const cnLen = cnById[id].replace(/[\d\u4e00-\u9fa5]/g, "").length;

      if (enLen > 3 && cnLen > 0) {
        if (!translations[enText]) {
          translations[enText] = cnById[id];
          matched++;
        }
      }
    }
  });

  console.log(`  New translations found: ${matched}`);

  return translations;
}

async function main() {
  console.log("🚀 Starting Craft page scrape...\n");

  const outDir = path.join(__dirname, "../src/data/translated-affixes");

  // 1. 从网站下载
  const newTranslations = await scrapeCraft();

  // 2. 加载现有的翻译
  const existingFile = path.join(outDir, "merged-all-translations.json");
  const existingTranslations = fs.existsSync(existingFile)
    ? JSON.parse(fs.readFileSync(existingFile, "utf8"))
    : {};

  console.log(
    `\n📚 Existing translations: ${Object.keys(existingTranslations).length}`,
  );

  // 3. 找出新的翻译
  const toAdd = {};
  let newCount = 0;
  let existingCount = 0;

  Object.entries(newTranslations).forEach(([en, cn]) => {
    if (!existingTranslations[en]) {
      toAdd[en] = cn;
      newCount++;
    } else {
      existingCount++;
    }
  });

  console.log(`\n📊 Analysis:`);
  console.log(`  Already matched: ${existingCount}`);
  console.log(`  New to add: ${newCount}`);

  if (newCount > 0) {
    // 4. 合并
    const merged = { ...existingTranslations, ...toAdd };

    // 5. 保存
    fs.writeFileSync(
      path.join(outDir, "merged-all-translations.json"),
      JSON.stringify(merged, null, 2),
      "utf-8",
    );

    console.log(`\n✅ Added ${newCount} new translations`);
    console.log(`✅ Total now: ${Object.keys(merged).length}`);

    // 6. 保存新的 Craft 翻译
    fs.writeFileSync(
      path.join(outDir, "craft-new-translations.json"),
      JSON.stringify(toAdd, null, 2),
      "utf-8",
    );
  } else {
    console.log(`\n✅ All Craft translations already matched!`);
  }

  console.log("\n✅ Done!");
}

main().catch(console.error);
