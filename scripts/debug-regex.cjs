const fs = require("fs");
const glob = require("glob");

const content = fs.readFileSync("src/data/gear-affix/belt-base-affix.ts", "utf-8");

console.log("Testing regex...\n");

// Try matching individual objects
const regex = /\{"equipmentSlot":"[^"]*","equipmentType":"([^"]*)","affixType":"[^"]*","craftingPool":"[^"]*","tier":"(\d*)","craftableAffix":"([^"]*)"\}/g;

let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  if (count < 5) {
    console.log(`Match ${count + 1}:`);
    console.log(`  equipmentType: ${match[1]}`);
    console.log(`  tier: ${match[2]}`);
    console.log(`  craftableAffix: ${match[3]}`);
  }
  count++;
}

console.log(`\nTotal matches: ${count}`);
