const fs = require("fs");
const path = require("path");

const translations = JSON.parse(
  fs.readFileSync(
    path.join(
      __dirname,
      "../src/data/translated-affixes/merged-all-translations.json",
    ),
    "utf8",
  ),
);

const testCases = [
  "+140 Max Energy Shield",
  "+110 Max Energy Shield",
  "+80 Max Energy Shield",
  "+50 Max Energy Shield",
  "+35 Max Energy Shield",
  "+18 Max Energy Shield",
  "+140 Max Life",
  "+110 Max Life",
  "+95 Max Life",
  "+65 Max Life",
  "+35 Max Life",
  "Elder Sage Girdle - +140 Max Energy Shield",
  "Wayfarer Waistguard - +110 Max Life",
  "Arcanist Girdle - +110 Max Energy Shield",
  "Conqueror Waistguard - +95 Max Life",
  "Magic Girdle - +80 Max Energy Shield",
  "Fearless Waistguard - +65 Max Life",
  "Radiant Lunar Girdle - +50 Max Energy Shield",
  "Dragon Scale Waistguard - +35 Max Life",
  "God's Grace Girdle - +18 Max Energy Shield",
];

console.log("=== Translation Verification ===\n");

let allPassed = true;

testCases.forEach((test) => {
  const found = translations[test];
  if (found) {
    console.log(`✅ ${test}`);
    console.log(`   → ${found}`);
  } else {
    console.log(`❌ ${test}`);
    console.log(`   → NOT FOUND`);
    allPassed = false;
  }
  console.log("");
});

if (allPassed) {
  console.log("🎉 All translations verified successfully!");
} else {
  console.log("⚠️  Some translations are missing");
}
