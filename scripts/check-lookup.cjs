const fs = require("fs");

const translations = JSON.parse(fs.readFileSync("scripts/scraped-full-objects.json", "utf-8"));

console.log("🔍 检查 Max Mana 词缀\n");

Object.entries(translations).forEach(([key, value]) => {
  if (key.includes("Max Mana")) {
    const parsed = JSON.parse(key);
    console.log("EN:", parsed.equipmentType, "|", parsed.tier, "|", parsed.craftableAffix);
    return;
  }
});

console.log("\n检查 wand 的词缀:");
let count = 0;
Object.entries(translations).forEach(([key, value]) => {
  if (key.toLowerCase().includes('"equipmenttype":"wand"')) {
    count++;
    if (count <= 5) {
      const parsed = JSON.parse(key);
      console.log(count + ".", parsed.equipmentType, "|", parsed.tier, "|", parsed.craftableAffix);
    }
  }
});
console.log("Total:", count);
