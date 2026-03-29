const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

translations[
  "Gains Attack Aggression when casting an Attack Skill +(40-60)% Attack Aggression"
] = "释放攻击技能时，获得攻击激进 +(40-60)% 攻击激进";
translations[
  "Gains Attack Aggression when casting an Attack Skill +(10-30)% Attack Aggression"
] = "释放攻击技能时，获得攻击激进 +(10-30)% 攻击激进";
translations["+2 Jumps +(8-10)% additional damage"] =
  "+2 弹射次数 +(8-10)% 额外伤害";

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

console.log("已添加 3 个翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
