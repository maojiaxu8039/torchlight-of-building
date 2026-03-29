const fs = require("fs");

console.log("=== 添加 Max Energy Shield 翻译 ===\n");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+140 Max Energy Shield": "+140 最大护盾",
  "+130 Max Energy Shield": "+130 最大护盾",
  "+120 Max Energy Shield": "+120 最大护盾",
  "+110 Max Energy Shield": "+110 最大护盾",
  "+100 Max Energy Shield": "+100 最大护盾",
  "+90 Max Energy Shield": "+90 最大护盾",
  "+80 Max Energy Shield": "+80 最大护盾",
  "+70 Max Energy Shield": "+70 最大护盾",
  "+60 Max Energy Shield": "+60 最大护盾",
  "+50 Max Energy Shield": "+50 最大护盾",
  "+45 Max Energy Shield": "+45 最大护盾",
  "+40 Max Energy Shield": "+40 最大护盾",
  "+35 Max Energy Shield": "+35 最大护盾",
  "+30 Max Energy Shield": "+30 最大护盾",
  "+25 Max Energy Shield": "+25 最大护盾",
  "+20 Max Energy Shield": "+20 最大护盾",
  "+15 Max Energy Shield": "+15 最大护盾",
  "+10 Max Energy Shield": "+10 最大护盾",
  "+5 Max Energy Shield": "+5 最大护盾",
};

let added = 0;
Object.entries(newTranslations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log("添加了 " + added + " 个翻译");

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
