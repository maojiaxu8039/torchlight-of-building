const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const missing = [
  "+11% Elemental Resistance",
  "+14% Elemental Resistance",
  "+7% Elemental Resistance",
  "+8% Elemental Resistance",
  "+9% Elemental Resistance",
  "+12% Elemental Resistance",
  "+14% Elemental Resistance",
  "+15% Elemental Resistance",
  "+17% Elemental Resistance",
  "+18% Elemental Resistance",
  "+19% Elemental Resistance",
];

missing.forEach((key) => {
  if (!translations[key]) {
    translations[key] = key.replace(/\+(\d+)% /, "+$1% ");
  }
});

fs.writeFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  JSON.stringify(translations, null, 2),
);
console.log("Done!");
