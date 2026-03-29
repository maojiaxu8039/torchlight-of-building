const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Armor + Max Life
  "+(19-23)% Armor +(11-143) Max Life": "+(19-23)% 护甲 +(11-143) 最大生命",
  // Sealed Mana Compensation for Deep Pain
  "+(10-15)% Sealed Mana Compensation for Deep Pain":
    "+(10-15)% 深痛魔力封印补偿",
  // Critical Strike Rating
  "+(60-80) Attack and Spell Critical Strike Rating":
    "+(60-80) 攻击和法术暴击值",
  // Skill Area
  "+(30-40)% Skill Area": "+(30-40)% 技能范围",
  "+(15-20)% Skill Effect Duration": "+(15-20)% 技能效果持续时间",
  // Armor
  "+(37-47)% Armor": "+(37-47)% 护甲",
  "+(19-26)% Armor": "+(19-26)% 护甲",
  "+(14-18)% Armor": "+(14-18)% 护甲",
  "+(10-13)% Armor": "+(10-13)% 护甲",
  // Evasion
  "+(37-47)% Evasion": "+(37-47)% 闪避",
  "+(19-26)% Evasion": "+(19-26)% 闪避",
  "+(10-13)% Evasion": "+(10-13)% 闪避",
  // Attack Aggression
  "Gains Attack Aggression when casting an Attack Skill +(40-60)% Attack Aggression":
    "释放攻击技能时，获得攻击激进 +(40-60)% 攻击激进",
  "Gains Attack Aggression when casting an Attack Skill +(10-30)% Attack Aggression":
    "释放攻击技能时，获得攻击激进 +(10-30)% 攻击激进",
  // Spell Aggression
  "Gains Spell Aggression when casting a Spell Skill +(40-60)% Spell Aggression Effect":
    "释放法术技能时，获得法术激进 +(40-60)% 法术激进效果",
  "Gains Spell Aggression when casting a Spell Skill +(10-30)% Spell Aggression Effect":
    "释放法术技能时，获得法术激进 +(10-30)% 法术激进效果",
  // Beacon
  "[Beacon] +2 Max Spell Burst": "[信标] +2 法术迸发上限",
  // Elemental Resistance
  "+(37-47)% Elemental Resistance": "+(37-47)% 元素抗性",
  "+(19-26)% Elemental Resistance": "+(19-26)% 元素抗性",
  // Evasion + Max Mana
  "+(19-23)% Evasion +(111-143) Max Mana": "+(19-23)% 闪避 +(111-143) 最大魔力",
  "+(14-18)% Evasion +(78-110) Max Mana": "+(14-18)% 闪避 +(78-110) 最大魔力",
  "+(10-13)% Evasion +(56-77) Max Mana": "+(10-13)% 闪避 +(56-77) 最大魔力",
  "+(10-13)% Evasion +(45-55) Max Mana": "+(10-13)% 闪避 +(45-55) 最大魔力",
  "+7% Evasion +(36-44) Max Mana": "+7% 闪避 +(36-44) 最大魔力",
  // Barrier
  "+(19-23)% Barrier Absorption Rate": "+(19-23)% 屏障吸收率",
  "+(14-18)% Barrier Absorption Rate": "+(14-18)% 屏障吸收率",
  "+(10-13)% Barrier Absorption Rate": "+(10-13)% 屏障吸收率",
  // Thorns
  "+24 Thorns Damage": "+24 荆棘伤害",
  // Heal on Kill
  "+24% Life restored on defeating enemies": "+24% 击败敌人时回复生命",
  // Critical Strike Rating
  "+(37-47)% Critical Strike Rating": "+(37-47)% 暴击值",
  "+(19-26)% Critical Strike Rating": "+(19-26)% 暴击值",
  // Cast Speed
  "+(37-47)% Cast Speed": "+(37-47)% 施法速度",
  "+(19-26)% Cast Speed": "+(19-26)% 施法速度",
  // Cooldown Recovery Speed
  "+(37-47)% Cooldown Recovery Speed": "+(37-47)% 冷却回复速度",
  "+(19-26)% Cooldown Recovery Speed": "+(19-26)% 冷却回复速度",
  // Attack Speed
  "+(37-47)% Attack Speed": "+(37-47)% 攻击速度",
  "+(19-26)% Attack Speed": "+(19-26)% 攻击速度",
  // Movement Speed
  "+(37-47)% Movement Speed": "+(37-47)% 移动速度",
  "+(19-26)% Movement Speed": "+(19-26)% 移动速度",
  // Minion Damage
  "+(37-47)% Minion Damage": "+(37-47)% 召唤物伤害",
  "+(19-26)% Minion Damage": "+(19-26)% 召唤物伤害",
  // Elemental Damage
  "+(37-47)% Elemental Damage": "+(37-47)% 元素伤害",
  "+(19-26)% Elemental Damage": "+(19-26)% 元素伤害",
  // Fire Damage
  "+(37-47)% Fire Damage": "+(37-47)% 火焰伤害",
  "+(19-26)% Fire Damage": "+(19-26)% 火焰伤害",
  // Cold Damage
  "+(37-47)% Cold Damage": "+(37-47)% 冰冷伤害",
  "+(19-26)% Cold Damage": "+(19-26)% 冰冷伤害",
  // Lightning Damage
  "+(37-47)% Lightning Damage": "+(37-47)% 闪电伤害",
  "+(19-26)% Lightning Damage": "+(19-26)% 闪电伤害",
  // Erosion Damage
  "+(37-47)% Erosion Damage": "+(37-47)% 腐蚀伤害",
  "+(19-26)% Erosion Damage": "+(19-26)% 腐蚀伤害",
  // Spell Damage
  "+(37-47)% Spell Damage": "+(37-47)% 法术伤害",
  "+(19-26)% Spell Damage": "+(19-26)% 法术伤害",
  // Max Mana
  "+(37-47)% Max Mana": "+(37-47)% 最大魔力",
  "+(19-26)% Max Mana": "+(19-26)% 最大魔力",
  // Max Life
  "+(37-47)% Max Life": "+(37-47)% 最大生命",
  "+(19-26)% Max Life": "+(19-26)% 最大生命",
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
