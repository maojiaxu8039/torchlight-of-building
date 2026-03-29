const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 添加所有可能的翻译变体
const patterns = [
  // Energy Shield
  ["+(28-33)% gear Energy Shield", "+(28-33)% 该装备护盾"],
  ["+(23-26)% gear Energy Shield", "+(23-26)% 该装备护盾"],
  // Converts to Cold
  [
    "Converts (%d+-%d+)% of Physical Damage taken to Cold Damage",
    "将 $1 受到的物理伤害转化为冰冷伤害",
  ],
  [
    "Converts (%d+-%d+)% of Erosion Damage taken to Cold Damage",
    "将 $1 受到的腐蚀伤害转化为冰冷伤害",
  ],
  // Converts to Fire
  [
    "Converts (%d+-%d+)% of Physical Damage taken to Fire Damage",
    "将 $1 受到的物理伤害转化为火焰伤害",
  ],
  [
    "Converts (%d+-%d+)% of Erosion Damage taken to Fire Damage",
    "将 $1 受到的腐蚀伤害转化为火焰伤害",
  ],
  // Armor
  ["+(760-960) Armor", "+(760-960) 护甲值"],
  // Gear Armor
  ["+(30-50)% Gear Armor", "+(30-50)% 装备护甲值"],
  // Agility Blessing
  [
    "+(6-12)% chance to gain 1 stack of Agility Blessing on defeat",
    "+(6-12)% 击败时获得 1 层灵动祝福的几率",
  ],
];

// 添加精确翻译
const exactTranslations = {
  "+(28-33)% gear Energy Shield": "+(28-33)% 该装备护盾",
  "+(23-26)% gear Energy Shield": "+(23-26)% 该装备护盾",
  "+(760-960) Armor": "+(760-960) 护甲值",
  "+(30-50)% Gear Armor": "+(30-50)% 装备护甲值",
  "+(6-12)% chance to gain 1 stack of Agility Blessing on defeat":
    "+(6-12)% 击败时获得 1 层灵动祝福的几率",
};

Object.entries(exactTranslations).forEach((entry) => {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
  }
});

// 添加 Converts 翻译
const convertPatterns = [
  ["taken to Cold Damage", "受到伤害转化为冰冷伤害"],
  ["taken to Fire Damage", "受到伤害转化为火焰伤害"],
  ["taken to Lightning Damage", "受到伤害转化为闪电伤害"],
];

Object.entries(translations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  if (
    en.includes("Converts") &&
    !cn.includes("受到") &&
    en.includes("taken to")
  ) {
    // 生成正确的翻译
    let newCn = cn;
    convertPatterns.forEach((p) => {
      if (en.includes(p[0])) {
        newCn = en
          .replace("Converts ", "将 ")
          .replace(" taken to ", " 受到伤害转化为");
      }
    });
    if (newCn !== cn && !newCn.includes("$1")) {
      translations[en] = newCn;
    }
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

console.log("总计: " + Object.keys(result).length + " 条翻译");
