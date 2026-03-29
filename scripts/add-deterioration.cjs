const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+443% Critical Strike Rating against Traumatized enemies -30% additional Hit Damage":
    "对创伤状态下的敌人，+443% 暴击值额外 -30% 击中伤害",
  "-17% additional damage taken at Low Mana": "低魔力时，额外 -17% 受到的伤害",
  "+58% Deterioration Damage": "+58% 恶化伤害",
  "+38% Deterioration Chance": "+38% 恶化几率",
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
