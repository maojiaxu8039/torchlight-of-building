const fs = require("fs");

console.log("=== 生成模板翻译并应用到游戏数据 ===\n");

// 读取网页模板翻译
const webTranslations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 生成模板翻译
const templates = {};

Object.entries(webTranslations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  // 生成模板：移除数值范围
  const template = en
    .replace(/\+\([\d-]+\)/g, "+(--)")
    .replace(/\+[\d-]+%/g, "+--%")
    .replace(/\([\d-]+\)/g, "(--)");

  if (template !== en) {
    // 这是有数值范围的词缀
    const templateCn = cn
      .replace(/\+[\d-]+%/g, "+--%")
      .replace(/\+\([\d-]+\)/g, "+(--)")
      .replace(/\([\d-]+\)/g, "(--)");

    if (!templates[template] && templateCn) {
      templates[template] = templateCn;
    }
  }
});

console.log("生成了 " + Object.keys(templates).length + " 个模板翻译");

// 读取游戏数据
const gameFiles = fs
  .readdirSync("src/data/gear-affix")
  .filter((f) => f.endsWith(".ts"));

let matched = 0;
let total = 0;

// 为每个游戏数据文件应用模板翻译
gameFiles.forEach((file) => {
  const filePath = "src/data/gear-affix/" + file;
  const content = fs.readFileSync(filePath, "utf8");

  // 检查是否是 Prefix 或 Suffix 文件
  if (file.includes("-prefix") || file.includes("-suffix")) {
    // 提取 craftableAffix
    const affixMatches = content.match(/craftableAffix:\s*"([^"]+)"/g);

    if (affixMatches) {
      total += affixMatches.length;

      affixMatches.forEach((m) => {
        const affix = m.match(/craftableAffix:\s*"([^"]+)"/)[1];

        // 检查是否已有翻译
        if (!webTranslations[affix]) {
          // 尝试模板匹配
          const template = affix
            .replace(/\+\([\d-]+\)/g, "+(--)")
            .replace(/\+[\d-]+%/g, "+--%")
            .replace(/\([\d-]+\)/g, "(--)");

          const templateCn = templates[template];

          if (templateCn) {
            // 应用模板翻译
            const cnAffix = templateCn
              .replace(/\+--%/g, () => {
                const rangeMatch = affix.match(/\+([\d-]+)%/);
                return rangeMatch ? "+" + rangeMatch[1] + "%" : "+--%";
              })
              .replace(/\+--\)/g, () => {
                const rangeMatch = affix.match(/\+\(([\d-]+)\)/);
                return rangeMatch ? "+(" + rangeMatch[1] + ")" : "+--";
              })
              .replace(/--/g, () => {
                const rangeMatch = affix.match(/(\d+-\d+)/);
                return rangeMatch ? rangeMatch[1] : "--";
              });

            if (cnAffix && cnAffix !== affix) {
              webTranslations[affix] = cnAffix;
              matched++;
            }
          }
        }
      });
    }
  }
});

console.log("检查了 " + total + " 个词缀");
console.log("通过模板匹配新增 " + matched + " 个翻译");

// 保存翻译
const sorted = Object.entries(webTranslations).sort(
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

console.log("\n翻译文件已更新，总计 " + Object.keys(result).length + " 条翻译");
