const https = require("https");

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

function getAffixType(typeText) {
  if (!typeText) return null;
  const lower = typeText.toLowerCase();
  if (lower.includes("base affix")) return "Base Affix";
  if (lower.includes("pre-fix")) return "Prefix";
  if (lower.includes("suffix")) return "Suffix";
  if (lower.includes("sweet dream")) return "Sweet Dream Affix";
  if (lower.includes("tower sequence")) return "Tower Sequence";
  if (lower.includes("corrosion")) return "Corrosion Base";
  return null;
}

async function main() {
  console.log("=== 分析 Belt Prefix/Suffix ===\n");

  const html = await fetchUrl("https://tlidb.com/en/Belt");

  // 提取表格行
  const byType = {};
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1];

    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells = [];
    let tdMatch;

    while ((tdMatch = tdRegex.exec(row)) !== null) {
      cells.push(cleanText(tdMatch[1]));
    }

    if (cells.length >= 3) {
      const affixText = cells[0];
      const affixType = getAffixType(cells[2]);

      if (affixText && affixType) {
        if (!byType[affixType]) byType[affixType] = [];
        byType[affixType].push(affixText);
      }
    }
  }

  // 统计
  Object.entries(byType).forEach((entry) => {
    console.log(entry[0] + ": " + entry[1].length + " 条");
  });

  // 分析 Prefix 中的 Max Life 变体
  console.log("\n=== Prefix 中的 Max Life 变体 ===");
  if (byType["Prefix"]) {
    const maxLifeVariants = byType["Prefix"].filter(
      (text) => text.includes("Max Life") && text.match(/\+\(\d+-\d+\)/),
    );

    console.log("Max Life 变体数量: " + maxLifeVariants.length);
    maxLifeVariants.forEach((v) => {
      console.log("  " + v);
    });
  }

  // 分析 Prefix 中的词缀模板
  console.log("\n=== Prefix 词缀模板 ===");
  if (byType["Prefix"]) {
    const templates = {};
    byType["Prefix"].forEach((text) => {
      // 移除数值范围
      const template = text
        .replace(/\+\(\d+-\d+\)/g, "+(--)")
        .replace(/\+\d+-\d+/g, "+--");
      if (!templates[template]) templates[template] = 0;
      templates[template]++;
    });

    console.log("唯一模板数量: " + Object.keys(templates).length);
    Object.entries(templates)
      .slice(0, 10)
      .forEach((entry) => {
        console.log("  (" + entry[1] + "次) " + entry[0]);
      });
  }
}

main();
