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

async function scrapePage(slug) {
  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/" + slug + "#Item"),
    fetchUrl("https://tlidb.com/cn/" + slug + "#Item"),
  ]);

  const enById = {};
  const cnById = {};

  // 提取 Base Affix (通过 Type 列判断)
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
      const source = cells[1];
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
}

async function main() {
  console.log("=== 抓取 Base Affix 翻译 ===\n");

  const translations = {};

  const slugs = ["Belt", "Helmet-Str", "Chest-Str"];

  for (const slug of slugs) {
    process.stdout.write(slug + "... ");
    const result = await scrapePage(slug);
    Object.assign(translations, result);
    console.log(Object.keys(result).length + " 条");
  }

  // 显示示例
  console.log("\n示例:");
  let count = 0;
  Object.entries(translations).forEach((entry) => {
    if (count < 5) {
      console.log("EN:", entry[0]);
      console.log("CN:", entry[1]);
      console.log("");
      count++;
    }
  });

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

  console.log("翻译已保存，总计:", Object.keys(result).length);
}

main();
