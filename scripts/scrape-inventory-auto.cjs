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

// 从页面提取 Gear/Stash 分类
function extractCategories(html, locale) {
  const categories = [];

  // 匹配导航栏或菜单中的分类链接
  // 例如: <a href="/en/Claw">Claw</a> 或 <a href="/cn/爪子">爪子</a>
  const linkPattern = /href=["']\/(?:en|cn)\/([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(html)) !== null) {
    const slug = match[1];
    const name = match[2].trim();

    // 过滤掉非分类链接
    if (
      slug &&
      name &&
      !slug.includes(".") &&
      !slug.includes("#") &&
      !slug.includes("?") &&
      slug.length > 1 &&
      name.length > 1
    ) {
      categories.push({ slug, name, locale });
    }
  }

  return categories;
}

// 去重
function deduplicateCategories(categories) {
  const seen = new Set();
  const unique = [];

  categories.forEach((cat) => {
    const key = cat.slug.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(cat);
    }
  });

  return unique;
}

// 抓取单个页面的翻译
async function scrapePageTranslations(enUrl, cnUrl) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(enUrl),
      fetchUrl(cnUrl),
    ]);

    const enById = {};
    const cnById = {};

    // Pattern: data-modifier-id="ID">...text...</span>
    const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
    let match;

    while ((match = pattern.exec(enHtml)) !== null) {
      const id = match[1];
      const text = match[2]
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "–")
        .replace(/\s+/g, " ")
        .trim();
      if (text && text.length > 2) {
        enById[id] = text;
      }
    }

    while ((match = pattern.exec(cnHtml)) !== null) {
      const id = match[1];
      const text = match[2]
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&ndash;/g, "–")
        .replace(/\s+/g, " ")
        .trim();
      if (text && text.length > 2) {
        cnById[id] = text;
      }
    }

    // Match by ID
    const translations = {};
    Object.entries(enById).forEach(([id, enText]) => {
      if (cnById[id] && enText !== cnById[id]) {
        const enLen = enText.replace(/[\d.\-–()%]/g, "").length;
        const cnLen = cnById[id].replace(/[\d\u4e00-\u9fa5]/g, "").length;
        if (enLen > 2 && cnLen > 0) {
          translations[enText] = cnById[id];
        }
      }
    });

    return translations;
  } catch (error) {
    console.log(`  Error: ${error.message}`);
    return {};
  }
}

async function main() {
  console.log("=== Auto-scraping all translations from Inventory ===\n");

  const outDir = path.join(__dirname, "../src/data/translated-affixes");
  const inventoryUrl = "https://tlidb.com/en/Inventory";

  try {
    // 1. 抓取 Inventory 页面
    console.log("1. Fetching Inventory page...");
    const html = await fetchUrl(inventoryUrl);
    console.log(`   HTML size: ${html.length} chars\n`);

    // 2. 提取分类
    console.log("2. Extracting categories...");
    const enCategories = extractCategories(html, "en");
    const uniqueCategories = deduplicateCategories(enCategories);

    // 过滤出有效的分类（排除一些通用页面）
    const validCategories = uniqueCategories.filter((cat) => {
      const slug = cat.slug.toLowerCase();
      return (
        ![
          "login",
          "register",
          "about",
          "contact",
          "help",
          "api",
          "en",
          "cn",
        ].includes(slug) &&
        !slug.startsWith("user") &&
        !slug.includes("category") &&
        !slug.includes("page") &&
        slug.length < 50
      );
    });

    console.log(`   Found ${validCategories.length} categories:\n`);
    validCategories.slice(0, 20).forEach((cat) => {
      console.log(`   - ${cat.slug}`);
    });
    if (validCategories.length > 20) {
      console.log(`   ... and ${validCategories.length - 20} more`);
    }
    console.log("");

    // 3. 抓取每个分类页面的翻译
    console.log("3. Scraping translations from each category...\n");

    const allTranslations = {};
    let successCount = 0;
    let errorCount = 0;

    for (const category of validCategories) {
      const enUrl = `https://tlidb.com/en/${category.slug}`;
      const cnUrl = `https://tlidb.com/cn/${category.slug}`;

      process.stdout.write(`   ${category.slug}... `);

      const translations = await scrapePageTranslations(enUrl, cnUrl);

      if (Object.keys(translations).length > 0) {
        Object.assign(allTranslations, translations);
        console.log(`✅ ${Object.keys(translations).length}`);
        successCount++;
      } else {
        console.log("❌ (no data)");
        errorCount++;
      }
    }

    console.log(`\n4. Summary:`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   No data: ${errorCount}`);
    console.log(
      `   Total translations: ${Object.keys(allTranslations).length}`,
    );

    // 5. 合并翻译
    console.log("\n5. Merging with existing translations...");

    const existingPath = path.join(outDir, "merged-all-translations.json");
    const existing = fs.existsSync(existingPath)
      ? JSON.parse(fs.readFileSync(existingPath, "utf8"))
      : {};

    const merged = { ...existing, ...allTranslations };

    // Sort by length (longest first for matching priority)
    const sorted = Object.entries(merged).sort(
      (a, b) => b[0].length - a[0].length,
    );
    const sortedTranslations = {};
    sorted.forEach(([en, cn]) => {
      sortedTranslations[en] = cn;
    });

    // Save
    fs.writeFileSync(
      existingPath,
      JSON.stringify(sortedTranslations, null, 2),
      "utf-8",
    );

    console.log(`   Existing: ${Object.keys(existing).length}`);
    console.log(`   New: ${Object.keys(allTranslations).length}`);
    console.log(`   Total: ${Object.keys(sortedTranslations).length}`);

    // Save category list
    fs.writeFileSync(
      path.join(outDir, "scraped-categories.json"),
      JSON.stringify(validCategories, null, 2),
      "utf-8",
    );

    // Save new translations
    fs.writeFileSync(
      path.join(outDir, "inventory-translations.json"),
      JSON.stringify(allTranslations, null, 2),
      "utf-8",
    );

    console.log("\n✅ Done!");
    console.log(`   - merged-all-translations.json`);
    console.log(`   - scraped-categories.json`);
    console.log(`   - inventory-translations.json`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// 导出函数供外部调用
module.exports = { fetchUrl, extractCategories, scrapePageTranslations, main };

// 如果直接运行此脚本
if (require.main === module) {
  main();
}
