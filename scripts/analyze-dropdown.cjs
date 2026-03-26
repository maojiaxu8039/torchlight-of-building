const fs = require("fs");

// 读取 EquipmentSlotDropdown 源代码
const content = fs.readFileSync("src/components/equipment/EquipmentSlotDropdown.tsx", "utf8");

console.log("=== EquipmentSlotDropdown 分析 ===\n");

// 提取 selectedItemId 使用
const selectedMatch = content.match(/selectedItemId/g);
console.log("selectedItemId 出现次数:", selectedMatch ? selectedMatch.length : 0);

// 提取 value 使用
const valueMatch = content.match(/value=/g);
console.log("value= 出现次数:", valueMatch ? valueMatch.length : 0);

// 提取 options 计算
const optionsStart = content.indexOf("const options = ");
const optionsEnd = content.indexOf(");", optionsStart);
const optionsCode = content.substring(optionsStart, optionsEnd + 2);
console.log("\n=== options 计算代码 ===");
console.log(optionsCode);

// 提取 OptionWithTooltip 计算
const optionTooltipStart = content.indexOf("const OptionWithTooltip");
const optionTooltipEnd = content.indexOf("};", optionTooltipStart);
const optionTooltipCode = content.substring(optionTooltipStart, optionTooltipEnd + 2);
console.log("\n=== OptionWithTooltip 计算代码 ===");
console.log(optionTooltipCode.substring(0, 1000));
