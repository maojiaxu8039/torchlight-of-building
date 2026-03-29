const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let added = 0;

// Affliction Effect
for (let i = 50; i <= 200; i++) {
  const en = "+" + i + "% Affliction Effect";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 加剧效果";
    added++;
  }
}

// Critical Strike Rating 高数值
for (let i = 100; i <= 500; i++) {
  const en = "+" + i + "% Critical Strike Rating";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 暴击值";
    added++;
  }
}

// Has Hasten +11%
const en =
  "Has Hasten +11% Attack Speed, Cast Speed, and Movement Speed when having Hasten";
if (!translations[en]) {
  translations[en] = "拥有迅捷 获得迅捷时，+11% 攻击速度、施法速度和移动速度";
  added++;
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
