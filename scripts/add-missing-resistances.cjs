const fs = require("fs");

const translations = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));

// 添加缺失的翻译
const missing = {
  "+11% Elemental Resistance": "+11% 元素抗性",
  "+14% Elemental Resistance": "+14% 元素抗性",
  "+7% Elemental Resistance": "+7% 元素抗性",
  "+8% Elemental Resistance": "+8% 元素抗性",
  "+9% Elemental Resistance": "+9% 元素抗性",
  "+12% Elemental Resistance": "+12% 元素抗性",
  "+15% Elemental Resistance": "+15% 元素抗性",
  "+17% Elemental Resistance": "+17% 元素抗性",
  "+18% Elemental Resistance": "+18% 元素抗性",
  "+19% Elemental Resistance": "+19% 元素抗性",
  "+20% Elemental Resistance": "+20% 元素抗性",
  "+14% chance to avoid Elemental Ailment": "+14% 几率避免元素异常",
  "+12% chance to avoid Elemental Ailment": "+12% 几率避免元素异常",
  "+10% chance to avoid Elemental Ailment": "+10% 几率避免元素异常",
  "+8% chance to avoid Elemental Ailment": "+8% 几率避免元素异常",
  "+6% chance to avoid Elemental Ailment": "+6% 几率避免元素异常",
  "+30% chance to avoid Elemental Ailment": "+30% 几率避免元素异常",
  "+45% chance to avoid Elemental Ailment": "+45% 几率避免元素异常",
};

let added = 0;
Object.entries(missing).forEach(([en, cn]) => {
  if (!translations[en]) {
    translations[en] = cn;
    added++;
  }
});

console.log(`Added ${added} missing translations`);

const sorted = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
const result = {};
sorted.forEach(([en, cn]) => { result[en] = cn; });

fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));
console.log("Done!");
