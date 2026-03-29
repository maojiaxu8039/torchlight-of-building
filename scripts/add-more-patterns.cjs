const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// gear Attack Speed 类型
const gearAttackTypes = [
  "gear Attack Speed",
  "gear Cast Speed",
  "gear Physical Damage",
  "gear Elemental Damage",
  "gear Spell Damage",
];

const cnMapping = {
  "gear Attack Speed": "该装备攻击速度",
  "gear Cast Speed": "该装备施法速度",
  "gear Physical Damage": "该装备物理伤害",
  "gear Elemental Damage": "该装备元素伤害",
  "gear Spell Damage": "该装备法术伤害",
};

// Mitigation 类型
const mitigationTypes = [
  "Critical Strike Damage Mitigation",
  "Damage Mitigation",
];

const pctValues = [];
for (let i = 1; i <= 100; i++) {
  pctValues.push(i);
}

let added = 0;

// 添加 gear Attack Speed 等
pctValues.forEach((pct) => {
  gearAttackTypes.forEach((type) => {
    var en = "+" + pct + "% " + type;
    if (!translations[en]) {
      translations[en] = "+" + pct + "% " + cnMapping[type];
      added++;
    }
  });
});

// 添加 Shadow Damage
for (var i = 1; i <= 50; i++) {
  var en = "Shadow Quantity +2 +" + i + "% additional Shadow Damage";
  if (!translations[en]) {
    translations[en] = "影子数量 +2 额外 +" + i + "% 影子伤害";
    added++;
  }
}

// 添加 Mitigation
pctValues.forEach((pct) => {
  mitigationTypes.forEach((type) => {
    var en = "+" + pct + "% " + type;
    if (!translations[en]) {
      translations[en] =
        "+" +
        pct +
        "% " +
        (type === "Critical Strike Damage Mitigation"
          ? "暴击伤害减免"
          : "伤害减免");
      added++;
    }
  });
});

// 排序并保存
var sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
var result = {};
sorted.forEach((e) => {
  result[e[0]] = e[1];
});
fs.writeFileSync(
  "src/data/translated-affixes/merged-all-translations.json",
  JSON.stringify(result, null, 2),
);

console.log("新增翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
