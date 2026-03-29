const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// Duration 类型
const durationTypes = [
  "Reaping Duration",
  "Skill Effect Duration",
  "Restoration Duration",
  "Ailment Duration",
  "Blessing Duration",
  "Curse Duration",
  "Deterioration Duration",
  "Trauma Duration",
  "Wilt Duration",
  "Ignite Duration",
];

const cnMapping = {
  "Reaping Duration": "收割持续时间",
  "Skill Effect Duration": "技能效果持续时间",
  "Restoration Duration": "回复持续时间",
  "Ailment Duration": "异常状态持续时间",
  "Blessing Duration": "祝福持续时间",
  "Curse Duration": "诅咒持续时间",
  "Deterioration Duration": "恶化持续时间",
  "Trauma Duration": "创伤持续时间",
  "Wilt Duration": "凋零持续时间",
  "Ignite Duration": "点燃持续时间",
};

const percentages = [];
for (let i = 1; i <= 150; i++) {
  percentages.push(i);
}

let added = 0;

percentages.forEach((pct) => {
  durationTypes.forEach((type) => {
    const en = "+" + pct + "% " + type;
    const cn = "+" + pct + "% " + cnMapping[type];

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

console.log("新增 Duration 翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
