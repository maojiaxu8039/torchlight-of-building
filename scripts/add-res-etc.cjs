const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+30% Fire Resistance": "+30% 火焰抗性",
  "+30% Cold Resistance": "+30% 冰冷抗性",
  "+30% Lightning Resistance": "+30% 闪电抗性",
  "+30% Erosion Resistance": "+30% 腐蚀抗性",
  "+28% Ailment Duration": "+28% 异常状态持续时间",
  "+55% Affliction Effect": "+55% 加剧效果",
  "+11% Elemental Resistance +13% chance to avoid Elemental Ailment":
    "+11% 元素抗性 +13% 几率避免元素异常",
  "+53 initial Growth for Spirit Magi": "+53 魔灵初始成长",
  "+40% Focus Speed": "+40% 贯注速度",
  "+36% Max Mana": "+36% 最大魔力",
  "+27% Skill Effect Duration": "+27% 技能效果持续时间",
  "+25% Cooldown Recovery Speed": "+25% 冷却回复速度",
  "+29% chance to deal Double Damage": "+29% 双倍伤害几率",
  "+58% Wilt Duration": "+58% 凋零持续时间",
  "+43% chance to launch one more wave when casting a Barrage Skill":
    "释放弹幕技能时，+43% 额外发射一波的几率",
  "+36% additional Deterioration Duration": "额外 +36% 恶化持续时间",
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
