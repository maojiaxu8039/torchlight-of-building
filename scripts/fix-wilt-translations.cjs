const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let fixed = 0;

Object.entries(translations).forEach(([en, cn]) => {
  if (cn.includes("萎陷")) {
    translations[en] = cn.replace(/萎陷/g, "凋零");
    fixed++;
  }
});

console.log(`Fixed ${fixed} translations`);

fs.writeFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  JSON.stringify(translations, null, 2),
);
console.log("Done!");
