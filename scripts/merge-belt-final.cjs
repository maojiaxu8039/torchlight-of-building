const fs = require("fs");

const beltTranslations = JSON.parse(
  fs.readFileSync("scripts/belt-base-affix-translations.json", "utf8"),
);
const existing = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

console.log("Belt 翻译:", Object.keys(beltTranslations).length);
console.log("现有翻译:", Object.keys(existing).length);

let added = 0;
Object.entries(beltTranslations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];
  if (!existing[en]) {
    existing[en] = cn;
    added++;
  }
});

console.log("新增:", added);

const sorted = Object.entries(existing).sort(
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

console.log("总计:", Object.keys(result).length);
