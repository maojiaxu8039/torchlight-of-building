const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "Restores 6% Life on Block. Interval: 0.3s":
    "格挡时，回复 6% 生命，间隔 0.3 秒",
  "+41% Attack and Cast Speed +41% Minion Attack and Cast Speed":
    "+41% 攻击和施法速度 +41% 召唤物攻击和施法速度",
  "+1 Max Sentry Quantity +5% additional damage":
    "+1 哨卫数量上限 额外 +5% 伤害",
  "+10% Max Elemental Resistance": "+10% 最大元素抗性",
};

Object.entries(newTranslations).forEach((entry) => {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
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

console.log("已添加 " + Object.keys(newTranslations).length + " 个翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
