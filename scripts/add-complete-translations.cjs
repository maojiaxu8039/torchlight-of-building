const fs = require("fs");

const translations = JSON.parse(
  fs
    .readFileSync(
      "src/data/translated-affixes/complete-affix-translations.ts",
      "utf8",
    )
    .replace(/^export const AFFIX_NAME_TRANSLATIONS[^=]*=\s*{/s, "")
    .replace(/^\s*};/s, ""),
);

// 添加完整翻译
const complete = {
  // 腰带 Suffix
  "+(10-12)% Elemental Resistance +(12-15)% chance to avoid Elemental Ailment":
    "+(10-12)% 元素抗性 +(12-15)% 几率避免元素异常",
  "+(7-9)% Elemental Resistance +(12-15)% chance to avoid Elemental Ailment":
    "+(7-9)% 元素抗性 +(12-15)% 几率避免元素异常",
  "+6% Elemental Resistance +(9-11)% chance to avoid Elemental Ailment":
    "+6% 元素抗性 +(9-11)% 几率避免元素异常",
  "+(4-5)% Elemental Resistance +(6-8)% chance to avoid Elemental Ailment":
    "+(4-5)% 元素抗性 +(6-8)% 几率避免元素异常",
};

let added = 0;
Object.entries(complete).forEach((entry) => {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
    added++;
  }
});

console.log("Added " + added + " translations");

fs.writeFileSync(
  "src/data/translated-affixes/complete-affix-translations.ts",
  "export const AFFIX_NAME_TRANSLATIONS: Record<string, string> = " +
    JSON.stringify(translations, null, 2) +
    ";",
);
