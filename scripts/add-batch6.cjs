const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Fervor
  "Have Fervor +5% additional damage": "拥有战意 +5% 额外伤害",
  // Tangle
  "You can apply 1 additional Tangle(s) to enemies +(12-15)% Tangle Damage Enhancement":
    "可以额外对敌人施加 1 个缠结 +(12-15)% 缠结伤害增强",
  "You can apply 1 additional Tangle(s) to enemies +(5-8)% Tangle Damage Enhancement":
    "可以额外对敌人施加 1 个缠结 +(5-8)% 缠结伤害增强",
  // Blessing Duration
  "+7% Blessing Duration": "+7% 祝福持续时间",
  // Barrier
  "100% chance to gain a Barrier for every 5 m you move +25% Barrier Shield":
    "每移动 5 米，+100% 几率获得屏障 +25% 屏障吸收量",
  // Blessing
  "+(7-8)% damage per stack of any Blessing":
    "每有 1 层任意祝福，额外 +(7-8)% 伤害",
  // Sealed Mana Compensation
  "+(8-10)% Sealed Mana Compensation": "+(8-10)% 魔力封印补偿",
  // Traumatized enemies
  "+(6-8)% additional damage against Traumatized enemies":
    "+(6-8)% 对创伤状态敌人的额外伤害",
  // Steep Strike Damage
  "+(6-9)% additional Steep Strike Damage": "+(6-9)% 额外斩击伤害",
  // Tenacity Blessing
  "+(4-8)% chance to gain 1 stack of Tenacity Blessing on defeat":
    "+(4-8)% 击败时获得 1 层坚韧祝福的几率",
  // Steep Strike chance
  "+30% Steep Strike chance. +(23-29)% additional Steep Strike Damage":
    "+30% 斩击几率 +(23-29)% 额外斩击伤害",
  "+23% Steep Strike chance. +(16-22)% additional Steep Strike Damage":
    "+23% 斩击几率 +(16-22)% 额外斩击伤害",
  "+16% Steep Strike chance. +(12-15)% additional Steep Strike Damage":
    "+16% 斩击几率 +(12-15)% 额外斩击伤害",
  "+12% Steep Strike chance. +(10-11)% additional Steep Strike Damage":
    "+12% 斩击几率 +(10-11)% 额外斩击伤害",
  "+9% Steep Strike chance. +(8-9)% additional Steep Strike Damage":
    "+9% 斩击几率 +(8-9)% 额外斩击伤害",
  // Physical Damage
  "+(25-32)% Physical Damage": "+(25-32)% 物理伤害",
  // Attack Damage
  "+(25-32)% Attack Damage": "+(25-32)% 攻击伤害",
  // Heal on Kill
  "+5% Life restored on defeating enemies": "+5% 击败敌人时回复生命",
  // Blessing Duration
  "+(5-8)% Blessing Duration": "+(5-8)% 祝福持续时间",
  // Curse Effect
  "+(5-8)% Curse Effect": "+(5-8)% 诅咒效果",
  // Critical Strike Rating for Minions
  "+(5-8)% Minion Critical Strike Rating": "+(5-8)% 召唤物暴击值",
  // Damage Taken
  "-5% additional damage taken": "额外 -5% 受到的伤害",
  // Elemental Damage as Erosion
  "Adds (5-8)% of Elemental Damage as Erosion Damage":
    "将 (5-8)% 元素伤害转化为腐蚀伤害",
  // Fire Damage as Erosion
  "Adds (5-8)% of Fire Damage as Erosion Damage":
    "将 (5-8)% 火焰伤害转化为腐蚀伤害",
  // Cold Damage as Erosion
  "Adds (5-8)% of Cold Damage as Erosion Damage":
    "将 (5-8)% 冰冷伤害转化为腐蚀伤害",
  // Lightning Damage as Erosion
  "Adds (5-8)% of Lightning Damage as Erosion Damage":
    "将 (5-8)% 闪电伤害转化为腐蚀伤害",
  // Trauma Damage
  "+(25-32)% Trauma Damage": "+(25-32)% 创伤伤害",
  // Ignite Damage
  "+(25-32)% Ignite Damage": "+(25-32)% 点燃伤害",
  // Wilt Damage
  "+(25-32)% Wilt Damage": "+(25-32)% 凋零伤害",
  // Skill Area
  "+(25-32)% Skill Area": "+(25-32)% 技能范围",
  // Thorns Damage
  "+6 Thorns Damage": "+6 荆棘伤害",
  // Max Life Regain
  "+6% Life Regain": "+6% 生命返还",
  // Deterioration Damage
  "+(25-32)% Deterioration Damage": "+(25-32)% 恶化伤害",
  // Curse Effect against you
  "(-10--8)% Curse effect against you": "你受到诅咒效果 (-10--8)%",
  // Critical Strike Damage Mitigation
  "+(5-8)% Critical Strike Damage Mitigation": "+(5-8)% 暴击伤害减免",
  // Sealed Mana
  "+(5-8)% Sealed Mana Compensation": "+(5-8)% 魔力封印补偿",
  // Heal on Kill
  "+10% Life restored on defeating enemies": "+10% 击败敌人时回复生命",
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
