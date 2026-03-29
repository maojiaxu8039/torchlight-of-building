const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+54% Focus Damage Enhancement": "+54% 聚能伤害增强",
  "+2 Parabolic Projectile Split Quantity +10% additional Projectile Damage":
    "+2 抛物线投射物分裂数量 +10% 额外投射物伤害",
  "+47% chance to deal Double Damage": "+47% 双倍伤害几率",
  "+75% additional Hit Damage for skills cast by Spell Burst":
    "+75% 法术迸发投射物额外击中伤害",
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
