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

function extractCategories(html) {
  const categories = new Set();

  // 匹配 /en/Claw, /cn/爪子 等链接格式
  const patterns = [
    /href=["']\/en\/([^"']+)["'][^>]*>([^<]+)<\/a>/gi,
    /href=["']\/cn\/([^"']+)["'][^>]*>([^<]+)<\/a>/gi,
  ];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const slug = match[1];
      const name = match[2].trim();

      // 过滤无效链接
      if (
        slug &&
        !slug.includes(".") &&
        !slug.includes("#") &&
        !slug.includes("?") &&
        slug.length > 1 &&
        slug.length < 50 &&
        name.length > 1 &&
        name.length < 50
      ) {
        categories.add(slug);
      }
    }
  });

  return Array.from(categories);
}

async function scrapePage(enSlug, cnSlug) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(`https://tlidb.com/en/${enSlug}`),
      fetchUrl(`https://tlidb.com/cn/${cnSlug}`),
    ]);

    if (enHtml.length < 1000 || cnHtml.length < 1000) {
      return {};
    }

    const enById = {};
    const cnById = {};

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
  console.log("=== Scraping all Inventory categories ===\n");

  try {
    // 1. 抓取 Inventory 页面获取所有分类
    console.log("1. Fetching Inventory page...");
    const inventoryHtml = await fetchUrl("https://tlidb.com/en/Inventory");
    const categories = extractCategories(inventoryHtml);

    console.log(`   Found ${categories.length} categories:\n`);
    categories.slice(0, 20).forEach((cat) => console.log(`   - ${cat}`));
    if (categories.length > 20) {
      console.log(`   ... and ${categories.length - 20} more`);
    }

    // 2. 抓取每个分类的翻译
    console.log("\n2. Scraping translations...\n");

    const allTranslations = {};
    let success = 0;
    let failed = 0;

    for (const category of categories) {
      const enSlug = decodeURIComponent(category);
      const cnSlug = category; // CN 页面可能需要编码

      process.stdout.write(`   ${enSlug}... `);

      const translations = await scrapePage(enSlug, cnSlug);

      if (Object.keys(translations).length > 0) {
        Object.assign(allTranslations, translations);
        console.log(`✅ ${Object.keys(translations).length}`);
        success++;
      } else {
        console.log(`❌ (no data)`);
        failed++;
      }

      await new Promise((r) => setTimeout(r, 100));
    }

    // 3. 保存结果
    console.log("\n3. Saving results...");

    const outDir = path.join(__dirname, "../src/data/translated-affixes");

    // 保存到 merged-all-translations.json
    const mergedPath = path.join(outDir, "merged-all-translations.json");
    const existing = fs.existsSync(mergedPath)
      ? JSON.parse(fs.readFileSync(mergedPath, "utf8"))
      : {};

    const merged = { ...existing, ...allTranslations };
    const sorted = Object.entries(merged).sort(
      (a, b) => b[0].length - a[0].length,
    );
    const sortedTranslations = {};
    sorted.forEach(([en, cn]) => {
      sortedTranslations[en] = cn;
    });

    fs.writeFileSync(
      mergedPath,
      JSON.stringify(sortedTranslations, null, 2),
      "utf-8",
    );

    // 保存分类列表
    fs.writeFileSync(
      path.join(outDir, "inventory-categories.json"),
      JSON.stringify(categories, null, 2),
      "utf-8",
    );

    console.log("\n=== Summary ===");
    console.log(`Categories: ${categories.length}`);
    console.log(`Success: ${success}`);
    console.log(`Failed: ${failed}`);
    console.log(`New translations: ${Object.keys(allTranslations).length}`);
    console.log(
      `Total translations: ${Object.keys(sortedTranslations).length}`,
    );
    console.log("\n✅ Done!");
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

main();
