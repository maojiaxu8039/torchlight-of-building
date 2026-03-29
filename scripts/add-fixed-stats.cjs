const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 固定数值类型属性
const fixedStatTypes = [
  "Intelligence",
  "Dexterity",
  "Strength",
  "Max Life",
  "Max Mana",
  "Max Energy Shield",
];

// 翻译映射
const cnMapping = {
  Intelligence: "智慧",
  Dexterity: "敏捷",
  Strength: "力量",
  "Max Life": "最大生命",
  "Max Mana": "最大魔力",
  "Max Energy Shield": "最大护盾",
};

// 数值范围
const fixedValues = [];
for (let i = 1; i <= 300; i++) {
  fixedValues.push(i);
}

let added = 0;

fixedValues.forEach((val) => {
  fixedStatTypes.forEach((stat) => {
    const en = "+" + val + " " + stat;
    const cn = "+" + val + " " + cnMapping[stat];

    if (!translations[en]) {
      translations[en] = cn;
      added++;
    }
  });
});

// 排序并保存
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

console.log("新增翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
