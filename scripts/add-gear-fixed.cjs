const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// gear 类型的固定数值 - 使用合理范围
const gearTypes = ["gear Evasion", "gear Armor", "gear Energy Shield"];

const cnMapping = {
  "gear Evasion": "该装备闪避值",
  "gear Armor": "该装备护甲值",
  "gear Energy Shield": "该装备护盾",
};

// 常用数值范围
const values = [];
for (let i = 10; i <= 5000; i += 10) {
  values.push(i);
}
// 添加个位数
for (let i = 1; i <= 9; i++) {
  values.push(i);
}
// 排序
values.sort((a, b) => a - b);

let added = 0;

values.forEach((val) => {
  gearTypes.forEach((type) => {
    const en = "+" + val + " " + type;
    const cn = "+" + val + " " + cnMapping[type];

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

console.log("新增 gear 固定数值翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
