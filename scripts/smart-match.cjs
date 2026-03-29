const fs = require("fs");

console.log("=== 智能模板匹配 ===\n");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 生成更智能的模板
const smartTemplates = {};

Object.entries(translations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  // 生成智能模板：移除所有数值
  const template = en
    .replace(/\d+[\d.]*/g, "#")
    .replace(/\s+/g, " ")
    .trim();

  if (template.length > 10) {
    smartTemplates[template] = cn;
  }
});

console.log("生成了 " + Object.keys(smartTemplates).length + " 个智能模板");

// 读取游戏数据并匹配
const files = fs
  .readdirSync("src/data/gear-affix")
  .filter((f) => f.endsWith(".ts"));
let matched = 0;

files.forEach((file) => {
  const content = fs.readFileSync("src/data/gear-affix/" + file, "utf8");
  const affixMatches = content.match(/craftableAffix:\s*"([^"]+)"/g);

  if (affixMatches) {
    affixMatches.forEach((m) => {
      const affix = m.match(/craftableAffix:\s*"([^"]+)"/)[1];

      if (!translations[affix]) {
        // 生成智能模板
        const affixTemplate = affix
          .replace(/\d+[\d.]*/g, "#")
          .replace(/\s+/g, " ")
          .trim();

        if (smartTemplates[affixTemplate]) {
          translations[affix] = smartTemplates[affixTemplate];
          matched++;
        }
      }
    });
  }
});

console.log("通过智能模板匹配新增 " + matched + " 个翻译");

// 保存
const sorted = Object.entries(translations).sort(
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

console.log("总计: " + Object.keys(result).length + " 条翻译");
