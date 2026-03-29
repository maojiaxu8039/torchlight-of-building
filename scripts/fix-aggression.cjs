const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

translations[
  "Gains Attack Aggression when casting an Attack Skill +(40-60)% Attack Aggression Effect"
] = "释放攻击技能时，获得攻击激进 +(40-60)% 攻击激进效果";
translations[
  "Gains Attack Aggression when casting an Attack Skill +(10-30)% Attack Aggression Effect"
] = "释放攻击技能时，获得攻击激进 +(10-30)% 攻击激进效果";

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

console.log("已修正 Attack Aggression Effect 翻译");
