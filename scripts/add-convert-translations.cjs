const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 添加 Converts 翻译
const convertTranslations = {
  // to Cold Damage
  "Converts (21-26)% of Physical Damage taken to Cold Damage":
    "将 (21-26)% 受到的物理伤害转化为冰冷伤害",
  "Converts (12-15)% of Physical Damage taken to Cold Damage":
    "将 (12-15)% 受到的物理伤害转化为冰冷伤害",
  "Converts (46-60)% of Erosion Damage taken to Cold Damage":
    "将 (46-60)% 受到的腐蚀伤害转化为冰冷伤害",
  "Converts (27-35)% of Erosion Damage taken to Cold Damage":
    "将 (27-35)% 受到的腐蚀伤害转化为冰冷伤害",
  // to Fire Damage
  "Converts (36-45)% of Erosion Damage taken to Fire Damage":
    "将 (36-45)% 受到的腐蚀伤害转化为火焰伤害",
  "Converts (16-20)% of Physical Damage taken to Fire Damage":
    "将 (16-20)% 受到的物理伤害转化为火焰伤害",
  "Converts (21-26)% of Physical Damage taken to Fire Damage":
    "将 (21-26)% 受到的物理伤害转化为火焰伤害",
  "Converts (12-15)% of Physical Damage taken to Fire Damage":
    "将 (12-15)% 受到的物理伤害转化为火焰伤害",
  "Converts (46-60)% of Erosion Damage taken to Fire Damage":
    "将 (46-60)% 受到的腐蚀伤害转化为火焰伤害",
  "Converts (27-35)% of Erosion Damage taken to Fire Damage":
    "将 (27-35)% 受到的腐蚀伤害转化为火焰伤害",
  // Bow corrosion
  "Damage Penetrates (8-12)% Elementral Resistance":
    "伤害穿透 (8-12)% 元素抗性",
  "Damage Penetrates (8-12)% Elemental Resistance": "伤害穿透 (8-12)% 元素抗性",
  "Adds (7-10) - (14-17) Physical Damage to the gear":
    "该装备附加 (7-10) - (14-17) 点物理伤害",
  "+(15-25)% Gear Physical Damage": "+(15-25)% 该装备物理伤害",
  "+(5-8)% gear Attack Speed": "+(5-8)% 该装备攻击速度",
  "+(3-6)% Attack Critical Strike Rating for this gear":
    "+(3-6)% 该装备攻击暴击值",
  "+(40-45)% Elemental Damage": "+(40-45)% 元素伤害",
};

Object.entries(convertTranslations).forEach((entry) => {
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

console.log("已添加 " + Object.keys(convertTranslations).length + " 个翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
