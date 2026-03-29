const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let added = 0;

// 添加更多 Reaps 数值
const dotTypes = [
  "Wilt Damage",
  "Trauma Damage",
  "Ignite Damage",
  "Damage Over Time",
];
const reapValues = [0.19, 0.21, 0.24, 0.28, 0.35, 0.42, 0.5];

reapValues.forEach((val) => {
  dotTypes.forEach((type) => {
    const en =
      "Reaps " +
      val +
      " s of " +
      type +
      " when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target";
    if (!translations[en]) {
      translations[en] =
        "造成持续伤害时，收割 " +
        val +
        " 秒" +
        (type === "Wilt Damage"
          ? "凋零"
          : type === "Trauma Damage"
            ? "创伤"
            : type === "Ignite Damage"
              ? "点燃"
              : "持续") +
        "伤害，该效果对同一目标有 1 秒回复时间";
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

console.log("新增 Reaps 翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
