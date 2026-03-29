const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+70% additional Ignite Damage": "额外 +70% 点燃伤害",
  "Adds 78 - 439 Elemental Damage to the gear -100% Gear Physical Damage":
    "在该装备上附加 78 - 439 点元素伤害 -100% 该装备物理伤害",
  "+128% Gear Physical Damage Adds 70 - 86 Physical Damage to the gear":
    "+128% 该装备物理伤害 在该装备上附加 70 - 86 点物理伤害",
  "Multistrikes deal 139% increasing damage": "多重打击伤害递增 139%",
  "+70% Elemental and Erosion Resistance Penetration":
    "+70% 元素和腐蚀抗性穿透",
  "+58% Armor DMG Mitigation Penetration": "+58% 护甲减伤穿透",
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
