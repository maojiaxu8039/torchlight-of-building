const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Max Energy Shield
  "+(9-11)% Max Energy Shield": "+(9-11)% 最大护盾",
  "+(7-8)% Max Energy Shield": "+(7-8)% 最大护盾",
  "+6% Max Energy Shield": "+6% 最大护盾",
  // Armor + Max Life
  "+(19-23)% Armor +(111-143) Max Life": "+(19-23)% 护甲 +(111-143) 最大生命",
  "+(14-18)% Armor +(78-110) Max Life": "+(14-18)% 护甲 +(78-110) 最大生命",
  "+(10-13)% Armor +(56-77) Max Life": "+(10-13)% 护甲 +(56-77) 最大生命",
  "+(10-13)% Armor +(45-55) Max Life": "+(10-13)% 护甲 +(45-55) 最大生命",
  "+7% Armor +(36-44) Max Life": "+7% 护甲 +(36-44) 最大生命",
  // Damaging Ailments
  "+(12-15)% chance for Attacks to inflict Damaging Ailments":
    "+(12-15)% 攻击施加伤害性异常状态的几率",
  // Ignite
  "Reaps 0.16 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.16 秒点燃伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.14 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.14 秒点燃伤害，该效果对同一目标有 1 秒回复时间",
  // Immune
  "Immune to Frostbite Immune to Numbed": "免疫冰结 免疫麻痹",
  "Immune to Ignite Immune to Numbed": "免疫点燃 免疫麻痹",
  // Sealed Mana Compensation for
  "+(10-15)% Sealed Mana Compensation for Charged Flames":
    "+(10-15)% 充能烈焰魔力封印补偿",
  "+(10-15)% Sealed Mana Compensation for Frigid Domain":
    "+(10-15)% 冰寒领域魔力封印补偿",
  "+(10-15)% Sealed Mana Compensation for Electric Conversion":
    "+(10-15)% 电流转换魔力封印补偿",
  "+(10-15)% Sealed Mana Compensation for Weapon Amplification":
    "+(10-15)% 武器增幅魔力封印补偿",
  // Elemental Damage as Erosion
  "Adds (13-16)% of Elemental Damage as Erosion Damage":
    "将 (13-16)% 元素伤害转化为腐蚀伤害",
  // Sealed Mana Compensation
  "+(10-15)% Sealed Mana Compensation": "+(10-15)% 魔力封印补偿",
  // Ailment Duration
  "+(10-15)% Ailment Duration": "+(10-15)% 异常状态持续时间",
  // Elemental Resistance
  "+(10-15)% Elemental Resistance": "+(10-15)% 元素抗性",
  // Max Mana
  "+(10-15)% Max Mana": "+(10-15)% 最大魔力",
  // Max Life
  "+(10-15)% Max Life": "+(10-15)% 最大生命",
  // Armor
  "+(10-15)% Armor": "+(10-15)% 护甲",
  // Fire Damage
  "+(10-15)% Fire Damage": "+(10-15)% 火焰伤害",
  "+(15-20)% Fire Damage": "+(15-20)% 火焰伤害",
  // Cold Damage
  "+(10-15)% Cold Damage": "+(10-15)% 冰冷伤害",
  "+(15-20)% Cold Damage": "+(15-20)% 冰冷伤害",
  // Lightning Damage
  "+(10-15)% Lightning Damage": "+(10-15)% 闪电伤害",
  "+(15-20)% Lightning Damage": "+(15-20)% 闪电伤害",
  // Erosion Damage
  "+(10-15)% Erosion Damage": "+(10-15)% 腐蚀伤害",
  "+(15-20)% Erosion Damage": "+(15-20)% 腐蚀伤害",
  // Elemental Damage
  "+(10-15)% Elemental Damage": "+(10-15)% 元素伤害",
  "+(15-20)% Elemental Damage": "+(15-20)% 元素伤害",
  // Critical Strike Rating
  "+(10-15)% Critical Strike Rating": "+(10-15)% 暴击值",
  // Critical Strike Damage
  "+(10-15)% Critical Strike Damage": "+(10-15)% 暴击伤害",
  // Cast Speed
  "+(10-15)% Cast Speed": "+(10-15)% 施法速度",
  // Cooldown Recovery Speed
  "+(10-15)% Cooldown Recovery Speed": "+(10-15)% 冷却回复速度",
  // Spell Damage
  "+(10-15)% Spell Damage": "+(10-15)% 法术伤害",
  // Attack Speed
  "+(10-15)% Attack Speed": "+(10-15)% 攻击速度",
  // Movement Speed
  "+(10-15)% Movement Speed": "+(10-15)% 移动速度",
  // Minion Damage
  "+(10-15)% Minion Damage": "+(10-15)% 召唤物伤害",
  // Minion Cast Speed
  "+(10-15)% Minion Cast Speed": "+(10-15)% 召唤物施法速度",
  // Minion Attack Speed
  "+(10-15)% Minion Attack Speed": "+(10-15)% 召唤物攻击速度",
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
