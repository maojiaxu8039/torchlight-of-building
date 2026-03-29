const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Gear Attack Speed
  "+(31-33)% Gear Attack Speed. -15% additional Attack Damage":
    "+(31-33)% 该装备攻击速度额外 -15% 攻击伤害",
  // Shadow
  "Shadow Quantity +2 +(10-15)% additional Shadow Damage":
    "影子数量 +2 额外 +(10-15)% 影子伤害",
  "Shadow Quantity +2 -5% additional Shadow Damage":
    "影子数量 +2 额外 -5% 影子伤害",
  // Fearless Aura
  "+120% Fearless Aura -20% additional Fearless Sealed Mana Compensation":
    "+120% 无畏光环额外 -20% 无畏魔力封印补偿",
  // Reaps
  "Reaps 0.08 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.08 秒创伤伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.07 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.07 秒创伤伤害，该效果对同一目标有 1 秒回复时间",
  // Enemies explode
  "Enemies have a 30% chance to explode when defeated, dealing True Damage equal to (50-100)% of their Max Life to enemies within a 6 m radius":
    "击败敌人时，30% 几率爆炸，对半径 6 米内的敌人造成相当于敌人最大生命 (50-100)% 的真实伤害",
  // Tenacity Blessing
  "+(6-12)% chance to gain 1 stack of Tenacity Blessing on defeat":
    "+(6-12)% 击败时获得 1 层坚韧祝福的几率",
  // Infiltration
  "When dealing damage, inflicts Lightning Infiltration. Interval for each enemy: 1 sWhen Minions deal damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s":
    "造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间召唤物造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间",
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
