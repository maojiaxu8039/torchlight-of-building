const fs = require("fs");

const data = JSON.parse(
  fs.readFileSync("scripts/scraped-translations-by-tier.json", "utf-8"),
);

console.log("🔍 Checking 'all stats' entries...\n");

const allStatsKeys = Object.keys(data).filter((k) => k.includes("all stats"));
console.log(`Found ${allStatsKeys.length} 'all stats' entries\n`);

allStatsKeys.forEach((k) => {
  console.log(`  ${k} → ${data[k]}`);
});

console.log("\n" + "=".repeat(60));

console.log("\nAll equipment types in scraped data:");
const equipmentTypes = new Set();
Object.keys(data).forEach((k) => {
  const type = k.split("|")[0];
  equipmentTypes.add(type);
});
console.log(Array.from(equipmentTypes).sort().join(", "));
