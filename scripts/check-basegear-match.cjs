const fs = require("fs");

// 读取 base gear 数据
const baseGearContent = fs.readFileSync("src/data/gear-base/all-base-gear.ts", "utf8");

// 提取 Belt 相关的 baseGear
const beltNames = [];
const beltRegex = /name:\s*"([^"]*Waist[^"]*)"/g;
let match;
while ((match = beltRegex.exec(baseGearContent)) !== null) {
  beltNames.push(match[1]);
}

console.log("=== ALL_BASE_GEAR 中的 Belt 装备 ===");
console.log(beltNames.slice(0, 10));

// 检查实际的 item.baseGearName 是什么
console.log("\n=== 检查 options 中的 value 和 label 计算 ===");

// 模拟 EquipmentSlotDropdown 中的计算
const baseGearStats = {};
beltNames.forEach(name => {
  // 查找 stats
  const statsRegex = new RegExp(`name:\\s*"${name}"[\\s\\S]*?stats:\\s*"([^"]*)"`, "g");
  const statsMatch = statsRegex.exec(baseGearContent);
  if (statsMatch) {
    baseGearStats[name] = statsMatch[1];
  }
});

console.log("\n=== BaseGear 的 stats ===");
Object.entries(baseGearStats).slice(0, 5).forEach(([name, stats]) => {
  console.log(`${name}: ${stats}`);
});
