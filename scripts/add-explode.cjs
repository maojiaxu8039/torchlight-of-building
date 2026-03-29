const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 添加爆炸词条
translations[
  "Enemies have a 23% chance to explode when defeated by an Attack or Spell, dealing True Damage equal to 275% of their Max Life to enemies within a 6 m radius"
] =
  "被攻击或法术击败的敌人有 23% 几率爆炸，对半径 6 米内的敌人造成相当于其最大生命 275% 的真实伤害";

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

console.log("已添加翻译");
