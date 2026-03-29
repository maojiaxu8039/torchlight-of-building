const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Infiltration
  "When dealing damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s":
    "造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间",
  "Inflicts Cold Infiltration when dealing damage. Interval for each enemy: 1 s When Minions deal damage, inflicts Cold Infiltration. Interval for each enemy: 1 s":
    "造成伤害时，施加冰冷渗透，对每个敌人拥有 1 秒间隔时间召唤物造成伤害时，施加冰冷渗透，对每个敌人拥有 1 秒间隔时间",
  "When dealing damage, inflicts Fire Infiltration. Interval for each enemy: 1 s When Minions deal damage, inflicts Fire Infiltration. Interval for each enemy: 1 s":
    "造成伤害时，施加火焰渗透，对每个敌人拥有 1 秒间隔时间召唤物造成伤害时，施加火焰渗透，对每个敌人拥有 1 秒间隔时间",
  // Damage Over Time
  "Regenerates 4% Life per second when taking Damage Over Time":
    "受到持续伤害时，每秒回复 4% 生命",
  "Regenerates 3% Life per second when taking Damage Over Time":
    "受到持续伤害时，每秒回复 3% 生命",
  // Armor Effective Rate
  "+(13-14)% Armor Effective Rate for Non-Physical Damage":
    "对非物理伤害，+(13-14)% 护甲有效率",
  // Agility Blessing
  "+(4-8)% chance to gain 1 stack of Agility Blessing on defeat":
    "+(4-8)% 击败时获得 1 层灵动祝福的几率",
  // Physical Damage
  "Adds (2-4) - (8-10) Physical Damage to the gear":
    "该装备附加 (2-4) - (8-10) 点物理伤害",
  // Movement Speed
  "+(5-8)% Movement Speed": "+(5-8)% 移动速度",
  // Skill Area
  "+(10-15)% Skill Area": "+(10-15)% 技能范围",
  // Elemental Damage
  "+(25-30)% Elemental Damage": "+(25-30)% 元素伤害",
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
