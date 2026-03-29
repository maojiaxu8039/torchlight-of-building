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

const pages = [
  { en: "Fire_Cannon", cn: "Fire_Cannon", name: "火炮" },
  { en: "Cudgel", cn: "Cudgel", name: "钉头锤" },
  { en: "Vorax_Limb:_Head", cn: "Vorax_Limb:_Head", name: "渴瘾肢体：脑部" },
  { en: "Vorax_Limb:_Chest", cn: "Vorax_Limb:_Chest", name: "渴瘾肢体：胸部" },
  { en: "Vorax_Limb:_Hands", cn: "Vorax_Limb:_Hands", name: "渴瘾肢体：手部" },
  { en: "Vorax_Limb:_Legs", cn: "Vorax_Limb:_Legs", name: "渴瘾肢体：腿部" },
  { en: "Vorax_Limb:_Neck", cn: "Vorax_Limb:_Neck", name: "渴瘾肢体：颈部" },
  {
    en: "Vorax_Limb:_Digits",
    cn: "Vorax_Limb:_Digits",
    name: "渴瘾肢体：指部",
  },
  { en: "Vorax_Limb:_Waist", cn: "Vorax_Limb:_Waist", name: "渴瘾肢体：腰部" },
];

function encodeSlug(slug) {
  return slug.replace(/:/g, "%3A");
}

async function scrapePage(enSlug, cnSlug) {
  try {
    const encodedEn = encodeSlug(enSlug);
    const encodedCn = encodeSlug(cnSlug);

    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(`https://tlidb.com/en/${encodedEn}`),
      fetchUrl(`https://tlidb.com/cn/${encodedCn}`),
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
  console.log("=== Scraping Vorax Limb (URL encoded) ===\n");

  const allTranslations = {};
  let success = 0;
  let failed = 0;

  for (const page of pages) {
    process.stdout.write(`${page.name} (${page.en})... `);

    const translations = await scrapePage(page.en, page.cn);

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
