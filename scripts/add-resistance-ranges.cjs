const fs = require("fs");

const translations = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));

// 添加所有变体的完整翻译
const ranges = ["(10-12)", "(11-15)", "(7-9)", "(8-10)", "(4-5)", "(5-6)", "(6-8)", "(3-5)", "(9-11)", "(12-15)", "(13-15)", "(14-18)", "(15-20)", "(19-27)"];
const avoidRanges = ["(10-15)", "(11-15)", "(12-15)", "(6-8)", "(9-11)", "(14-18)"];

let added = 0;

// 生成 Elemental Resistance + chance to avoid Elemental Ailment 组合
ranges.forEach(function(range) {
  avoidRanges.forEach(function(avoidRange) {
    var en = "+" + range + "% Elemental Resistance +" + avoidRange + "% chance to avoid Elemental Ailment";
    var cn = "+" + range + "% 元素抗性 +" + avoidRange + "% 几率避免元素异常";
    if (!translations[en]) {
      translations[en] = cn;
      added++;
    }
  });
});

// 生成单独翻译
ranges.forEach(function(range) {
  var en = "+" + range + "% Elemental Resistance";
  var cn = "+" + range + "% 元素抗性";
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

avoidRanges.forEach(function(range) {
  var en = "+" + range + "% chance to avoid Elemental Ailment";
  var cn = "+" + range + "% 几率避免元素异常";
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log("Added " + added + " translations");

fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(translations, null, 2));
console.log("Done!");
