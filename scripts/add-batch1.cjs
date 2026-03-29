const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Tower Sequence
  "Attack Horizontal Projectiles will return after reaching their max range and will hit enemies on their path again -30% additional Projectile Damage":
    "攻击直射投射物达到最大飞行距离后，会返回自身，并且可以再次击中路径上的敌人 -30% 额外投射物伤害",
  "+200% Precise Projectiles Aura effect -30% additional Precise Projectiles Sealed Mana Compensation":
    "+200% 精密投射物光环效果 -30% 额外精密投射物魔力封印补偿",
  "+30% additional Deterioration Damage 10% chance to inflict 2 additional stack(s) of Deterioration":
    "+30% 额外恶化伤害 10% 几率额外施加 2 层凋零",
  "+120% Precise Projectiles Aura effect -20% additional Precise Projectiles Sealed Mana Compensation":
    "+120% 精密投射物光环效果 -20% 额外精密投射物魔力封印补偿",
  "+15% additional Deterioration Damage 10% chance to inflict 1 additional stack(s) of Deterioration":
    "+15% 额外恶化伤害 10% 几率额外施加 1 层凋零",
  // Infiltration
  "When dealing damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s When Minions deal damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s +(40-60)% Lightning Infiltration Effect":
    "造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间 召唤物造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间 +(40-60)% 闪电渗透效果",
  "When dealing damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s When Minions deal damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s +(10-30)% Lightning Infiltration Effect":
    "造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间 召唤物造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间 +(10-30)% 闪电渗透效果",
  "Inflicts Cold Infiltration when dealing damage. Interval for each enemy: 1 s When Minions deal damage, inflicts Cold Infiltration. Interval for each enemy: 1 s +(40-60)% Cold Infiltration Effect":
    "造成伤害时，施加冰冷渗透，对每个敌人拥有 1 秒间隔时间 召唤物造成伤害时，施加冰冷渗透，对每个敌人拥有 1 秒间隔时间 +(40-60)% 冰冷渗透效果",
  "Inflicts Cold Infiltration when dealing damage. Interval for each enemy: 1 s When Minions deal damage, inflicts Cold Infiltration. Interval for each enemy: 1 s +(10-30)% Cold Infiltration Effect":
    "造成伤害时，施加冰冷渗透，对每个敌人拥有 1 秒间隔时间 召唤物造成伤害时，施加冰冷渗透，对每个敌人拥有 1 秒间隔时间 +(10-30)% 冰冷渗透效果",
  "When dealing damage, inflicts Fire Infiltration. Interval for each enemy: 1 s When Minions deal damage, inflicts Fire Infiltration. Interval for each enemy: 1 s +(40-60)% Fire Infiltration Effect":
    "造成伤害时，施加火焰渗透，对每个敌人拥有 1 秒间隔时间 召唤物造成伤害时，施加火焰渗透，对每个敌人拥有 1 秒间隔时间 +(40-60)% 火焰渗透效果",
  "When dealing damage, inflicts Fire Infiltration. Interval for each enemy: 1 s When Minions deal damage, inflicts Fire Infiltration. Interval for each enemy: 1 s +(10-30)% Fire Infiltration Effect":
    "造成伤害时，施加火焰渗透，对每个敌人拥有 1 秒间隔时间 召唤物造成伤害时，施加火焰渗透，对每个敌人拥有 1 秒间隔时间 +(10-30)% 火焰渗透效果",
  // Other
  "Eliminates enemies under (5-8)% Life upon inflicting damage":
    "造成伤害时，淘汰生命值低于 (5-8)% 的敌人",
  "+(8-12)% chance to deal double Trauma Damage": "+(8-12)% 双倍创伤伤害几率",
  "Reaps 0.16 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.16 秒创伤伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.14 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.14 秒创伤伤害，该效果对同一目标有 1 秒回复时间",
  "+(81-104)% Knockback distance +14% additional damage":
    "+(81-104)% 击退距离 +14% 额外伤害",
  "+(58-80)% Knockback distance +10% additional damage":
    "+(58-80)% 击退距离 +10% 额外伤害",
  // Focus Blessing
  "+(6-12)% chance to gain 1 stack of Focus Blessing on defeat":
    "+(6-12)% 击败时获得 1 层聚能祝福的几率",
  // Cast Speed
  "+(18-24)% Cast Speed": "+(18-24)% 施法速度",
  // Spell Damage
  "+(35-45)% Spell Damage": "+(35-45)% 法术伤害",
  // Spell Critical Strike Rating
  "+(50-60)% Spell Critical Strike Rating": "+(50-60)% 法术暴击值",
  // Critical Strike Damage
  "+(40-48)% Critical Strike Damage": "+(40-48)% 暴击伤害",
  // Cooldown Recovery Speed
  "+(8-15)% Cooldown Recovery Speed": "+(8-15)% 冷却回复速度",
  // Elemental Damage as Erosion
  "Adds (7-12)% of Elemental Damage as Erosion Damage":
    "将 (7-12)% 元素伤害转化为腐蚀伤害",
  // Support Skill Level
  "+(1-2) Support Skill Level": "+(1-2) 辅助技能等级",
  // Steep Strike
  "+60% Steep Strike chance. +(49-62)% additional Steep Strike Damage":
    "+60% 斩击几率 +(49-62)% 额外斩击伤害",
  "+46% Steep Strike chance. +(35-48)% additional Steep Strike Damage":
    "+46% 斩击几率 +(35-48)% 额外斩击伤害",
  "+32% Steep Strike chance. +(25-34)% additional Steep Strike Damage":
    "+32% 斩击几率 +(25-34)% 额外斩击伤害",
  "+24% Steep Strike chance. +(20-24)% additional Steep Strike Damage":
    "+24% 斩击几率 +(20-24)% 额外斩击伤害",
  "+18% Steep Strike chance. +(16-19)% additional Steep Strike Damage":
    "+18% 斩击几率 +(16-19)% 额外斩击伤害",
  // Channeling
  "+(6-8)% additional damage when channeling": "+(6-8)% 引导时额外伤害",
  // Steamroll
  "Main Skill is supported by Lv. 25 Steamroll +25% additional Melee Damage":
    "核心技能被 25 级碾压辅助 +25% 额外近战伤害",
  // Fearless
  "+200% Fearless Aura -30% additional Fearless Sealed Mana Compensation":
    "+200% 无畏光环 -30% 额外无畏魔力封印补偿",
  // Gear Physical Damage
  "+120% Gear Physical Damage -20% Attack Critical Strike Rating for this gear":
    "+120% 该装备物理伤害 -20% 该装备攻击暴击值",
  // Affliction
  "+(5-10) Affliction inflicted per second": "+(5-10) 每秒施加加剧值",
  // Wilt
  "(5-8)% chance to inflict 1 additional stack(s) of Wilt":
    "(5-8)% 额外施加 1 层凋零的几率",
  "Wilted enemies defeated by you will explode, dealing True Damage equal to (50-100)% of their Max Life to enemies within a 6 m radius":
    "被你击败的凋零敌人会爆炸，对半径 6 米内的敌人造成相当于敌人最大生命 (50-100)% 的真实伤害",
  "Reaps 0.08 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.08 秒凋零伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.07 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.07 秒凋零伤害，该效果对同一目标有 1 秒回复时间",
  // Parabolic Projectile
  "+2 Parabolic Projectile Split Quantity": "+2 抛物线投射物分裂数量",
  "+(1-2) to Parabolic Projectile Splits quantity":
    "+(1-2) 抛物线投射物分裂数量",
  // Damage Over Time
  "-30% additional Damage Over Time taken while standing still":
    "静止时，额外 -30% 受到的持续伤害",
  "Reaps 0.16 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.16 秒凋零伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.14 s of Wilt Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.14 秒凋零伤害，该效果对同一目标有 1 秒回复时间",
  // Terra
  "Max Terra Quantity +2 +10% additional damage":
    "地面数量上限 +2 +10% 额外伤害",
  "Max Terra Quantity +2 +1% additional damage": "地面数量上限 +2 +1% 额外伤害",
  "Max Terra Quantity +2 -20% additional damage":
    "地面数量上限 +2 -20% 额外伤害",
  // Paralyze
  "+100% chance to Paralyze the target on hit": "+100% 击中时使目标瘫痪的几率",
  // Converts
  "Converts 50% of Physical Damage to Cold Damage":
    "将 50% 物理伤害转化为冰冷伤害",
  "Converts 50% of Physical Damage to Lightning Damage":
    "将 50% 物理伤害转化为闪电伤害",
  "Converts 50% of Physical Damage to Fire Damage":
    "将 50% 物理伤害转化为火焰伤害",
  "Converts 50% of Physical Damage to Erosion Damage":
    "将 50% 物理伤害转化为腐蚀伤害",
  // Attack Speed
  "+(12-15)% Attack Speed": "+(12-15)% 攻击速度",
  // Chance to Blind/Mark/Paralysis
  "+(15-20)% chance to Blind the target on hit":
    "+(15-20)% 击中时致盲目标的几率",
  "+(15-20)% chance to Mark the target on hit":
    "+(15-20)% 击中时标记目标的几率",
  "+(15-20)% chance to inflict Paralysis on hit":
    "+(15-20)% 击中时施加瘫痪的几率",
  // Eliminate
  "Eliminates enemies under 15% Life upon inflicting damage":
    "造成伤害时，淘汰生命值低于 15% 的敌人",
  // Lucky Critical Strike
  "Lucky Critical Strike (-150--120) Critical Strike Rating":
    "暴击幸运 (-150--120) 暴击值",
  // Fortitude
  "Gains a stack of Fortitude when using a Melee Skill":
    "使用近战技能时，获得一层强硬",
  // Frail
  "Inflicts Frail when dealing Spell Damage": "造成法术伤害时施加脆弱",
  // Torment
  "Gains a stack of Torment when Reaping": "收割时获得一层折磨",
  // Physical as Lightning
  "Adds (13-16)% of Physical Damage as Lightning Damage":
    "将 (13-16)% 物理伤害转化为闪电伤害",
  "Adds (7-8)% of Physical Damage as Lightning Damage":
    "将 (7-8)% 物理伤害转化为闪电伤害",
  "Adds 6% of Physical Damage as Lightning Damage":
    "将 6% 物理伤害转化为闪电伤害",
  "Adds 5% of Physical Damage as Lightning Damage":
    "将 5% 物理伤害转化为闪电伤害",
  // Lightning as Erosion
  "Adds 6% of Lightning Damage as Erosion Damage":
    "将 6% 闪电伤害转化为腐蚀伤害",
  "Adds 5% of Lightning Damage as Erosion Damage":
    "将 5% 闪电伤害转化为腐蚀伤害",
  // Attack and Cast Speed
  "+(22-31)% Attack and Cast Speed +(22-31)% Minion Attack and Cast Speed":
    "+(22-31)% 攻击和施法速度 +(22-31)% 召唤物攻击和施法速度",
  "+(17-24)% Attack and Cast Speed +(17-24)% Minion Attack and Cast Speed":
    "+(17-24)% 攻击和施法速度 +(17-24)% 召唤物攻击和施法速度",
  "+(14-17)% Attack and Cast Speed +(14-17)% Minion Attack and Cast Speed":
    "+(14-17)% 攻击和施法速度 +(14-17)% 召唤物攻击和施法速度",
  // Skill Area
  "+(49-62)% Skill Area +(49-62)% Minion Skill Area":
    "+(49-62)% 技能范围 +(49-62)% 召唤物技能范围",
  "+(35-48)% Skill Area +(35-48)% Minion Skill Area":
    "+(35-48)% 技能范围 +(35-48)% 召唤物技能范围",
  "+(25-34)% Skill Area +(25-34)% Minion Skill Area":
    "+(25-34)% 技能范围 +(25-34)% 召唤物技能范围",
  "+(20-24)% Skill Area +(20-24)% Minion Skill Area":
    "+(20-24)% 技能范围 +(20-24)% 召唤物技能范围",
  "+(16-19)% Skill Area +(16-19)% Minion Skill Area":
    "+(16-19)% 技能范围 +(16-19)% 召唤物技能范围",
  // Jumps
  "+1 Jumps +6% additional damage for every Jump (multiplies)":
    "+1 弹射次数 每层弹射 (乘) +6% 额外伤害",
  "+1 Jumps +(4-5)% additional damage for every Jump (multiplies)":
    "+1 弹射次数 每层弹射 (乘) +(4-5)% 额外伤害",
  "+1 Jumps +(2-3)% additional damage for every Jump (multiplies)":
    "+1 弹射次数 每层弹射 (乘) +(2-3)% 额外伤害",
  // Blur Effect
  "+(16-20)% Blur Effect Gains Blur for 1 s after losing Blur":
    "+(16-20)% 迷踪效果 失去迷踪后获得 1 秒迷踪",
  "+(12-15)% Blur Effect Gains Blur for 1 s after losing Blur":
    "+(12-15)% 迷踪效果 失去迷踪后获得 1 秒迷踪",
  "+(8-10)% Blur Effect Gains Blur for 1 s after losing Blur":
    "+(8-10)% 迷踪效果 失去迷踪后获得 1 秒迷踪",
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
