const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "../src/data/translated-affixes");

// 加载所有翻译
const translations = JSON.parse(
  fs.readFileSync(path.join(outDir, "merged-all-translations.json"), "utf8"),
);

// 添加/更新 Affliction Duration 翻译，确保数字能正确显示
const afflictionTranslations = {
  // 保持原格式，让数字能正确显示
  "+(%) additional Affliction Duration": "+()% 额外 加剧 持续时间",
  "+(%) Affliction Duration": "+()% 加剧 持续时间",
  "+(%) Affliction Effect": "+()% 加剧 效果",

  // 移除百分号前缀，只翻译后面的内容
  "additional Affliction Duration": "额外 加剧 持续时间",
  "additional Affliction Effect": "额外 加剧 效果",
  "Affliction Duration": "加剧 持续时间",
  "Affliction Effect": "加剧 效果",
  Affliction: "加剧",

  // 常见百分比格式
  "+% additional Affliction Duration": "+%额外 加剧 持续时间",
  "% additional Affliction Duration": "%额外 加剧 持续时间",
  "+% Affliction Duration": "+%加剧 持续时间",
  "% Affliction Duration": "%加剧 持续时间",
  "+% Affliction Effect": "+%加剧 效果",
  "% Affliction Effect": "%加剧 效果",
};

// 添加/更新翻译
Object.entries(afflictionTranslations).forEach(([en, cn]) => {
  translations[en] = cn;
});

console.log(
  `✅ Added/updated ${Object.keys(afflictionTranslations).length} Affliction translations`,
);

// 排序（优先匹配长的）
const sorted = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length,
);
const sortedTranslations = {};
sorted.forEach(([en, cn]) => {
  sortedTranslations[en] = cn;
});

// 保存
fs.writeFileSync(
  path.join(outDir, "merged-all-translations.json"),
  JSON.stringify(sortedTranslations, null, 2),
  "utf-8",
);

console.log(`✅ Total translations: ${Object.keys(sortedTranslations).length}`);
