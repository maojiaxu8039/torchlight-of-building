const fs = require("fs");
const path = require("path");

const translations = JSON.parse(fs.readFileSync("scripts/scraped-full-objects.json", "utf-8"));

const gearContent = fs.readFileSync("src/data/gear-affix/wand-prefix.ts", "utf-8");

console.log("🔍 检查未匹配原因\n");

const enAffix = "Adds (82-84) - (106-113) Fire Damage to Spells";

console.log("gear-affix 中的词缀:");
console.log(`"${enAffix}"\n`);

const lookups = [
  `Wand|${enAffix}`,
  `Wand|${enAffix.replace(/ /g, " ")}`,
  `wand|${enAffix}`,
];

lookups.forEach(key => {
  console.log(`查找 "${key}":`);
  if (translations[key]) {
    console.log(`  ✅ 找到: ${translations[key]}`);
  } else {
    console.log(`  ❌ 未找到`);
  }
});

console.log("\n检查 scraped-full-objects 中 Wand 前缀示例:");
let count = 0;
Object.entries(translations).forEach(([key, value]) => {
  if (key.includes('"equipmentType":"Wand"') && key.includes('"Spell"') && count < 3) {
    const parsed = JSON.parse(key);
    console.log(`\nKey: ${parsed.equipmentType} | ${parsed.tier} | ${parsed.craftableAffix.substring(0, 50)}...`);
    console.log(`Value: ${value.craftableAffix.substring(0, 50)}...`);
    count++;
  }
});

console.log("\n检查 gear-affix 中相同的词缀:");
const prefixMatches = gearContent.match(/"craftableAffix":"([^"]+)"/g) || [];
console.log(`\n找到 ${prefixMatches.length} 个 craftableAffix`);
prefixMatches.slice(0, 5).forEach(m => {
  console.log(`  ${m.substring(0, 60)}...`);
});
