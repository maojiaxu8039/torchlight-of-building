const fs = require("fs");

console.log("=== 添加更多翻译 ===\n");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

// 更多翻译
const moreTranslations = {
  "+(21-30)% Spell Burst Charge Speed +10% chance to immediately gain 1 stack(s) of Spell Burst Charge when using a skill. Interval: 0.03s":
    "+(21-30)% 法术迸发充能速度使用技能时，+10% 几率立即获得 1 层法术迸发充能，间隔 0.03 秒",
  "+(10-20)% Spell Burst Charge Speed +10% chance to immediately gain 1 stack(s) of Spell Burst Charge when using a skill. Interval: 0.03s":
    "+(10-20)% 法术迸发充能速度使用技能时，+10% 几率立即获得 1 层法术迸发充能，间隔 0.03 秒",
  "+(25-31)% Attack and Cast Speed +(25-31)% Minion Attack and Cast Speed":
    "+(25-31)% 攻击和施法速度+(25-31)% 召唤物攻击和施法速度",
  "+(18-24)% Attack and Cast Speed +(18-24)% Minion Attack and Cast Speed":
    "+(18-24)% 攻击和施法速度+(18-24)% 召唤物攻击和施法速度",
  "+(13-17)% Attack and Cast Speed +(13-17)% Minion Attack and Cast Speed":
    "+(13-17)% 攻击和施法速度+(13-17)% 召唤物攻击和施法速度",
  "+(10-12)% Attack and Cast Speed +(10-12)% Minion Attack and Cast Speed":
    "+(10-12)% 攻击和施法速度+(10-12)% 召唤物攻击和施法速度",
  "+(7-9)% Attack and Cast Speed +(7-9)% Minion Attack and Cast Speed":
    "+(7-9)% 攻击和施法速度+(7-9)% 召唤物攻击和施法速度",
  "Has Hasten +(9-12)% Attack Speed, Cast Speed, and Movement Speed when having Hasten":
    "拥有急行拥有急行时，+(9-12)% 攻击速度、施法速度和移动速度",
  "Has Hasten +(5-8)% Attack Speed, Cast Speed, and Movement Speed when having Hasten":
    "拥有急行拥有急行时，+(5-8)% 攻击速度、施法速度和移动速度",
  "+6% additional Max Energy Shield": "额外 +6% 最大护盾",
  "+(25-31)% Attack and Cast Speed": "+(25-31)% 攻击和施法速度",
  "+(18-24)% Attack and Cast Speed": "+(18-24)% 攻击和施法速度",
  "+(13-17)% Attack and Cast Speed": "+(13-17)% 攻击和施法速度",
  "+(10-12)% Attack and Cast Speed": "+(10-12)% 攻击和施法速度",
  "+(7-9)% Attack and Cast Speed": "+(7-9)% 攻击和施法速度",
  "+(15-20)% Attack and Cast Speed": "+(15-20)% 攻击和施法速度",
  "+(5-10)% Attack and Cast Speed": "+(5-10)% 攻击和施法速度",
  "+(8-10)% Attack and Cast Speed": "+(8-10)% 攻击和施法速度",
};

let added = 0;
Object.entries(moreTranslations).forEach((entry) => {
  const en = entry[0];
  const cn = entry[1];

  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log("添加了 " + added + " 个翻译");

// 保存
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
