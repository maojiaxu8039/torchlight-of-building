const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 检查翻译文件中是否存在特定模式
const patternsToCheck = [
  "Critical Strikes eliminate enemies under",
  "Converts",
  "Damage Penetrates",
  "Adds.*Base Trauma Damage",
  "Adds.*Base Wilt Damage",
  "Shadow Quantity",
  "Lucky Critical Strike",
  "Adds.*Elemental Damage to the gear -100% Gear Physical Damage",
];

patternsToCheck.forEach((pattern) => {
  const regex = new RegExp(pattern);
  const matches = Object.keys(translations).filter((k) => regex.test(k));
  console.log(`Pattern "${pattern}": ${matches.length} matches`);
});

// 添加更多翻译
const moreTranslations = {
  "Adds 84 - 98 Base Wilt Damage": "附加 84 - 98 基础凋零伤害",
  "Adds 64 - 78 Base Wilt Damage": "附加 64 - 78 基础凋零伤害",
  "Adds 96 - 112 Base Wilt Damage": "附加 96 - 112 基础凋零伤害",
  "Adds 72 - 88 Base Wilt Damage": "附加 72 - 88 基础凋零伤害",
  "Adds 56 - 67 Base Wilt Damage": "附加 56 - 67 基础凋零伤害",
  "Adds 48 - 58 Base Wilt Damage": "附加 48 - 58 基础凋零伤害",
  "Adds 36 - 44 Base Wilt Damage": "附加 36 - 44 基础凋零伤害",
  "Adds 28 - 33 Base Wilt Damage": "附加 28 - 33 基础凋零伤害",
  "Adds 120 - 140 Base Wilt Damage": "附加 120 - 140 基础凋零伤害",
  "Adds 1440 - 3360 Base Trauma Damage": "附加 1440 - 3360 基础创伤伤害",
  "Adds 1080 - 2520 Base Trauma Damage": "附加 1080 - 2520 基础创伤伤害",
  "Adds 720 - 1680 Base Trauma Damage": "附加 720 - 1680 基础创伤伤害",
  "Adds 540 - 1260 Base Trauma Damage": "附加 540 - 1260 基础创伤伤害",
  "Adds 420 - 980 Base Trauma Damage": "附加 420 - 980 基础创伤伤害",
  "Adds 300 - 700 Base Trauma Damage": "附加 300 - 700 基础创伤伤害",
};

let added = 0;
Object.entries(moreTranslations).forEach((entry) => {
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

console.log("\n已添加 " + added + " 个翻译");
console.log("总计: " + Object.keys(result).length + " 条翻译");
