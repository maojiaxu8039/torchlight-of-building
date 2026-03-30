import { getBaseGearNameTranslation } from "../src/data/translated-affixes/base-gear-name-translations.ts";

const testCases = [
  "Elder Sage Girdle",
  "Elder Sage's Treads",
  "Arcanist Girdle",
  "Dragon Scale Shoes",
  "Wayfarer Waistguard",
  "Steel's Lament",
  "Assassin's Pendant",
  "Bannerlord's Musket",
];

console.log("=== Testing Base Gear Name Translations ===\n");

testCases.forEach((testCase) => {
  const translated = getBaseGearNameTranslation(testCase);
  const hasTranslation = translated !== testCase;
  console.log(
    `${hasTranslation ? "✅" : "⚠️"} ${testCase.padEnd(35)} → ${translated}`,
  );
});

console.log("\n=== Test Complete ===");
