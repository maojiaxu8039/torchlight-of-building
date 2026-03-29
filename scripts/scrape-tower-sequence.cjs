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

async function main() {
  console.log("=== 抓取 Tower Sequence 翻译 ===\n");

  const [enHtml, cnHtml] = await Promise.all([
    fetchUrl("https://tlidb.com/en/TOWER_Sequence"),
    fetchUrl("https://tlidb.com/cn/TOWER_Sequence"),
  ]);

  const enById = {};
  const cnById = {};

  // 提取 EN 表格
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(enHtml)) !== null) {
    const row = rowMatch[1];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [];
    let tdMatch;

    while ((tdMatch = tdRegex.exec(row)) !== null) {
      cells.push(cleanText(tdMatch[1]));
    }

    if (cells.length >= 1) {
      const idMatch = row.match(/data-modifier-id="(\d+)"/);
      if (idMatch && cells[0]) {
        enById[idMatch[1]] = cells[0];
      }
    }
  }

  // 提取 CN 表格
  while ((rowMatch = rowRegex.exec(cnHtml)) !== null) {
    const row = rowMatch[1];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [];
    let tdMatch;

    while ((tdMatch = tdRegex.exec(row)) !== null) {
      cells.push(cleanText(tdMatch[1]));
    }

    if (cells.length >= 1) {
      const idMatch = row.match(/data-modifier-id="(\d+)"/);
      if (idMatch && cells[0]) {
        cnById[idMatch[1]] = cells[0];
      }
    }
  }

  console.log("EN 词缀数:", Object.keys(enById).length);
  console.log("CN 词缀数:", Object.keys(cnById).length);

  // 生成翻译
  const translations = {};
  let matched = 0;

  Object.entries(enById).forEach((entry) => {
    const id = entry[0];
    const enText = entry[1];

    if (cnById[id] && enText !== cnById[id]) {
      translations[enText] = cnById[id];
      matched++;
    }
  });

  console.log("匹配到的翻译:", matched);

  // 显示示例
  console.log("\n示例:");
  let count = 0;
  Object.entries(translations).forEach((entry) => {
    if (count < 10) {
      console.log("EN:", entry[0].substring(0, 60));
      console.log("CN:", entry[1].substring(0, 60));
      console.log("");
      count++;
    }
  });

  // 读取现有翻译并合并
  const existing = JSON.parse(
    fs.readFileSync(
      "src/data/translated-affixes/merged-all-translations.json",
      "utf8",
    ),
  );
  const merged = Object.assign({}, existing, translations);

  // 重新排序
  const sorted = Object.entries(merged).sort(
    (a, b) => b[0].length - a[0].length,
  );
  const result = {};
  sorted.forEach((entry) => {
    result[entry[0]] = entry[1];
  });

  fs.writeFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    JSON.stringify(result, null, 2),
  );

  console.log("翻译已保存，总计:", Object.keys(result).length);
}

main();
