const { getTranslatedAffixText } = require("./src/lib/affix-translator.ts");

// 测试一些常见的翻译
const tests = [
  "+38% additional Affliction Duration",
  "+(12–15)% chance to avoid Elemental Ailment",
  "Elemental Resistance",
  "additional",
  "Affliction Duration",
  "Wilt Damage",
  "Fire Damage",
  "Cold Damage",
  "Lightning Damage",
];

console.log("=== 翻译匹配测试 ===\n");

tests.forEach((test) => {
  const result = getTranslatedAffixText(test);
  console.log(`输入: ${test}`);
  console.log(`输出: ${result}`);
  console.log(`匹配: ${test === result ? "❌ 未匹配" : "✅ 已匹配"}`);
  console.log("");
});
