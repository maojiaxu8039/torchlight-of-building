const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+7% additional damage against Traumatized enemies":
    "额外 +7% 对创伤状态敌人的伤害",
  "+7% additional Steep Strike Damage": "额外 +7% 斩击伤害",
  "+70% additional Trauma Damage": "额外 +70% 创伤伤害",
  "Reaps 0.42 s of Trauma Damage when dealing Damage Over Time. The effect has a 1 s Recovery Time against the same target":
    "造成持续伤害时，收割 0.42 秒创伤伤害，该效果对同一目标有 1 秒回复时间",
  "Adds 93 - 113 Physical Damage to the gear":
    "为该装备附加 93 - 113 点物理伤害",
  "Adds 95 - 115 Physical Damage to the gear":
    "为该装备附加 95 - 115 点物理伤害",
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
