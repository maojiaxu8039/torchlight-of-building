const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 所有数值
const percentages = [];
for (let i = 1; i <= 100; i++) {
  percentages.push(i);
}

// Converts 翻译
const convertsTypes = [
  {
    from: "Physical Damage taken to Lightning Damage",
    to: "受到伤害转化为闪电伤害",
    fromCn: "受到的物理伤害转化为闪电伤害",
  },
  {
    from: "Physical Damage taken to Cold Damage",
    to: "受到伤害转化为冰冷伤害",
    fromCn: "受到的物理伤害转化为冰冷伤害",
  },
  {
    from: "Physical Damage taken to Fire Damage",
    to: "受到伤害转化为火焰伤害",
    fromCn: "受到的物理伤害转化为火焰伤害",
  },
  {
    from: "Erosion Damage taken to Lightning Damage",
    to: "受到伤害转化为闪电伤害",
    fromCn: "受到的腐蚀伤害转化为闪电伤害",
  },
  {
    from: "Erosion Damage taken to Cold Damage",
    to: "受到伤害转化为冰冷伤害",
    fromCn: "受到的腐蚀伤害转化为冰冷伤害",
  },
  {
    from: "Erosion Damage taken to Fire Damage",
    to: "受到伤害转化为火焰伤害",
    fromCn: "受到的腐蚀伤害转化为火焰伤害",
  },
  {
    from: "Physical Damage taken to random Elemental Damage",
    to: "受到伤害转化为随机元素伤害",
    fromCn: "受到的物理伤害转化为随机元素伤害",
  },
];

let added = 0;

percentages.forEach((pct) => {
  convertsTypes.forEach((type) => {
    const en = "Converts " + pct + "% of " + type.from;
    const cn = "将 " + pct + "% " + type.fromCn;

    if (!translations[en]) {
      translations[en] = cn;
      added++;
    }
  });
});

// 排序并保存
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

console.log("新增 Converts 翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
