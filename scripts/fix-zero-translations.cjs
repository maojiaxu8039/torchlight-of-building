const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "../src/data/translated-affixes/complete-affix-translations.ts",
);
let content = fs.readFileSync(filePath, "utf-8");

// All manual translations
const allTranslations = {
  // Additional entries
  "+(18-24)% Cast Speed": "+(18-24)% 施法速度",
  "+(8-10)% Strength": "+(8-10)% 力量",
  "+(9-11)% Max Life": "+(9-11)% 最大生命",
  "+(50-70)% damage": "+(50-70)% 伤害",
  "+(3-5)% Max Life": "+(3-5)% 最大生命",
  "+(7-8)% Max Life": "+(7-8)% 最大生命",
  "Immune to curse": "免疫诅咒",
  "+5% XP earned": "+5% 经验获取",
  "Has Hasten": "拥有加速",
  // Original translations
  "Enemies have a (20-25)% chance to explode when defeated by an Attack or Spell, dealing True Damage equal to (250-300)% of their Max Life to enemies within a 6 m radius":
    "攻击或者法术击败敌人时 (20-25)% 几率爆炸，对半径 6 米内的敌人造成被击败的敌人最大生命 (250-300)% 的真实伤害",
  "Enemies have a 30% chance to explode when defeated, dealing True Damage equal to (50-100)% of their Max Life to enemies within a 6 m radius":
    "攻击或者法术击败敌人时 30% 几率爆炸，对半径 6 米内的敌人造成被击败的敌人最大生命 (50-100)% 的真实伤害",
  "Triggers Lv. (15-20) Entangled Pain Curse upon inflicting damage. Cooldown: 0.3 s":
    "造成伤害时，触发 (15-20) 级苦痛纠缠诅咒，冷却 0.3 秒",
  "(-50--40)% additional Damage Over Time taken when a Restoration Skill is active":
    "处于恢复技能状态下，额外受到 (-50--40)% 持续伤害",
  "+(5-8)% chance to trigger the Main Spell Skill 1 additional time when using it":
    "使用技能时，+(5-8)% 几率额外释放核心法术技能 1 次",
  "Triggers Lv. 20 Entangled Pain Curse when Minions deal damage. Cooldown: 0.2 s":
    "召唤物造成伤害时，触发 20 级苦痛纠缠诅咒，冷却 0.2 秒",
  "Triggers Lv. 20 Entangled Pain Curse upon inflicting damage. Cooldown: 0.2 s":
    "造成伤害时，触发 20 级苦痛纠缠诅咒，冷却 0.2 秒",
  "Triggers Lv. 20 Vulnerability Curse upon inflicting damage. Cooldown: 0.2 s":
    "造成伤害时，触发 20 级易伤诅咒，冷却 0.2 秒",
  "Triggers Lv. 20 Biting Cold Curse upon inflicting damage. Cooldown: 0.2 s":
    "造成伤害时，触发 20 级刺骨冰冷诅咒，冷却 0.2 秒",
  "Triggers Lv. 20 Electrocute Curse upon inflicting damage. Cooldown: 0.2 s":
    "造成伤害时，触发 20 级电击诅咒，冷却 0.2 秒",
  "Triggers Lv. (15-20) Timid Curse upon inflicting damage. Cooldown: 0.3 s":
    "造成伤害时，触发 (15-20) 级胆怯诅咒，冷却 0.3 秒",
  "Triggers Lv. 20 Corruption Curse upon inflicting damage. Cooldown: 0.2 s":
    "造成伤害时，触发 20 级腐化诅咒，冷却 0.2 秒",
  "Triggers Lv. 20 Dazzled Curse when Minions deal damage. Cooldown: 0.2 s":
    "召唤物造成伤害时，触发 20 级目眩诅咒，冷却 0.2 秒",
  "Triggers Lv. 20 Dazzled Curse upon inflicting damage. Cooldown: 0.2 s":
    "造成伤害时，触发 20 级目眩诅咒，冷却 0.2 秒",
  "Triggers Lv. 20 Timid Curse when Minions deal damage. Cooldown: 0.2 s":
    "召唤物造成伤害时，触发 20 级胆怯诅咒，冷却 0.2 秒",
  "Triggers Lv. 20 Scorch Curse upon inflicting damage. Cooldown: 0.2 s":
    "造成伤害时，触发 20 级灼烧诅咒，冷却 0.2 秒",
  "Triggers Lv. 20 Timid Curse upon inflicting damage. Cooldown: 0.2 s":
    "造成伤害时，触发 20 级胆怯诅咒，冷却 0.2 秒",
  "Gains 1 stack(s) of all Blessings when casting a Restoration Skill":
    "释放恢复技能时，获得所有祝福 1 层",
  "+(5-8)% Elemental and Erosion Resistance Penetration for Minions":
    "+(5-8)% 召唤物元素和腐蚀抗性穿透",
  "+(6-12)% chance to gain 1 stack of Tenacity Blessing on defeat":
    "击败敌人时，+(6-12)% 几率获得 1 层坚韧祝福",
  "Converts (16-20)% of Physical Damage taken to Lightning Damage":
    "将受到物理伤害的 (16-20)% 转化为闪电伤害",
  "Converts (21-26)% of Physical Damage taken to Lightning Damage":
    "将受到物理伤害的 (21-26)% 转化为闪电伤害",
  "Converts (12-15)% of Physical Damage taken to Lightning Damage":
    "将受到物理伤害的 (12-15)% 转化为闪电伤害",
  "+(4-8)% chance to gain 1 stack of Tenacity Blessing on defeat":
    "击败敌人时，+(4-8)% 几率获得 1 层坚韧祝福",
  "+(6-12)% chance to gain 1 stack of Agility Blessing on defeat":
    "击败敌人时，+(6-12)% 几率获得 1 层灵动祝福",
  "Converts (36-45)% of Erosion Damage taken to Lightning Damage":
    "将受到腐蚀伤害的 (36-45)% 转化为闪电伤害",
  "Converts (46-60)% of Erosion Damage taken to Lightning Damage":
    "将受到腐蚀伤害的 (46-60)% 转化为闪电伤害",
  "Converts (27-35)% of Erosion Damage taken to Lightning Damage":
    "将受到腐蚀伤害的 (27-35)% 转化为闪电伤害",
  "+(5-10)% chance to gain 1 stack of Agility Blessing on defeat":
    "击败敌人时，+(5-10)% 几率获得 1 层灵动祝福",
  "+(4-8)% chance to gain 1 stack of Agility Blessing on defeat":
    "击败敌人时，+(4-8)% 几率获得 1 层灵动祝福",
  "Converts (8-9)% of Physical Damage taken to Lightning Damage":
    "将受到物理伤害的 (8-9)% 转化为闪电伤害",
  "Eliminates enemies under (5-8)% Life upon inflicting damage":
    "造成伤害时，消除生命值低于 (5-8)% 的敌人",
  "+(6-12)% chance to gain 1 stack of Focus Blessing on defeat":
    "击败敌人时，+(6-12)% 几率获得 1 层聚能祝福",
  "-30% additional Damage Over Time taken while standing still":
    "站立不动时，额外受到 30% 持续伤害",
  "+(4-8)% chance to gain 1 stack of Focus Blessing on defeat":
    "击败敌人时，+(4-8)% 几率获得 1 层聚能祝福",
  "Converts (16-20)% of Physical Damage taken to Fire Damage":
    "将受到物理伤害的 (16-20)% 转化为火焰伤害",
  "Converts (16-20)% of Physical Damage taken to Cold Damage":
    "将受到物理伤害的 (16-20)% 转化为冰冷伤害",
  "+(12-15)% chance for Attacks to inflict Damaging Ailments":
    "+(12-15)% 攻击造成伤害性异常状态几率",
  "Converts (21-26)% of Physical Damage taken to Cold Damage":
    "将受到物理伤害的 (21-26)% 转化为冰冷伤害",
  "Converts (12-15)% of Physical Damage taken to Cold Damage":
    "将受到物理伤害的 (12-15)% 转化为冰冷伤害",
  "Converts (21-26)% of Physical Damage taken to Fire Damage":
    "将受到物理伤害的 (21-26)% 转化为火焰伤害",
  "Converts (12-15)% of Physical Damage taken to Fire Damage":
    "将受到物理伤害的 (12-15)% 转化为火焰伤害",
  "Converts (36-45)% of Erosion Damage taken to Fire Damage":
    "将受到腐蚀伤害的 (36-45)% 转化为火焰伤害",
  "Converts (36-45)% of Erosion Damage taken to Cold Damage":
    "将受到腐蚀伤害的 (36-45)% 转化为冰冷伤害",
  "Eliminates enemies under 15% Life upon inflicting damage":
    "造成伤害时，消除生命值低于 15% 的敌人",
  "Converts (46-60)% of Erosion Damage taken to Cold Damage":
    "将受到腐蚀伤害的 (46-60)% 转化为冰冷伤害",
  "Converts (27-35)% of Erosion Damage taken to Cold Damage":
    "将受到腐蚀伤害的 (27-35)% 转化为冰冷伤害",
  "Converts (46-60)% of Erosion Damage taken to Fire Damage":
    "将受到腐蚀伤害的 (46-60)% 转化为火焰伤害",
  "Converts (27-35)% of Erosion Damage taken to Fire Damage":
    "将受到腐蚀伤害的 (27-35)% 转化为火焰伤害",
  "Lucky Critical Strike(-150--120) Critical Strike Rating":
    "幸运暴击：暴击率 +150~120",
  "Converts (8-9)% of Physical Damage taken to Cold Damage":
    "将受到物理伤害的 (8-9)% 转化为冰冷伤害",
  "Converts (8-9)% of Physical Damage taken to Fire Damage":
    "将受到物理伤害的 (8-9)% 转化为火焰伤害",
  "+(13-14)% Armor Effective Rate for Non-Physical Damage":
    "+(13-14)% 非物理伤害护甲有效率",
  "(5-8)% chance to inflict 1 additional stack(s) of Wilt":
    "+(5-8)% 几率额外造成 1 层凋零",
  "Lucky Critical Strike(-80--50)% Critical Strike Rating":
    "幸运暴击：暴击率 +80~50%",
  "Lucky Critical Strike(-50--40)% Critical Strike Rating":
    "幸运暴击：暴击率 +50~40%",
  "+(30-40)% Cooldown Recovery Speed for Mobility Skills":
    "+(30-40)% 机动技能冷却回复速度",
  "Triggers Lv. 20 Stoneskin when moving. Interval: 2 s":
    "移动时，触发 20 级石肤，间隔 2 秒",
  "Adds (18-20)% of Physical Damage as Lightning Damage":
    "+(18-20)% 物理伤害转化为闪电伤害",
  "Adds (13-16)% of Physical Damage as Lightning Damage":
    "+(13-16)% 物理伤害转化为闪电伤害",
  "Restoration Skills: (-20--15)% Restoration Duration":
    "恢复技能：-20~-15)% 恢复持续时间",
  "Gains a stack of Fortitude when using a Melee Skill":
    "使用近战技能时，获得 1 层坚韧",
  "+(3-6)% Attack Critical Strike Rating for this gear":
    "+(3-6)% 攻击暴击率（装备限定）",
  "Adds (7-12)% of Elemental Damage as Erosion Damage":
    "+(7-12)% 元素伤害转化为腐蚀伤害",
  "Adds (18-20)% of Physical Damage as Erosion Damage":
    "+(18-20)% 物理伤害转化为腐蚀伤害",
  "Adds (7-8)% of Physical Damage as Lightning Damage":
    "+(7-8)% 物理伤害转化为闪电伤害",
  "Adds (5-8)% of Elemental Damage as Erosion Damage":
    "+(5-8)% 元素伤害转化为腐蚀伤害",
  "Adds (7-10) - (14-17) Physical Damage to the gear":
    "+7-10)-(14-17) 物理伤害",
  "Restoration Skills: +(30-40)% Restoration Effect":
    "恢复技能：+(30-40)% 恢复效果",
  "+(60-80) Attack and Spell Critical Strike Rating":
    "+(60-80) 攻击和法术暴击率",
  "Adds (2-4) - (8-10) Physical Damage to the gear": "+2-4)-(8-10) 物理伤害",
  "Adds (18-20)% of Physical Damage as Fire Damage":
    "+(18-20)% 物理伤害转化为火焰伤害",
  "Adds (18-20)% of Physical Damage to Cold Damage":
    "+(18-20)% 物理伤害转化为冰冷伤害",
  "Adds (13-16)% of Physical Damage to Cold Damage":
    "+(13-16)% 物理伤害转化为冰冷伤害",
  "Adds (13-16)% of Physical Damage as Fire Damage":
    "+(13-16)% 物理伤害转化为火焰伤害",
  "Damage Penetrates (8-12)% Elemental Resistance": "伤害穿透 (8-12)% 元素抗性",
  "+(1-2) to Parabolic Projectile Splits quantity": "+(1-2) 专注投射物分裂数量",
  "Damage Penetrates (5-8)% Elemental Resistance": "伤害穿透 (5-8)% 元素抗性",
  "Adds (7-8)% of Physical Damage to Cold Damage":
    "+(7-8)% 物理伤害转化为冰冷伤害",
  "Adds (7-8)% of Physical Damage as Fire Damage":
    "+(7-8)% 物理伤害转化为火焰伤害",
  "+(15-20)% chance to inflict Paralysis on hit": "+(15-20)% 命中麻痹几率",
  "+(8-12)% chance to deal double Trauma Damage": "+(8-12)% 双重创伤伤害几率",
  "+(4-5)% Max Elemental and Erosion Resistance": "+(4-5)% 最大元素和腐蚀抗性",
  "Has a (5-10)% chance to avoid Blocked damage": "+(5-10)% 几率避免格挡伤害",
  "+(15-20)% chance to Blind the target on hit": "+(15-20)% 命中致盲几率",
  "+(15-20)% chance to Mark the target on hit": "+(15-20)% 命中标记几率",
  "+(8-10)% Elemental and Erosion Resistance": "+(8-10)% 元素和腐蚀抗性",
  "Inflicts Frail when dealing Spell Damage": "法术伤害造成易伤",
  "Owns 1 additional stack(s) of Fortitude": "拥有 1 层额外坚韧",
  "+(5-10) Affliction inflicted per second": "+(5-10) 每秒施加折磨",
  "+(30-40)% Minion Critical Strike Rating": "+(30-40)% 召唤物暴击率",
  "+(25-32)% Minion Critical Strike Damage": "+(25-32)% 召唤物暴击伤害",
  "+(30-40)% Spell Critical Strike Rating": "+(30-40)% 法术暴击率",
  "+(50-60)% Spell Critical Strike Rating": "+(50-60)% 法术暴击率",
  "Immune to BlindingImmune to Paralysis": "免疫致盲和瘫痪",
  "Gains a stack of Torment when Reaping": "收割时获得折磨层数",
  "+(20-30)% Radical Order Aura Effect": "+(20-30)% 激进号令光环效果",
  "+(20-30)% Spell Amplification Aura": "+(20-30)% 法术增幅光环",
  "+(10-15)% Sealed Mana Compensation": "+(10-15)% 魔力封印补偿",
  "+2 to Max Tenacity Blessing Stacks": "+2 坚韧祝福层数上限",
  "+(21-26)% Sealed Mana Compensation": "+(21-26)% 魔力封印补偿",
  "+(11-14)% Sealed Mana Compensation": "+(11-14)% 魔力封印补偿",
  "+(20-25)% Cooldown Recovery Speed": "+(20-25)% 冷却回复速度",
  "+(17-24)% Cooldown Recovery Speed": "+(17-24)% 冷却回复速度",
  "+(15-20)% Cooldown Recovery Speed": "+(15-20)% 冷却回复速度",
  "+2 to Max Agility Blessing Stacks": "+2 灵动祝福层数上限",
  "+(22-31)% Cooldown Recovery Speed": "+(22-31)% 冷却回复速度",
  "+(14-17)% Cooldown Recovery Speed": "+(14-17)% 冷却回复速度",
  "+(10-12)% Cooldown Recovery Speed": "+(10-12)% 冷却回复速度",
  "+(27-34)% Cooldown Recovery Speed": "+(27-34)% 冷却回复速度",
  "+(14-18)% Cooldown Recovery Speed": "+(14-18)% 冷却回复速度",
  "+(11-13)% Cooldown Recovery Speed": "+(11-13)% 冷却回复速度",
  "+(8-12)% Sealed Mana Compensation": "+(8-12)% 魔力封印补偿",
  "+(8-10)% Sealed Mana Compensation": "+(8-10)% 魔力封印补偿",
  "+(9-10)% Max Elemental Resistance": "+(9-10)% 最大元素抗性",
  "+(3-5)% Max Elemental Resistance": "+(3-5)% 最大元素抗性",
  "You can cast 1 additional Curses": "可额外施放 1 个诅咒",
  "+(6-10)% Cooldown Recovery Speed": "+(6-10)% 冷却回复速度",
  "+(25-32)% Critical Strike Damage": "+(25-32)% 暴击伤害",
  "+(40-48)% Critical Strike Damage": "+(40-48)% 暴击伤害",
  "+(8-15)% Cooldown Recovery Speed": "+(8-15)% 冷却回复速度",
  "+(1-2)% Max Lightning Resistance": "+(1-2)% 最大闪电抗性",
  "+(5-6)% Max Elemental Resistance": "+(5-6)% 最大元素抗性",
  "+(3-4)% Max Elemental Resistance": "+(3-4)% 最大元素抗性",
  "+(20-25)% Skill Effect Duration": "+(20-25)% 技能效果持续时间",
  "Immune to crowd control effects": "免疫控制效果",
  "Takes 10 True Damage every 0.1s": "每 0.1 秒受到 10 点真实伤害",
  "+2 to Max Focus Blessing Stacks": "+2 聚能祝福层数上限",
  "+(15-20)% Skill Effect Duration": "+(15-20)% 技能效果持续时间",
  "+(25-31)% Skill Effect Duration": "+(25-31)% 技能效果持续时间",
  "+(13-17)% Skill Effect Duration": "+(13-17)% 技能效果持续时间",
  "+(10-12)% Skill Effect Duration": "+(10-12)% 技能效果持续时间",
  "+(15-25)% Gear Physical Damage": "+(15-25)% 装备物理伤害",
  "Immune to TraumaImmune to Wilt": "免疫创伤和凋零",
  "+(20-30)% Cruelty Aura Effect": "+(20-30)% 残忍光环效果",
  "+(1-2) Projectile Skill Level": "+(1-2) 投射物技能等级",
  "Immune to Elemental Ailments": "免疫元素异常状态",
  "+(8-12)% Attack Block Chance": "+(8-12)% 攻击格挡率",
  "+(12-15)% Spell Block Chance": "+(12-15)% 法术格挡率",
  "+(23-26)% gear Energy Shield": "+(23-26)% 装备能量护盾",
  "+(15-20)% Max Energy Shield": "+(15-20)% 最大能量护盾",
  "+(1-2)% Max Fire Resistance": "+(1-2)% 最大火焰抗性",
  "+(1-2)% Max Cold Resistance": "+(1-2)% 最大冰冷抗性",
  "+(15-25)% Max Energy Shield": "+(15-25)% 最大能量护盾",
  "+(17-21)% Max Energy Shield": "+(17-21)% 最大能量护盾",
  "+(25-31)% Max Energy Shield": "+(25-31)% 最大能量护盾",
  "+(13-17)% Max Energy Shield": "+(13-17)% 最大能量护盾",
  "+(11-12)% Max Energy Shield": "+(11-12)% 最大能量护盾",
  "+(25-30)% Elemental Damage": "+(25-30)% 元素伤害",
  "+(25-30)% Projectile Speed": "+(25-30)% 投射物速度",
  "+(40-45)% Elemental Damage": "+(40-45)% 元素伤害",
  "+(1-2) Support Skill Level": "+(1-2) 辅助技能等级",
  "+(15-20)% Projectile Speed": "+(15-20)% 投射物速度",
  "+(9-11)% Max Energy Shield": "+(9-11)% 最大能量护盾",
  "+(9-10)% Max Energy Shield": "+(9-10)% 最大能量护盾",
  "+(5-8)% gear Attack Speed": "+(5-8)% 装备攻击速度",
  "+(3-5)% Max Energy Shield": "+(3-5)% 最大能量护盾",
  "+(7-8)% Max Energy Shield": "+(7-8)% 最大能量护盾",
  "+(4-6)% Max Energy Shield": "+(4-6)% 最大能量护盾",
  "+(20-30)% Deep Pain Aura": "+(20-30)% 深痛光环",
  "+(20-25)% Movement Speed": "+(20-25)% 移动速度",
  "+(15-20)% Movement Speed": "+(15-20)% 移动速度",
  "+(41-52)% Movement Speed": "+(41-52)% 移动速度",
  "+(21-28)% Movement Speed": "+(21-28)% 移动速度",
  "+(17-20)% Movement Speed": "+(17-20)% 移动速度",
  "+(14-16)% Movement Speed": "+(14-16)% 移动速度",
  "+3 Max Fortitude Stacks": "+3 坚韧层数上限",
  "+(20-30)% Minion Damage": "+(20-30)% 召唤物伤害",
  "+(1-2) Main Skill Level": "+(1-2) 核心技能等级",
  "+(3-4) Main Skill Level": "+(3-4) 核心技能等级",
  "+(4-5) Main Skill Level": "+(4-5) 核心技能等级",
  "+(30-50)% gear Evasion": "+(30-50)% 装备闪避",
  "+(12-15)% Attack Speed": "+(12-15)% 攻击速度",
  "+(5-8)% Movement Speed": "+(5-8)% 移动速度",
  "+(20-30)% Spell Damage": "+(20-30)% 法术伤害",
  "+(35-45)% Spell Damage": "+(35-45)% 法术伤害",
  "+(8-10)% Intelligence": "+(8-10)% 智力",
  "+(30-50)% Gear Armor": "+(30-50)% 护甲",
  "+(12-15)% Cast Speed": "+(12-15)% 施法速度",
  "+(10-15)% Skill Area": "+(10-15)% 技能范围",
  "+1 Melee Skill Level": "+1 近战技能等级",
  "+(10-16)% Cast Speed": "+(10-16)% 施法速度",
  "+(30-40)% Skill Area": "+(30-40)% 技能范围",
  "+1 Main Skill Level": "+1 核心技能等级",
  "+(6-8)% Blur Effect": "+(6-8)% 模糊效果",
  "+(5-8)% Block Ratio": "+(5-8)% 格挡率",
  "Immune to Frostbite": "免疫冻伤",
  "+(5-10)% Skill Area": "+(5-10)% 技能范围",
  "+(15-20)% Max Life": "+(15-20)% 最大生命",
  "+5% Movement Speed": "+5% 移动速度",
  "+(8-10)% Dexterity": "+(8-10)% 敏捷",
  "+(15-25)% Max Life": "+(15-25)% 最大生命",
  "+(17-21)% Max Life": "+(17-21)% 最大生命",
  "+(25-31)% Max Life": "+(25-31)% 最大生命",
  "+(13-17)% Max Life": "+(13-17)% 最大生命",
  "+(11-12)% Max Life": "+(11-12)% 最大生命",
};

// Process line by line
const lines = content.split("\n");
let fixedCount = 0;
const fixedEntries = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Check if this line contains ': '0'' (a zero translation)
  const zeroMatch = line.match(/^\s*'([^']+)':\s*'0'(,?)$/);

  if (zeroMatch) {
    const key = zeroMatch[1];
    const comma = zeroMatch[2];

    // Check if we have a translation
    if (allTranslations[key]) {
      lines[i] = `  '${key}': '${allTranslations[key]}'${comma}`;
      fixedCount++;
      fixedEntries.push(key);
    }
  }
}

content = lines.join("\n");
fs.writeFileSync(filePath, content, "utf-8");

console.log(`Fixed ${fixedCount} entries with '0' translations.`);
if (fixedCount > 0) {
  console.log("\nFixed entries:");
  fixedEntries.forEach((entry) => console.log(`  - ${entry}`));
}
