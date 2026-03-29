const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

let added = 0;

// Reaps X s of Y Damage 类型
const dotTypes = [
  "Wilt Damage",
  "Trauma Damage",
  "Ignite Damage",
  "Damage Over Time",
];
const reapValues = [0.07, 0.08, 0.14, 0.16, 0.21, 0.28, 0.35, 0.42, 0.5, 0.6];

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

// Projectile Damage 高数值
for (let i = 150; i <= 300; i++) {
  const en = "+" + i + "% Projectile Damage";
  if (!translations[en]) {
    translations[en] = "+" + i + "% 投射物伤害";
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
