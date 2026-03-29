const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const fixes = {
  "+(30-50)% gear Energy Shield": "+(30-50)% 该装备护盾",
  "+(61-86)% gear Energy Shield": "+(61-86)% 该装备护盾",
  "+(39-46)% gear Energy Shield": "+(39-46)% 该装备护盾",
  "+(28-33)% gear Energy Shield": "+(28-33)% 该装备护盾",
  "+74% gear Energy Shield": "+74% 该装备护盾",
};

Object.entries(fixes).forEach((entry) => {
  translations[entry[0]] = entry[1];
});

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

console.log("已修复翻译");
