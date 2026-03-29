const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+130% Focus Speed": "+130% 贯注速度",
  "+173% Affliction Effect": "+173% 加剧效果",
  "+166% chance to Multistrike": "+166% 多重打击几率",
  "+208% Critical Strike Damage": "+208% 暴击伤害",
  "+80% Attack and Cast Speed +80% Minion Attack and Cast Speed":
    "+80% 攻击和施法速度 +80% 召唤物攻击和施法速度",
  "+398% Critical Strike Rating": "+398% 暴击值",
  "+58% Attack Critical Strike Rating for this gear": "+58% 该装备攻击暴击值",
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
