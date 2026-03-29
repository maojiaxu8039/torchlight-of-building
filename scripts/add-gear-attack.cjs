const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let added = 0;

// +XX% Gear Attack Speed. -XX% additional Attack Damage
for (let i = 10; i <= 100; i++) {
  for (let j = 5; j <= 30; j++) {
    const en =
      "+" + i + "% Gear Attack Speed. -" + j + "% additional Attack Damage";
    if (!translations[en]) {
      translations[en] = "+" + i + "% 该装备攻击速度 -" + j + "% 额外攻击伤害";
      added++;
    }
  }
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

console.log("新增 Gear Attack Speed 翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
