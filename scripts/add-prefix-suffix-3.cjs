const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  // Critical Strike Damage Mitigation
  "+(19-24)% Critical Strike Damage Mitigation": "+(19-24)% 暴击伤害减免",
  // Converts
  "Converts (21-26)% of Physical Damage taken to Lightning Damage":
    "将 (21-26)% 受到的物理伤害转化为闪电伤害",
  "Converts (12-15)% of Physical Damage taken to Lightning Damage":
    "将 (12-15)% 受到的物理伤害转化为闪电伤害",
  "Converts (46-60)% of Erosion Damage taken to Lightning Damage":
    "将 (46-60)% 受到的腐蚀伤害转化为闪电伤害",
  "Converts (27-35)% of Erosion Damage taken to Lightning Damage":
    "将 (27-35)% 受到的腐蚀伤害转化为闪电伤害",
  "Converts (36-45)% of Erosion Damage taken to Cold Damage":
    "将 (36-45)% 受到的腐蚀伤害转化为冰冷伤害",
  "Converts (16-20)% of Physical Damage taken to Cold Damage":
    "将 (16-20)% 受到的物理伤害转化为冰冷伤害",
  // Movement Speed
  "+(41-52)% Movement Speed": "+(41-52)% 移动速度",
  "+(21-28)% Movement Speed": "+(21-28)% 移动速度",
  "+(17-20)% Movement Speed": "+(17-20)% 移动速度",
  "+(14-16)% Movement Speed": "+(14-16)% 移动速度",
  // Cooldown Recovery Speed
  "+(27-34)% Cooldown Recovery Speed": "+(27-34)% 冷却回复速度",
  "+(14-18)% Cooldown Recovery Speed": "+(14-18)% 冷却回复速度",
  "+(11-13)% Cooldown Recovery Speed": "+(11-13)% 冷却回复速度",
  // Energy Shield
  "+(4-6)% Energy Shield Charge Speed": "+(4-6)% 护盾充能速度",
  "+(15-20)% Max Energy Shield": "+(15-20)% 最大护盾",
  "+(30-50)% gear Energy Shield": "+(30-50)% 该装备护盾",
  "+(61-86)% gear Energy Shield": "+(61-86)% 该装备护盾",
  "+(39-46)% gear Energy Shield": "+(39-46)% 该装备护盾",
  // gear Energy Shield (suffix)
  "+(61-78)% gear Energy Shield": "+(61-78)% 该装备护盾",
  "+(31-42)% gear Energy Shield": "+(31-42)% 该装备护盾",
  "+(25-30)% gear Energy Shield": "+(25-30)% 该装备护盾",
  "+(12-20)% gear Energy Shield": "+(12-20)% 该装备护盾",
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
