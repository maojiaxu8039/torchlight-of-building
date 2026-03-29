const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Skill Effect Duration
  "+(13-17)% Skill Effect Duration": "+(13-17)% 技能效果持续时间",
  "+(10-12)% Skill Effect Duration": "+(10-12)% 技能效果持续时间",
  // Movement Speed
  "+(20-25)% Movement Speed": "+(20-25)% 移动速度",
  "+(15-20)% Movement Speed": "+(15-20)% 移动速度",
  // Cooldown Recovery Speed
  "+(30-40)% Cooldown Recovery Speed for Mobility Skills":
    "+(30-40)% 机动技能冷却回复速度",
  "+(15-20)% Cooldown Recovery Speed": "+(15-20)% 冷却回复速度",
  // Restoration Duration
  "Restoration Skills: (-20--15)% Restoration Duration":
    "回复技能： (-20--15)% 回复持续时间",
  // Evasion
  "+(760-960) Evasion": "+(760-960) 闪避值",
  "+(50-70)% damage": "+(50-70)% 伤害",
  "+(30-50)% gear Evasion": "+(30-50)% 该装备闪避值",
  // Critical Strike Damage Mitigation
  "+(61-78)% Critical Strike Damage Mitigation": "+(61-78)% 暴击伤害减免",
  "+(31-42)% Critical Strike Damage Mitigation": "+(31-42)% 暴击伤害减免",
  "+(25-30)% Critical Strike Damage Mitigation": "+(25-30)% 暴击伤害减免",
  "+(12-20)% Critical Strike Damage Mitigation": "+(12-20)% 暴击伤害减免",
  // Converts
  "Converts (36-45)% of Erosion Damage taken to Lightning Damage":
    "将 (36-45)% 受到的腐蚀伤害转化为闪电伤害",
  "Converts (16-20)% of Physical Damage taken to Lightning Damage":
    "将 (16-20)% 受到的物理伤害转化为闪电伤害",
  // Triggers
  "Triggers Lv. 20 Stoneskin when moving. Interval: 2 s":
    "移动时，触发 20 级石肤，间隔 2 秒",
  // Max Life
  "+(15-20)% Max Life": "+(15-20)% 最大生命",
  // Skill Area
  "+(20-24)% Skill Area": "+(20-24)% 技能范围",
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
