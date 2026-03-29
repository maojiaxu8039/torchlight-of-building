const fs = require("fs");

const html = fs.readFileSync(".garbage/tlidb/gear/wand.html", "utf-8");

console.log("🔍 Debugging Prefix/Suffix parsing\n");

// 检查有 data-modifier-id 的 td 数量
const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
let tdMatch;
let count = 0;
let prefixCount = 0;
let suffixCount = 0;
let baseCount = 0;

while ((tdMatch = tdRegex.exec(html)) !== null) {
  const tdContent = tdMatch[1];
  
  if (tdContent.includes("data-modifier-id")) {
    count++;
    
    if (tdContent.includes("Pre-fix") || tdContent.includes("Prefix")) {
      prefixCount++;
      if (prefixCount <= 3) {
        console.log("Prefix td:", tdContent.substring(0, 200));
        const idMatch = tdContent.match(/data-modifier-id="(\d+)"/);
        if (idMatch) {
          console.log("  ID:", idMatch[1]);
        }
      }
    } else if (tdContent.includes("Suffix")) {
      suffixCount++;
      if (suffixCount <= 3) {
        console.log("Suffix td:", tdContent.substring(0, 200));
      }
    } else if (tdContent.includes("Base Affix")) {
      baseCount++;
    }
  }
}

console.log("\n统计:");
console.log("  Total td with modifier-id:", count);
console.log("  Prefix td:", prefixCount);
console.log("  Suffix td:", suffixCount);
console.log("  Base Affix td:", baseCount);

// 检查翻译表中的 modifierId 前缀
const trans = require("./src/data/translated-affixes/complete-affix-translations.ts");
const ids = Object.keys(trans.AFFIX_TRANSLATIONS);
console.log("\n翻译表中的 ID 前缀统计:");
const prefixes = {};
ids.forEach(id => {
  const prefix = id.substring(0, 3);
  prefixes[prefix] = (prefixes[prefix] || 0) + 1;
});
Object.entries(prefixes).slice(0, 10).forEach(([p, c]) => {
  console.log(`  ${p}: ${c}`);
});
