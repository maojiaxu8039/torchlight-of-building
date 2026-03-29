const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

translations[
  "Has Hasten +(9-12)% Attack Speed, Cast Speed, and Movement Speed when having Hasten"
] = "拥有迅捷 获得迅捷时，+(9-12)% 攻击速度、施法速度和移动速度";
translations[
  "Has Hasten +(5-8)% Attack Speed, Cast Speed, and Movement Speed when having Hasten"
] = "拥有迅捷 获得迅捷时，+(5-8)% 攻击速度、施法速度和移动速度";
translations[
  "Has Hasten+(5-8)% Attack Speed, Cast Speed, and Movement Speed when having Hasten"
] = "拥有迅捷 获得迅捷时，+(5-8)% 攻击速度、施法速度和移动速度";
translations[
  "Has Hasten +(11-14)% Attack Speed, Cast Speed, and Movement Speed when having Hasten"
] = "拥有迅捷 获得迅捷时，+(11-14)% 攻击速度、施法速度和移动速度";
translations[
  "Has Hasten +(11-15)% Attack Speed, Cast Speed, and Movement Speed when having Hasten"
] = "拥有迅捷 获得迅捷时，+(11-15)% 攻击速度、施法速度和移动速度";
translations[
  "Has Hasten +(10-12)% Attack Speed, Cast Speed, and Movement Speed when having Hasten"
] = "拥有迅捷 获得迅捷时，+(10-12)% 攻击速度、施法速度和移动速度";

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

console.log("已修正翻译");
