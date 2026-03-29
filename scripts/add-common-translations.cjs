const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Belt Suffix
  "+(25-31)% Skill Effect Duration": "+(25-31)% 技能效果持续时间",
  "+(22-31)% Cooldown Recovery Speed": "+(22-31)% 冷却回复速度",
  "+(17-24)% Cooldown Recovery Speed": "+(17-24)% 冷却回复速度",
  "+(14-17)% Cooldown Recovery Speed": "+(14-17)% 冷却回复速度",
  "+(10-12)% Cooldown Recovery Speed": "+(10-12)% 冷却回复速度",
  // Belt Corrosion Base
  "+(3-5)% Max Elemental Resistance": "+(3-5)% 最大元素抗性",
  "Restoration Skills: +(30-40)% Restoration Effect":
    "回复技能： +(30-40)% 回复效果",
  "+(4-6)% Max Energy Shield": "+(4-6)% 最大护盾",
  "+(5-10)% Skill Area": "+(5-10)% 技能范围",
  "+(20-30)% Deep Pain Aura": "+(20-30)% 深痛光环",
  "+(20-30)% Spell Amplification Aura": "+(20-30)% 法术增幅光环",
  "+(20-30)% Cruelty Aura Effect": "+(20-30)% 残忍光环效果",
  "+(20-30)% Radical Order Aura Effect": "+(20-30)% 激进秩序光环效果",
  "(-50--40)% additional Damage Over Time taken when a Restoration Skill is active":
    "回复技能生效期间，额外 (-50--40)% 持续伤害受到的伤害",
  "Owns 1 additional stack(s) of Fortitude": "额外拥有 1 层强硬",
  "+(3-5)% Max Life": "+(3-5)% 最大生命",
  "Immune to crowd control effects": "免疫控制类状态",
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
