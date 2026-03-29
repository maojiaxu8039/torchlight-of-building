const fs = require("fs");

const jsFile =
  "/Users/mc/.openclaw/workspace/torchlight-of-building/src/locales/zh/common.js";
let content = fs.readFileSync(jsFile, "utf8");

// The translations to add
const translations = {
  "<Select Base Affix>": "<选择基底词缀>",
  "<Select Sweet Dream Affix>": "<选择甜蜜梦境词缀>",
  "<Select Tower Sequence>": "<选择高塔序列>",
  "<Select Blend>": "<选择混合词缀>",
  "<Select Prefix>": "<选择前缀>",
  "<Select Suffix>": "<选择后缀>",
};

// Find the right place to insert (before "Select equipment type...")
const target = '"Select equipment type...\\"';
let inserted = false;

Object.entries(translations).forEach(([en, cn]) => {
  // Use escaped quotes for the JSON format
  const translationEntry = `"${en}\\":["${cn}"],`;

  if (!content.includes(translationEntry) && !content.includes(`"${en}\\":`)) {
    // Insert before "Select equipment type..."
    const idx = content.indexOf(target);
    if (idx !== -1) {
      content = content.slice(0, idx) + translationEntry + content.slice(idx);
      console.log(`✓ Added: ${en} → ${cn}`);
      inserted = true;
    }
  } else {
    console.log(`✓ Already exists: ${en}`);
  }
});

if (inserted) {
  fs.writeFileSync(jsFile, content, "utf8");
  console.log("\n✓ Successfully updated common.js");
} else {
  console.log("\n⚠ No translations were added");
}
