const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// additional Max Life/Mana/Energy Shield 类型
const types = [
  "additional Max Life",
  "additional Max Mana",
  "additional Max Energy Shield",
  "additional Evasion",
  "additional Armor",
];

const cnMapping = {
  "additional Max Life": "额外最大生命",
  "additional Max Mana": "额外最大魔力",
  "additional Max Energy Shield": "额外最大护盾",
  "additional Evasion": "额外闪避",
  "additional Armor": "额外护甲",
};

let added = 0;

for (let i = 1; i <= 50; i++) {
  types.forEach((type) => {
    const en = "+" + i + "% " + type;
    if (!translations[en]) {
      translations[en] = "+" + i + "% " + cnMapping[type];
      added++;
    }
  });
}

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

console.log("新增 additional 翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
