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
  { en: "STR_Helmet", name: "力量头部" },
  { en: "DEX_Helmet", name: "敏捷头部" },
  { en: "INT_Helmet", name: "智慧头部" },
  { en: "STR_Chest_Armor", name: "力量胸甲" },
  { en: "DEX_Chest_Armor", name: "敏捷胸甲" },
  { en: "INT_Chest_Armor", name: "智慧胸甲" },
  { en: "STR_Gloves", name: "力量手套" },
  { en: "DEX_Gloves", name: "敏捷手套" },
  { en: "INT_Gloves", name: "智慧手套" },
  { en: "STR_Boots", name: "力量鞋子" },
  { en: "DEX_Boots", name: "敏捷鞋子" },
  { en: "INT_Boots", name: "智慧鞋子" },
  { en: "Claw", name: "爪" },
  { en: "Dagger", name: "匕首" },
  { en: "One-Handed_Sword", name: "单手剑" },
  { en: "One-Handed_Hammer", name: "单手锤" },
  { en: "One-Handed_Axe", name: "单手斧" },
  { en: "Staff", name: "法杖" },
  { en: "Rod", name: "灵杖" },
  { en: "Wand", name: "魔杖" },
  { en: "Cane", name: "手杖" },
  { en: "Pistol", name: "手枪" },
  { en: "Two-Handed_Sword", name: "双手剑" },
  { en: "Two-Handed_Hammer", name: "双手锤" },
  { en: "Two-Handed_Axe", name: "双手斧" },
  { en: "Tin_Staff", name: "锡杖" },
  { en: "War_Staff", name: "武杖" },
  { en: "Bow", name: "弓" },
  { en: "Crossbow", name: "弩" },
  { en: "Musket", name: "火枪" },
  { en: "Fire_Cannon", name: "火炮" },
  { en: "STR_Shield", name: "力量盾牌" },
  { en: "DEX_Shield", name: "敏捷盾牌" },
  { en: "INT_Shield", name: "智慧盾牌" },
  { en: "Necklace", name: "项链" },
  { en: "Ring", name: "戒指" },
  { en: "Belt", name: "腰带" },
  { en: "Spirit_Ring", name: "灵戒" },
  { en: "Memory", name: "英雄追忆" },
  { en: "Divinity_Slate", name: "神格石板" },
  { en: "Destiny", name: "命运" },
  { en: "Prism", name: "异度棱镜" },
];

async function scrapePage(enSlug) {
  try {
    const enUrl = `https://tlidb.com/en/${enSlug}`;
    const cnUrl = `https://tlidb.com/cn/${enSlug}`;

    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(enUrl),
      fetchUrl(cnUrl),
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
  console.log("=== Scraping equipment translations ===\n");

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
