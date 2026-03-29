const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Physical to Cold
  "Adds (13-16)% of Physical Damage to Cold Damage":
    "将 (13-16)% 物理伤害转化为冰冷伤害",
  "Adds (7-8)% of Physical Damage to Cold Damage":
    "将 (7-8)% 物理伤害转化为冰冷伤害",
  "Adds 6% of Physical Damage to Cold Damage": "将 6% 物理伤害转化为冰冷伤害",
  "Adds 5% of Physical Damage to Cold Damage": "将 5% 物理伤害转化为冰冷伤害",
  // Cold as Erosion
  "Adds 6% of Cold Damage as Erosion Damage": "将 6% 冰冷伤害转化为腐蚀伤害",
  "Adds 5% of Cold Damage as Erosion Damage": "将 5% 冰冷伤害转化为腐蚀伤害",
  // Physical to Fire
  "Adds (13-16)% of Physical Damage as Fire Damage":
    "将 (13-16)% 物理伤害转化为火焰伤害",
  "Adds (7-8)% of Physical Damage as Fire Damage":
    "将 (7-8)% 物理伤害转化为火焰伤害",
  "Adds 6% of Physical Damage as Fire Damage": "将 6% 物理伤害转化为火焰伤害",
  "Adds 5% of Physical Damage as Fire Damage": "将 5% 物理伤害转化为火焰伤害",
  // Fire as Erosion
  "Adds 6% of Fire Damage as Erosion Damage": "将 6% 火焰伤害转化为腐蚀伤害",
  "Adds 5% of Fire Damage as Erosion Damage": "将 5% 火焰伤害转化为腐蚀伤害",
  // Infiltration
  "When dealing damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s When Minions deal damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s":
    "造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间 召唤物造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间",
  // Sealed Mana Compensation
  "+(10-15)% Sealed Mana Compensation": "+(10-15)% 魔力封印补偿",
  // Curse
  "Triggers Lv. (15-20) Timid Curse upon inflicting damage. Cooldown: 0.3 s":
    "造成伤害时，触发 (15-20) 级胆怯诅咒，冷却时间 0.3 秒",
  "Triggers Lv. (15-20) Entangled Pain Curse upon inflicting damage. Cooldown: 0.3 s":
    "造成伤害时，触发 (15-20) 级苦痛纠缠诅咒，冷却时间 0.3 秒",
  // Curse Effect
  "(-50--30)% Curse effect against you": "你受到诅咒效果 (-50--30)%",
  // Elemental Damage
  "Adds (13-16)% of Elemental Damage as Erosion Damage":
    "将 (13-16)% 元素伤害转化为腐蚀伤害",
  // Gear Attack Speed
  "+(12-15)% Gear Attack Speed": "+(12-15)% 该装备攻击速度",
  // Elemental Resistance
  "+(10-15)% Elemental Resistance": "+(10-15)% 元素抗性",
  // Energy Shield
  "+(10-15)% Max Energy Shield": "+(10-15)% 最大护盾",
  // Regain
  "+8% Life Regain": "+8% 生命返还",
  "+8% Energy Shield Regain": "+8% 护盾返还",
  // Critical Strike Rating
  "+(12-15)% Critical Strike Rating": "+(12-15)% 暴击值",
  // Armor
  "+(12-15)% Armor": "+(12-15)% 护甲",
  // Minion Damage
  "+(20-25)% Minion Damage": "+(20-25)% 召唤物伤害",
  // Max Life
  "+(10-15)% Max Life": "+(10-15)% 最大生命",
  // Dodge
  "+(10-15)% Dodge": "+(10-15)% 闪避",
  // Thorns
  "+12 Thorns Damage": "+12 荆棘伤害",
  // Reap
  "+100% chance to gain 1 stack of Agility Blessing when Reaping":
    "收割时，+100% 几率获得 1 层灵动祝福",
  "+100% chance to gain 1 stack of Tenacity Blessing when Reaping":
    "收割时，+100% 几率获得 1 层坚韧祝福",
  "+100% chance to gain 1 stack of Focus Blessing when Reaping":
    "收割时，+100% 几率获得 1 层聚能祝福",
  // Damage Taken
  "-12% additional damage taken": "额外 -12% 受到的伤害",
  // Elemental Damage as Erosion
  "Adds (13-16)% of Elemental Damage as Erosion Damage":
    "将 (13-16)% 元素伤害转化为腐蚀伤害",
  // Minion Attack Speed
  "+(12-15)% Minion Attack Speed": "+(12-15)% 召唤物攻击速度",
  // Curse Effect
  "+(20-25)% Curse Effect": "+(20-25)% 诅咒效果",
  // Channeled Stacks
  "+1 Max Channeled Stacks": "+1 引导层数上限",
  // Max Life and Energy Shield
  "+(10-15)% Max Life and Energy Shield": "+(10-15)% 最大生命和护盾",
  // Attack Critical Strike Rating
  "+(12-15)% Attack Critical Strike Rating": "+(12-15)% 攻击暴击值",
  // Cast Speed
  "+(10-15)% Cast Speed": "+(10-15)% 施法速度",
  // Heal on Kill
  "+12% Life restored on defeating enemies": "+12% 击败敌人时回复生命",
  // Minion Attack and Cast Speed
  "+(12-15)% Minion Attack and Cast Speed": "+(12-15)% 召唤物攻击和施法速度",
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
