const fs = require("fs");

const translations = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));

// 标准化百分号格式：+11% -> +11%
let fixed = 0;

Object.entries(translations).forEach(([en, cn]) => {
  // 修复英文格式：+ 11% -> +11%
  const fixedEn = en.replace(/\+ (\d+%)/g, "+$1%").replace(/- (\d+%)/g, "-$1%");
  
  if (fixedEn !== en) {
    delete translations[en];
    translations[fixedEn] = cn;
    fixed++;
  }
});

console.log(`Fixed ${fixed} formats`);

const sorted = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
const result = {};
sorted.forEach(([en, cn]) => { result[en] = cn; });

fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));
console.log("Done!");
