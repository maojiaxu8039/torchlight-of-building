const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// Regenerates X Life/Energy Shield per second 类型
const regenTypes = [
  "Life per second",
  "Energy Shield per second",
  "Mana per second",
];

const cnMapping = {
  "Life per second": "生命/秒",
  "Energy Shield per second": "护盾/秒",
  "Mana per second": "魔力/秒",
};

// 固定数值
const values = [];
for (let i = 1; i <= 500; i++) {
  values.push(i);
}

let added = 0;

values.forEach((val) => {
  regenTypes.forEach((type) => {
    const en = "Regenerates " + val + " " + type;
    const cn = "每秘回复 " + val + " " + cnMapping[type];

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

console.log("新增 Regenerates 翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
