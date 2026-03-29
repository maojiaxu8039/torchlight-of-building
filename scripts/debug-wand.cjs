const fs = require("fs");

const data = JSON.parse(
  fs.readFileSync("scripts/scraped-translations-by-tier.json", "utf-8"),
);

console.log("🔍 Checking Wand entries...\n");

const wandKeys = Object.keys(data).filter((k) => k.startsWith("Wand|"));
console.log(`Found ${wandKeys.length} Wand entries\n`);

console.log("First 20 Wand entries:");
wandKeys.slice(0, 20).forEach((k) => {
  console.log(`  ${k} → ${data[k]}`);
});

console.log("\n" + "=".repeat(60));

const wandStatsKeys = wandKeys.filter((k) => k.includes("all stats"));
console.log(`\nWand entries with 'all stats': ${wandStatsKeys.length}`);
wandStatsKeys.forEach((k) => {
  console.log(`  ${k} → ${data[k]}`);
});
