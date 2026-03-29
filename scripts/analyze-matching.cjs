const fs = require("fs");
const path = require("path");
const glob = require("glob");

// 使用新的翻译表
const translations = require("../src/data/translated-affixes/complete-affix-translations.ts");

console.log("🔍 检查翻译匹配情况\n");

const translationLookup = translations.AFFIX_TRANSLATIONS;

console.log(`翻译查找表条目数: ${Object.keys(translationLookup).length}\n`);

const AFFIX_TYPES = [
  "Base Affix",
  "Prefix",
  "Suffix",
  "Sweet Dream Affix",
  "Tower Sequence",
  "Blend",
];

const stats = {};
let totalEN = 0;
let totalMatched = 0;

AFFIX_TYPES.forEach(type => {
  stats[type] = { en: 0, matched: 0, notFound: [] };
});

const gearFiles = glob.sync("src/data/gear-affix/*.ts");

gearFiles.forEach(file => {
  const content = fs.readFileSync(file, "utf-8");
  
  const objMatches = content.match(/\{[^{}]+\}/g) || [];
  
  objMatches.forEach(objStr => {
    const props = {};
    const pairs = objStr.slice(1, -1).split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    pairs.forEach(pair => {
      const colonIndex = pair.indexOf(":");
      if (colonIndex > 0) {
        const key = pair.slice(0, colonIndex).trim().replace(/"/g, "");
        const value = pair.slice(colonIndex + 1).trim().replace(/"/g, "");
        props[key] = value;
      }
    });
    
    if (!props.equipmentType || !props.craftableAffix || !props.affixType) return;
    
    const type = props.affixType;
    if (!AFFIX_TYPES.includes(type)) return;
    
    stats[type].en++;
    totalEN++;
    
    // 使用 modifierId 匹配
    if (props.modifierId && translationLookup[props.modifierId]) {
      stats[type].matched++;
      totalMatched++;
    } else {
      stats[type].notFound.push({
        equipmentType: props.equipmentType,
        tier: props.tier,
        craftableAffix: props.craftableAffix
      });
    }
  });
});

console.log("=".repeat(60));
console.log("\n📊 统计结果:\n");
console.log("| 词缀类型 | 英文数量 | 匹配数量 | 覆盖率 |");
console.log("|---------|---------|---------|--------|");

AFFIX_TYPES.forEach(type => {
  const s = stats[type];
  const coverage = s.en > 0 ? ((s.matched / s.en) * 100).toFixed(1) : "0.0";
  console.log(`| ${type.padEnd(15)} | ${String(s.en).padStart(7)} | ${String(s.matched).padStart(7)} | ${coverage.padStart(6)}% |`);
});

console.log("|---------|---------|---------|--------|");
console.log(`| ${"总计".padEnd(15)} | ${String(totalEN).padStart(7)} | ${String(totalMatched).padStart(7)} | ${totalEN > 0 ? ((totalMatched / totalEN) * 100).toFixed(1).padStart(6) : "0.0".padStart(6)}% |`);

console.log("\n" + "=".repeat(60));
console.log("\n📋 未匹配的词缀示例 (每类前3个):\n");

AFFIX_TYPES.forEach(type => {
  const s = stats[type];
  if (s.notFound.length > 0) {
    console.log(`### ${type} (${s.notFound.length} 个未匹配):`);
    s.notFound.slice(0, 3).forEach(item => {
      console.log(`  - [${item.equipmentType}] Tier ${item.tier}: ${item.craftableAffix}`);
    });
    console.log();
  } else if (s.en > 0) {
    console.log(`✅ ${type}: 全部匹配! (${s.matched} 条)`);
  }
});
