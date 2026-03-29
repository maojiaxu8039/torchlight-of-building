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

function cleanText(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const equipmentList = [
  "Belt",
  "Helmet-Str",
  "Helmet-Dex",
  "Helmet-Int",
  "Chest-Str",
  "Chest-Dex",
  "Chest-Int",
  "Gloves-Str",
  "Gloves-Dex",
  "Gloves-Int",
  "Boots-Str",
  "Boots-Dex",
  "Boots-Int",
  "Shield-Str",
  "Shield-Dex",
  "Shield-Int",
  "Necklace",
  "Ring",
  "Spirit-Ring",
  "Claw",
  "Dagger",
  "One-Handed-Sword",
  "One-Handed-Hammer",
  "One-Handed-Axe",
  "Rod",
  "Wand",
  "Scepter",
  "Cane",
  "Pistol",
  "Two-Handed-Sword",
  "Two-Handed-Hammer",
  "Two-Handed-Axe",
  "Tin-Staff",
  "Cudgel",
  "Bow",
  "Crossbow",
  "Musket",
  "Fire-Cannon",
];

async function scrapePage(slug) {
  try {
    const [enHtml, cnHtml] = await Promise.all([
      fetchUrl("https://tlidb.com/en/" + slug + "#Item"),
      fetchUrl("https://tlidb.com/cn/" + slug + "#Item"),
    ]);

    const enById = {};
    const cnById = {};

    // 提取 Base Affix
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(enHtml)) !== null) {
      const row = rowMatch[1];
      const cells = [];
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdMatch;

      while ((tdMatch = tdRegex.exec(row)) !== null) {
        cells.push(cleanText(tdMatch[1]));
      }

      if (cells.length >= 3) {
        const affixText = cells[0];
        const type = cells[2];

        if (type === "Base Affix" && affixText) {
          const idMatch = row.match(/data-modifier-id="(\d+)"/);
          if (idMatch) {
            enById[idMatch[1]] = affixText;
          }
        }
      }
    }

    while ((rowMatch = rowRegex.exec(cnHtml)) !== null) {
      const row = rowMatch[1];
      const cells = [];
      const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tdMatch;

      while ((tdMatch = tdRegex.exec(row)) !== null) {
        cells.push(cleanText(tdMatch[1]));
      }

      if (cells.length >= 3) {
        const type = cells[2];

        if (type === "基础词缀" && cells[0]) {
          const idMatch = row.match(/data-modifier-id="(\d+)"/);
          if (idMatch) {
            cnById[idMatch[1]] = cells[0];
          }
        }
      }
    }

    const translations = {};
    Object.entries(enById).forEach((entry) => {
      const id = entry[0];
      const en = entry[1];
      if (cnById[id] && en !== cnById[id]) {
        translations[en] = cnById[id];
      }
    });

    return translations;
  } catch (e) {
    return {};
  }
}

async function main() {
  console.log("=== 抓取所有装备的 Base Affix 翻译 ===\n");

  const translations = {};
  let total = 0;

  for (let i = 0; i < equipmentList.length; i++) {
    const slug = equipmentList[i];
    process.stdout.write(
      "[" + (i + 1) + "/" + equipmentList.length + "] " + slug + "... ",
    );

    const result = await scrapePage(slug);
    Object.assign(translations, result);
    total += Object.keys(result).length;
    console.log(Object.keys(result).length + " 条");

    await new Promise((r) => {
      setTimeout(r, 50);
    });
  }

  console.log("\n总计抓取: " + total + " 条翻译");

  // 保存
  const existing = JSON.parse(
    fs.readFileSync(
      "src/data/translated-affixes/merged-all-translations.json",
      "utf8",
    ),
  );
  const merged = Object.assign({}, existing, translations);
  const sorted = Object.entries(merged).sort(
    (a, b) => b[0].length - a[0].length,
  );
  const result = {};
  sorted.forEach((e) => {
    result[e[0]] = e[1];
  });
  fs.writeFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    JSON.stringify(result, null, 2),
  );

  console.log("已保存到 merged-all-translations.json");
}

main();
