const fs = require("fs");

const content = fs.readFileSync(
  "src/data/translated-affixes/complete-affix-translations.ts",
  "utf8",
);
const jsonMatch = content.match(
  /export const AFFIX_NAME_TRANSLATIONS[^=]*=\s*(\{[\s\S]*\});?\s*$/,
);

if (!jsonMatch) {
  console.log("Failed to parse file");
  process.exit(1);
}

const translations = JSON.parse(jsonMatch[1]);

// 添加所有变体的完整翻译
const ranges = [
  "(10-12)",
  "(11-15)",
  "(7-9)",
  "(8-10)",
  "(4-5)",
  "(5-6)",
  "(6-8)",
  "(3-5)",
  "(9-11)",
  "(12-15)",
  "(13-15)",
  "(14-18)",
  "(15-20)",
  "(19-27)",
];
const avoidRanges = [
  "(10-15)",
  "(11-15)",
  "(12-15)",
  "(6-8)",
  "(9-11)",
  "(14-18)",
];

const toAdd = [];

// 生成 Elemental Resistance + chance to avoid Elemental Ailment 组合
ranges.forEach((range) => {
  avoidRanges.forEach((avoidRange) => {
    const en =
      "+" +
      range +
      "% Elemental Resistance +" +
      avoidRange +
      "% chance to avoid Elemental Ailment";
    const cn = "+" + range + "% 元素抗性 +" + avoidRange + "% 几率避免元素异常";
    if (!translations[en]) {
      toAdd.push([en, cn]);
    }
  });
});

// 生成单独翻译
ranges.forEach((range) => {
  const en = "+" + range + "% Elemental Resistance";
  const cn = "+" + range + "% 元素抗性";
  if (!translations[en]) {
    toAdd.push([en, cn]);
  }
});

avoidRanges.forEach((range) => {
  const en = "+" + range + "% chance to avoid Elemental Ailment";
  const cn = "+" + range + "% 几率避免元素异常";
  if (!translations[en]) {
    toAdd.push([en, cn]);
  }
});

toAdd.forEach((item) => {
  translations[item[0]] = item[1];
});

console.log("Added " + toAdd.length + " translations");

const newContent =
  "export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = " +
  JSON.stringify(translations, null, 2) +
  ";";
fs.writeFileSync(
  "src/data/translated-affixes/complete-affix-translations.ts",
  newContent,
);
console.log("Done!");
