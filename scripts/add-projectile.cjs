const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// Projectile Speed 类型
const types = ["Projectile Speed", "Projectile Damage", "Projectile Area"];

const cnMapping = {
  "Projectile Speed": "投射物速度",
  "Projectile Damage": "投射物伤害",
  "Projectile Area": "投射物范围",
};

const values = [];
for (let i = 1; i <= 150; i++) {
  values.push(i);
}

let added = 0;

values.forEach((val) => {
  types.forEach((type) => {
    const en = "+" + val + "% " + type;
    if (!translations[en]) {
      translations[en] = "+" + val + "% " + cnMapping[type];
      added++;
    }
  });
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

console.log("新增 Projectile 翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
