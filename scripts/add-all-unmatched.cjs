const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Multistrike
  "+(26-32)% chance to Multistrike": "+(26-32)% 多重打击几率",
  "Multistrikes deal (10-16)% increasing damage": "多重打击伤害递增 (10-16)%",
  "+(60-64)% chance to Multistrike": "+(60-64)% 多重打击几率",
  "Multistrikes deal (28-32)% increasing damage": "多重打击伤害递增 (28-32)%",
  "+(30-32)% chance to Multistrike": "+(30-32)% 多重打击几率",
  "Multistrikes deal (14-16)% increasing damage": "多重打击伤害递增 (14-16)%",
  // Projectile Speed
  "+(25-30)% Projectile Speed": "+(25-30)% 投射物速度",
  // Terra
  "Max Terra Quantity +1 +5% additional damage": "地面数量上限 +1 +5% 额外伤害",
  "Max Terra Quantity +1 +1% additional damage": "地面数量上限 +1 +1% 额外伤害",
  "Max Terra Quantity +1 -10% additional damage":
    "地面数量上限 +1 -10% 额外伤害",
  // XP
  "+5% XP earned": "+5% 经验获得",
  // Movement Speed
  "+5% Movement Speed": "+5% 移动速度",
  // Immune
  "Immune to Trauma Immune to Wilt": "免疫创伤 免疫凋零",
  // Stats
  "+(8-10)% Strength": "+(8-10)% 力量",
  "+(8-10)% Dexterity": "+(8-10)% 敏捷",
  "+(8-10)% Intelligence": "+(8-10)% 智慧",
  "+(35-40) Strength": "+(35-40) 力量",
  "+(35-40) Dexterity": "+(35-40) 敏捷",
  "+(35-40) Intelligence": "+(35-40) 智慧",
  // Blessing
  "+1 to Max Tenacity Blessing Stacks +5% additional damage":
    "+1 坚韧祝福层数上限 +5% 额外伤害",
  "+1 to Max Agility Blessing Stacks +5% additional damage":
    "+1 灵动祝福层数上限 +5% 额外伤害",
  "+1 to Max Focus Blessing Stacks +5% additional damage":
    "+1 聚能祝福层数上限 +5% 额外伤害",
  // Skill Cost
  "+15% Max Mana. +(100-120) Skill Cost": "+15% 最大魔力 +(100-120) 技能消耗",
  "+8% Max Mana. +(40-60) Skill Cost": "+8% 最大魔力 +(40-60) 技能消耗",
  // Combo
  "+1 Combo Points gained from Combo Starters +(3-5)% additional damage":
    "+1 连携起点获得的连携点 +(3-5)% 额外伤害",
  "+1 Combo Points gained from Combo Starters +(1-2)% additional damage":
    "+1 连携起点获得的连携点 +(1-2)% 额外伤害",
  "+1 Combo Points gained from Combo Starters (-5--3)% additional damage":
    "+1 连携起点获得的连携点 (-5--3)% 额外伤害",
  // Resistance
  "+(13-16)% Elemental Resistance +(13-16)% Erosion Resistance":
    "+(13-16)% 元素抗性 +(13-16)% 腐蚀抗性",
  "+(9-12)% Elemental Resistance +(9-12)% Erosion Resistance":
    "+(9-12)% 元素抗性 +(9-12)% 腐蚀抗性",
  "+(7-8)% Elemental Resistance +(7-8)% Erosion Resistance":
    "+(7-8)% 元素抗性 +(7-8)% 腐蚀抗性",
  "+6% Elemental Resistance +6% Erosion Resistance":
    "+6% 元素抗性 +6% 腐蚀抗性",
  // Fervor
  "+(51-65)% Fervor effect": "+(51-65)% 战意效果",
  "+(26-35)% Fervor effect": "+(26-35)% 战意效果",
  "+(21-25)% Fervor effect": "+(21-25)% 战意效果",
  // Curse
  "Triggers Lv. 20 Frost Touch Curse upon inflicting damage. Cooldown: 0.2 s":
    "造成伤害时，触发 20 级冻伤诅咒，冷却时间 0.2 秒",
  "Triggers Lv. 20 Dazzled Curse when Minions deal damage. Cooldown: 0.2 s":
    "召唤物造成伤害时，触发 20 级目眩诅咒，冷却时间 0.2 秒",
  "Triggers Lv. 20 Timid Curse when Minions deal damage. Cooldown: 0.2 s":
    "召唤物造成伤害时，触发 20 级胆怯诅咒，冷却时间 0.2 秒",
  "Triggers Lv. 20 Entangled Pain Curse when Minions deal damage. Cooldown: 0.2 s":
    "召唤物造成伤害时，触发 20 级苦痛纠缠诅咒，冷却时间 0.2 秒",
  // Infiltration
  "When dealing damage, inflicts Fire Infiltration. Interval for each enemy: 2 s":
    "造成伤害时，施加火焰渗透，对每个敌人拥有 2 秒间隔时间",
  "Inflicts Cold Infiltration when dealing damage. Interval for each enemy: 2 s":
    "造成伤害时，施加冰冷渗透，对每个敌人拥有 2 秒间隔时间",
  "When dealing damage, inflicts Lightning Infiltration. Interval for each enemy: 2 s":
    "造成伤害时，施加闪电渗透，对每个敌人拥有 2 秒间隔时间",
  // Minion Resistance Penetration
  "+(5-8)% Elemental and Erosion Resistance Penetration for Minions":
    "+(5-8)% 召唤物元素和腐蚀抗性穿透",
  // Minion Damage
  "+(20-30)% Minion Damage": "+(20-30)% 召唤物伤害",
  // Minion Critical Strike
  "+(30-40)% Minion Critical Strike Rating": "+(30-40)% 召唤物暴击值",
  "+(25-32)% Minion Critical Strike Damage": "+(25-32)% 召唤物暴击伤害",
  // Cold Damage to Minions
  "Adds (83-85) - (110-112) Cold Damage to Minions":
    "为召唤物附加 (83-85) - (110-112) 点冰冷伤害",
  "Adds (42-44) - (55-57) Cold Damage to Minions":
    "为召唤物附加 (42-44) - (55-57) 点冰冷伤害",
  "Adds (30-32) - (40-42) Cold Damage to Minions":
    "为召唤物附加 (30-32) - (40-42) 点冰冷伤害",
  "Adds (22-24) - (30-32) Cold Damage to Minions":
    "为召唤物附加 (22-24) - (30-32) 点冰冷伤害",
  "Adds (55-57) - (73-75) Cold Damage to Minions":
    "为召唤物附加 (55-57) - (73-75) 点冰冷伤害",
  "Adds (27-29) - (37-39) Cold Damage to Minions":
    "为召唤物附加 (27-29) - (37-39) 点冰冷伤害",
  "Adds (20-22) - (26-28) Cold Damage to Minions":
    "为召唤物附加 (20-22) - (26-28) 点冰冷伤害",
  "Adds (14-16) - (20-22) Cold Damage to Minions":
    "为召唤物附加 (14-16) - (20-22) 点冰冷伤害",
  // Erosion Damage to Minions
  "Adds (87-89) - (106-108) Erosion Damage to Minions":
    "为召唤物附加 (87-89) - (106-108) 点腐蚀伤害",
  "Adds (44-46) - (53-55) Erosion Damage to Minions":
    "为召唤物附加 (44-46) - (53-55) 点腐蚀伤害",
  "Adds (31-33) - (39-41) Erosion Damage to Minions":
    "为召唤物附加 (31-33) - (39-41) 点腐蚀伤害",
  "Adds (23-25) - (29-31) Erosion Damage to Minions":
    "为召唤物附加 (23-25) - (29-31) 点腐蚀伤害",
  "Adds (58-60) - (71-73) Erosion Damage to Minions":
    "为召唤物附加 (58-60) - (71-73) 点腐蚀伤害",
  "Adds (29-31) - (35-37) Erosion Damage to Minions":
    "为召唤物附加 (29-31) - (35-37) 点腐蚀伤害",
  "Adds (21-23) - (25-27) Erosion Damage to Minions":
    "为召唤物附加 (21-23) - (25-27) 点腐蚀伤害",
  "Adds (15-17) - (19-21) Erosion Damage to Minions":
    "为召唤物附加 (15-17) - (19-21) 点腐蚀伤害",
  // Physical Damage to Minions
  "Adds (87-89) - (106-108) Physical Damage to Minions":
    "为召唤物附加 (87-89) - (106-108) 点物理伤害",
  "Adds (44-46) - (53-55) Physical Damage to Minions":
    "为召唤物附加 (44-46) - (53-55) 点物理伤害",
  "Adds (31-33) - (39-41) Physical Damage to Minions":
    "为召唤物附加 (31-33) - (39-41) 点物理伤害",
  "Adds (23-25) - (29-31) Physical Damage to Minions":
    "为召唤物附加 (23-25) - (29-31) 点物理伤害",
  "Adds (58-60) - (71-73) Physical Damage to Minions":
    "为召唤物附加 (58-60) - (71-73) 点物理伤害",
  "Adds (29-31) - (35-37) Physical Damage to Minions":
    "为召唤物附加 (29-31) - (35-37) 点物理伤害",
  "Adds (21-23) - (25-27) Physical Damage to Minions":
    "为召唤物附加 (21-23) - (25-27) 点物理伤害",
  "Adds (15-17) - (19-21) Physical Damage to Minions":
    "为召唤物附加 (15-17) - (19-21) 点物理伤害",
  // Synthetic Troops
  "+1 to Max Summonable Synthetic Troops +(10-12)% additional Minion Damage":
    "+1 可召唤智械人数上限 +(10-12)% 额外召唤物伤害",
  "+1 to Max Summonable Synthetic Troops +(6-8)% additional Minion Damage":
    "+1 可召唤智械人数上限 +(6-8)% 额外召唤物伤害",
  // Skill Level
  "+(3-4) Minion Skill Level": "+(3-4) 召唤技能等级",
  "+(3-4) Main Skill Level": "+(3-4) 核心技能等级",
  "+(2-3) Physical Skill Level": "+(2-3) 物理技能等级",
  "+(2-3) Lightning Skill Level": "+(2-3) 闪电技能等级",
  "+(2-3) Cold Skill Level": "+(2-3) 冰冷技能等级",
  "+(2-3) Fire Skill Level": "+(2-3) 火焰技能等级",
  "+(2-3) Erosion Skill Level": "+(2-3) 腐蚀技能等级",
  "+(3-4) Spell Skill Level": "+(3-4) 法术技能等级",
  // Attack and Cast Speed
  "+(37-47)% Attack and Cast Speed +(37-47)% Minion Attack and Cast Speed":
    "+(37-47)% 攻击和施法速度 +(37-47)% 召唤物攻击和施法速度",
  "+(27-36)% Attack and Cast Speed +(27-36)% Minion Attack and Cast Speed":
    "+(27-36)% 攻击和施法速度 +(27-36)% 召唤物攻击和施法速度",
  "+(19-26)% Attack and Cast Speed +(19-26)% Minion Attack and Cast Speed":
    "+(19-26)% 攻击和施法速度 +(19-26)% 召唤物攻击和施法速度",
  "+(14-18)% Attack and Cast Speed +(14-18)% Minion Attack and Cast Speed":
    "+(14-18)% 攻击和施法速度 +(14-18)% 召唤物攻击和施法速度",
  "+(10-13)% Attack and Cast Speed +(10-13)% Minion Attack and Cast Speed":
    "+(10-13)% 攻击和施法速度 +(10-13)% 召唤物攻击和施法速度",
  "+(34-47)% Attack and Cast Speed +(34-47)% Minion Attack and Cast Speed":
    "+(34-47)% 攻击和施法速度 +(34-47)% 召唤物攻击和施法速度",
  "+(22-25)% Attack and Cast Speed +(22-25)% Minion Attack and Cast Speed":
    "+(22-25)% 攻击和施法速度 +(22-25)% 召唤物攻击和施法速度",
  "+(16-18)% Attack and Cast Speed +(16-18)% Minion Attack and Cast Speed":
    "+(16-18)% 攻击和施法速度 +(16-18)% 召唤物攻击和施法速度",
  // Cast Speed
  "+(37-47)% Cast Speed +(37-47)% Minion Cast Speed":
    "+(37-47)% 施法速度 +(37-47)% 召唤物施法速度",
  "+(26-36)% Cast Speed +(26-36)% Minion Cast Speed":
    "+(26-36)% 施法速度 +(26-36)% 召唤物施法速度",
  "+(19-25)% Cast Speed +(19-25)% Minion Cast Speed":
    "+(19-25)% 施法速度 +(19-25)% 召唤物施法速度",
  "+(73-94)% Cast Speed +(73-94)% Minion Cast Speed":
    "+(73-94)% 施法速度 +(73-94)% 召唤物施法速度",
  "+(51-72)% Cast Speed +(51-72)% Minion Cast Speed":
    "+(51-72)% 施法速度 +(51-72)% 召唤物施法速度",
  "+(37-50)% Cast Speed +(37-50)% Minion Cast Speed":
    "+(37-50)% 施法速度 +(37-50)% 召唤物施法速度",
  "+(30-36)% Cast Speed +(30-36)% Minion Cast Speed":
    "+(30-36)% 施法速度 +(30-36)% 召唤物施法速度",
  "+(34-47)% Cast Speed +(34-47)% Minion Cast Speed":
    "+(34-47)% 施法速度 +(34-47)% 召唤物施法速度",
  "+(26-36)% Cast Speed +(26-36)% Minion Cast Speed":
    "+(26-36)% 施法速度 +(26-36)% 召唤物施法速度",
  "+(22-25)% Cast Speed +(22-25)% Minion Cast Speed":
    "+(22-25)% 施法速度 +(22-25)% 召唤物施法速度",
  "+(16-18)% Cast Speed +(16-18)% Minion Cast Speed":
    "+(16-18)% 施法速度 +(16-18)% 召唤物施法速度",
  // Minion Curse
  "Triggers Lv. 10 Entangled Pain Curse and Timid Curse when a Minion deals damage. Cooldown: 1 s Minions can cast 1 additional Curse(s)":
    "召唤物造成伤害时，触发 10 级苦痛纠缠诅咒和胆怯诅咒，冷却时间 1 秒 召唤物可以施展 1 个额外诅咒",
  // Minion Critical Strike Rating
  "-80 Minion Critical Strike Rating +200% Minion Critical Strike Damage":
    "-80 召唤物暴击值 +200% 召唤物暴击伤害",
  // Aura
  "+120% Radical Order Aura Effect -20% additional Radical Order Sealed Mana Compensation":
    "+120% 激进秩序光环效果 -20% 额外激进秩序魔力封印补偿",
  "+120% Deep Pain Aura -20% additional Deep Pain Sealed Mana Compensation":
    "+120% 深痛光环 -20% 额外深痛魔力封印补偿",
  // Infiltration (all types)
  "When Minions deal damage, inflicts Fire Infiltration. Interval for each enemy: 1 s When Minions deal damage, inflicts Lightning Infiltration. Interval for each enemy: 1 s When Minions deal damage, inflicts Cold Infiltration. Interval for each enemy: 1 s":
    "召唤物造成伤害时，施加火焰渗透，对每个敌人拥有 1 秒间隔时间 召唤物造成伤害时，施加闪电渗透，对每个敌人拥有 1 秒间隔时间 召唤物造成伤害时，施加冰冷渗透，对每个敌人拥有 1 秒间隔时间",
  // Reap
  "Reaps 0.08 s of Damage Over Time when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.08 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.07 s of Damage Over Time when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.07 秒持续伤害，该效果对同一目标有 1 秒回复时间",
  // Terra Charge
  "Max Terra Charge Stacks -1 Max Terra Quantity +1":
    "地面充能层数上限 -1 地面数量上限 +1",
  // Terra Skill
  "+20% Movement Speed when standing on a Terra Skill. The effect lasts 2s. +100% Skill Area when standing on a Terra Skill. Lasts for 2 s":
    "处于地面技能上时，+20% 移动速度，效果持续 2 秒 处于地面技能上时，+100% 技能范围，持续 2 秒",
  // Blessing Stack
  "+1 to Max Tenacity Blessing Stacks -1 to Max Focus Blessing Stacks +1 to Max Agility Blessing Stacks":
    "+1 坚韧祝福层数上限 -1 聚能祝福层数上限 +1 灵动祝福层数上限",
  "-2 to Max Tenacity Blessing Stacks +2 to Max Focus Blessing Stacks +2 to Max Agility Blessing Stacks":
    "-2 坚韧祝福层数上限 +2 聚能祝福层数上限 +2 灵动祝福层数上限",
  "-1 to Max Tenacity Blessing Stacks +1 to Max Focus Blessing Stacks +1 to Max Agility Blessing Stacks":
    "-1 坚韧祝福层数上限 +1 聚能祝福层数上限 +1 灵动祝福层数上限",
  // Affliction
  "+16 Affliction inflicted per second +24% Affliction Effect":
    "+16 每秒施加加剧值 +24% 加剧效果",
  // Armor
  "+(10-14)% Armor": "+(10-14)% 护甲",
  "+(8-10)% Attack and Spell Block Chance": "+(8-10)% 攻击和法术格挡几率",
  "+(6-8)% additional damage": "+(6-8)% 额外伤害",
  "+(1-2)% Max Fire Resistance": "+(1-2)% 最大火焰抗性",
  "+(1-2)% Max Cold Resistance": "+(1-2)% 最大冰冷抗性",
  "+(1-2)% Max Lightning Resistance": "+(1-2)% 最大闪电抗性",
  "Has a (5-10)% chance to avoid Blocked damage": "(5-10)% 几率避免格挡伤害",
  "+(5-8)% Block Ratio": "+(5-8)% 格挡比例",
  "+(8-12)% Attack Block Chance": "+(8-12)% 攻击格挡几率",
  "+(12-15)% Spell Block Chance": "+(12-15)% 法术格挡几率",
  "+(3-5)% Max Energy Shield": "+(3-5)% 最大护盾",
  // Damage + Minion Damage
  "+(109-140)% damage +(109-140)% Minion Damage":
    "+(109-140)% 伤害 +(109-140)% 召唤物伤害",
  "+(77-108)% damage +(77-108)% Minion Damage":
    "+(77-108)% 伤害 +(77-108)% 召唤物伤害",
  "+(55-76)% damage +(55-76)% Minion Damage":
    "+(55-76)% 伤害 +(55-76)% 召唤物伤害",
  "+(44-54)% damage +(44-54)% Minion Damage":
    "+(44-54)% 伤害 +(44-54)% 召唤物伤害",
  "+(36-43)% damage +(36-43)% Minion Damage":
    "+(36-43)% 伤害 +(36-43)% 召唤物伤害",
  // Resistance Penetration
  "+(29-39)% Elemental and Erosion Resistance Penetration Minion Damage penetrates (29-39)% Elemental Resistance":
    "+(29-39)% 元素和腐蚀抗性穿透 召唤物伤害穿透 (29-39)% 元素抗性",
  "+(22-30)% Elemental and Erosion Resistance Penetration Minion Damage penetrates (22-30)% Elemental Resistance":
    "+(22-30)% 元素和腐蚀抗性穿透 召唤物伤害穿透 (22-30)% 元素抗性",
  "+(18-21)% Elemental and Erosion Resistance Penetration Minion Damage penetrates (18-21)% Elemental Resistance":
    "+(18-21)% 元素和腐蚀抗性穿透 召唤物伤害穿透 (18-21)% 元素抗性",
  "+(13-15)% Elemental and Erosion Resistance Penetration Minion Damage penetrates (13-15)% Elemental Resistance":
    "+(13-15)% 元素和腐蚀抗性穿透 召唤物伤害穿透 (13-15)% 元素抗性",
  // Armor DMG Mitigation Penetration
  "+(26-33)% Armor DMG Mitigation Penetration +(26-33)% Armor DMG Mitigation Penetration for Minions":
    "+(26-33)% 护甲减伤穿透 +(26-33)% 召唤物护甲减伤穿透",
  "+(19-25)% Armor DMG Mitigation Penetration +(19-25)% Armor DMG Mitigation Penetration for Minions":
    "+(19-25)% 护甲减伤穿透 +(19-25)% 召唤物护甲减伤穿透",
  "+(14-18)% Armor DMG Mitigation Penetration +(14-18)% Armor DMG Mitigation Penetration for Minions":
    "+(14-18)% 护甲减伤穿透 +(14-18)% 召唤物护甲减伤穿透",
  "+(11-13)% Armor DMG Mitigation Penetration +(11-13)% Armor DMG Mitigation Penetration for Minions":
    "+(11-13)% 护甲减伤穿透 +(11-13)% 召唤物护甲减伤穿透",
  // Block
  "Restores (5-6)% Life on Block. Interval: 0.3s":
    "格挡时，回复 (5-6)% 生命，间隔 0.3 秒",
  "Restores (5-6)% Energy Shield on Block. Interval: 0.3s":
    "格挡时，回复 (5-6)% 护盾，间隔 0.3 秒",
  // Sentry
  "Max Sentry Quantity +1 +5% additional damage":
    "哨卫数量上限 +1 +5% 额外伤害",
  // Max Elemental Resistance
  "+(9-10)% Max Elemental Resistance": "+(9-10)% 最大元素抗性",
  "+(5-6)% Max Elemental Resistance": "+(5-6)% 最大元素抗性",
  "+(3-4)% Max Elemental Resistance": "+(3-4)% 最大元素抗性",
  // Block Speed
  "+1% Attack Speed and Movement Speed for every 6% of Attack or Spell Block":
    "每 6% 攻击或法术格挡，+1% 攻击速度和移动速度",
  // Fortitude
  "+100% chance to gain a stack of Fortitude when using a Melee Skill":
    "使用近战技能时，+100% 几率获得一层强硬",
  // Converts
  "Converts 25% of Physical Damage taken to random Elemental Damage -25% Defense":
    "将 25% 受到的物理伤害转化为随机元素伤害 -25% 防御",
  // Armor Effective Rate
  "+15% Armor Effective Rate for Non-Physical Damage +2400 Gear Armor":
    "对非物理伤害，+15% 护甲有效率 +2400 该装备护甲值",
  // Evasion
  "Spell Damage will not further reduce Evasion by default +1680 gear Evasion":
    "法术伤害默认不再降低闪避 +1680 该装备闪避值",
  // Energy Shield
  "Energy Shield starts to Charge when Blocking +40% Energy Shield Charge Speed":
    "格挡时护盾开始充能 +40% 护盾充能速度",
  // Minion Movement Speed
  "+(6-8)% Minion Movement Speed, Attack Speed, and Cast Speed":
    "+(6-8)% 召唤物移动速度、攻击速度和施法速度",
  // Command
  "+ 3 Command per second": "+3 每秒指令",
  "+ 5 Command per second": "+5 每秒指令",
  // Spirit Magi
  "+32 initial Growth for Spirit Magi": "+32 魔灵初始成长",
  // Aggression
  "Gains Attack Aggression when Minions land a Critical Strike":
    "召唤物攻击暴击时，获得攻击激进",
  "Gains Spell Aggression when Minion Spells land a Critical Strike":
    "召唤物法术暴击时，获得法术激进",
  // Max Life
  "+(15-25)% Max Life": "+(15-25)% 最大生命",
  "+(15-25)% Max Energy Shield": "+(15-25)% 最大护盾",
  // Attack Aggression
  "Gains Attack Aggression when Minions land a Critical Strike +(5-8)% additional Minion Damage":
    "召唤物攻击暴击时，获得攻击激进 +(5-8)% 额外召唤物伤害",
  "Gains Attack Aggression when Minions land a Critical Strike +(3-4)% additional Minion Damage":
    "召唤物攻击暴击时，获得攻击激进 +(3-4)% 额外召唤物伤害",
  "Gains Spell Aggression when Minion Spells land a Critical Strike +(5-8)% additional Minion Damage":
    "召唤物法术暴击时，获得法术激进 +(5-8)% 额外召唤物伤害",
  "Gains Spell Aggression when Minion Spells land a Critical Strike +(3-4)% additional Minion Damage":
    "召唤物法术暴击时，获得法术激进 +(3-4)% 额外召唤物伤害",
  // Blessing + Minion Damage
  "+1 to Max Tenacity Blessing Stacks +5% additional Minion Damage":
    "+1 坚韧祝福层数上限 +5% 额外召唤物伤害",
  "+1 to Max Agility Blessing Stacks +5% additional Minion Damage":
    "+1 灵动祝福层数上限 +5% 额外召唤物伤害",
  "+1 to Max Focus Blessing Stacks +5% additional Minion Damage":
    "+1 聚能祝福层数上限 +5% 额外召唤物伤害",
  // Hasten
  "Gains Hasten when Minions land a Critical Strike +(5-8)% additional Minion Attack and Cast Speed":
    "召唤物攻击暴击时，获得迅捷 +(5-8)% 额外召唤物攻击和施法速度",
  "Gains Hasten when Minions land a Critical Strike +(3-4)% additional Minion Attack and Cast Speed":
    "召唤物攻击暴击时，获得迅捷 +(3-4)% 额外召唤物攻击和施法速度",
  // Minion Infiltration
  "When Minions deal damage, inflicts Fire Infiltration. Interval for each enemy: 2 s":
    "召唤物造成伤害时，施加火焰渗透，对每个敌人拥有 2 秒间隔时间",
  "When Minions deal damage, inflicts Lightning Infiltration. Interval for each enemy: 2 s":
    "召唤物造成伤害时，施加闪电渗透，对每个敌人拥有 2 秒间隔时间",
  "When Minions deal damage, inflicts Cold Infiltration. Interval for each enemy: 2 s":
    "召唤物造成伤害时，施加冰冷渗透，对每个敌人拥有 2 秒间隔时间",
  // Spells
  "Adds (25-30) - (33-38) Physical Damage to Spells":
    "为法术附加 (25-30) - (33-38) 点物理伤害",
  "Adds (24-29) - (34-39) Fire Damage to Spells":
    "为法术附加 (24-29) - (34-39) 点火焰伤害",
  "Adds (24-29) - (34-39) Cold Damage to Spells":
    "为法术附加 (24-29) - (34-39) 点冰冷伤害",
  "Adds (1-3) - (60-65) Lightning Damage to Spells":
    "为法术附加 (1-3) - (60-65) 点闪电伤害",
  "Adds (26-31) - (32-37) Erosion Damage to Spells":
    "为法术附加 (26-31) - (32-37) 点腐蚀伤害",
  // Demolisher
  "+(12-16)% additional damage when a Skill consumes Demolisher Charge":
    "技能消耗爆破充能时，额外 +(12-16)% 伤害",
  "+4 Jumps +(25-30)% additional damage": "+4 弹射次数 +(25-30)% 额外伤害",
  "+4 Jumps +(18-20)% additional damage": "+4 弹射次数 +(18-20)% 额外伤害",
  "+2 Jumps +(12-16)% additional damage": "+2 弹射次数 +(12-16)% 额外伤害",
  // Beam
  "+4 Beams +(20-30)% additional damage": "+4 光束 +(20-30)% 额外伤害",
  "+4 Beams +(5-10)% additional damage": "+4 光束 +(5-10)% 额外伤害",
  "+4 Beams (-20--10)% additional damage": "+4 光束 (-20--10)% 额外伤害",
  // Channeling
  "+(61-78)% additional damage when channeling": "+(61-78)% 引导时额外伤害",
  "+(32-43)% additional damage when channeling": "+(32-43)% 引导时额外伤害",
  "+(23-31)% additional damage when channeling": "+(23-31)% 引导时额外伤害",
  // Spell Damage
  "+(40-48)% Spell Damage": "+(40-48)% 法术伤害",
  "+(12-16)% Cast Speed": "+(12-16)% 施法速度",
  "+(12-16)% additional Spell Damage": "+(12-16)% 额外法术伤害",
  "+(6-8)% additional Spell Damage": "+(6-8)% 额外法术伤害",
  "+(4-5) Main Skill Level": "+(4-5) 核心技能等级",
  "+(7-8) Spell Skill Level": "+(7-8) 法术技能等级",
  "+(4-5) Spell Skill Level": "+(4-5) 法术技能等级",
  // Control Spell
  "The Main Skill is supported by Lv. 25 Control Spell +25% additional Spell Damage":
    "核心技能被 25 级控制法术辅助 +25% 额外法术伤害",
  // Spell Amplification
  "+200% Spell Amplification Aura -30% additional Spell Amplification Sealed Mana Compensation":
    "+200% 法术增幅光环 -30% 额外法术增幅魔力封印补偿",
  "+120% Spell Amplification Aura -20% additional Spell Amplification Sealed Mana Compensation":
    "+120% 法术增幅光环 -20% 额外法术增幅魔力封印补偿",
  // Additional
  "+70% additional damage -10% additional Cast Speed":
    "+70% 额外伤害 -10% 额外施法速度",
  "+35% additional damage -10% additional Cast Speed":
    "+35% 额外伤害 -10% 额外施法速度",
  // Steep Strike
  "+(12-18)% additional Steep Strike Damage": "+(12-18)% 额外斩击伤害",
  "+(6-8)% additional Steep Strike Damage": "+(6-8)% 额外斩击伤害",
  "+(28-32)% additional damage when a Skill consumes Demolisher Charge":
    "技能消耗爆破充能时，额外 +(28-32)% 伤害",
  "+(14-16)% additional damage when a Skill consumes Demolisher Charge":
    "技能消耗爆破充能时，额外 +(14-16)% 伤害",
  // Eliminate
  "Eliminates enemies under (10-14)% Life upon inflicting damage":
    "造成伤害时，淘汰生命值低于 (10-14)% 的敌人",
  "Eliminates enemies under (5-7)% Life upon inflicting damage":
    "造成伤害时，淘汰生命值低于 (5-7)% 的敌人",
  // Standing Still
  "+(50-58)% additional Attack Damage after standing still for 0.1s. (-16--15)% additional Attack Speed":
    "站立 0.1 秒后，+(50-58)% 额外攻击伤害 (-16--15)% 额外攻击速度",
  "+(37-49)% additional Attack Damage after standing still for 0.1s. (-14--13)% additional Attack Speed":
    "站立 0.1 秒后，+(37-49)% 额外攻击伤害 (-14--13)% 额外攻击速度",
  "+(33-38)% additional Attack Damage after standing still for 0.1s. (-16--15)% additional Attack Speed":
    "站立 0.1 秒后，+(33-38)% 额外攻击伤害 (-16--15)% 额外攻击速度",
  "+(25-32)% additional Attack Damage after standing still for 0.1s. (-14--13)% additional Attack Speed":
    "站立 0.1 秒后，+(25-32)% 额外攻击伤害 (-14--13)% 额外攻击速度",
  // Main Skill
  "+1 Main Skill Level": "+1 核心技能等级",
  "+1 Melee Skill Level": "+1 近战技能等级",
  "+(1-2) Main Skill Level": "+(1-2) 核心技能等级",
  // Traumatized
  "+(12-16)% additional damage against Traumatized enemies":
    "+(12-16)% 对创伤状态敌人的额外伤害",
  // Parabolic
  "+2 Parabolic Projectile Split Quantity +(8-12)% additional Projectile Damage":
    "+2 抛物线投射物分裂数量 +(8-12)% 额外投射物伤害",
  "+1 Parabolic Projectile Split Quantity +(12-16)% additional Projectile Damage":
    "+1 抛物线投射物分裂数量 +(12-16)% 额外投射物伤害",
  // Cast Speed + Spell Damage
  "-15% additional Cast Speed +(54-69)% additional Spell Damage":
    "-15% 额外施法速度 +(54-69)% 额外法术伤害",
  "-15% additional Cast Speed +(38-53)% additional Spell Damage":
    "-15% 额外施法速度 +(38-53)% 额外法术伤害",
  "-15% additional Cast Speed +(28-37)% additional Spell Damage":
    "-15% 额外施法速度 +(28-37)% 额外法术伤害",
  "-15% additional Cast Speed +(22-27)% additional Spell Damage":
    "-15% 额外施法速度 +(22-27)% 额外法术伤害",
  "-15% additional Cast Speed +(18-21)% additional Spell Damage":
    "-15% 额外施法速度 +(18-21)% 额外法术伤害",
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
