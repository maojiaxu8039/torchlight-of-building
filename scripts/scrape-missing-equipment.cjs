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

const equipmentList = [
  { en: "STR_Chest_Armor", name: "力量胸甲" },
  { en: "DEX_Chest_Armor", name: "敏捷胸甲" },
  { en: "INT_Chest_Armor", name: "智慧胸甲" },
  { en: "Two-Handed_Axe", name: "双手斧" },
  { en: "Staff", name: "法杖" },
  { en: "War_Staff", name: "武杖" },
  { en: "Divinity_Slate", name: "神格石板" },
];

async function scrapePage(enSlug) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(`https://tlidb.com/en/${enSlug}`),
      fetchUrl(`https://tlidb.com/cn/${enSlug}`),
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
    return {};
  }
}

async function main() {
  console.log("=== Scraping missing equipment ===\n");

  const allTranslations = {};
  let success = 0;
  let failed = 0;

  for (const item of equipmentList) {
    process.stdout.write(`${item.name} (${item.en})... `);

    const translations = await scrapePage(item.en);

    if (Object.keys(translations).length > 0) {
      Object.assign(allTranslations, translations);
      console.log(`✅ ${Object.keys(translations).length}`);
      success++;
    } else {
      console.log(`❌`);
      failed++;
    }

    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\n=== Summary ===`);
  console.log(`Success: ${success}, Failed: ${failed}`);
  console.log(`New translations: ${Object.keys(allTranslations).length}`);

  const outDir = path.join(__dirname, "../src/data/translated-affixes");
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
  console.log(`Total: ${Object.keys(sortedTranslations).length}`);
  console.log("\n✅ Done!");
}

main();
