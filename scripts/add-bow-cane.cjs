const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Bow
  "+(1-2) Projectile Skill Level": "+(1-2) 投射物技能等级",
  "+(15-20)% Projectile Speed": "+(15-20)% 投射物速度",
  "+1 Horizontal Projectile Penetration(s)": "+1 直射投射物穿透",
  "+(24-32)% Gear Physical Damage": "+(24-32)% 该装备物理伤害",
  "Adds (32-34) - (40-42) Physical Damage to the gear":
    "该装备附加 (32-34) - (40-42) 点物理伤害",
  "+(5-8)% chance to trigger the Main Spell Skill 1 additional time when using it":
    "+(5-8)% 使用主技能时，额外触发 1 次主法术技能的几率",
  "+(4-8)% chance to gain 1 stack of Focus Blessing on defeat":
    "+(4-8)% 击败时获得 1 层聚能祝福的几率",
  "Damage Penetrates (5-8)% Elemental Resistance": "伤害穿透 (5-8)% 元素抗性",
  "+(10-16)% Cast Speed": "+(10-16)% 施法速度",
  "+(20-30)% Spell Damage": "+(20-30)% 法术伤害",
  "+(30-40)% Spell Critical Strike Rating": "+(30-40)% 法术暴击值",
  "+(25-32)% Critical Strike Damage": "+(25-32)% 暴击伤害",
  "+(6-10)% Cooldown Recovery Speed": "+(6-10)% 冷却回复速度",
  "Adds (5-8)% of Elemental Damage as Erosion Damage":
    "将 (5-8)% 元素伤害转化为腐蚀伤害",
  // Chest armor
  "Regenerates (0.5-1.0)% Life per second": "每秒自然回复 (0.5-1.0)% 生命",
  // Tower Sequence
  "Attack Horizontal Projectiles will return after reaching their max range and will hit enemies on their path again":
    "攻击直射投射物达到最大飞行距离后，会返回自身，并且可以再次击中路径上的敌人",
  "+200% Precise Projectiles Aura effect -30% additional Precise Projectiles Sealed":
    "+200% 精密投射物光环效果额外 -30% 精密投射物封印",
  "+30% additional Deterioration Damage 10% chance to inflict 2 additional stack(s)":
    "额外 +30% 恶化伤害 10% 几率额外施加 2 层",
  "+120% Precise Projectiles Aura effect -20% additional Precise Projectiles Sealed":
    "+120% 精密投射物光环效果额外 -20% 精密投射物封印",
  "+15% additional Deterioration Damage 10% chance to inflict 1 additional stack(s)":
    "额外 +15% 恶化伤害 10% 几率额外施加 1 层",
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
