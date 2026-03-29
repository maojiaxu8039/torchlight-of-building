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

function extractAllText(html) {
  const texts = new Set();

  // 提取所有 td 标签的文本
  const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let match;
  while ((match = tdPattern.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&ndash;/g, "–")
      .replace(/&mdash;/g, "—")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();

    if (text && text.length > 3 && text.length < 500) {
      texts.add(text);
    }
  }

  // 提取 data-hover 链接文本
  const hoverPattern = /data-hover="([^"]+)"/g;
  while ((match = hoverPattern.exec(html)) !== null) {
    const text = match[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    if (text && text.length > 3) {
      texts.add(text);
    }
  }

  return texts;
}

function normalizeForMatch(text) {
  return text.replace(/[\d.\-–—]+/g, "#").replace(/\s+/g, " ");
}

async function scrapePage(page) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl(`https://tlidb.com/en/${page}`),
      fetchUrl(`https://tlidb.com/cn/${page}`),
    ]);

    if (!enHtml || !cnHtml || enHtml.length < 1000) {
      return { page, matched: 0, enTexts: 0, cnTexts: 0 };
    }

    const enTexts = extractAllText(enHtml);
    const cnTexts = extractAllText(cnHtml);

    const translations = {};
    let matched = 0;

    enTexts.forEach((enText) => {
      if (cnTexts.has(enText)) {
        if (!translations[enText]) {
          translations[enText] = enText;
          matched++;
        }
      }
    });

    return {
      page,
      matched,
      enTexts: enTexts.size,
      cnTexts: cnTexts.size,
      translations,
    };
  } catch (error) {
    return { page, matched: 0, enTexts: 0, cnTexts: 0, error: error.message };
  }
}

async function main() {
  console.log("🚀 Scraping all pages for translations...\n");

  const outDir = path.join(__dirname, "../src/data/translated-affixes");
  const allTranslations = {};

  const pages = [
    "Craft",
    "Belt",
    "Necklace",
    "Ring",
    "One-Handed_Sword",
    "Two-Handed_Sword",
    "One-Handed_Axe",
    "Two-Handed_Axe",
    "One-Handed_Hammer",
    "Two-Handed_Hammer",
    "Dagger",
    "Wand",
    "Tin_Staff",
    "Bow",
    "Crossbow",
    "Pistol",
    "Musket",
    "Cane",
    "Shield",
    "Claw",
    "Rod",
    "Scepter",
    "Fire_Cannon",
    "Spirit_Ring",
    "DEX_Boots",
    "INT_Boots",
    "STR_Boots",
    "DEX_Gloves",
    "INT_Gloves",
    "STR_Gloves",
    "DEX_Helmet",
    "INT_Helmet",
    "STR_Helmet",
    "DEX_Shield",
    "INT_Shield",
    "STR_Shield",
    "Legendary_Gear",
    "Active_Skill",
    "Support_Skill",
    "Passive_Skill",
    "Activation_Medium_Skill",
    "Noble_Support_Skill",
    "Magnificent_Support_Skill",
    "Pactspirit",
    "Ethereal_Prism",
    "Destiny",
    "Corrosion",
    "Dream_Talking",
    "Blending_Rituals",
    "TOWER_Sequence",
    "Graft",
  ];

  let totalMatched = 0;

  for (const page of pages) {
    const result = await scrapePage(page);

    if (result.error) {
      console.log(`❌ ${result.page}: Error - ${result.error}`);
    } else {
      console.log(
        `✅ ${result.page}: ${result.matched}/${result.enTexts} matched`,
      );
      Object.assign(allTranslations, result.translations || {});
      totalMatched += result.matched;
    }
  }

  console.log(`\n=================================================`);
  console.log(`✅ Total translations: ${Object.keys(allTranslations).length}`);
  console.log(`=================================================\n`);

  // 保存
  fs.writeFileSync(
    path.join(outDir, "all-website-exact-translations.json"),
    JSON.stringify(allTranslations, null, 2),
    "utf-8",
  );

  console.log(`✅ Saved to all-website-exact-translations.json`);

  // 显示样本
  console.log("\nSample translations:");
  let count = 0;
  Object.entries(allTranslations)
    .slice(0, 15)
    .forEach(([en, cn]) => {
      console.log(`  ${en.substring(0, 60)}`);
      count++;
    });
}

main().catch(console.error);
