const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let added = 0;

// Lightning Infiltration Effect
for (let i = 1; i <= 100; i++) {
  const en = "+" + i + "% Lightning Infiltration Effect";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 闪电渗透效果";
    added++;
  }
}

// Cold Infiltration Effect
for (let i = 1; i <= 100; i++) {
  const en = "+" + i + "% Cold Infiltration Effect";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 冰冷渗透效果";
    added++;
  }
}

// Fire Infiltration Effect
for (let i = 1; i <= 100; i++) {
  const en = "+" + i + "% Fire Infiltration Effect";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 火焰渗透效果";
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

console.log("新增 Infiltration Effect 翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
