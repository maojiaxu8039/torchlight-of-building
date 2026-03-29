const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Converts
  "Converts (8-9)% of Physical Damage taken to Lightning Damage":
    "将 (8-9)% 受到的物理伤害转化为闪电伤害",
  "Converts (8-9)% of Physical Damage taken to Cold Damage":
    "将 (8-9)% 受到的物理伤害转化为冰冷伤害",
  "Converts (8-9)% of Physical Damage taken to Fire Damage":
    "将 (8-9)% 受到的物理伤害转化为火焰伤害",
  // Spell Burst
  "+1 Max Spell Burst +10% additional Hit Damage for skills cast by Spell Burst":
    "+1 法术迸发上限 +10% 法术迸发投射物额外击中伤害",
  // Terra Charge
  "Max Terra Charge Stacks +1 +30% Terra Charge Recovery Speed":
    "地面充能层数上限 +1 +30% 地面充能回复速度",
  // Sealed Mana Compensation
  "+(11-14)% Sealed Mana Compensation": "+(11-14)% 魔力封印补偿",
  // Barrier
  "(11-15)% chance to gain a Barrier on defeat":
    "(11-15)% 击败时获得屏障的几率",
  // Evasion + Max Life
  "+(19-23)% Evasion +(111-143) Max Life": "+(19-23)% 闪避 +(111-143) 最大生命",
  "+(14-18)% Evasion +(78-110) Max Life": "+(14-18)% 闪避 +(78-110) 最大生命",
  "+(10-13)% Evasion +(56-77) Max Life": "+(10-13)% 闪避 +(56-77) 最大生命",
  "+(10-13)% Evasion +(45-55) Max Life": "+(10-13)% 闪避 +(45-55) 最大生命",
  "+7% Evasion +(36-44) Max Life": "+7% 闪避 +(36-44) 最大生命",
  // Frail
  "Nearby enemies within 15 m have Frail": "15 米内的敌人处于脆弱状态",
  // Max Energy Shield
  "+(17-21)% Max Energy Shield": "+(17-21)% 最大护盾",
  // Evasion
  "+(14-18)% Evasion": "+(14-18)% 闪避",
  // Barrier
  "+(17-21)% Barrier Absorption Rate": "+(17-21)% 屏障吸收率",
  // Thorns
  "+18 Thorns Damage": "+18 荆棘伤害",
  // Minion Thorns
  "+18 Minion Thorns Damage": "+18 召唤物荆棘伤害",
  // Attack Speed
  "+(18-24)% Attack Speed": "+(18-24)% 攻击速度",
  // Cooldown Recovery Speed
  "+(15-20)% Cooldown Recovery Speed": "+(15-20)% 冷却回复速度",
  // Cast Speed
  "+(18-24)% Cast Speed": "+(18-24)% 施法速度",
  // Skill Effect Duration
  "+(18-24)% Skill Effect Duration": "+(18-24)% 技能效果持续时间",
  // Deterioration Duration
  "+(18-24)% additional Deterioration Duration": "+(18-24)% 额外恶化持续时间",
  // Critical Strike Rating
  "+(18-24)% Critical Strike Rating": "+(18-24)% 暴击值",
  // Minion Damage
  "+(25-32)% Minion Damage": "+(25-32)% 召唤物伤害",
  // Elemental Damage
  "+(25-32)% Elemental Damage": "+(25-32)% 元素伤害",
  // Elemental Resistance
  "+(18-24)% Elemental Resistance": "+(18-24)% 元素抗性",
  // Max Mana
  "+(25-32)% Max Mana": "+(25-32)% 最大魔力",
  // Max Life
  "+(18-24)% Max Life": "+(18-24)% 最大生命",
  // Fire/Cold/Lightning Damage
  "+(25-32)% Fire Damage": "+(25-32)% 火焰伤害",
  "+(25-32)% Cold Damage": "+(25-32)% 冰冷伤害",
  "+(25-32)% Lightning Damage": "+(25-32)% 闪电伤害",
  // Cast Speed for Minions
  "+(18-24)% Minion Cast Speed": "+(18-24)% 召唤物施法速度",
  // Attack Speed for Minions
  "+(18-24)% Minion Attack Speed": "+(18-24)% 召唤物攻击速度",
  // Critical Strike Damage
  "+(50-65)% Critical Strike Damage": "+(50-65)% 暴击伤害",
  // Life Regain
  "+12% Life Regain": "+12% 生命返还",
  // Elemental and Erosion Resistance
  "+(18-24)% Elemental and Erosion Resistance": "+(18-24)% 元素和腐蚀抗性",
  // Minion Critical Strike Rating
  "+(18-24)% Minion Critical Strike Rating": "+(18-24)% 召唤物暴击值",
  // Erosion Damage
  "+(25-32)% Erosion Damage": "+(25-32)% 腐蚀伤害",
  // Armor
  "+(18-24)% Armor": "+(18-24)% 护甲",
  // Spell Damage
  "+(25-32)% Spell Damage": "+(25-32)% 法术伤害",
  // Heal on Kill
  "+18% Life restored on defeating enemies": "+18% 击败敌人时回复生命",
  // Movement Speed
  "+(18-24)% Movement Speed": "+(18-24)% 移动速度",
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

console.log("已添加 " + added + " 个翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
