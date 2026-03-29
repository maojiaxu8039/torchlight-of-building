const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 添加缺失的 Regain 翻译
const newTranslations = {
  "+21% Life Regain": "+21% 生命返还",
  "+21% Energy Shield Regain": "+21% 护盾返还",
  "+18% Life Regain": "+18% 生命返还",
  "+18% Energy Shield Regain": "+18% 护盾返还",
  "+15% Life Regain": "+15% 生命返还",
  "+15% Energy Shield Regain": "+15% 护盾返还",
  "+12% Life Regain": "+12% 生命返还",
  "+12% Energy Shield Regain": "+12% 护盾返还",
  "+10% Life Regain": "+10% 生命返还",
  "+10% Energy Shield Regain": "+10% 护盾返还",
};

let added = 0;
Object.entries(newTranslations).forEach((entry) => {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
    added++;
  }
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

console.log("已添加 " + added + " 个翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
