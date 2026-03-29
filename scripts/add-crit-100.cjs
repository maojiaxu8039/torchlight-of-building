const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let added = 0;

// Critical Strike Damage 100%+
for (let i = 101; i <= 300; i++) {
  const en = "+" + i + "% Critical Strike Damage";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 暴击伤害";
    added++;
  }
}

// Attack Critical Strike Rating for this gear
for (let i = 50; i <= 150; i++) {
  const en = "+" + i + "% Attack Critical Strike Rating for this gear";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 该装备攻击暴击值";
    added++;
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

console.log("新增翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
