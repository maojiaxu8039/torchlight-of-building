const fs = require("fs");

const existingTranslations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);
const scrapedTranslations = JSON.parse(
  fs.readFileSync("scripts/tlidb-dex-boots.json", "utf8"),
);

let added = 0;
const updated = 0;

Object.entries(scrapedTranslations).forEach((entry) => {
  let en = entry[0];
  let cn = entry[1];

  en = en.replace(/\s+1\s+1$/g, "");
  en = en.replace(/\s+[A-Z][a-zA-Z]+(\s+[A-Z][a-zA-Z]+)*$/g, "");

  cn = cn.replace(/\s+1\s+1$/g, "");
  cn = cn.replace(/\s+敏捷鞋子\s+[^】]+/g, "");

  if (en.length > 3 && cn.length > 3) {
    if (!existingTranslations[en]) {
      existingTranslations[en] = cn;
      added++;
    }
  }
});

const sorted = Object.entries(existingTranslations).sort(
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

console.log("新增翻译:", added);
console.log("更新翻译:", updated);
console.log("总计:", Object.keys(result).length, "条");
