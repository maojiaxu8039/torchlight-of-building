const fs = require("fs");
const path = require("path");
const glob = require("glob");

const scriptsDir = __dirname;
const projectDir = path.join(scriptsDir, "..");

const translations = JSON.parse(fs.readFileSync(path.join(scriptsDir, "scraped-full-objects.json"), "utf-8"));

console.log("🔍 检查 Craft New Item 页面词条匹配情况\n");

const AFFIX_TYPES = [
  "Base Affix",
  "Prefix",
  "Suffix",
  "Sweet Dream Affix",
  "Tower Sequence",
  "Blend",
];

const AFFIX_TYPE_PATTERNS = {
  "Base Affix": /"affixType":"Base Affix"/,
  "Prefix": /"affixType":"Prefix"/,
  "Suffix": /"affixType":"Suffix"/,
  "Sweet Dream Affix": /"affixType":"Sweet Dream Affix"/,
  "Tower Sequence": /"affixType":"Tower Sequence"/,
  "Blend": /"affixType":"Blend"/,
};

const stats = {};
let totalEN = 0;
let totalMatched = 0;

AFFIX_TYPES.forEach(type => {
  stats[type] = { en: 0, matched: 0, notFound: [] };
});

const gearFiles = glob.sync(path.join(projectDir, "src/data/gear-affix/*.ts"));

gearFiles.forEach(file => {
  const content = fs.readFileSync(file, "utf-8");
  const fileName = path.basename(file, ".ts");

  AFFIX_TYPES.forEach(type => {
    const pattern = AFFIX_TYPE_PATTERNS[type];
    if (!pattern.test(content)) return;

    const matches = content.match(/\{"equipmentSlot":"[^"]*","equipmentType":"([^"]*)","affixType":"[^"]*","craftingPool":"[^"]*","tier":"[^"]*","craftableAffix":"([^"]*)"\}/g) || [];
    
    matches.forEach(match => {
      const objMatch = match.match(/\{([^}]+)\}/);
      if (!objMatch) return;

      const props = {};
      objMatch[1].split(",").forEach(prop => {
        const [key, value] = prop.split(":").map(s => s.trim().replace(/"/g, ""));
        props[key] = value;
      });

      if (props.affixType !== type.replace(" Affix", "").replace(" ", "") && 
          props.affixType !== type &&
          props.affixType !== type.replace("Affix", "").trim()) {
        return;
      }

      const enKey = JSON.stringify(props);
      const lookupKey = `${props.equipmentType}|${props.tier}|${props.craftableAffix}`;

      stats[type].en++;
      totalEN++;

      if (translations[enKey] || Object.values(translations).some(t => t.craftableAffix === props.craftableAffix && t.equipmentType === props.equipmentType)) {
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
console.log(`| ${"总计".padEnd(15)} | ${String(totalEN).padStart(7)} | ${String(totalMatched).padStart(7)} | ${((totalMatched / totalEN) * 100).toFixed(1).padStart(6)}% |`);

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
  } else {
    console.log(`✅ ${type}: 全部匹配!`);
  }
});

console.log("=".repeat(60));
console.log("\n📁 翻译数据文件:");
console.log(`  - scraped-full-objects.json: ${Object.keys(translations).length} 条`);
console.log(`  - gear-affix/*.ts: ${gearFiles.length} 个文件`);
