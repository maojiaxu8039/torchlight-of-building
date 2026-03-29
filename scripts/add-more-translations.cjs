const fs = require("fs");

console.log("=== 添加更多关键翻译 ===\n");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 更多翻译
const moreTranslations = {
  "Has Profane. Minions have Profane +(40-50)% Erosion Damage +(40-50)% Minion Erosion Damage":
    "拥有邪祐；召唤物拥有邪祐+(40-50)% 腐蚀伤害+(40-50)% 召唤物腐蚀伤害",
  "Has Profane. Minions have Profane +(20-30)% Erosion Damage +(20-30)% Minion Erosion Damage":
    "拥有邪祐；召唤物拥有邪祐+(20-30)% 腐蚀伤害+(20-30)% 召唤物腐蚀伤害",
  "+1 Ignite limit +5% additional Ignite Damage":
    "+1 点燃上限额外 +5% 点燃伤害",
  "Warcry is cast immediately +2 Max Warcry Skill Charges":
    "战吼立即释放+2 战吼技能充能点数上限",
  "Warcry is cast immediately +1 Max Warcry Skill Charges":
    "战吼立即释放+1 战吼技能充能点数上限",
  "+(10-12)% Elemental Resistance +(12-15)% chance to avoid Elemental Ailment":
    "+(10-12)% 元素抗性+(12-15)% 几率避免元素异常",
  "+(7-9)% Elemental Resistance +(12-15)% chance to avoid Elemental Ailment":
    "+(7-9)% 元素抗性+(12-15)% 几率避免元素异常",
  "+6% Elemental Resistance +(9-11)% chance to avoid Elemental Ailment":
    "+6% 元素抗性+(9-11)% 几率避免元素异常",
  "+(4-5)% Elemental Resistance +(6-8)% chance to avoid Elemental Ailment":
    "+(4-5)% 元素抗性+(6-8)% 几率避免元素异常",
  "+(6-8)% Elemental and Erosion Resistance Penetration +(6-8)% Elemental and Erosion Resistance Penetration for Minions":
    "+(6-8)% 元素和腐蚀抗性穿透+(6-8)% 召唤物元素和腐蚀抗性穿透",
  "+(5-7)% Armor DMG Mitigation Penetration +(5-7)% Armor DMG Mitigation Penetration for Minions":
    "+(5-7)% 护甲减伤穿透+(5-7)% 召唤物护甲减伤穿透",
  "+1 Mobility Skill Level": "+1 机动技能等级",
  "Regenerates 1% Mana per second while moving": "移动时，每秒自然回复 1% 魔力",
  "+6% additional Max Life": "额外 +6% 最大生命",
  "+(31-40)% Spell Burst Charge Speed +10% chance to immediately gain 1 stack(s) of Spell Burst Charge when using a skill. Interval: 0.03s":
    "+(31-40)% 法术迸发充能速度使用技能时，+10% 几率立即获得 1 层法术迸发充能，间隔 0.03 秒",
  "+(386-500)% Critical Strike Rating against Traumatized enemies -30% additional Hit Damage":
    "对创伤状态下的敌人，+(386-500)% 暴击值额外 -30% 击中伤害",
  "+(271-385)% Critical Strike Rating against Traumatized enemies -30% additional Hit Damage":
    "对创伤状态下的敌人，+(271-385)% 暴击值额外 -30% 击中伤害",
  "+(194-270)% Critical Strike Rating against Traumatized enemies -30% additional Hit Damage":
    "对创伤状态下的敌人，+(194-270)% 暴击值额外 -30% 击中伤害",
  "+(155-193)% Critical Strike Rating against Traumatized enemies -30% additional Hit Damage":
    "对创伤状态下的敌人，+(155-193)% 暴击值额外 -30% 击中伤害",
  "+(124-154)% Critical Strike Rating against Traumatized enemies -30% additional Hit Damage":
    "对创伤状态下的敌人，+(124-154)% 暴击值额外 -30% 击中伤害",
};

let added = 0;
Object.entries(moreTranslations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log("添加了 " + added + " 个翻译");

// 保存
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

console.log("总计: " + Object.keys(result).length + " 条翻译");
