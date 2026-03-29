const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 添加这些特殊翻译
const newTranslations = {
  "70% chance to gain Blur per 8 m you move": "每移动 8 米，70% 几率获得迷踪",
  "+36% chance to avoid Spell Damage": "+36% 避免法术伤害几率",
  "+36% Spell Burst Charge Speed +10% chance to immediately gain 1 stack(s) of Spell Burst Charge when using a skill. Interval: 0.03s":
    "+36% 法术迸发充能速度 使用技能时，10% 几率立即获得 1 层法术迸发充能，间隔 0.03 秒",
  "Triggers Lv. 16 Aim while standing still. Interval: 1 s":
    "站立不动时，触发 16 级瞄准，间隔 1 秒",
  "24% of damage is taken from Mana before life":
    "伤害的 24% 先从魔力扣除再从生命扣除",
  "50% chance to gain Blur per 8 m you move": "每移动 8 米，50% 几率获得迷踪",
  "30% chance to gain Blur per 8 m you move": "每移动 8 米，30% 几率获得迷踪",
};

let added = 0;
Object.entries(newTranslations).forEach((entry) => {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
    added++;
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

console.log("新增翻译:", added);
console.log("总计:", Object.keys(result).length, "条");
