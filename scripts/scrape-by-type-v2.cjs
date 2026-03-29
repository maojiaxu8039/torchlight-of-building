const https = require("https");
const fs = require("fs");

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

// 装备列表
const equipmentList = [
  { slug: "Belt", type: "腰带" },
  { slug: "STR_Helmet", type: "力量头部" },
  { slug: "DEX_Helmet", type: "敏捷头部" },
  { slug: "INT_Helmet", type: "智慧头部" },
  { slug: "Claw", type: "爪" },
  { slug: "Dagger", type: "匕首" },
  { slug: "Rod", type: "灵杖" },
  { slug: "Wand", type: "法杖" },
  { slug: "Cane", type: "手杖" },
  { slug: "Pistol", type: "手枪" },
  { slug: "Bow", type: "弓" },
  { slug: "Crossbow", type: "弩" },
  { slug: "Musket", type: "火枪" },
  { slug: "Fire_Cannon", type: "火炮" },
  { slug: "Necklace", type: "项链" },
  { slug: "Ring", type: "戒指" },
  { slug: "Spirit_Ring", type: "灵戒" },
  { slug: "Memory", type: "英雄追忆" },
  { slug: "Destiny", type: "命运" },
];

function extractByType(html) {
  const byType = {
    "Base Affix": {},
    "Basic Pre-fix": {},
    "Advanced Pre-fix": {},
    "Ultimate Pre-fix": {},
    "Basic Suffix": {},
    "Advanced Suffix": {},
    "Ultimate Suffix": {},
    "Sweet Dream Affix": {},
    "Corrosion Base": {},
  };

  const pattern = /data-modifier-id="(\d+)"[^>]*>([\s\S]*?)<\/span>/gi;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const id = match[1];
    const text = match[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "–")
      .replace(/\s+/g, " ")
      .trim();

    if (text && text.length > 2) {
      // 判断类型
      let type = "Base Affix";
      if (text.includes("Base Affix")) type = "Base Affix";
      else if (text.includes("Basic Pre-fix")) type = "Basic Pre-fix";
      else if (text.includes("Advanced Pre-fix")) type = "Advanced Pre-fix";
      else if (text.includes("Ultimate Pre-fix")) type = "Ultimate Pre-fix";
      else if (text.includes("Basic Suffix")) type = "Basic Suffix";
      else if (text.includes("Advanced Suffix")) type = "Advanced Suffix";
      else if (text.includes("Ultimate Suffix")) type = "Ultimate Suffix";
      else if (text.includes("Sweet Dream")) type = "Sweet Dream Affix";
      else if (text.includes("Corrosion")) type = "Corrosion Base";

      byType[type][id] = text;
    }
  }

  return byType;
}

async function scrapeEquipment(slug) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(`https://tlidb.com/en/${slug}`),
      fetchUrl(`https://tlidb.com/cn/${slug}`),
    ]);

    if (enHtml.length < 1000 || cnHtml.length < 1000) {
      return {};
    }

    const enByType = extractByType(enHtml);
    const cnByType = extractByType(cnHtml);

    const translations = {};

    // 按类型匹配
    Object.entries(enByType).forEach(([type, enItems]) => {
      Object.entries(enItems).forEach(([id, enText]) => {
        const cnText = cnByType[type]?.[id];
        if (cnText && enText !== cnText) {
          translations[enText] = cnText;
        }
      });
    });

    return translations;
  } catch (error) {
    return {};
  }
}

async function main() {
  console.log("=== Scraping by equipment type ===\n");

  const allTranslations = {};

  for (const { slug, type } of equipmentList) {
    process.stdout.write(`${type} (${slug})... `);
    const translations = await scrapeEquipment(slug);
    Object.assign(allTranslations, translations);
    console.log(`✅ ${Object.keys(translations).length}`);
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\nTotal: ${Object.keys(allTranslations).length}`);

  // 保存
  fs.writeFileSync(
    "src/data/translated-affixes/by-type-translations.json",
    JSON.stringify(allTranslations, null, 2),
  );

  // 合并到主文件
  const existing = JSON.parse(
    fs.readFileSync(
      "src/data/translated-affixes/merged-all-translations.json",
      "utf8",
    ),
  );

  const merged = { ...existing, ...allTranslations };
  const sorted = Object.entries(merged).sort(
    (a, b) => b[0].length - a[0].length,
  );
  const result = {};
  sorted.forEach(([en, cn]) => {
    result[en] = cn;
  });

  fs.writeFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    JSON.stringify(result, null, 2),
  );

  console.log("Saved!");
}

main();
