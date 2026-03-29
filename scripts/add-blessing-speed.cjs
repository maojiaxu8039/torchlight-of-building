const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let added = 0;

// Attack and Cast Speed + Minion Attack and Cast Speed
for (let i = 1; i <= 100; i++) {
  const en =
    "+" +
    i +
    "% Attack and Cast Speed +" +
    i +
    "% Minion Attack and Cast Speed";
  if (!translations[en]) {
    translations[en] =
      "+" + i + "% 攻击和施法速度 +" + i + "% 召唤物攻击和施法速度";
    added++;
  }
}

// damage per stack of any Blessing
for (let i = 1; i <= 20; i++) {
  const en = "+" + i + "% damage per stack of any Blessing";
  if (!translations[en]) {
    translations[en] = "每有 1 层任意祝福，额外 +" + i + "% 伤害";
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
