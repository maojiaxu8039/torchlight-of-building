const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 添加缺失的百分比翻译模板
const missingTranslations = {
  "+125% Physical Damage": "+125% 物理伤害",
  "+125% Elemental Damage": "+125% 元素伤害",
  "+125% Fire Damage": "+125% 火焰伤害",
  "+125% Cold Damage": "+125% 冰冷伤害",
  "+125% Lightning Damage": "+125% 闪电伤害",
  "+125% Erosion Damage": "+125% 腐蚀伤害",
  "+125% Spell Damage": "+125% 法术伤害",
  "+125% Attack Damage": "+125% 攻击伤害",
  "+125% Minion Damage": "+125% 召唤物伤害",
  "+125% Critical Strike Damage": "+125% 暴击伤害",
  "+125% Movement Speed": "+125% 移动速度",
  "+125% Attack Speed": "+125% 攻击速度",
  "+125% Cast Speed": "+125% 施法速度",
  "+41% Cast Speed +41% Minion Cast Speed": "+41% 施法速度 +41% 召唤物施法速度",
  "+41% Minion Cast Speed": "+41% 召唤物施法速度",
  "+125% Max Life": "+125% 最大生命",
  "+125% Max Mana": "+125% 最大魔力",
  "+125% Max Energy Shield": "+125% 最大护盾",
};

let added = 0;
Object.entries(missingTranslations).forEach((entry) => {
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
