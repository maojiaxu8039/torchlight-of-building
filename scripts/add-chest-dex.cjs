const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Takes Damage
  "Takes 10 True Damage every 0.1s": "每 0.1 秒受到 10 点真实伤害",
  // Immune
  "Immune to Elemental Ailments": "免疫元素异常状态",
  // Resistance
  "+(8-10)% Elemental and Erosion Resistance": "+(8-10)% 元素和腐蚀抗性",
  // Max Life
  "+(17-21)% Max Life": "+(17-21)% 最大生命",
  "+(9-11)% Max Life": "+(9-11)% 最大生命",
  "+(7-8)% Max Life": "+(7-8)% 最大生命",
  // Sealed Mana Compensation
  "+(21-26)% Sealed Mana Compensation": "+(21-26)% 魔力封印补偿",
  "+(8-12)% Sealed Mana Compensation": "+(8-12)% 魔力封印补偿",
  // Curses
  "You can cast 1 additional Curses": "可以额外施展 1 个诅咒",
  // Infiltration
  "When dealing damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s":
    "造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间",
  // Damage Over Time
  "Regenerates 4% Life per second when dealing Damage Over Time":
    "造成持续伤害时，每秒回复 4% 生命",
  // Max Fortitude Stacks
  "+1 Max Fortitude Stacks": "+1 强硬层数上限",
  "+3 Max Fortitude Stacks": "+3 强硬层数上限",
};

Object.entries(newTranslations).forEach((entry) => {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
  }
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

console.log("已添加 " + Object.keys(newTranslations).length + " 个翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
