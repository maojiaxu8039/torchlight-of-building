const fs = require("fs");

const jsFile =
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/locales/zh/common.js";
let content = fs.readFileSync(jsFile, "utf8");

// The content uses escaped quotes
const target = '"Select equipment type...\\":["选择装备类型..."]';

if (content.includes(target)) {
  const insert = '"<Select {affixType}>":["<选择 {affixType}>"],';
  content = content.replace(target, insert + target);
  fs.writeFileSync(jsFile, content, "utf8");
  console.log("✓ Successfully added <Select {affixType}> translation");
} else {
  console.log("⚠ Target not found with escaped quotes");
  console.log("Trying without escape...");

  const target2 = '"Select equipment type...":["选择装备类型..."]';
  if (content.includes(target2)) {
    const insert = '"<Select {affixType}>":["<选择 {affixType}>"],';
    content = content.replace(target2, insert + target2);
    fs.writeFileSync(jsFile, content, "utf8");
    console.log(
      "✓ Successfully added <Select {affixType}> translation (method 2)",
    );
  } else {
    console.log("⚠ Could not find target");
  }
}
