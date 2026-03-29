const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+47% Movement Speed": "+47% 移动速度",
  "+40% Movement Speed": "+40% 移动速度",
  "+35% Movement Speed": "+35% 移动速度",
  "+30% Movement Speed": "+30% 移动速度",
  "+25% Movement Speed": "+25% 移动速度",
  "+20% Movement Speed": "+20% 移动速度",
  "+15% Movement Speed": "+15% 移动速度",
  "+12% Movement Speed": "+12% 移动速度",
  "+10% Movement Speed": "+10% 移动速度",
  "+8% Movement Speed": "+8% 移动速度",
  "+5% Movement Speed": "+5% 移动速度",
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
