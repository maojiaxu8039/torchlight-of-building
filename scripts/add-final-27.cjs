const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+(12-15)% Cast Speed": "+(12-15)% 施法速度",
  "Gains Attack Aggression when casting an Attack Skill +(40-60)% Attack Aggression":
    "释放攻击技能时，获得攻击激进 +(40-60)% 攻击激进",
  "Gains Attack Aggression when casting an Attack Skill +(10-30)% Attack Aggression":
    "释放攻击技能时，获得攻击激进 +(10-30)% 攻击激进",
  "+(5-10)% chance to gain 1 stack of Agility Blessing on defeat":
    "+(5-10)% 击败时获得 1 层灵动祝福的几率",
  "Reaps 0.08 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.08 秒点燃伤害，该效果对同一目标有 1 秒回复时间",
  "Reaps 0.07 s of Ignite Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.07 秒点燃伤害，该效果对同一目标有 1 秒回复时间",
  "+(10-14)% Evasion": "+(10-14)% 闪避",
  "+(4-5)% Max Elemental and Erosion Resistance": "+(4-5)% 最大元素和腐蚀抗性",
  "+(25-31)% Max Life": "+(25-31)% 最大生命",
  "+(13-17)% Max Life": "+(13-17)% 最大生命",
  "+(11-12)% Max Life": "+(11-12)% 最大生命",
  "+(25-31)% Max Energy Shield": "+(25-31)% 最大护盾",
  "+(13-17)% Max Energy Shield": "+(13-17)% 最大护盾",
  "+(11-12)% Max Energy Shield": "+(11-12)% 最大护盾",
  "+(9-10)% Max Energy Shield": "+(9-10)% 最大护盾",
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
