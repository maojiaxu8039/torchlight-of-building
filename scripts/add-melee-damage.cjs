const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+70% additional Melee Damage": "额外 +70% 近战伤害",
  "+54% additional Attack Damage after standing still for 0.1s. -15% additional Attack Speed":
    "站立 0.1 秒后，+54% 额外攻击伤害 -15% 额外攻击速度",
  "+113% additional Attack Damage after standing still for 0.1s. -20% additional Attack Speed":
    "站立 0.1 秒后，+113% 额外攻击伤害 -20% 额外攻击速度",
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
