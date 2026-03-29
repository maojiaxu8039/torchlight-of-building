const fs = require("fs");
const path = require("path");

const jsFile = path.join(__dirname, "../src/locales/zh/common.js");
let content = fs.readFileSync(jsFile, "utf8");

// Add the missing translation before "Select equipment type..."
const searchStr = '"Select equipment type...":"选择装备类型..."';
const insertStr =
  '"<Select {affixType}>":["<选择 {affixType}>"],"Select equipment type...":"选择装备类型..."';

if (content.includes(searchStr)) {
  content = content.replace(searchStr, insertStr);
  fs.writeFileSync(jsFile, content, "utf8");
  console.log("✓ Added <Select {affixType}> translation");
} else {
  console.log("⚠ Could not find target string");
  console.log("Searching for similar strings...");
  const lines = content.split(",");
  const selectLines = lines.filter((line) => line.includes("Select"));
  console.log("Found Select lines:", selectLines.length);
}
