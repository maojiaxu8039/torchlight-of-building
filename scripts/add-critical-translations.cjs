const fs = require("fs");

console.log("=== 添加关键翻译 ===\n");

const translations = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));

// 关键翻译
const criticalTranslations = {
  "Immune to Paralysis Immune to Blinding": "免疫瘫痪免疫致盲",
  "Immune to Slow Immune to Weaken": "免疫减速免疫虚弱",
  "Immune to Blinding Immune to Paralysis": "免疫致盲免疫瘫痪",
  "Immune to Slow Immune to Numbed": "免疫减速免疫麻痹",
  "Immune to Paralysis": "免疫瘫痪",
  "Immune to Blinding": "免疫致盲",
  "Immune to Slow": "免疫减速",
  "Immune to Weaken": "免疫虚弱",
  "Immune to Numbed": "免疫麻痹",
  "Gains a stack of Fortitude when using a Melee Skill (-8--6)% additional damage taken": "使用近战技能时，获得一层强硬额外 (-8--6)% 受到的伤害",
  "Gains a stack of Fortitude when using a Melee Skill (-5--3)% additional damage taken": "使用近战技能时，获得一层强硬额外 (-5--3)% 受到的伤害",
  "Gains a stack of Fortitude when using a Melee Skill (-2--1)% additional damage taken": "使用近战技能时，获得一层强硬额外 (-2--1)% 受到的伤害",
  "+2 to Max Channeled Stacks": "+2 引导层数上限",
  "Min Channeled Stacks +2": "+2 引导层数下限",
  "+1 to Max Channeled Stacks": "+1 引导层数上限",
  "Min Channeled Stacks +1": "+1 引导层数下限",
  "+(20-30)% Charged Flames Aura": "+(20-30)% 充能烈焰光环",
  "+(20-30)% Frigid Domain Aura Effect": "+(20-30)% 冰寒领域光环效果",
  "+(20-30)% Electric Conversion Aura": "+(20-30)% 电流转换光环",
  "+(20-30)% Weapon Amplification Aura": "+(20-30)% 武器增幅光环",
  "+(20-30)% Precise Projectiles Aura effect": "+(20-30)% 精密投射物光环效果",
  "+(20-30)% Fearless Aura": "+(20-30)% 无畏光环",
  "+(20-30)% Cruelty Aura Effect": "+(20-30)% 残忍光环效果",
  "+(20-30)% Radical Order Aura Effect": "+(20-30)% 激进秩序光环效果",
  "+(4-6)% Max Energy Shield": "+(4-6)% 最大护盾",
  "+(5-10)% Skill Area": "+(5-10)% 技能范围",
  "+(3-5)% Max Elemental Resistance": "+(3-5)% 最大元素抗性",
  "Restoration Skills: +(30-40)% Restoration Effect": "回复技能： +(30-40)% 回复效果",
  "Restoration Skills: (-20--15)% Restoration Duration": "回复技能： (-20--15)% 回复持续时间",
};

let added = 0;
Object.entries(criticalTranslations).forEach(function(entry) {
  const en = entry[0];
  const cn = entry[1];
  
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log("添加了 " + added + " 个关键翻译");

// 保存
const sorted = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
const result = {};
sorted.forEach(e => { result[e[0]] = e[1]; });
fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));

console.log("总计: " + Object.keys(result).length + " 条翻译");
