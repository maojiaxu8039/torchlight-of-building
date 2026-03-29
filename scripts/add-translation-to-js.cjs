const fs = require("fs");
const path = require("path");

const jsFile = path.join(__dirname, "../src/locales/zh/common.js");
let content = fs.readFileSync(jsFile, "utf8");

// Find the messages object and add the missing translation
const target = '"Select equipment type...":"选择装备类型..."';
const replacement =
  '"<Select {affixType}>":["<选择 {affixType}>"],"Select equipment type...":"选择装备类型..."';

if (content.includes(target) && !content.includes("<Select {affixType}>")) {
  content = content.replace(target, replacement);
  fs.writeFileSync(jsFile, content, "utf8");
  console.log("✓ Added <Select {affixType}> translation to common.js");
} else if (content.includes("<Select {affixType}>")) {
  console.log("✓ Translation already exists");
} else {
  console.log("⚠ Could not find target string");
}
