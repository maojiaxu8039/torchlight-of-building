const fs = require("fs");

const translations = JSON.parse(fs.readFileSync("src/data/translated-affixes/merged-all-translations.json", "utf8"));

const missing = {
  "+(10-12)% Elemental Resistance +(12-15)% chance to avoid Elemental Ailment": "+(10-12)% 元素抗性 +(12-15)% 几率避免元素异常",
  "+(7-9)% Elemental Resistance +(12-15)% chance to avoid Elemental Ailment": "+(7-9)% 元素抗性 +(12-15)% 几率避免元素异常",
  "+6% Elemental Resistance +(9-11)% chance to avoid Elemental Ailment": "+6% 元素抗性 +(9-11)% 几率避免元素异常",
  "+(4-5)% Elemental Resistance +(6-8)% chance to avoid Elemental Ailment": "+(4-5)% 元素抗性 +(6-8)% 几率避免元素异常",
};

let added = 0;
Object.entries(missing).forEach(function(entry) {
  if (!translations[entry[0]]) {
    translations[entry[0]] = entry[1];
    added++;
  }
});

const sorted = Object.entries(translations).sort(function(a, b) { return b[0].length - a[0].length; });
const result = {};
sorted.forEach(function(entry) { result[entry[0]] = entry[1]; });

fs.writeFileSync("src/data/translated-affixes/merged-all-translations.json", JSON.stringify(result, null, 2));

console.log("Added " + added + " translations");
