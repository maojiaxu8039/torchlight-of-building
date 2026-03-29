const fs = require("fs");

const translations = JSON.parse(
  fs.readFileSync(
    "src/data/translated-affixes/merged-all-translations.json",
    "utf8",
  ),
);

const newTranslations = {
  "+59% chance to avoid Elemental Ailments": "+59% 避免元素异常状态几率",
  "Triggers Lv. 16 Blurry Steps upon starting to move. Interval: 1 s":
    "开始移动时，触发 16 级迷踪步，间隔 1 秒",
  "+26% additional Evasion while moving": "移动时额外 +26% 闪避",
  "+96% Reaping Recovery Speed": "+96% 收割回复速度",
  "+31% Cooldown Recovery Speed": "+31% 冷却回复速度",
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
